import React from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { useFilterDialogState } from './useFilterDialogState'
import type { SchoolFilters } from '@/schemas/schoolSchemas'

interface FilterDialogProps {
  open: boolean
  onClose: () => void
}

interface FilterTextFieldsProps {
  localFilters: SchoolFilters
  handleLocalFilterChange: (key: keyof SchoolFilters, value: any) => void
}

interface FilterNumberFieldsProps {
  localFilters: SchoolFilters
  handleLocalFilterChange: (key: keyof SchoolFilters, value: any) => void
}

interface ActiveFiltersDisplayProps {
  localFilters: SchoolFilters
  activeFiltersCount: number
  handleLocalFilterChange: (key: keyof SchoolFilters, value: any) => void
}

interface FilterDialogActionsProps {
  handleClear: () => void
  handleReset: () => void
  onClose: () => void
  handleApply: () => void
}

const FilterTextFields: React.FC<FilterTextFieldsProps> = ({ 
  localFilters, 
  handleLocalFilterChange 
}) => (
  <>
    <TextField
      fullWidth
      label="Nome da Escola"
      placeholder="Digite o nome..."
      value={localFilters.name || ''}
      onChange={(e) => handleLocalFilterChange('name', e.target.value)}
      helperText="Busca aproximada por nome"
    />

    <TextField
      fullWidth
      label="Município"
      placeholder="Nome do município..."
      value={localFilters.municipalityName || ''}
      onChange={(e) => handleLocalFilterChange('municipalityName', e.target.value)}
      helperText="Nome do município"
    />

    <TextField
      fullWidth
      label="Estado (UF)"
      placeholder="Ex: SP, RJ, MG..."
      value={localFilters.stateAbbreviation || ''}
      onChange={(e) => handleLocalFilterChange('stateAbbreviation', e.target.value.toUpperCase())}
      helperText="Sigla do estado"
      slotProps={{ htmlInput: { maxLength: 2 } }}
    />

    <TextField
      fullWidth
      label="Região Administrativa"
      placeholder="Nome da região..."
      value={localFilters.administrativeRegion || ''}
      onChange={(e) => handleLocalFilterChange('administrativeRegion', e.target.value)}
      helperText="Região administrativa"
    />

    <TextField
      fullWidth
      label="Dependência Administrativa"
      placeholder="Ex: Municipal, Estadual..."
      value={localFilters.administrativeDependence || ''}
      onChange={(e) => handleLocalFilterChange('administrativeDependence', e.target.value)}
      helperText="Tipo de dependência"
    />

    <TextField
      fullWidth
      label="Localização"
      placeholder="Urbana, Rural..."
      value={localFilters.location || ''}
      onChange={(e) => handleLocalFilterChange('location', e.target.value)}
      helperText="Localização da escola"
    />

    <TextField
      fullWidth
      label="Situação"
      placeholder="Ex: ATIVA, INATIVA..."
      value={localFilters.situation || ''}
      onChange={(e) => handleLocalFilterChange('situation', e.target.value)}
      helperText="Situação da escola"
    />
  </>
)

const FilterNumberFields: React.FC<FilterNumberFieldsProps> = ({ 
  localFilters, 
  handleLocalFilterChange 
}) => (
  <>
    <TextField
      fullWidth
      type="number"
      label="Status Operacional (número)"
      placeholder="Ex: 1, 2, 3..."
      value={localFilters.operationalStatus ?? ''}
      onChange={(e) => handleLocalFilterChange('operationalStatus', e.target.value ? Number(e.target.value) : undefined)}
      helperText="Status de funcionamento (valor numérico)"
    />

    <TextField
      fullWidth
      type="number"
      label="Tipo de Dependência (número)"
      placeholder="Ex: 1, 2, 3..."
      value={localFilters.dependencyType ?? ''}
      onChange={(e) => handleLocalFilterChange('dependencyType', e.target.value ? Number(e.target.value) : undefined)}
      helperText="Esfera administrativa (valor numérico)"
    />

    <TextField
      fullWidth
      type="number"
      label="Tipo de Escola (número)"
      placeholder="Ex: 1, 2, 3..."
      value={localFilters.schoolType ?? ''}
      onChange={(e) => handleLocalFilterChange('schoolType', e.target.value ? Number(e.target.value) : undefined)}
      helperText="Modalidade de ensino (valor numérico)"
    />
  </>
)

const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({ 
  localFilters, 
  activeFiltersCount, 
  handleLocalFilterChange 
}) => {
  if (activeFiltersCount === 0) return null

  const displayKeyMap: Record<string, string> = {
    operationalStatus: 'Status',
    dependencyType: 'Dependência',
    schoolType: 'Tipo',
    municipalityName: 'Município',
    stateAbbreviation: 'Estado',
    administrativeRegion: 'Região',
    administrativeDependence: 'Dep. Admin',
    location: 'Localização',
    situation: 'Situação',
    name: 'Nome',
  }

  return (
    <Box mt={3}>
      <Typography variant="subtitle2" gutterBottom>
        Filtros Ativos:
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {Object.entries(localFilters).map(([key, value]) => {
          if (value === undefined || value === null || value === '') return null
          
          const displayKey = displayKeyMap[key] || key
          const displayValue = String(value)
          
          return (
            <Chip
              key={key}
              label={`${displayKey}: ${displayValue}`}
              size="small"
              onDelete={() => handleLocalFilterChange(key as keyof SchoolFilters, undefined)}
              color="primary"
              variant="outlined"
            />
          )
        })}
      </Stack>
    </Box>
  )
}

const FilterDialogActions: React.FC<FilterDialogActionsProps> = ({ 
  handleClear, 
  handleReset, 
  onClose, 
  handleApply 
}) => (
  <DialogActions>
    <Button onClick={handleClear} color="warning">
      Limpar Tudo
    </Button>
    <Button onClick={handleReset}>
      Resetar
    </Button>
    <Button onClick={onClose}>
      Cancelar
    </Button>
    <Button onClick={() => { handleApply(); onClose(); }} variant="contained">
      Aplicar Filtros
    </Button>
  </DialogActions>
)

export const FilterDialog: React.FC<FilterDialogProps> = ({ open, onClose }) => {
  const {
    localFilters,
    handleLocalFilterChange,
    handleApply,
    handleClear,
    handleReset,
    activeFiltersCount,
  } = useFilterDialogState(open)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Filtros Avançados</Typography>
          {activeFiltersCount > 0 && (
            <Chip 
              label={`${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} ativo${activeFiltersCount > 1 ? 's' : ''}`}
              color="primary"
              size="small"
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 3 
          }}
        >
          <FilterTextFields 
            localFilters={localFilters}
            handleLocalFilterChange={handleLocalFilterChange}
          />
          <FilterNumberFields 
            localFilters={localFilters}
            handleLocalFilterChange={handleLocalFilterChange}
          />
        </Box>

        <ActiveFiltersDisplay 
          localFilters={localFilters}
          activeFiltersCount={activeFiltersCount}
          handleLocalFilterChange={handleLocalFilterChange}
        />
      </DialogContent>

      <FilterDialogActions 
        handleClear={handleClear}
        handleReset={handleReset}
        onClose={onClose}
        handleApply={handleApply}
      />
    </Dialog>
  )
}

FilterDialog.displayName = 'FilterDialog' 