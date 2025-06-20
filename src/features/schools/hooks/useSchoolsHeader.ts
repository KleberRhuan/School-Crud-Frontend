import { useMediaQuery } from '@mui/material'
import { useSchoolFilters } from '../store/schoolFilters'

interface UseSchoolsHeaderProps {
  totalRowsCount: number
  selectedRowsCount: number
  isLoading: boolean
  onExport: () => void
  onExportSelected: () => void
  onExportAllColumns: () => void
  onOpenFilterDialog: () => void
  onOpenImportDialog: () => void
  onNewSchool: () => void
}

export const useSchoolsHeader = ({
  totalRowsCount,
  selectedRowsCount,
  isLoading,
  onExport,
  onExportSelected,
  onExportAllColumns,
  onOpenFilterDialog,
  onOpenImportDialog,
  onNewSchool,
}: UseSchoolsHeaderProps) => {
  const { filters, clear: clearFilters } = useSchoolFilters()
  const hasFilters = Object.keys(filters).length > 0
  const isSmallScreen = useMediaQuery('(max-width:900px)')

  const actionProps = {
    hasFilters,
    isLoading,
    totalRowsCount,
    selectedRowsCount,
    onExport,
    onExportSelected,
    onExportAllColumns,
    onOpenFilterDialog,
    onOpenImportDialog,
    onNewSchool,
  }

  return {
    filters,
    hasFilters,
    isSmallScreen,
    actionProps,
    clearFilters,
  }
} 