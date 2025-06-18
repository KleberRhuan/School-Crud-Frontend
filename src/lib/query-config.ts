import { DefaultOptions, QueryClient } from '@tanstack/react-query'

export const STALE_TIME = {
  SHORT: 2 * 60 * 1000,      // 2 minutos
  MEDIUM: 5 * 60 * 1000,     // 5 minutos
  LONG: 15 * 60 * 1000,      // 15 minutos
  VERY_LONG: 60 * 60 * 1000, // 1 hora
} as const

export const GC_TIME = {
  SHORT: 5 * 60 * 1000,      // 5 minutos
  MEDIUM: 10 * 60 * 1000,    // 10 minutos
  LONG: 30 * 60 * 1000,      // 30 minutos
  VERY_LONG: 2 * 60 * 60 * 1000, // 2 horas
} as const

/**
 * Determina se deve tentar novamente baseado no erro
 */
const shouldRetry = (failureCount: number, error: any): boolean => {
  const status = error?.response?.status

  if (status >= 400 && status < 500) {
    return status === 408 || status === 429
  }

  if (status >= 500) {
    return failureCount < 3
  }

  if (!error.response && error.request) {
    return failureCount < 2
  }
  
  return false
}

/**
 * Delay entre tentativas com backoff exponencial
 */
const getRetryDelay = (attempt: number, error: any): number => {
  const status = error?.response?.status

  if (status === 429) {
    const retryAfter = error.response?.headers?.['retry-after']
    if (retryAfter) {
      return parseInt(retryAfter) * 1000
    }
  }

  return Math.min(1000 * (2 ** attempt), 10000)
}

/**
 * Configurações padrão para queries
 */
const defaultQueryConfig: DefaultOptions = {
  queries: {
    staleTime: STALE_TIME.MEDIUM,
    gcTime: GC_TIME.MEDIUM,
    retry: shouldRetry,
    retryDelay: getRetryDelay,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  mutations: {
    retry: shouldRetry,
    retryDelay: getRetryDelay,
  },
}

/**
 * Cria uma instância configurada do QueryClient
 */
export const createAppQueryClient = (): QueryClient => {
  const queryClient = new QueryClient({
    defaultOptions: defaultQueryConfig,
  })
  
  console.log('⚙️ [QueryClient] Cliente configurado com configurações padrão')
  
  return queryClient
} 