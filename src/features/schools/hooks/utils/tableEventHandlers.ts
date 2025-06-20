import { useCallback } from 'react'
import { useGridEventHandlers } from '../grid/useGridEventHandlers'

interface UseTableEventHandlersParams {
  gridApiRef: React.RefObject<any>
  setIsRefreshing: (refreshing: boolean) => void
  setIsGridReady: (ready: boolean) => void
  onError?: ((error: Error) => void) | undefined
  onSelectionChanged?: ((selectedCount: number) => void) | undefined
}

export const useTableEventHandlers = ({
  gridApiRef,
  setIsRefreshing,
  setIsGridReady,
  onError,
  onSelectionChanged
}: UseTableEventHandlersParams) => {
  const {
    handleGridReady: baseHandleGridReady,
    handlePaginationChanged,
    handleSortChanged,
    handleFilterChanged,
    handleRowDataUpdated
  } = useGridEventHandlers(gridApiRef, setIsRefreshing, onError)

  const handleGridReady = useCallback((event: any) => {
    baseHandleGridReady(event)
    setIsGridReady(true)
    
  }, [baseHandleGridReady, setIsGridReady])

  // Handler para mudanças de seleção
  const handleSelectionChanged = useCallback(() => {
    if (!gridApiRef.current || !onSelectionChanged) return
    
    const selectedRows = gridApiRef.current.getSelectedRows()
    onSelectionChanged(selectedRows.length)
  }, [gridApiRef, onSelectionChanged])

  return {
    handleGridReady,
    handlePaginationChanged,
    handleSortChanged,
    handleFilterChanged,
    handleRowDataUpdated,
    handleSelectionChanged
  }
} 