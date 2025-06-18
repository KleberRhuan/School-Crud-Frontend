import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { QueuedRequest } from './types'
import { ApiError } from '@/lib/http'
import { FEATURE_FLAGS, QUEUE_CONFIG } from '../../config/constants'
import { generateRequestId } from '../../utils/id'
import {
  incrementFailedRefreshes,
  incrementSuccessfulRefreshes,
  incrementTimeouts,
  incrementTotalRequests,
  updateAverageQueueTime,
  updateMaxQueueSize,
} from './refreshMetrics'

/**
 * Estado privado da fila
 */
let refreshQueue: QueuedRequest[] = []

/**
 * Logs detalhados da fila (apenas em desenvolvimento)
 */
const logQueueState = (action: string, requestId?: string): void => {
  if (!FEATURE_FLAGS.ENABLE_QUEUE_LOGS) return
  
  const queueSize = refreshQueue.length
  console.log(`🔄 [REFRESH QUEUE] ${action}`, {
    requestId,
    queueSize,
    config: QUEUE_CONFIG,
  })
}

/**
 * Limpeza de requests expirados na fila
 */
const cleanupExpiredRequests = (): void => {
  const now = Date.now()
  const expiredRequests = refreshQueue.filter(
    req => now - req.timestamp > QUEUE_CONFIG.QUEUE_TIMEOUT
  )

  if (expiredRequests.length > 0) {
    if (FEATURE_FLAGS.ENABLE_QUEUE_LOGS) {
      console.warn(`🧹 Limpando ${expiredRequests.length} requests expirados da fila`)
    }

    expiredRequests.forEach(req => {
      req.reject(ApiError.requestTimeout(req.id))
      incrementTimeouts()
    })

    refreshQueue = refreshQueue.filter(
      req => now - req.timestamp <= QUEUE_CONFIG.QUEUE_TIMEOUT
    )
  }
}

/**
 * Função para adicionar request à fila
 * Retorna uma Promise que será resolvida quando o refresh completar
 */
export const enqueueRequest = (
  originalRequest: InternalAxiosRequestConfig,
  apiInstance: any
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    if (refreshQueue.length >= QUEUE_CONFIG.MAX_QUEUE_SIZE) {
      const error : ApiError = ApiError.requestRetriesExceeded();
      reject(error)
      return
    }

    const requestId = generateRequestId()
    const queuedRequest: QueuedRequest = {
      id: requestId,
      timestamp: Date.now(),
      retryCount: 0,
      originalUrl: originalRequest.url ?? 'unknown',
      resolve: (token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          resolve(apiInstance(originalRequest))
      },
      reject: (error: ApiError) => {
        reject(error)
      }
    }

    refreshQueue.push(queuedRequest)
    incrementTotalRequests()
    updateMaxQueueSize(refreshQueue.length)
    logQueueState('REQUEST_ENQUEUED', requestId)
  })
}

/**
 * Processa a fila após refresh bem-sucedido
 */
export const processQueue = (accessToken: string): void => {
  const startTime = Date.now()
  const queueSize = refreshQueue.length

  logQueueState('PROCESSING_QUEUE')

  refreshQueue.forEach(request => {
    try {
      const queueTime = Date.now() - request.timestamp
      updateAverageQueueTime(queueTime)
      request.resolve(accessToken)
    } catch (error) {
      if (FEATURE_FLAGS.ENABLE_QUEUE_LOGS) {
        console.error(`❌ Erro ao processar request ${request.id}:`, error)
      }
      request.reject(new ApiError(500, 'Queue Processing Error'))
    }
  })

  refreshQueue = []
  incrementSuccessfulRefreshes()

  if (FEATURE_FLAGS.ENABLE_QUEUE_LOGS) {
    const processingTime = Date.now() - startTime
    console.log(`✅ Fila processada com sucesso: ${queueSize} requests em ${processingTime}ms`)
  }
}

/**
 * Limpa a fila em caso de erro
 */
export const clearQueue = (error: ApiError): void => {
  const queueSize = refreshQueue.length

  logQueueState('CLEARING_QUEUE_ON_ERROR')

  refreshQueue.forEach(request => {
    request.reject(error)
  })

  refreshQueue = []
  incrementFailedRefreshes()

  if (FEATURE_FLAGS.ENABLE_QUEUE_LOGS) {
    console.error(`❌ Fila limpa devido a erro: ${queueSize} requests rejeitados`)
  }
}

/**
 * Obtém o tamanho atual da fila (útil para debugging)
 */
export const getQueueSize = (): number => refreshQueue.length

/**
 * Limpa a fila sem registrar como erro (útil para testes)
 */
export const resetQueue = (): void => {
  refreshQueue = []
}

// Configurar limpeza automática
if (typeof window !== 'undefined') {
  setInterval(cleanupExpiredRequests, QUEUE_CONFIG.CLEANUP_INTERVAL)
} 