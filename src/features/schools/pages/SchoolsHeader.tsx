import React from 'react'
import {
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { 
  ActiveFilters, 
  DesktopActions, 
  HeaderMetrics, 
  MobileActions 
} from '../components/header'
import { useSchoolsHeader } from '../hooks/useSchoolsHeader'

interface SchoolsHeaderProps {
  title: string
  totalColumns: number
  isLoadingColumns: boolean
  metricsSource: 'api' | 'local'
  apiError: string | null
  onExport: () => void
  onExportSelected: () => void
  onExportAllColumns: () => void
  onOpenFilterDialog: () => void
  onOpenColumnsDialog: () => void
  onOpenImportDialog: () => void
  onNewSchool: () => void
  totalRowsCount?: number
  selectedRowsCount?: number
  isLoading?: boolean
}

export const SchoolsHeader: React.FC<SchoolsHeaderProps> = ({
  title,
  totalColumns,
  isLoadingColumns,
  metricsSource,
  apiError,
  onExport,
  onExportSelected,
  onExportAllColumns,
  onOpenFilterDialog,
  onOpenColumnsDialog: onOpenColumnsDialogHandler,
  onOpenImportDialog,
  onNewSchool,
  totalRowsCount = 0,
  selectedRowsCount = 0,
  isLoading = false,
}) => {
  void onOpenColumnsDialogHandler

  const { filters, isSmallScreen, actionProps, clearFilters } = useSchoolsHeader({
    totalRowsCount,
    selectedRowsCount,
    isLoading,
    onExport,
    onExportSelected,
    onExportAllColumns,
    onOpenFilterDialog,
    onOpenImportDialog,
    onNewSchool,
  })

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 0 }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={{ xs: 2, sm: 0 }}
      >
        {/* Título e métricas */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Typography variant={isSmallScreen ? "h5" : "h4"} component="h1" fontWeight="bold">
            {title}
          </Typography>
          <HeaderMetrics
            totalColumns={totalColumns}
            isLoadingColumns={isLoadingColumns}
            metricsSource={metricsSource}
            apiError={apiError}
            totalRowsCount={totalRowsCount}
            selectedRowsCount={selectedRowsCount}
            isLoading={isLoading}
          />
        </Stack>

        {/* Botões de ação - responsivos */}
        {isSmallScreen ? (
          <MobileActions {...actionProps} />
        ) : (
          <DesktopActions {...actionProps} />
        )}
      </Stack>

      {/* Filtros ativos */}
      <ActiveFilters filters={filters} onClearFilters={clearFilters} />
    </Paper>
  )
} 