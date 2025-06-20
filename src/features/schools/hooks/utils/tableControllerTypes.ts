import type { GridApi } from 'ag-grid-community'
import type { QueryClient } from '@tanstack/react-query'

export interface TableControllerState {
  gridApiRef: React.RefObject<GridApi | null>
  quickFilterText: string
  isRefreshing: boolean
  isGridReady: boolean
  setQuickFilterText: (text: string) => void
  setIsRefreshing: (refreshing: boolean) => void
  setIsGridReady: (ready: boolean) => void
}

export interface TableControllerDependencies {
  queryClient: QueryClient
  filters: Record<string, any>
  onDataChanged?: (data: any) => void
  onError?: ((error: Error) => void) | undefined
  onSchoolSelected?: ((school: any) => void) | undefined
  onSchoolDoubleClicked?: ((school: any) => void) | undefined
  onSelectionChanged?: ((selectedCount: number) => void) | undefined
}

export interface ExportHandlers {
  exportToCsv: (filename?: string) => boolean
  exportVisiblePageToCsv: (filename?: string) => boolean
  exportSelectedToCsv: (filename?: string) => boolean
  exportAllColumnsToCsv: (filename?: string) => boolean
  autoSizeColumns: () => void
}

export interface TableControllerActions {
  updateQuickFilter: (text: string) => void
  refresh: () => Promise<void>
}

export interface TableControllerReturn extends ExportHandlers, TableControllerActions {
  gridOptions: any
  isLoading: boolean
  error: string | null
  isRefreshing: boolean
  isGridReady: boolean
  onGridReady: (event: any) => void
  onPaginationChanged: (event?: any) => void
  onSortChanged: (event?: any) => void
  onFilterChanged: (event?: any) => void
  onRowDataUpdated: (event?: any) => void
  filters: Record<string, any>
} 