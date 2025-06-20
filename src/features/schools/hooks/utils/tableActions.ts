import { useCallback } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import type { TableControllerActions } from './tableControllerTypes'

interface UseTableActionsParams {
  queryClient: QueryClient
  filters: Record<string, any>
  refetch: () => Promise<any>
  setIsRefreshing: (refreshing: boolean) => void
  setQuickFilterText: (text: string) => void
}

export const useTableActions = ({
  queryClient,
  filters,
  refetch,
  setIsRefreshing,
  setQuickFilterText
}: UseTableActionsParams): TableControllerActions => {
  const updateQuickFilter = useCallback((text: string) => {
    setQuickFilterText(text)
  }, [setQuickFilterText])

  const refresh = useCallback(async () => {
    try {
      setIsRefreshing(true)
      
      await queryClient.invalidateQueries({ 
        queryKey: ['schools', filters],
        exact: true
      })
      
      await refetch()
      
      
    } catch (error) {
      
    } finally {
      setIsRefreshing(false)
    }
  }, [queryClient, filters, refetch, setIsRefreshing])

  return {
    updateQuickFilter,
    refresh
  }
} 