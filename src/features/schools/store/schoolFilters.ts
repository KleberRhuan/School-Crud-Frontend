import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { SchoolFilters } from '@/schemas/schoolSchemas'

interface SchoolFiltersState {
  filters: SchoolFilters
  setFilter: (field: keyof SchoolFilters, value: any) => void
  clear: () => void
}

export const useSchoolFilters = create<SchoolFiltersState>()(
  persist(
    immer((set) => ({
      filters: {},
      setFilter: (field, value) =>
        set((state) => {
          if (value === undefined || value === null || value === '') {
            delete state.filters[field]
          } else {
            state.filters[field] = value
          }
        }),
      clear: () => set((state) => {
        state.filters = {}
      }),
    })),
    {
      name: 'school-filters',
      version: 1,
    }
  )
) 