import React from 'react'
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material'

interface ActiveFiltersProps {
  filters: {
    name?: string | undefined
    municipalityName?: string | undefined
    stateAbbreviation?: string | undefined
    [key: string]: any
  }
  onClearFilters: () => void
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onClearFilters,
}) => {
  const hasFilters = Object.keys(filters).length > 0

  if (!hasFilters) {
    return null
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Filtros ativos:
        </Typography>
        {filters.name && (
          <Chip size="small" label={`Nome: ${filters.name}`} variant="outlined" />
        )}
        {filters.municipalityName && (
          <Chip size="small" label={`Município: ${filters.municipalityName}`} variant="outlined" />
        )}
        {filters.stateAbbreviation && (
          <Chip size="small" label={`UF: ${filters.stateAbbreviation}`} variant="outlined" />
        )}
        <Button size="small" variant="text" onClick={onClearFilters}>
          Limpar filtros
        </Button>
      </Stack>
    </Box>
  )
} 