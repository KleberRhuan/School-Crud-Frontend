import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client.ts'
import { DefaultQueryConfig } from '@/config/queryConfig.ts'

/**
 * Política de retry global para queries e mutations
 */
const createRetryFunction = (maxRetries: number, rateLimitRetries: number) => 
  (failureCount: number, error: unknown) => {
    const apiError = error as ApiError
    
    // Não tentar novamente para erros 4xx client errors (exceto alguns específicos)
    if (apiError.status && apiError.status >= 400 && apiError.status < 500) {
      if (![408, 409, 429].includes(apiError.status)) {
        return false
      }
    }
    
    // Rate limit tem limite menor
    if (apiError.status === 429) {
      return failureCount < rateLimitRetries
    }
    
    // Outros erros seguem limite padrão
    return failureCount < maxRetries
  }

/**
 * Política de delay global com backoff exponencial
 */
const retryDelay = (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000)

/**
 * QueryClient configurado com defaults globais para eliminar boilerplate
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DefaultQueryConfig.STALE_TIME,
      gcTime: DefaultQueryConfig.GC_TIME,
      retry: createRetryFunction(DefaultQueryConfig.MAX_RETRIES, DefaultQueryConfig.RATE_LIMIT_RETRIES),
      retryDelay,
    },
    mutations: {
      retry: createRetryFunction(DefaultQueryConfig.MAX_RETRIES, DefaultQueryConfig.RATE_LIMIT_RETRIES),
      retryDelay,
    },
  },
}) 