import React from 'react'
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  Stack,
  Typography,
} from '@mui/material'

interface InfoBoxProps {
  children: React.ReactNode
}

export const InfoBox: React.FC<InfoBoxProps> = ({ children }) => (
  <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, mt: 2 }}>
    <Typography variant="body2" color="info.dark">
      {children}
    </Typography>
  </Box>
)

interface SchoolFormActionsProps {
  isSubmitting: boolean
  isEditing: boolean
  onSubmit: () => void
  onClose: () => void
}

export const SchoolFormActions: React.FC<SchoolFormActionsProps> = ({
  isSubmitting,
  isEditing,
  onSubmit,
  onClose
}) => {
  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return isEditing ? 'Salvando...' : 'Criando...'
    }
    return isEditing ? 'Salvar Alterações' : 'Criar Escola'
  }

  return (
    <DialogActions sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} width="100%" justifyContent="space-between">
        <Box />
        <Stack direction="row" spacing={2}>
          <Button 
            onClick={onClose}
            disabled={isSubmitting}
            size="large"
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSubmit}
            variant="contained" 
            disabled={isSubmitting}
            size="large"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {getSubmitButtonText()}
          </Button>
        </Stack>
      </Stack>
    </DialogActions>
  )
} 