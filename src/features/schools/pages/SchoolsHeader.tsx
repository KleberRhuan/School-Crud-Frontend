import React from 'react'
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  Api as ApiIcon,
  Download as ExportIcon,
  Storage as FallbackIcon,
  FilterList as FilterIcon,
  CloudUpload as ImportIcon,
} from '@mui/icons-material'
import { useSchoolFilters } from '../store/schoolFilters'

interface SchoolsHeaderProps {
  title: string
  totalColumns: number
  isLoadingColumns: boolean
  metricsSource: 'api' | 'local'
  apiError?: Error | null
  onExport: () => void
  onOpenFilterDialog: () => void
  onOpenColumnsDialog: () => void
  onOpenImportDialog: () => void
  onNewSchool: () => void
}

export const SchoolsHeader: React.FC<SchoolsHeaderProps> = ({
  title,
  totalColumns,
  isLoadingColumns,
  metricsSource,
  apiError,
  onExport,
  onOpenFilterDialog,
  onOpenColumnsDialog: onOpenColumnsDialogHandler,
  onOpenImportDialog,
  onNewSchool,
}) => {
  const { filters, clear } = useSchoolFilters()
  const hasFilters = Object.keys(filters).length > 0

  void onOpenColumnsDialogHandler

  const getMetricsTooltipText = () => {
    if (metricsSource === 'api') {
      return 'Métricas carregadas da API'
    }
    if (apiError) {
      return 'Erro na API - usando dados locais'
    }
    return 'Usando métricas padrão'
  }

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 0 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {title}
          </Typography>
          {/* Status das colunas */}
          <Stack direction="row" spacing={1}>
            <Chip
              size="small"
              label={`${totalColumns} colunas`}
              color="primary"
              variant="outlined"
            />
            <Tooltip title={getMetricsTooltipText()}>
              <Chip
                size="small"
                icon={metricsSource === 'api' ? <ApiIcon /> : <FallbackIcon />}
                label={metricsSource === 'api' ? 'API' : 'Local'}
                color={metricsSource === 'api' ? 'success' : 'warning'}
                variant="outlined"
              />
            </Tooltip>
            {isLoadingColumns && (
              <Chip size="small" label="Carregando..." color="info" variant="outlined" />
            )}
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Exportar">
            <IconButton onClick={onExport} color="primary">
              <ExportIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filtros">
            <IconButton onClick={onOpenFilterDialog} color={hasFilters ? 'secondary' : 'primary'}>
              <FilterIcon />
            </IconButton>
          </Tooltip>
          <Button variant="outlined" startIcon={<ImportIcon />} onClick={onOpenImportDialog} sx={{ ml: 1 }}>
            Importar CSV
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onNewSchool} sx={{ ml: 1 }}>
            Nova Escola
          </Button>
        </Stack>
      </Stack>
      {/* Filtros rápidos */}
      {hasFilters && (
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">
              Filtros ativos:
            </Typography>
            {filters.name && (
              <Chip size="small" label={`Nome: ${filters.name}`} variant="outlined" />
            )}
            {filters.municipalityName && (
              <Chip size="small" label={`Município: ${filters.municipalityName}`} variant="outlined" />
            )}
            {filters.stateAbbreviation && (
              <Chip size="small" label={`UF: ${filters.stateAbbreviation}`} variant="outlined" />
            )}
            <Button size="small" variant="text" onClick={clear}>
              Limpar filtros
            </Button>
          </Stack>
        </Box>
      )}
    </Paper>
  )
} 