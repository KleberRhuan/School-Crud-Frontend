import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FilterChangedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  PaginationChangedEvent,
  RowDataUpdatedEvent,
  SortChangedEvent
} from 'ag-grid-community'
import { useSchoolsGrid } from './useSchoolsGrid'
import { useSchoolsEvents } from './useSchoolsEvents'
import { useSchoolFilters } from '../store/schoolFilters'
import { useApiQuery } from '@/hooks/useApiQuery'
import type { PaginatedResponse, School } from '@/schemas/schoolSchemas'

interface UseSchoolsTableControllerProps {
  onDataChanged?: (data: any) => void
  onError?: (error: Error) => void
  onSchoolSelected?: (school: School | null) => void
  onSchoolDoubleClicked?: (school: School) => void
}

// Hook auxiliar para os event handlers do grid
const useGridEventHandlers = (
  gridApiRef: React.RefObject<GridApi | null>,
  _setIsRefreshing: (value: boolean) => void,
  _onError?: (error: Error) => void
) => {
  const handleGridReady = useCallback((event: GridReadyEvent) => {
    gridApiRef.current = event.api
  }, [gridApiRef])

  const handlePaginationChanged = useCallback((paginationEvent: PaginationChangedEvent) => {
    void paginationEvent
  }, [])

  const handleSortChanged = useCallback((sortEvent: SortChangedEvent) => {
    void sortEvent 
  }, [])

  const handleFilterChanged = useCallback((filterEvent: FilterChangedEvent) => {
    void filterEvent
  }, [])

  const handleRowDataUpdated = useCallback((dataEvent: RowDataUpdatedEvent) => {
    if (gridApiRef.current) {
      gridApiRef.current.hideOverlay()
    }
    void dataEvent
  }, [gridApiRef])

  return {
    handleGridReady,
    handlePaginationChanged,
    handleSortChanged,
    handleFilterChanged,
    handleRowDataUpdated
  }
}

// Hook auxiliar para funcionalidades de exportação
const useGridExport = (gridApiRef: React.RefObject<GridApi | null>) => {
  const createExportParams = useCallback((filename?: string) => ({
    fileName: filename || `escolas_${new Date().toISOString().split('T')[0]}.csv`,
    columnSeparator: ',',
    suppressQuotes: false,
    skipColumnGroupHeaders: false,
    skipColumnHeaders: false,
    allColumns: false,
    onlySelected: false,
    processCellCallback: (params: any) => {
      if (typeof params.value === 'string') {
        return params.value.replace(/"/g, '""')
      }
      return params.value
    }
  }), [])

  const exportToCsv = useCallback((filename?: string) => {
    if (!gridApiRef.current) return

    const params = createExportParams(filename)
    gridApiRef.current.exportDataAsCsv(params)
  }, [gridApiRef, createExportParams])

  const autoSizeColumns = useCallback(() => {
    if (!gridApiRef.current) return

    const allColumnIds: string[] = []
    gridApiRef.current.getColumns()?.forEach(column => {
      if (column.getColId()) {
        allColumnIds.push(column.getColId())
      }
    })

    gridApiRef.current.autoSizeColumns(allColumnIds, false)
  }, [gridApiRef])

  return {
    exportToCsv,
    autoSizeColumns
  }
}

export const useSchoolsTableController = ({
  onDataChanged: _onDataChanged,
  onError,
  onSchoolSelected,
  onSchoolDoubleClicked
}: UseSchoolsTableControllerProps = {}) => {
  const gridApiRef = useRef<GridApi | null>(null)
  const [quickFilterText, setQuickFilterText] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { filters } = useSchoolFilters()
  const { gridOptions: baseGridOptions } = useSchoolsGrid()
  
  // 2) REMOVER criações server-side e adicionar useApiQuery
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
    handleRowDataUpdated
  } = useGridEventHandlers(gridApiRef, setIsRefreshing, onError)

  // Export functions usando hook auxiliar
  const { exportToCsv, autoSizeColumns } = useGridExport(gridApiRef)

  // 3) REMOVER referências a server-side no gridOptions
  const gridOptions = useMemo((): GridOptions => ({
    ...baseGridOptions,
    rowModelType: 'clientSide',
    rowData: schoolsData,
    quickFilterText,
    onGridReady: handleGridReady,
    onRowSelected: eventHandlers.onRowSelected,
    onRowDoubleClicked: eventHandlers.onRowDoubleClicked,
    onCellEditingStopped: eventHandlers.onCellEditingStopped,
  }), [baseGridOptions, schoolsData, quickFilterText, eventHandlers])

  const updateQuickFilter = useCallback((text: string) => {
    setQuickFilterText(text)
  }, [])

  const refresh = useCallback(() => {
    refetch()
  }, [refetch])

  // 5) Ajustar overlay effect para isLoading e error
  useEffect(() => {
    if (!gridApiRef.current) return

    if (isLoading || isRefreshing) {
      gridApiRef.current.showLoadingOverlay()
    } else if (error) {
      gridApiRef.current.showNoRowsOverlay()
    } else {
      gridApiRef.current.hideOverlay()
    }
  }, [isLoading, isRefreshing, error])

  return {
    // Grid
    gridOptions,
    
    // State
    isLoading,
    error: error?.message ?? null,
    isRefreshing,
    
    // Actions
    updateQuickFilter,
    refresh,
    exportToCsv,
    autoSizeColumns,
    
    // Events
    onGridReady: handleGridReady,
    onPaginationChanged: handlePaginationChanged,
    onSortChanged: handleSortChanged,
    onFilterChanged: handleFilterChanged,
    onRowDataUpdated: handleRowDataUpdated,
    
    filters
  }
} 