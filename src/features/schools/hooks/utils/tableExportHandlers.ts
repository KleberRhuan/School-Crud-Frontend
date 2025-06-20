import { useCallback } from 'react'
import { useGridExport } from '../export/useGridExport'
import type { ExportHandlers } from './tableControllerTypes'

interface UseExportHandlersParams {
  gridApiRef: React.RefObject<any>
  isGridReady: boolean
}

export const useExportHandlers = ({
  gridApiRef,
  isGridReady
}: UseExportHandlersParams): ExportHandlers => {
  const { 
    exportToCsv: baseExportToCsv, 
    exportVisiblePageToCsv: baseExportVisiblePageToCsv, 
    exportSelectedToCsv: baseExportSelectedToCsv, 
    exportAllColumnsToCsv: baseExportAllColumnsToCsv, 
    autoSizeColumns: baseAutoSizeColumns 
  } = useGridExport(gridApiRef)

  const exportToCsv = useCallback((filename?: string) => {
    if (!isGridReady) {
      
      return false
    }
    return baseExportToCsv(filename)
  }, [isGridReady, baseExportToCsv])

  const exportVisiblePageToCsv = useCallback((filename?: string) => {
    if (!isGridReady) {
      
      return false
    }
    return baseExportVisiblePageToCsv(filename)
  }, [isGridReady, baseExportVisiblePageToCsv])

  const exportSelectedToCsv = useCallback((filename?: string) => {
    if (!isGridReady) {
      
      return false
    }
    return baseExportSelectedToCsv(filename)
  }, [isGridReady, baseExportSelectedToCsv])

  const exportAllColumnsToCsv = useCallback((filename?: string) => {
    if (!isGridReady) {
      
      return false
    }
    return baseExportAllColumnsToCsv(filename)
  }, [isGridReady, baseExportAllColumnsToCsv])

  const autoSizeColumns = useCallback(() => {
    if (!isGridReady) {
      
      return
    }
    baseAutoSizeColumns()
  }, [isGridReady, baseAutoSizeColumns])

  return {
    exportToCsv,
    exportVisiblePageToCsv,
    exportSelectedToCsv,
    exportAllColumnsToCsv,
    autoSizeColumns
  }
} 