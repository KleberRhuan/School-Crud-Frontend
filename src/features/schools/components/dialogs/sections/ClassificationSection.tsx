import React from 'react'
import { TextField } from '@mui/material'
import { FormSection } from './FormSection'
import type { ClassificationSectionProps } from './types'

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
      slotProps={{ htmlInput: { maxLength: 100 } }}
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