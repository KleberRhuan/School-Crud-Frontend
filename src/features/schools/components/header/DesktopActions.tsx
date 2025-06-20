import React from 'react'
import {
  Button,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Upload as ImportIcon,
} from '@mui/icons-material'
import { ExportMenu } from '../ExportMenu'

interface DesktopActionsProps {
  hasFilters: boolean
  isLoading: boolean
  totalRowsCount: number
  selectedRowsCount: number
  onExport: () => void
  onExportSelected: () => void
  onExportAllColumns: () => void
  onOpenFilterDialog: () => void
  onOpenImportDialog: () => void
  onNewSchool: () => void
}

export const DesktopActions: React.FC<DesktopActionsProps> = ({
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
}) => {
  return (
    <Stack direction="row" spacing={1}>
      <ExportMenu
        onExportAll={onExport}
        onExportSelected={onExportSelected}
        onExportAllColumns={onExportAllColumns}
        disabled={isLoading || totalRowsCount === 0}
        selectedRowsCount={selectedRowsCount}
        totalRowsCount={totalRowsCount}
      />
      <Tooltip title="Filtros">
        <IconButton onClick={onOpenFilterDialog} color={hasFilters ? 'secondary' : 'primary'}>
          <FilterIcon />
        </IconButton>
      </Tooltip>
      <Button 
        variant="outlined" 
        startIcon={<ImportIcon />} 
        onClick={onOpenImportDialog} 
        sx={{ ml: 1 }}
        disabled={isLoading}
      >
        Importar CSV
      </Button>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={onNewSchool} 
        sx={{ ml: 1 }}
        disabled={isLoading}
      >
        Nova Escola
      </Button>
    </Stack>
  )
} 