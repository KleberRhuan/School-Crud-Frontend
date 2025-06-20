import { useCallback } from 'react'
import {
  FilterChangedEvent,
  GridApi,
  GridReadyEvent,
  PaginationChangedEvent,
  RowDataUpdatedEvent,
  SortChangedEvent
} from 'ag-grid-community'

export const useGridEventHandlers = (
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