import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ApiError } from '@/lib/http'
import { FEATURE_FLAGS, QUEUE_CONFIG } from '../../config/constants'
import { clearQueue, enqueueRequest, getQueueSize, processQueue } from '../queue/refreshQueue'
import { getExtendedMetrics } from '../queue/refreshMetrics'
import { createAuthService } from "@/services/authService.ts";
import {api} from "@/lib/api-client.ts";

/**
 * Estado privado do interceptador (isolado neste módulo)
 */
let isRefreshing = false
let refreshPromise: Promise<string> | null = null
let refreshStartTime: number = 0
let refreshRetryCount: number = 0

const authService = createAuthService(api);

/**
 * Função de refresh com retry e controle de concorrência
 */
const performRefresh = async (): Promise<string> => {
  if (refreshPromise) {
    if (FEATURE_FLAGS.ENABLE_QUEUE_LOGS) {
      console.log('🔄 Refresh já em andamento, aguardando...')
    }
    return refreshPromise
  }

  refreshStartTime = Date.now()
  refreshRetryCount++

  if (FEATURE_FLAGS.ENABLE_QUEUE_LOGS) {
    console.log('🔄 [REFRESH] Iniciando refresh token...')
  }

  refreshPromise = (async (): Promise<string> => {
    try {
      const response = await authService.refresh()
      const {accessToken} = response
      const refreshTime = Date.now() - refreshStartTime

      if (FEATURE_FLAGS.ENABLE_QUEUE_LOGS) {
        console.log(`✅ Refresh concluído com sucesso em ${refreshTime}ms`)
      }

      return accessToken
    } catch (error) {
      const refreshTime = Date.now() - refreshStartTime
      if (FEATURE_FLAGS.ENABLE_QUEUE_LOGS) {
        console.error(`❌ Refresh falhou após ${refreshTime}ms:`, error)
      }
      throw error
    }
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

/**
 * Interceptador de request - apenas anexa accessToken se disponível
 */
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  return config
}

/**
 * Interceptador de request error
 */
const requestErrorInterceptor = (error: AxiosError) => {
  return Promise.reject(ApiError.fromHttpError(error))
}

/**
 * Interceptador de response - sistema de fila robusto
 */
const responseInterceptor = (response: AxiosResponse) => response

/**
 * Interceptador de response error com fila
 */
const responseErrorInterceptor = (api: AxiosInstance) => async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean
  }

  const apiError = ApiError.fromHttpError(error)

  const isAuthEndpoint = originalRequest.url?.includes('/auth/')
  if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
    originalRequest._retry = true

    if (isRefreshing) {
      return enqueueRequest(originalRequest, api)
    }

    if (refreshRetryCount >= QUEUE_CONFIG.MAX_RETRIES) {
      const maxRetriesError : ApiError = ApiError.requestRetriesExceeded();
      clearQueue(maxRetriesError)
      return Promise.reject(maxRetriesError)
    }

    isRefreshing = true

    try {
      const accessToken =  await performRefresh();
      processQueue(accessToken)

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
      }

      return api(originalRequest)
    } catch (refreshError) {
      const sessionError : ApiError = ApiError.sessionExpired();
      clearQueue(sessionError)
      throw sessionError
    } finally {
      isRefreshing = false
      refreshRetryCount = 0
    }
  }

  return Promise.reject(apiError)
}

/**
 * Função pública para registrar interceptadores de autenticação
 * Recebe a instância do Axios por injeção (evita dependência circular)
 */
export const registerAuthInterceptor = (): void => {
  api.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor
  )

  api.interceptors.response.use(
    responseInterceptor,
    responseErrorInterceptor(api)
  )

  if (FEATURE_FLAGS.ENABLE_QUEUE_LOGS) {
    console.log('🔐 Interceptadores de autenticação registrados')
  }
}

/**
 * Função para obter métricas da fila (útil para debugging)
 */
export const getRefreshQueueMetrics = () => {
  return getExtendedMetrics(getQueueSize(), isRefreshing, refreshRetryCount)
}

/**
 * Função para resetar estado do interceptador (útil para testes)
 */
export const resetAuthInterceptorState = (): void => {
  isRefreshing = false
  refreshPromise = null
  refreshRetryCount = 0
} 