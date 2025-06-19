import React from 'react'
import {
  Box,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useAuthStore } from '@/stores/authStore'
import { CACHE_TIME_HOUR, CACHE_TIME_LONG } from '@/constants/pagination'

interface FormSectionProps {
  title: string
  children: React.ReactNode
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" gutterBottom color="primary">
      {title}
    </Typography>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 2,
      }}
    >
      {children}
    </Box>
  </Paper>
)

interface BasicInfoSectionProps {
  formData: any
  errors: any
  updateField: (field: any, value: any) => void
  isEditing: boolean
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  updateField,
  isEditing
}) => (
  <FormSection title="📋 Informações Básicas">
    <TextField
      fullWidth
      required
      type="number"
      label="Código da Escola"
      placeholder="Digite o código..."
      value={formData.code}
      onChange={(e) => updateField('code', e.target.value ? Number(e.target.value) : '')}
      error={!!errors.code}
      helperText={errors.code || 'Código único da escola'}
      disabled={isEditing}
      sx={{ gridColumn: { xs: 'span 1', md: 'span 1' } }}
    />

    <TextField
      fullWidth
      required
      label="Nome da Escola"
      placeholder="Digite o nome completo..."
      value={formData.schoolName}
      onChange={(e) => updateField('schoolName', e.target.value)}
      error={!!errors.schoolName}
      helperText={errors.schoolName || 'Nome completo da escola (máximo 200 caracteres)'}
      inputProps={{ maxLength: 200 }}
      sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}
    />

    <TextField
      fullWidth
      label="Dependência Administrativa"
      placeholder="Ex: Municipal, Estadual, Federal..."
      value={formData.administrativeDependency}
      onChange={(e) => updateField('administrativeDependency', e.target.value)}
      error={!!errors.administrativeDependency}
      helperText={errors.administrativeDependency || 'Esfera administrativa (máximo 100 caracteres)'}
      inputProps={{ maxLength: 100 }}
    />

    <TextField
      fullWidth
      label="Estado (UF)"
      placeholder="Ex: SP, RJ, MG..."
      value={formData.stateCode}
      onChange={(e) => updateField('stateCode', e.target.value.toUpperCase())}
      error={!!errors.stateCode}
      helperText={errors.stateCode || 'Sigla do estado'}
      inputProps={{ maxLength: 10 }}
    />

    <TextField
      fullWidth
      type="number"
      label="Código da Escola (Alt)"
      placeholder="Código alternativo..."
      value={formData.schoolCode}
      onChange={(e) => updateField('schoolCode', e.target.value ? Number(e.target.value) : '')}
      error={!!errors.schoolCode}
      helperText={errors.schoolCode || 'Código alternativo (opcional)'}
    />
  </FormSection>
)

interface LocationSectionProps {
  formData: any
  errors: any
  updateField: (field: any, value: any) => void
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  formData,
  errors,
  updateField
}) => (
  <FormSection title="📍 Localização">
    <TextField
      fullWidth
      label="Município"
      placeholder="Digite o município..."
      value={formData.municipality}
      onChange={(e) => updateField('municipality', e.target.value)}
      error={!!errors.municipality}
      helperText={errors.municipality || 'Nome do município (máximo 100 caracteres)'}
      inputProps={{ maxLength: 100 }}
    />

    <TextField
      fullWidth
      label="Distrito/Bairro"
      placeholder="Digite o distrito ou bairro..."
      value={formData.district}
      onChange={(e) => updateField('district', e.target.value)}
      error={!!errors.district}
      helperText={errors.district || 'Distrito ou bairro (máximo 100 caracteres)'}
      inputProps={{ maxLength: 100 }}
    />
  </FormSection>
)

interface ClassificationSectionProps {
  formData: any
  errors: any
  updateField: (field: any, value: any) => void
}

