import React, { useCallback, useState } from 'react'
import {
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material'
import {
  Clear as ClearIcon,
  ViewColumn as ColumnsIcon,
  Download as ExportIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { useSchoolFilters } from '../store/schoolFilters'

interface SchoolsTableToolbarProps {
  onQuickFilter: (text: string) => void
  onExport: () => void
  onRefresh: () => void
  onOpenFilters: () => void
  onOpenColumns: () => void
  totalRows: number
  filteredRows: number
  isLoading?: boolean
  // Props para carregamento inteligente
  hasMore?: boolean
  currentBatch?: number
  loadedPercentage?: number
  loadedRows?: number // Número de registros já carregados
}

interface QuickSearchProps {
  quickFilterText: string
  onQuickFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClearQuickFilter: () => void
  isLoading: boolean
  hasMore?: boolean | undefined
  loadedPercentage?: number | undefined
  loadedRows?: number | undefined
  filteredRows: number
  totalRows: number
}

const QuickSearch: React.FC<QuickSearchProps> = ({
  quickFilterText,
  onQuickFilterChange,
  onClearQuickFilter,
  isLoading,
  hasMore,
  loadedPercentage,
  loadedRows,
  filteredRows,
  totalRows,
}) => (
  <TextField
    size="small"
    placeholder={hasMore ? 
      `Buscar nos ${Math.round(loadedPercentage || 0)}% carregados...` : 
      "Buscar escolas..."
    }
    value={quickFilterText}
    onChange={onQuickFilterChange}
    disabled={isLoading}
    sx={{ minWidth: 300, maxWidth: 400, flex: 1 }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Tooltip title={hasMore ? 
            `Busca apenas nos ${loadedRows || filteredRows} registros já carregados de ${totalRows} na base. Para buscar em toda a base, use os Filtros Avançados.` :
            "Buscar em todos os dados carregados"
          }>
            <SearchIcon color="action" />
          </Tooltip>
        </InputAdornment>
      ),
      endAdornment: quickFilterText && (
        <InputAdornment position="end">
          <IconButton
            size="small"
            onClick={onClearQuickFilter}
            disabled={isLoading}
          >
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
)

interface FilterIndicatorsProps {
  activeFiltersCount: number
  filteredRows: number
  totalRows: number
  hasMore?: boolean | undefined
  loadedPercentage?: number | undefined
  currentBatch?: number | undefined
  onClearAllFilters: () => void
}

const FilterIndicators: React.FC<FilterIndicatorsProps> = ({
  activeFiltersCount,
  filteredRows,
  totalRows,
  hasMore,
  loadedPercentage,
  currentBatch,
  onClearAllFilters,
}) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {activeFiltersCount > 0 && (
      <Chip
        label={`${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''}`}
        size="small"
        color="primary"
        variant="outlined"
        onDelete={onClearAllFilters}
      />
    )}
    
    {filteredRows !== totalRows && (
      <Chip
        label={`${filteredRows} de ${totalRows}`}
        size="small"
        color="secondary"
        variant="outlined"
      />
    )}

    {/* Indicador de progresso do carregamento inteligente */}
    {hasMore && loadedPercentage && loadedPercentage < 100 && (
      <Chip
        label={`Carregado ${Math.round(loadedPercentage)}% (Lote ${currentBatch})`}
        size="small"
        color="info"
        variant="outlined"
      />
    )}
  </Stack>
)

interface ActionButtonsProps {
  onOpenFilters: () => void
  onOpenColumns: () => void
  onRefresh: () => void
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void
  isLoading: boolean
  activeFiltersCount: number
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onOpenFilters,
  onOpenColumns,
  onRefresh,
  onMenuOpen,
  isLoading,
  activeFiltersCount,
}) => (
  <Stack direction="row" spacing={0.5}>
    <Tooltip title="Filtros Avançados">
      <span>
        <IconButton
          onClick={onOpenFilters}
          disabled={isLoading}
          color={activeFiltersCount > 0 ? 'primary' : 'default'}
        >
          <FilterIcon />
        </IconButton>
      </span>
    </Tooltip>

    <Tooltip title="Configurar Colunas">
      <span>
        <IconButton onClick={onOpenColumns} disabled={isLoading}>
          <ColumnsIcon />
        </IconButton>
      </span>
    </Tooltip>

    <Tooltip title="Atualizar">
      <span>
        <IconButton onClick={onRefresh} disabled={isLoading}>
          <RefreshIcon />
        </IconButton>
      </span>
    </Tooltip>

    <Tooltip title="Mais opções">
      <span>
        <IconButton onClick={onMenuOpen} disabled={isLoading}>
          <MoreIcon />
        </IconButton>
      </span>
    </Tooltip>
  </Stack>
)

interface OptionsMenuProps {
  menuAnchor: HTMLElement | null
  onMenuClose: () => void
  onExport: () => void
  onClearAllFilters: () => void
  hasMore?: boolean | undefined
  loadedRows?: number | undefined
  filteredRows: number
  activeFiltersCount: number
  quickFilterText: string
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  menuAnchor,
  onMenuClose,
  onExport,
  onClearAllFilters,
  hasMore,
  loadedRows,
  filteredRows,
  activeFiltersCount,
  quickFilterText,
}) => (
  <Menu
    anchorEl={menuAnchor}
    open={Boolean(menuAnchor)}
    onClose={onMenuClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  >
    <MenuItem onClick={() => { onExport(); onMenuClose() }}>
      <ExportIcon sx={{ mr: 1 }} />
      Exportar para CSV
    </MenuItem>
    
    <Divider />

    {hasMore && [
      <MenuItem key="search-info" disabled sx={{ opacity: 0.7, fontStyle: 'italic' }}>
        💡 Busca rápida: apenas nos {loadedRows || filteredRows} registros carregados
      </MenuItem>,
      <Divider key="divider-search" />
    ]}
    
    <MenuItem 
      onClick={onClearAllFilters}
      disabled={activeFiltersCount === 0 && !quickFilterText}
    >
      <ClearIcon sx={{ mr: 1 }} />
      Limpar todos os filtros
    </MenuItem>
  </Menu>
)

export const SchoolsTableToolbar: React.FC<SchoolsTableToolbarProps> = ({
  onQuickFilter,
  onExport,
  onRefresh,
  onOpenFilters,
  onOpenColumns,
  totalRows,
  filteredRows,
  isLoading = false,
  hasMore,
  currentBatch,
  loadedPercentage,
  loadedRows,
}) => {
  const [quickFilterText, setQuickFilterText] = useState('')
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const { filters, clear: clearFilters } = useSchoolFilters()

  // Contar filtros ativos
  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== null && value !== ''
  ).length

  const handleQuickFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target
    setQuickFilterText(value)
    onQuickFilter(value)
  }, [onQuickFilter])

  const handleClearQuickFilter = useCallback(() => {
    setQuickFilterText('')
    onQuickFilter('')
  }, [onQuickFilter])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleClearAllFilters = () => {
    clearFilters()
    handleClearQuickFilter()
    handleMenuClose()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        backgroundColor: 'background.paper',
      }}
    >
      <QuickSearch
        quickFilterText={quickFilterText}
        onQuickFilterChange={handleQuickFilterChange}
        onClearQuickFilter={handleClearQuickFilter}
        isLoading={isLoading}
        hasMore={hasMore}
        loadedPercentage={loadedPercentage}
        loadedRows={loadedRows}
        filteredRows={filteredRows}
        totalRows={totalRows}
      />

      <FilterIndicators
        activeFiltersCount={activeFiltersCount}
        filteredRows={filteredRows}
        totalRows={totalRows}
        hasMore={hasMore}
        loadedPercentage={loadedPercentage}
        currentBatch={currentBatch}
        onClearAllFilters={handleClearAllFilters}
      />

      <ActionButtons
        onOpenFilters={onOpenFilters}
        onOpenColumns={onOpenColumns}
        onRefresh={onRefresh}
        onMenuOpen={handleMenuOpen}
        isLoading={isLoading}
        activeFiltersCount={activeFiltersCount}
      />

      <OptionsMenu
        menuAnchor={menuAnchor}
        onMenuClose={handleMenuClose}
        onExport={onExport}
        onClearAllFilters={handleClearAllFilters}
        hasMore={hasMore}
        loadedRows={loadedRows}
        filteredRows={filteredRows}
        activeFiltersCount={activeFiltersCount}
        quickFilterText={quickFilterText}
      />
    </Box>
  )
} 