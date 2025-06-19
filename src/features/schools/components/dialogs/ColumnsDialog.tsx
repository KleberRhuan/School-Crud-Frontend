import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material'
import { type ColumnPreference, useColumnPreferences } from '../../store/columnPreferences'

interface ColumnsDialogProps {
  open: boolean
  onClose: () => void
  totalColumns: number
  metricsSource: 'api' | 'local'
}

export const ColumnsDialog: React.FC<ColumnsDialogProps> = ({ open, onClose, totalColumns, metricsSource }) => {
  const { preferences, setColumnVisible } = useColumnPreferences()
  const [localPrefs, setLocalPrefs] = useState<Record<string, ColumnPreference>>({})
  
  useEffect(() => {
    if (open) {
      setLocalPrefs(JSON.parse(JSON.stringify(preferences)))
    }
  }, [open, preferences])

  const handleToggle = (field: string) => {
    setLocalPrefs((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        visible: !prev[field].visible,
      },
    }))
  }

  const handleSave = () => {
    Object.values(localPrefs).forEach((pref) => {
      if (pref.visible !== preferences[pref.field]?.visible) {
        setColumnVisible(pref.field, pref.visible)
      }
    })
    onClose()
  }

  const sortedPrefs = Object.values(localPrefs).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Gerenciar Colunas</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Selecione quais colunas deseja visualizar na tabela ({totalColumns} colunas disponíveis)
        </Typography>

        <FormGroup>
          {sortedPrefs.map((pref) => (
            <FormControlLabel
              key={pref.field}
              control={<Checkbox checked={pref.visible} onChange={() => handleToggle(pref.field)} />}
              label={pref.field}
            />
          ))}
        </FormGroup>

        <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
          Fonte das métricas: {metricsSource === 'api' ? 'API' : 'Local'}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Salvar Configuração
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

ColumnsDialog.displayName = 'ColumnsDialog' 