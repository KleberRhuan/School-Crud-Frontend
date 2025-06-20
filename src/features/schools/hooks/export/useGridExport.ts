import React, { useCallback } from 'react'
import { GridApi } from 'ag-grid-community'

interface ExportOptions {
  allColumns?: boolean
  onlySelected?: boolean
  includeHeaders?: boolean
  onlyVisiblePage?: boolean
}

export const useGridExport = (gridApiRef: React.RefObject<GridApi | null>) => {
  const createExportParams = useCallback((filename?: string, options?: ExportOptions) => {
    const defaultOptions = {
      allColumns: false,
      onlySelected: false,
      includeHeaders: true,
      onlyVisiblePage: false,
      ...options
    }

    const baseParams = {
      fileName: filename ?? `escolas_${new Date().toISOString().split('T')[0]}.csv`,
      columnSeparator: ',',
      suppressQuotes: false,
      skipColumnGroupHeaders: !defaultOptions.includeHeaders,
      skipColumnHeaders: !defaultOptions.includeHeaders,
      allColumns: defaultOptions.allColumns,
      onlySelected: defaultOptions.onlySelected
    }

    if (defaultOptions.onlyVisiblePage && gridApiRef.current) {
      const visibleRowPositions: any[] = []
      const currentPage = gridApiRef.current.paginationGetCurrentPage()
      const pageSize = gridApiRef.current.paginationGetPageSize()
      const startIndex = currentPage * pageSize

      for (let i = 0; i < pageSize; i++) {
        const rowIndex = startIndex + i
        const rowNode = gridApiRef.current.getDisplayedRowAtIndex(rowIndex)
        
        if (rowNode) {
          visibleRowPositions.push({
            rowIndex,
            rowPinned: rowNode.rowPinned ?? null
          })
        }
      }
      
      return {
        ...baseParams,
        rowPositions: visibleRowPositions
      }
    }

    return baseParams
  }, [gridApiRef])

  const exportToCsv = useCallback((filename?: string, options?: ExportOptions) => {
    if (!gridApiRef.current) {
      
      return false
    }

    try {
      const rowCount = gridApiRef.current.getDisplayedRowCount()
      if (rowCount === 0) {
        
        return false
      }

      
    } catch (_) {
      return false
    }

    try {
      const params = createExportParams(filename, options)
      gridApiRef.current.exportDataAsCsv(params)
      return true
    } catch (_) {
      return false
    }
  }, [gridApiRef, createExportParams])

  const exportVisiblePageToCsv = useCallback((filename?: string) => {
    if (!gridApiRef.current) {
      return false
    }
    return exportToCsv(filename, { onlyVisiblePage: true })
  }, [exportToCsv, gridApiRef])

  const exportSelectedToCsv = useCallback((filename?: string) => {
    if (!gridApiRef.current) {
      
      return false
    }

    try {
      const selectedRows = gridApiRef.current.getSelectedRows()
      if (selectedRows.length === 0) {
        return false
      }
      
    } catch (_) {
      return false
    }

    return exportToCsv(filename, { onlySelected: true })
  }, [exportToCsv, gridApiRef])

  const exportAllColumnsToCsv = useCallback((filename?: string) => {
    return exportToCsv(filename, { allColumns: true })
  }, [exportToCsv])

  const autoSizeColumns = useCallback(() => {
    if (!gridApiRef.current) {
      
      return
    }

    try {
      const allColumnIds: string[] = []
      gridApiRef.current.getColumns()?.forEach(column => {
        if (column.getColId()) {
          allColumnIds.push(column.getColId())
        }
      })

      gridApiRef.current.autoSizeColumns(allColumnIds, false)
      
    } catch (error) {

    }
  }, [gridApiRef])

  return {
    exportToCsv,
    exportVisiblePageToCsv,
    exportSelectedToCsv,
    exportAllColumnsToCsv,
    autoSizeColumns
  }
}