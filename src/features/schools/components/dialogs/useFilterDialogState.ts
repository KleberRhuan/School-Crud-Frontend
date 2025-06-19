import { useEffect, useState } from 'react'
import { useSchoolFilters } from '../../store/schoolFilters'
import type { SchoolFilters } from '@/schemas/schoolSchemas'

interface UseFilterDialogState {
  localFilters: SchoolFilters
  setLocalFilters: React.Dispatch<React.SetStateAction<SchoolFilters>>
  handleLocalFilterChange: (field: keyof SchoolFilters, value: any) => void
  handleApply: () => void
  handleClear: () => void
  handleReset: () => void
  activeFiltersCount: number
}

export const useFilterDialogState = (open: boolean): UseFilterDialogState => {
  const { filters, setFilter, clear } = useSchoolFilters()
  const [localFilters, setLocalFilters] = useState<SchoolFilters>(filters)

  // Sincroniza estado interno sempre que o dialog é aberto ou quando store muda
  useEffect(() => {
    if (open) {
      setLocalFilters(filters)
    }
  }, [open, filters])

  const handleLocalFilterChange = (field: keyof SchoolFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }))
  }

  const handleApply = () => {
    Object.entries(localFilters).forEach(([key, value]) => {
      setFilter(key as keyof SchoolFilters, value)
    })
  }
  
  const handleClear = () => {
    setLocalFilters({})
    clear()
  }

  const handleReset = () => {
    setLocalFilters(filters)
  }

  const activeFiltersCount = Object.values(localFilters).filter(
    (v) => v !== undefined && v !== null && v !== ''
  ).length

  return {
    localFilters,
    setLocalFilters,
    handleLocalFilterChange,
    handleApply,
    handleClear,
    handleReset,
    activeFiltersCount,
  }
} 