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
const logQueueState = (_action: string, _requestId?: string): void => {
  if (!FEATURE_FLAGS.ENABLE_QUEUE_LOGS) return
  
  // Queue action: ${action}, ID: ${requestId}, Size: ${queueSize}
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
      // Cleaning expired requests: ${expiredRequests.length}
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
      const error = ApiError.requestRetriesExceeded()
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
  logQueueState('PROCESSING_QUEUE')

  refreshQueue.forEach(request => {
    try {
      const queueTime = Date.now() - request.timestamp
      updateAverageQueueTime(queueTime)
      request.resolve(accessToken)
    } catch {
      if (FEATURE_FLAGS.ENABLE_QUEUE_LOGS) {
        // Error processing queue request
      }
      request.reject(new ApiError(500, 'Queue Processing Error'))
    }
  })

  refreshQueue = []
  incrementSuccessfulRefreshes()

  if (FEATURE_FLAGS.ENABLE_QUEUE_LOGS) {
    // Queue processed in ${processingTime}ms, handled ${queueSize} requests
  }
}

/**
 * Limpa a fila em caso de erro
 */
export const clearQueue = (error: ApiError): void => {
  logQueueState('CLEARING_QUEUE_ON_ERROR')

  refreshQueue.forEach(request => {
    request.reject(error)
  })

  refreshQueue = []
  incrementFailedRefreshes()

  if (FEATURE_FLAGS.ENABLE_QUEUE_LOGS) {
    // Queue cleared due to error, rejected ${queueSize} requests
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

if (typeof window !== 'undefined') {
  setInterval(cleanupExpiredRequests, QUEUE_CONFIG.CLEANUP_INTERVAL)
} 