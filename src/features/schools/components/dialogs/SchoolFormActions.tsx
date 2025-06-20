import React, { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'

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
  schoolName?: string
  onSubmit: () => void
  onDelete?: (() => Promise<void> | void) | undefined
  onClose: () => void
}

export const SchoolFormActions: React.FC<SchoolFormActionsProps> = ({
  isSubmitting,
  isEditing,
  schoolName = '',
  onSubmit,
  onDelete,
  onClose
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return isEditing ? 'Salvando...' : 'Criando...'
    }
    return isEditing ? 'Salvar Alterações' : 'Criar Escola'
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false)
    onDelete?.()
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <DialogActions sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} width="100%" justifyContent="space-between">
          {/* Botão de excluir à esquerda (apenas no modo edição) */}
          <Box>
            {isEditing && onDelete && (
              <Button 
                onClick={handleDeleteClick}
                disabled={isSubmitting}
                size="large"
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
              >
                Excluir Escola
              </Button>
            )}
          </Box>

          {/* Botões principais à direita */}
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

      {/* Diálogo de confirmação para exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          ⚠️ Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir a escola <strong>"{schoolName}"</strong>?
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: 'error.main' }}>
            ⚠️ <strong>Esta ação não pode ser desfeita!</strong> Todos os dados da escola serão removidos permanentemente.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleDeleteCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {isSubmitting ? 'Excluindo...' : 'Excluir Escola'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
} 