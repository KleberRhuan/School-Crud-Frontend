import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { CsvData, TablePreferences } from '@/types'

interface TableState {
  csvData: CsvData | null
  preferences: TablePreferences
  isLoading: boolean
  error: string | null
  
  // Actions
  setCsvData: (data: CsvData | null) => void
  clearCsvData: () => void
  updatePreferences: (preferences: Partial<TablePreferences>) => void
  resetPreferences: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const defaultPreferences: TablePreferences = {
  columnVisibility: {},
  columnOrder: [],
  columnWidths: {},
  sorting: [],
  filters: {},
  pageSize: 50,
}

// Store para gerenciar estado da tabela e preferências do usuário
export const useTableStore = create<TableState>()(
  persist(
    immer((set) => ({
      // State
      csvData: null,
      preferences: defaultPreferences,
      isLoading: false,
      error: null,

      // Actions
      setCsvData: (data: CsvData | null) =>
        set((state) => {
          state.csvData = data
          state.error = null
          // Inicializar preferências baseadas nas colunas
          if (data && data.columns.length > 0) {
            const columnVisibility: Record<string, boolean> = {}
            const columnOrder: string[] = []
            data.columns.forEach((col) => {
              columnVisibility[col.id] = col.visible
              columnOrder.push(col.id)
            })
            state.preferences.columnVisibility = {
              ...state.preferences.columnVisibility,
              ...columnVisibility,
            }
            if (state.preferences.columnOrder.length === 0) {
              state.preferences.columnOrder = columnOrder
            }
          }
        }),

      clearCsvData: () =>
        set((state) => {
          state.csvData = null
          state.error = null
        }),

      updatePreferences: (newPreferences: Partial<TablePreferences>) =>
        set((state) => {
          state.preferences = { ...state.preferences, ...newPreferences }
        }),

      resetPreferences: () =>
        set((state) => {
          state.preferences = defaultPreferences
        }),

      setLoading: (loading: boolean) =>
        set((state) => {
          state.isLoading = loading
        }),

      setError: (error: string | null) =>
        set((state) => {
          state.error = error
        }),
    })),
    {
      name: 'table-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Selectors otimizados
export const useCsvData = () => useTableStore((state) => state.csvData)
export const useTablePreferences = () => useTableStore((state) => state.preferences)
export const useTableLoading = () => useTableStore((state) => state.isLoading)
export const useTableError = () => useTableStore((state) => state.error)
export const useColumnVisibility = () => useTableStore((state) => state.preferences.columnVisibility)
export const useTableSorting = () => useTableStore((state) => state.preferences.sorting)
export const useTableFilters = () => useTableStore((state) => state.preferences.filters) 