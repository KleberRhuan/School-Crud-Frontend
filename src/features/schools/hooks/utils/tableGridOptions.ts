import { useMemo } from 'react'
import type { GridOptions } from 'ag-grid-community'

interface CreateGridOptionsParams {
  baseGridOptions: GridOptions
  schoolsData: any[]
  quickFilterText: string
  handleGridReady: (event: any) => void
  eventHandlers: {
    onRowSelected?: (event: any) => void
    onRowDoubleClicked?: (event: any) => void
    onCellEditingStopped?: (event: any) => void
  }
  handleSelectionChanged: () => void
}

export const useTableGridOptions = ({
  baseGridOptions,
  schoolsData,
  quickFilterText,
  handleGridReady,
  eventHandlers,
  handleSelectionChanged
}: CreateGridOptionsParams): GridOptions => {
  return useMemo((): GridOptions => {
    const gridOptions: GridOptions = {
      ...baseGridOptions,
      rowModelType: 'clientSide',
      rowData: schoolsData,
      quickFilterText,
      onGridReady: handleGridReady,
      onSelectionChanged: handleSelectionChanged,
    }

    if (eventHandlers.onRowSelected) {
      gridOptions.onRowSelected = eventHandlers.onRowSelected
    }

    if (eventHandlers.onRowDoubleClicked) {
      gridOptions.onRowDoubleClicked = eventHandlers.onRowDoubleClicked
    }

    if (eventHandlers.onCellEditingStopped) {
      gridOptions.onCellEditingStopped = eventHandlers.onCellEditingStopped
    }

    return gridOptions
  }, [baseGridOptions, schoolsData, quickFilterText, handleGridReady, eventHandlers, handleSelectionChanged])
} 