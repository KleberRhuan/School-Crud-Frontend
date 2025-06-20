import React from 'react'
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import type { School } from '@/schemas/schoolSchemas'
import { useSchoolFormState } from './useSchoolFormState'
import { 
  BasicInfoSection, 
  ClassificationSection, 
  LocationSection,
  MetricsSection
} from './SchoolFormSections'
import { InfoBox, SchoolFormActions } from './SchoolFormActions'

interface SchoolFormDialogProps {
  open: boolean
  onClose: () => void
  selectedSchool: School | null
  onSchoolCreated?: ((school: School) => void) | undefined
  onSchoolUpdated?: ((school: School) => void) | undefined
  onSchoolDeleted?: (() => void) | undefined
}

export const SchoolFormDialog: React.FC<SchoolFormDialogProps> = ({ 
  open, 
  onClose, 
  selectedSchool,
  onSchoolCreated,
  onSchoolUpdated,
  onSchoolDeleted
}) => {
  const {
    formData,
    errors,
    isSubmitting,
    isEditing,
    isLoading,
    updateField,
    handleSubmit,
    handleDelete,
    resetForm,
  } = useSchoolFormState({
    school: selectedSchool,
    isOpen: open,
    onClose,
    onSchoolCreated,
    onSchoolUpdated,
    onSchoolDeleted,
  })

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <form onSubmit={handleFormSubmit}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5">
              {isEditing ? 'Editar Escola' : 'Nova Escola'}
            </Typography>
            {isLoading && <CircularProgress size={24} />}
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <BasicInfoSection
            formData={formData}
            errors={errors}
            updateField={updateField}
            isEditing={isEditing}
          />

          <LocationSection
            formData={formData}
            errors={errors}
            updateField={updateField}
          />

          <ClassificationSection
            formData={formData}
            errors={errors}
            updateField={updateField}
          />

          <MetricsSection
            formData={formData}
            errors={errors}
            updateField={updateField}
          />

          <InfoBox>
            💡 <strong>Dica:</strong> Adicione métricas da escola para ter informações mais detalhadas 
            sobre infraestrutura, recursos e dados estatísticos. As métricas são validadas automaticamente.
          </InfoBox>
        </DialogContent>

        <SchoolFormActions
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          schoolName={selectedSchool?.schoolName || formData.schoolName || ''}
          onSubmit={handleSubmit}
          onDelete={isEditing ? handleDelete : undefined}
          onClose={handleClose}
        />
      </form>
    </Dialog>
  )
}

SchoolFormDialog.displayName = 'SchoolFormDialog' 