export const ClassificationSection: React.FC<ClassificationSectionProps> = ({
  formData,
  errors,
  updateField
}) => (
  <FormSection title="🏫 Classificação">
    <TextField
      fullWidth
      type="number"
      label="Tipo de Escola"
      placeholder="Ex: 1, 2, 3..."
      value={formData.schoolType}
      onChange={(e) => updateField('schoolType', e.target.value ? Number(e.target.value) : '')}
      error={!!errors.schoolType}
      helperText={errors.schoolType || 'Código do tipo de escola'}
    />

    <TextField
      fullWidth
      label="Descrição do Tipo"
      placeholder="Ex: Escola Estadual, EMEI..."
      value={formData.schoolTypeDescription}
      onChange={(e) => updateField('schoolTypeDescription', e.target.value)}
      error={!!errors.schoolTypeDescription}
      helperText={errors.schoolTypeDescription || 'Descrição do tipo (máximo 100 caracteres)'}
      inputProps={{ maxLength: 100 }}
      sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}
    />

    <TextField
      fullWidth
      type="number"
      label="Código de Situação"
      placeholder="Ex: 1, 2, 3..."
      value={formData.situationCode}
      onChange={(e) => updateField('situationCode', e.target.value ? Number(e.target.value) : '')}
      error={!!errors.situationCode}
      helperText={errors.situationCode || 'Status da escola'}
    />
  </FormSection>
)

interface MetricsSectionProps {
  formData: any
  errors: any
  updateField: (field: any, value: any) => void
}

const useMetricsList = () => {
  const accessToken = useAuthStore(state => state.accessToken)

  const query = useApiQuery<string[]>(
    ['school-metrics-list'],
    '/schools/metrics',
    {},
    {
      staleTime: CACHE_TIME_LONG,
      gcTime: CACHE_TIME_HOUR,
      retry: 2,
      enabled: !!accessToken,
    }
  )

  return query
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({
  formData,
  errors,
  updateField
}) => {
  const { data: availableMetrics = [], isLoading } = useMetricsList()
  const currentMetrics = formData.metrics || {}

  const handleAddMetric = (metric: string) => {
    if (metric && !currentMetrics[metric]) {
      updateField('metrics', {
        ...currentMetrics,
        [metric]: 0
      })
    }
  }

  const handleUpdateMetricValue = (metric: string, value: number) => {
    updateField('metrics', {
      ...currentMetrics,
      [metric]: value
    })
  }

  const handleRemoveMetric = (metric: string) => {
    const newMetrics = { ...currentMetrics }
    delete newMetrics[metric]
    updateField('metrics', newMetrics)
  }

  const getAvailableMetricsForSelection = () => {
    return availableMetrics.filter(metric => !currentMetrics[metric])
  }

  return (
    <FormSection title="📊 Métricas da Escola">
      <Box sx={{ gridColumn: 'span 2' }}>
        <Stack spacing={2}>
          <Select
            fullWidth
            value=""
            onChange={(e) => {
              if (e.target.value) {
                handleAddMetric(e.target.value as string)
              }
            }}
            displayEmpty
            disabled={isLoading}
          >
            <MenuItem value="" disabled>
              Selecione uma métrica...
            </MenuItem>
            {getAvailableMetricsForSelection().map((metric) => (
              <MenuItem key={metric} value={metric}>
                {metric.replace(/_/g, ' ')}
              </MenuItem>
            ))}
          </Select>

          {Object.entries(currentMetrics).map(([metric, value]) => (
            <Stack key={metric} direction="row" spacing={2} alignItems="center">
              <Chip
                label={metric.replace(/_/g, ' ')}
                color="primary"
                variant="outlined"
                sx={{ minWidth: 200, justifyContent: 'flex-start' }}
              />
              <TextField
                type="number"
                label="Valor"
                value={value}
                onChange={(e) => handleUpdateMetricValue(metric, Number(e.target.value) || 0)}
                inputProps={{ min: 0 }}
                error={!!errors[`metrics.${metric}`]}
                helperText={errors[`metrics.${metric}`]}
                sx={{ flex: 1 }}
              />
              <Tooltip title="Remover métrica">
                <IconButton
                  onClick={() => handleRemoveMetric(metric)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          ))}

          {Object.keys(currentMetrics).length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Nenhuma métrica adicionada. Use o campo acima para adicionar métricas da escola.
            </Typography>
          )}

          {isLoading && (
            <Typography variant="body2" color="text.secondary">
              Carregando métricas disponíveis...
            </Typography>
          )}
        </Stack>
      </Box>
    </FormSection>
  )
} 