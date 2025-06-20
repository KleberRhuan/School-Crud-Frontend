import React from 'react'
import { Box, MenuItem, Select, Stack, Typography } from '@mui/material'
import { FormSection } from './FormSection'
import type { MetricsSectionProps } from './types'
import { useMetricsList } from './metrics/useMetricsList'
import { useMetricsVisibility } from './metrics/useMetricsVisibility'
import { useMetricsHandlers } from './metrics/useMetricsHandlers'
import { MetricsVisibilityControls } from './metrics/MetricsVisibilityControls'
import { MetricItem } from './metrics/MetricItem'

export const MetricsSection: React.FC<MetricsSectionProps> = ({
  formData,
  errors,
  updateField
}) => {
  const { data: availableMetrics = [], isLoading } = useMetricsList()
  const currentMetrics = formData.metrics || {}
  const metricsEntries = Object.entries(currentMetrics)
  
  const { getVisibilityState, showMore, showLess, adjustAfterRemoval } = useMetricsVisibility()
  const { visibleCount, remainingCount, canShowMore, canShowLess } = getVisibilityState(metricsEntries.length)
  
  const {
    handleAddMetric,
    handleUpdateMetricValue,
    handleRemoveMetric,
    getAvailableMetricsForSelection
  } = useMetricsHandlers(currentMetrics, updateField, adjustAfterRemoval)

  const visibleMetrics = metricsEntries.slice(0, visibleCount)

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
            {getAvailableMetricsForSelection(availableMetrics).map((metric) => (
              <MenuItem key={metric} value={metric}>
                {metric.replace(/_/g, ' ')}
              </MenuItem>
            ))}
          </Select>

          {/* Métricas visíveis (incrementais de 10 em 10) */}
          {visibleMetrics.map(([metric, value]) => (
            <MetricItem
              key={metric}
              metric={metric}
              value={typeof value === 'number' ? value : Number(value) || 0}
              error={errors[`metrics.${metric}`]}
              onUpdateValue={handleUpdateMetricValue}
              onRemove={handleRemoveMetric}
            />
          ))}

          {/* Controles de visibilidade */}
          <MetricsVisibilityControls
            canShowMore={canShowMore}
            canShowLess={canShowLess}
            remainingCount={remainingCount}
            visibleCount={visibleCount}
            totalCount={metricsEntries.length}
            onShowMore={() => showMore(metricsEntries.length)}
            onShowLess={showLess}
          />

          {metricsEntries.length === 0 && (
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