import { useApiQuery } from '@/hooks/useApiQuery'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PageableRequest, PaginatedResponse, School, SchoolFilters } from '@/schemas/schoolSchemas'
import { 
  API_TIMEOUT, 
  CACHE_TIME_MEDIUM, 
  CACHE_TIME_SHORT, 
  DEFAULT_BATCH_SIZE,
  DEFAULT_PAGE_SIZE 
} from '@/constants/pagination'

interface UseSchoolsQueryParams {
  filters?: SchoolFilters
  pageable?: PageableRequest
  enabled?: boolean
  loadAll?: boolean
  batchSize?: number // Tamanho do lote para carregamento progressivo
}

// Hook para carregamento inteligente em lotes
export const useSchoolsQuery = ({ 
  filters = {}, 
  pageable = { page: 1, size: DEFAULT_PAGE_SIZE, direction: 'ASC' }, 
  enabled = true,
  loadAll = false,
  batchSize = DEFAULT_BATCH_SIZE
}: UseSchoolsQueryParams = {}) => {
  const [allData, setAllData] = useState<School[]>([])
  const [totalElements, setTotalElements] = useState<number>(0)
  const [currentBatch, setCurrentBatch] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  const [sortState, setSortState] = useState<{
    field?: string
    direction?: 'ASC' | 'DESC'
  }>({
    field: pageable.sort || 'code',
    direction: pageable.direction || 'ASC'
  })

  const updateSort = useCallback((field: string, direction: 'ASC' | 'DESC') => {
    setSortState({ field, direction })
    
    if (!loadAll) {
      setCurrentBatch(1)
      setAllData([])
      setTotalElements(0)
      setHasMore(true)
    }
  }, [loadAll])

  // Parâmetros atualizados com ordenação
  const queryParams = useMemo(() => ({
    ...filters,
    page: loadAll ? 0 : 0,
    size: loadAll ? API_TIMEOUT : batchSize * currentBatch,
    sort: sortState.field,
    direction: sortState.direction,
  }), [filters, loadAll, batchSize, currentBatch, sortState.field, sortState.direction])

  // Query para carregamento completo (loadAll = true)
  const fullQuery = useApiQuery<PaginatedResponse<School>>(
    ['schools', filters, 'all', sortState.field, sortState.direction],
    '/schools',
    { params: queryParams },
    {
      enabled: enabled && loadAll,
      staleTime: CACHE_TIME_MEDIUM,
    }
  )

  // Query para carregamento em lotes (loadAll = false)
  const batchQuery = useApiQuery<PaginatedResponse<School>>(
    ['schools-batch', filters, currentBatch, batchSize, sortState.field, sortState.direction],
    '/schools',
    { params: queryParams },
    {
      enabled: enabled && !loadAll && hasMore,
      staleTime: CACHE_TIME_SHORT,
    }
  )

  // Atualizar dados quando receber novos lotes (apenas para modo batch)
  useEffect(() => {
    if (!loadAll && batchQuery.data?.content) {
      const newData = batchQuery.data.content
      setAllData(newData)
      setTotalElements(batchQuery.data.totalElements)
      
      const loadedCount = newData.length
      const total = batchQuery.data.totalElements
      setHasMore(loadedCount < total)
    }
  }, [loadAll, batchQuery.data, currentBatch, batchSize])

  // Funções para controle de carregamento (sempre declaradas)
  const loadNextBatch = useCallback(() => {
    if (!loadAll && hasMore && !batchQuery.isLoading) {
      setCurrentBatch(prev => prev + 1)
    }
  }, [loadAll, hasMore, batchQuery.isLoading])

  const checkShouldLoadMore = useCallback((currentPage: number, pageSize: number) => {
    if (loadAll) return false
    
    const currentPosition = currentPage * pageSize
    const loadedData = allData.length
    const bufferZone = pageSize * 2

    return hasMore && (currentPosition + bufferZone >= loadedData)
  }, [loadAll, allData, hasMore])

  // Função para reset completo (usado no refetch)
  const resetBatchState = useCallback(() => {
    if (!loadAll) {
      setCurrentBatch(1)
      setAllData([])
      setTotalElements(0)
      setHasMore(true)
    }
  }, [loadAll])

  // Função de refetch customizada
  const customRefetch = useCallback(async () => {
    resetBatchState()
    
    if (loadAll) {
      return await fullQuery.refetch()
    }
    
    return await batchQuery.refetch()
  }, [loadAll, fullQuery, batchQuery, resetBatchState])

  // Resultado baseado no modo
  const result = useMemo(() => {
    if (loadAll) {
      return {
        data: fullQuery.data,
        isLoading: fullQuery.isLoading,
        error: fullQuery.error,
        refetch: customRefetch,
        updateSort,
        loadNextBatch: () => {},
        checkShouldLoadMore: () => false,
        hasMore: false,
        currentBatch: 1,
        sortState
      }
    }

    return {
      data: {
        content: allData,
        page: 0,
        size: allData.length,
        totalElements,
        totalPages: Math.ceil(totalElements / (pageable.size || DEFAULT_PAGE_SIZE)),
        last: !hasMore
      } as PaginatedResponse<School>,
      isLoading: batchQuery.isLoading,
      error: batchQuery.error,
      refetch: customRefetch,
      updateSort,
      loadNextBatch,
      checkShouldLoadMore,
      hasMore,
      currentBatch,
      sortState
    }
  }, [loadAll, fullQuery, allData, totalElements, hasMore, batchQuery, loadNextBatch, checkShouldLoadMore, currentBatch, pageable.size, customRefetch, updateSort, sortState])

  return result
}

export const useSchoolQuery = (code: number, enabled = true) => {
  return useApiQuery<School>(
    ['school', code],
    `/schools/${code}`,
    {},
    {
      enabled: enabled && !!code,
    }
  )
}

export const useSchoolMetricsQuery = (code: number, enabled = true) => {
  return useApiQuery(
    ['school-metrics', code],
    `/schools/${code}/metrics`,
    {},
    {
      enabled: enabled && !!code,
    }
  )
} 