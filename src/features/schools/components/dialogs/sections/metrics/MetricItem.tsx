import React from 'react'
import { Chip, IconButton, Stack, TextField, Tooltip } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'

interface MetricItemProps {
  metric: string
  value: number
  error?: string
  onUpdateValue: (metric: string, value: number) => void
  onRemove: (metric: string) => void
}

export const MetricItem: React.FC<MetricItemProps> = ({
  metric,
  value,
  error,
  onUpdateValue,
  onRemove
}) => (
  <Stack direction="row" spacing={2} alignItems="center">
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
      onChange={(e) => onUpdateValue(metric, Number(e.target.value) || 0)}
      slotProps={{ htmlInput: { min: 0 } }}
      error={!!error}
      helperText={error}
      sx={{ flex: 1 }}
    />
    <Tooltip title="Remover métrica">
      <IconButton
        onClick={() => onRemove(metric)}
        color="error"
        size="small"
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  </Stack>
) 