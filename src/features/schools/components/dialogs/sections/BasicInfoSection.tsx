import React from 'react'
import { TextField } from '@mui/material'
import { FormSection } from './FormSection'
import type { BasicInfoSectionProps } from './types'

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
      slotProps={{ htmlInput: { maxLength: 200 } }}
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
      slotProps={{ htmlInput: { maxLength: 100 } }}
    />

    <TextField
      fullWidth
      label="Estado (UF)"
      placeholder="Ex: SP, RJ, MG..."
      value={formData.stateCode}
      onChange={(e) => updateField('stateCode', e.target.value.toUpperCase())}
      error={!!errors.stateCode}
      helperText={errors.stateCode || 'Sigla do estado'}
      slotProps={{ htmlInput: { maxLength: 10 } }}
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