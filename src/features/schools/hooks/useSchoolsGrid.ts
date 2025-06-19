import { useMemo } from 'react'
import type { GridOptions } from 'ag-grid-community'
import { useSchoolColumns } from './useSchoolColumns'
import type { School } from '@/schemas/schoolSchemas'

export interface UseSchoolsGridReturn {
  gridOptions: GridOptions<School>
  columns: any[]
  defaultColDef: any
}

export const useSchoolsGrid = (): UseSchoolsGridReturn => {
  const { columns, defaultColDef } = useSchoolColumns()

  const gridOptions = useMemo<GridOptions<School>>(() => ({
    // Row Model - voltar para client-side mas com carregamento inteligente
    rowModelType: 'clientSide',
    
    // Paginação client-side
    pagination: true,
    paginationPageSize: 50,
    paginationPageSizeSelector: [25, 50, 100, 200],
    
    // Performance
    suppressColumnVirtualisation: false,
    suppressRowVirtualisation: false,
    rowBuffer: 0,
    animateRows: true,

    // Selection - Novo formato do AG Grid 32.2.1+
    rowSelection: {
      mode: 'singleRow',
      checkboxes: false,
    },
    suppressCellFocus: false,

    // Editing
    undoRedoCellEditing: true,
    stopEditingWhenCellsLoseFocus: true,
    
    // Styling
    suppressContextMenu: false,
    theme: 'legacy',

    // Loading states
    loadingOverlayComponent: 'customLoadingOverlay',
    noRowsOverlayComponent: 'customNoRowsOverlay',

    // Accessibility
    suppressMenuHide: false,
    
    // Column definitions
    columnDefs: columns,
    defaultColDef,
  }), [columns, defaultColDef])

  return {
    gridOptions,
    columns,
    defaultColDef
  }
} 