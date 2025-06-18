import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface TablePreferences {
  columnVisibility: Record<string, boolean>
  columnOrder: string[]
  columnWidths: Record<string, number>
  sorting: Array<{ id: string; desc: boolean }>
  filters: Record<string, any>
  pageSize: number
  density: 'compact' | 'standard' | 'comfortable'
}

interface DataTableState {
  preferences: TablePreferences
  isLoading: boolean
  error: string | null
  selectedRows: Set<string>
  expandedRows: Set<string>
  
  // Actions
  updatePreferences: (updates: Partial<TablePreferences>) => void
  resetPreferences: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  selectRow: (id: string) => void
  deselectRow: (id: string) => void
  selectAllRows: (ids: string[]) => void
  clearSelection: () => void
  toggleRowExpansion: (id: string) => void
  setColumnWidth: (columnId: string, width: number) => void
  setColumnVisibility: (columnId: string, visible: boolean) => void
  reorderColumns: (columnOrder: string[]) => void
}

const defaultPreferences: TablePreferences = {
  columnVisibility: {},
  columnOrder: [],
  columnWidths: {},
  sorting: [],
  filters: {},
  pageSize: 50,
  density: 'standard',
}

// Store global responsável por preferências e estado da tabela de dados
export const useDataTableStore = create<DataTableState>()(
  // Persistimos o estado no localStorage usando os middlewares 'persist'
  // e 'immer' para garantir imutabilidade automática
  persist(
    immer((set) => ({
      preferences: defaultPreferences,
      isLoading: false,
      error: null,
      selectedRows: new Set(),
      expandedRows: new Set(),

      updatePreferences: (updates) =>
        set((state) => {
          Object.assign(state.preferences, updates)
        }),

      resetPreferences: () =>
        set((state) => {
          state.preferences = { ...defaultPreferences }
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading
        }),

      setError: (error) =>
        set((state) => {
          state.error = error
        }),

      selectRow: (id) =>
        set((state) => {
          state.selectedRows.add(id)
        }),

      deselectRow: (id) =>
        set((state) => {
          state.selectedRows.delete(id)
        }),

      selectAllRows: (ids) =>
        set((state) => {
          state.selectedRows = new Set(ids)
        }),

      clearSelection: () =>
        set((state) => {
          state.selectedRows.clear()
        }),

      toggleRowExpansion: (id) =>
        set((state) => {
          if (state.expandedRows.has(id)) {
            state.expandedRows.delete(id)
          } else {
            state.expandedRows.add(id)
          }
        }),

      setColumnWidth: (columnId, width) =>
        set((state) => {
          state.preferences.columnWidths[columnId] = width
        }),

      setColumnVisibility: (columnId, visible) =>
        set((state) => {
          state.preferences.columnVisibility[columnId] = visible
        }),

      reorderColumns: (columnOrder) =>
        set((state) => {
          state.preferences.columnOrder = columnOrder
        }),
    })),
    {
      name: 'data-table-preferences',
      storage: createJSONStorage(() => localStorage),
      // Salva apenas partes relevantes do estado para evitar excesso de dados
      partialize: (state) => ({
        columnVisibility: state.preferences.columnVisibility,
        columnOrder: state.preferences.columnOrder,
        columnWidths: state.preferences.columnWidths,
        sorting: state.preferences.sorting,
        filters: state.preferences.filters,
        pageSize: state.preferences.pageSize,
        density: state.preferences.density,
      }),
    }
  )
)

// Seletores otimizados
export const useTablePreferences = () => useDataTableStore((state) => state.preferences)
export const useTableLoading = () => useDataTableStore((state) => state.isLoading)
export const useTableError = () => useDataTableStore((state) => state.error)
export const useSelectedRows = () => useDataTableStore((state) => state.selectedRows)
export const useExpandedRows = () => useDataTableStore((state) => state.expandedRows)

// Hooks derivados
export const useIsRowSelected = (rowId: string) =>
  useDataTableStore((state) => state.selectedRows.has(rowId))

export const useIsRowExpanded = (rowId: string) =>
  useDataTableStore((state) => state.expandedRows.has(rowId))

export const useSelectedRowsCount = () =>
  useDataTableStore((state) => state.selectedRows.size)

export const useHasSelectedRows = () =>
  useDataTableStore((state) => state.selectedRows.size > 0) 