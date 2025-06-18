import { QueryClient } from '@tanstack/react-query'
import { DefaultQueryConfig } from '@/config/queryConfig.ts'

/**
 * Utilitários para QueryClient
 */
export class QueryClientUtils {
  constructor(private queryClient: QueryClient) {}

  /**
   * Invalidar queries por padrão
   */
  invalidateQueriesByPattern(pattern: string) {
    return this.queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey[0]
        return typeof key === 'string' && key.includes(pattern)
      }
    })
  }

  /**
   * Prefetch dados com configuração padrão
   */
  prefetchQuery(key: unknown[], fn: () => Promise<unknown>) {
    return this.queryClient.prefetchQuery({
      queryKey: key,
      queryFn: fn,
      staleTime: DefaultQueryConfig.STALE_TIME,
      gcTime: DefaultQueryConfig.GC_TIME,
    })
  }

  /**
   * Obter dados do cache
   */
  getCachedData<T>(key: unknown[]): T | undefined {
    return this.queryClient.getQueryData<T>(key)
  }

  /**
   * Definir dados no cache
   */
  setCachedData<T>(key: unknown[], data: T) {
    this.queryClient.setQueryData(key, data)
  }

  /**
   * Remover query do cache
   */
  removeQuery(key: unknown[]) {
    this.queryClient.removeQueries({ queryKey: key })
  }
} 