import { useCallback, useMemo, useState } from 'react'
import type { IDatasource, IGetRowsParams } from 'ag-grid-community'
import type { SchoolFilters } from '@/schemas/schoolSchemas'
import { apiClient } from '@/lib/api-client'
import { SchoolService } from '../services/schoolService'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'

const schoolService = new SchoolService(apiClient)

export interface UseSchoolsDatasourceReturn {
  datasource: IDatasource | null
  isLoading: boolean
  error: string | null
  refreshData: () => void
}

export interface UseSchoolsDatasourceProps {
  filters?: SchoolFilters
  pageSize?: number
  onDataLoaded?: (data: any) => void
  onError?: (error: Error) => void
}

export const useSchoolsDatasource = ({
  filters = {},
  pageSize = DEFAULT_PAGE_SIZE,
  onDataLoaded,
  onError
}: UseSchoolsDatasourceProps): UseSchoolsDatasourceReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const datasource = useMemo((): IDatasource => ({
    getRows: async (params: IGetRowsParams) => {
      try {
        setIsLoading(true)
        setError(null)
        
        const page = Math.floor(params.startRow / pageSize) + 1
        const data = await schoolService.getAll(filters, { page, size: pageSize, direction: 'ASC' })

        if (!data.content || !Array.isArray(data.content)) {
          throw new Error('Formato de resposta inválido')
        }

        const lastRow = data.last ? data.totalElements : -1
        params.successCallback(data.content, lastRow)
        onDataLoaded?.(data)

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar escolas'
        setError(errorMessage)
        
        params.failCallback()
        onError?.(err instanceof Error ? err : new Error(errorMessage))
        
      } finally {
        setIsLoading(false)
      }
    },
    
    destroy: () => {
      setIsLoading(false)
      setError(null)
    }
  }), [filters, pageSize, onDataLoaded, onError])

  const refreshData = useCallback(() => {
    setError(null)
  }, [])

  return {
    datasource,
    isLoading,
    error,
    refreshData
  }
} 