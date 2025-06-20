import { useEffect } from 'react'
import { useSchoolsGrid } from './useSchoolsGrid'
import { useSchoolsEvents } from './useSchoolsEvents'
import { useSchoolFilters } from '../store/schoolFilters'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useQueryClient } from '@tanstack/react-query'
import type { UseSchoolsTableControllerProps } from './types/tableController.types'
import type { PaginatedResponse, School } from '@/schemas/schoolSchemas'
import {
  useTableControllerState,
  useTableEventHandlers,
  useExportHandlers,
  useTableActions,
  useTableGridOptions,
  type TableControllerReturn
} from './utils'

export const useSchoolsTableController = ({
  onDataChanged,
  onError,
  onSchoolSelected,
  onSchoolDoubleClicked,
  onSelectionChanged
}: UseSchoolsTableControllerProps = {}): TableControllerReturn => {
  const queryClient = useQueryClient()
  const { filters } = useSchoolFilters()
  const { gridOptions: baseGridOptions } = useSchoolsGrid()
  
  // Estado centralizado
  const {
    gridApiRef,
    quickFilterText,
    isRefreshing,
    isGridReady,
    setQuickFilterText,
    setIsRefreshing,
    setIsGridReady
  } = useTableControllerState()
  
  // Query para buscar dados das escolas
  const { data: schoolsResponse, isLoading, error, refetch } = useApiQuery<PaginatedResponse<School>>(
    ['schools', filters],
    '/schools',
    {
      params: {
        ...filters,
        page: 0,
        size: 10000,
        sort: 'code',
        direction: 'ASC',
      },
    },
  )

  const schoolsData = schoolsResponse?.content ?? []

  // Event handlers das escolas
  const eventHandlers = useSchoolsEvents({ 
    datasource: null,
    onRowSelected: onSchoolSelected || undefined,
    onRowDoubleClicked: onSchoolDoubleClicked || undefined
  })

  const {
    handleGridReady,
    handlePaginationChanged,
    handleSortChanged,
    handleFilterChanged,
    handleRowDataUpdated,
    handleSelectionChanged
  } = useTableEventHandlers({
    gridApiRef,
    setIsRefreshing,
    setIsGridReady,
    onError,
    onSelectionChanged
  })

  // Handlers de exportação
  const exportHandlers = useExportHandlers({
    gridApiRef,
    isGridReady
  })

  // Ações da tabela
  const actions = useTableActions({
    queryClient,
    filters,
    refetch,
    setIsRefreshing,
    setQuickFilterText
  })

  // Grid options
  const gridOptions = useTableGridOptions({
    baseGridOptions,
    schoolsData,
    quickFilterText,
    handleGridReady,
    eventHandlers,
    handleSelectionChanged
  })

  // Effect para notificar mudanças nos dados
  useEffect(() => {
    onDataChanged?.(schoolsData)
  }, [schoolsData, onDataChanged])

  // Effect para gerenciar overlay do grid
  useEffect(() => {
    if (!gridApiRef.current) return

    if (isLoading || isRefreshing) {
      gridApiRef.current.showLoadingOverlay()
    } else if (error) {
      gridApiRef.current.showNoRowsOverlay()
    } else {
      gridApiRef.current.hideOverlay()
    }
  }, [isLoading, isRefreshing, error, gridApiRef])

  return {
    // Grid
    gridOptions,
    
    // State
    isLoading,
    error: error?.message ?? null,
    isRefreshing,
    isGridReady,
    
    // Actions
    ...actions,
    ...exportHandlers,
    
    // Events
    onGridReady: handleGridReady,
    onPaginationChanged: handlePaginationChanged,
    onSortChanged: handleSortChanged,
    onFilterChanged: handleFilterChanged,
    onRowDataUpdated: handleRowDataUpdated,
    
    filters
  }
} 