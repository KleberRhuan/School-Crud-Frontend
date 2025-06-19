import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { ColDef } from 'ag-grid-community'

export interface ColumnPreference {
  field: string
  visible: boolean
  width?: number
  pinned?: 'left' | 'right' | null
  sortOrder?: number
}

interface ColumnPreferencesState {
  // Estado das preferências
  preferences: Record<string, ColumnPreference>
  columnOrder: string[]
  
  // Ações
  setColumnVisible: (field: string, visible: boolean) => void
  setColumnWidth: (field: string, width: number) => void
  setColumnPinned: (field: string, pinned: 'left' | 'right' | null) => void
  reorderColumns: (newOrder: string[]) => void
  updatePreference: (field: string, updates: Partial<ColumnPreference>) => void
  resetPreferences: () => void
  applyPreferencesToColumns: (columns: ColDef[]) => ColDef[]
  getVisibleColumns: () => string[]
}

// Preferências padrão para colunas principais
const defaultPreferences: Record<string, ColumnPreference> = {
  code: { field: 'code', visible: true, pinned: 'left', width: 120, sortOrder: 0 },
  schoolName: { field: 'schoolName', visible: true, pinned: 'left', width: 300, sortOrder: 1 },
  municipality: { field: 'municipality', visible: true, width: 200, sortOrder: 2 },
  stateCode: { field: 'stateCode', visible: true, width: 80, sortOrder: 3 },
  administrativeDependency: { field: 'administrativeDependency', visible: true, width: 180, sortOrder: 4 },
  district: { field: 'district', visible: true, width: 150, sortOrder: 5 },
  schoolType: { field: 'schoolType', visible: true, width: 120, sortOrder: 6 },
  schoolTypeDescription: { field: 'schoolTypeDescription', visible: true, width: 200, sortOrder: 7 },
  situationCode: { field: 'situationCode', visible: true, width: 120, sortOrder: 8 },
  schoolCode: { field: 'schoolCode', visible: true, width: 120, sortOrder: 9 },
}

const defaultColumnOrder = Object.keys(defaultPreferences)

export const useColumnPreferences = create<ColumnPreferencesState>()(
  persist(
    immer((set, get) => ({
      preferences: defaultPreferences,
      columnOrder: defaultColumnOrder,

      setColumnVisible: (field, visible) =>
        set((state) => {
          if (!state.preferences[field]) {
            state.preferences[field] = { field, visible }
          } else {
            state.preferences[field].visible = visible
          }
        }),

      setColumnWidth: (field, width) =>
        set((state) => {
          if (!state.preferences[field]) {
            state.preferences[field] = { field, visible: true, width }
          } else {
            state.preferences[field].width = width
          }
        }),

      setColumnPinned: (field, pinned) =>
        set((state) => {
          if (!state.preferences[field]) {
            state.preferences[field] = { field, visible: true, pinned }
          } else {
            state.preferences[field].pinned = pinned
          }
        }),

      reorderColumns: (newOrder) =>
        set((state) => {
          state.columnOrder = newOrder
          // Atualizar sortOrder baseado na nova ordem
          newOrder.forEach((field, index) => {
            if (!state.preferences[field]) {
              state.preferences[field] = { field, visible: true, sortOrder: index }
            } else {
              state.preferences[field].sortOrder = index
            }
          })
        }),

      updatePreference: (field, updates) =>
        set((state) => {
          if (!state.preferences[field]) {
            state.preferences[field] = { field, visible: true, ...updates }
          } else {
            Object.assign(state.preferences[field], updates)
          }
        }),

      resetPreferences: () =>
        set((state) => {
          state.preferences = { ...defaultPreferences }
          state.columnOrder = [...defaultColumnOrder]
        }),

      applyPreferencesToColumns: (columns) => {
        const { preferences, columnOrder } = get()
        
        return columns
          .map((col) => {
            if (!col.field) return col
            
            const pref = preferences[col.field]
            if (!pref) return col

            const newCol: ColDef = {
              ...col,
              hide: !pref.visible,
            }

            if (pref.width !== undefined) {
              newCol.width = pref.width
            }

            if (pref.pinned !== undefined) {
              newCol.pinned = pref.pinned
            }

            return newCol
          })
          .sort((a, b) => {
            const aField = a.field
            const bField = b.field
            
            if (!aField || !bField) return 0
            
            const aIndex = columnOrder.indexOf(aField)
            const bIndex = columnOrder.indexOf(bField)
            
            // Se não estiver na ordem, coloca no final
            if (aIndex === -1 && bIndex === -1) return 0
            if (aIndex === -1) return 1
            if (bIndex === -1) return -1
            
            return aIndex - bIndex
          })
      },

      getVisibleColumns: () => {
        const { preferences } = get()
        return Object.values(preferences)
          .filter(pref => pref.visible)
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map(pref => pref.field)
      },
    })),
    {
      name: 'school-column-preferences',
      version: 1,
    }
  )
) 