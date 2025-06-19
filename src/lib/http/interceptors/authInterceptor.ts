import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ApiError } from '@/lib/http'
import { QUEUE_CONFIG } from '../../config/constants'
import { clearQueue, enqueueRequest, getQueueSize, processQueue } from '../queue/refreshQueue'
import { getExtendedMetrics } from '../queue/refreshMetrics'
import { createAuthService } from "@/services/authService.ts";
import {api} from "@/lib/api-client.ts";
import { useAuthStore } from '@/stores/authStore'

/**
 * Estado privado do interceptador (isolado neste módulo)
 */
let isRefreshing = false
let refreshPromise: Promise<string> | null = null
let refreshRetryCount: number = 0

const authService = createAuthService(api);

/**
 * Função de refresh com retry e controle de concorrência
 */
const performRefresh = async (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshRetryCount++

  refreshPromise = (async (): Promise<string> => {
    const response = await authService.refresh()
    const {accessToken} = response
    return accessToken
  })()

  return await refreshPromise.finally(() => {
    refreshPromise = null
  })
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
    } catch {
      const sessionError : ApiError = ApiError.sessionExpired();
      clearQueue(sessionError)
      // Limpa a sessão no Zustand para evitar loops de loading na UI
      try {
        useAuthStore.getState().clearSession()
      } catch {
        // Não foi possível limpar a sessão - erro ignorado
      }
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
  refreshRetryCount = 0
} 