import {QueryKey, useInfiniteQuery, UseInfiniteQueryOptions, useQuery, UseQueryOptions,} from '@tanstack/react-query'
import {apiClient, ApiError} from '@/lib/api-client.ts'
import {AxiosRequestConfig} from 'axios'
import { useToast } from '@/hooks/useToast.ts'
import {ApiQueryOptions} from '@/types'

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

/**
 * Hook genérico para operações GET com cache
 * 
 * Usa configurações globais do QueryClient para retry, retryDelay, staleTime e gcTime
 */
export const useApiQuery = <TData = any>(
  queryKey: QueryKey,
  url: string,
  config?: AxiosRequestConfig,
  options?: ApiQueryOptions & Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) => {
  const contextToastService = useToast()
  const { 
    showErrorToast: showError = true, 
    toastService = contextToastService,
    ...queryOptions 
  } = options ?? {}

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await apiClient.get<TData>(url, config)
        return response.data
      } catch (error) {
        const apiError = error as ApiError
        if (showError && toastService) {
          toastService.error(apiError.message || 'Erro ao carregar dados')
        }
        throw apiError
      }
    },
    ...queryOptions,
  })
}

/**
 * Hook para paginação infinita usando useInfiniteQuery
 */
export const usePaginatedQuery = <TData = any>(
  queryKey: QueryKey,
  url: string,
  params?: Record<string, any>,
  options?: Omit<UseInfiniteQueryOptions<PaginatedResponse<TData>>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'>
) => {
  return useInfiniteQuery({
    queryKey: [...queryKey, params],
    queryFn: ({ pageParam = 1 }) => 
      apiClient.get<PaginatedResponse<TData>>(url, {
        params: { ...params, page: pageParam }
      }).then(r => r.data),
    getNextPageParam: (lastPage) => 
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    ...options
  })
} 