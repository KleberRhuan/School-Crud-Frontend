import React from 'react'
import { Box, Button, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, Stack, Typography } from '@mui/material'
import type { School } from '@/schemas/schoolSchemas'

interface SchoolDetailDialogProps {
  open: boolean
  onClose: () => void
  onEdit: () => void
  selectedSchool: School | null
}

export const SchoolDetailDialog: React.FC<SchoolDetailDialogProps> = ({ open, onClose, onEdit, selectedSchool }) => (
  <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
    <DialogTitle>Detalhes da Escola</DialogTitle>
    <DialogContent>
      {selectedSchool && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 2 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informações Básicas
                </Typography>
                <Typography>
                  <strong>Código:</strong> {selectedSchool.code}
                </Typography>
                <Typography>
                  <strong>Nome:</strong> {selectedSchool.schoolName}
                </Typography>
                <Typography>
                  <strong>Município:</strong> {selectedSchool.municipality}
                </Typography>
                <Typography>
                  <strong>UF:</strong> {selectedSchool.stateCode}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informações Administrativas
                </Typography>
                <Typography>
                  <strong>Dependência:</strong> {selectedSchool.administrativeDependency}
                </Typography>
                <Typography>
                  <strong>Tipo:</strong> {selectedSchool.schoolTypeDescription}
                </Typography>
                <Typography>
                  <strong>Situação:</strong> {selectedSchool.situationCode}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      )}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
        <Button onClick={onClose}>Fechar</Button>
        <Button variant="contained" onClick={onEdit}>
          Editar
        </Button>
      </Stack>
    </DialogContent>
  </Dialog>
)

SchoolDetailDialog.displayName = 'SchoolDetailDialog' 