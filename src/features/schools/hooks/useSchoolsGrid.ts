import { useMemo } from 'react'
import type { GridOptions } from 'ag-grid-community'
import { useSchoolColumns } from './useSchoolColumns'
import type { School } from '@/schemas/schoolSchemas'

export interface UseSchoolsGridReturn {
  gridOptions: GridOptions<School>
  columns: any[]
  defaultColDef: any
}

// Constantes para configuração da grid
const DEFAULT_PAGE_SIZE = 50
const PAGE_SIZE_OPTIONS = [25, 50, 100, 200]

export const useSchoolsGrid = (): UseSchoolsGridReturn => {
  const { columns, defaultColDef } = useSchoolColumns()

  const gridOptions = useMemo<GridOptions<School>>(() => ({
    // Row Model - voltar para client-side mas com carregamento inteligente
    rowModelType: 'clientSide',
    
    // Paginação client-side
    pagination: true,
    paginationPageSize: DEFAULT_PAGE_SIZE,
    paginationPageSizeSelector: PAGE_SIZE_OPTIONS,
    
    // Performance
    suppressColumnVirtualisation: false,
    suppressRowVirtualisation: false,
    rowBuffer: 0,
    animateRows: true,

    // Selection - Habilitado seleção múltipla com checkboxes
    rowSelection: {
      mode: 'multiRow',
      checkboxes: true,
      headerCheckbox: true,
      enableClickSelection: true,
    },
    suppressCellFocus: false,

    // Editing
    undoRedoCellEditing: true,
    stopEditingWhenCellsLoseFocus: true,
    
    // Styling
    suppressContextMenu: false,
    theme: 'legacy',

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