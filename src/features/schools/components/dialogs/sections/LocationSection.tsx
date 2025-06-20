import React from 'react'
import { TextField } from '@mui/material'
import { FormSection } from './FormSection'
import type { LocationSectionProps } from './types'

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
      slotProps={{ htmlInput: { maxLength: 100 } }}
    />

    <TextField
      fullWidth
      label="Distrito/Bairro"
      placeholder="Digite o distrito ou bairro..."
      value={formData.district}
      onChange={(e) => updateField('district', e.target.value)}
      error={!!errors.district}
      helperText={errors.district || 'Distrito ou bairro (máximo 100 caracteres)'}
      slotProps={{ htmlInput: { maxLength: 100 } }}
    />
  </FormSection>
) 