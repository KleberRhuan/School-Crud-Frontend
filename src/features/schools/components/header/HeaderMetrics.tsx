import React from 'react'
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Info as InfoIcon,
} from '@mui/icons-material'

interface HeaderMetricsProps {
  totalColumns: number
  isLoadingColumns: boolean
  metricsSource: string | null
  apiError: string | null
  totalRowsCount: number
  selectedRowsCount: number
  isLoading: boolean
}

export const HeaderMetrics: React.FC<HeaderMetricsProps> = ({
  totalColumns,
  isLoadingColumns,
  metricsSource,
  apiError,
  totalRowsCount,
  selectedRowsCount,
  isLoading,
}) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
      {/* Métricas principais */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {isLoading ? 'Carregando...' : `${totalRowsCount} registros`}
        </Typography>
        
        {selectedRowsCount > 0 && (
          <Chip
            label={`${selectedRowsCount} selecionados`}
            size="small"
            color="secondary"
            variant="outlined"
          />
        )}
      </Box>

      {/* Indicador de colunas */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {isLoadingColumns ? 'Carregando colunas...' : `${totalColumns} colunas`}
        </Typography>
        
        {metricsSource && (
          <Chip
            label={metricsSource === 'api' ? 'Dados da API' : 'Modo Offline'}
            size="small"
            color={metricsSource === 'api' ? 'success' : 'warning'}
            variant="outlined"
          />
        )}
      </Box>

      {/* Dica de edição */}
      <Tooltip 
        title={
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              💡 Como editar registros:
            </Typography>
            <Typography variant="body2">
              • Clique duplo em qualquer linha para editá-la
            </Typography>
            <Typography variant="body2">
              • Use os checkboxes para seleção múltipla
            </Typography>
            <Typography variant="body2">
              • Exporte apenas os registros selecionados
            </Typography>
          </Box>
        }
        arrow
        placement="bottom"
      >
        <IconButton size="small" sx={{ color: 'primary.main', opacity: 0.7 }}>
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Indicador de erro da API */}
      {apiError && (
        <Tooltip title={`Erro: ${apiError}`}>
          <Chip
            label="Erro na API"
            size="small"
            color="error"
            variant="outlined"
            icon={<InfoIcon />}
          />
        </Tooltip>
      )}
    </Stack>
  )
} 