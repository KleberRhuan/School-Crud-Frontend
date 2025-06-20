import React, { useState } from 'react'
import {
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  useTheme,
} from '@mui/material'
import {
  Add as AddIcon,
  CheckBox as CheckBoxIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Upload as ImportIcon,
  MoreVert as MoreVertIcon,
  TableChart as TableChartIcon,
} from '@mui/icons-material'

interface MobileActionsProps {
  hasFilters: boolean
  isLoading: boolean
  totalRowsCount: number
  selectedRowsCount: number
  onExport: () => void
  onExportSelected: () => void
  onExportAllColumns: () => void
  onOpenFilterDialog: () => void
  onOpenImportDialog: () => void
  onNewSchool: () => void
}

export const MobileActions: React.FC<MobileActionsProps> = ({
  hasFilters,
  isLoading,
  totalRowsCount,
  selectedRowsCount,
  onExport,
  onExportSelected,
  onExportAllColumns,
  onOpenFilterDialog,
  onOpenImportDialog,
  onNewSchool,
}) => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (action: () => void) => {
    action()
    handleMenuClose()
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {/* Apenas o botão principal "Nova Escola" permanece visível */}
      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={onNewSchool}
        disabled={isLoading}
        size="small"
      >
        Nova
      </Button>
      
      {/* Menu collapse com outras ações */}
      <Tooltip title="Mais ações">
        <IconButton 
          onClick={handleMenuOpen}
          disabled={isLoading}
          sx={{ 
            color: 'primary.main',
            backgroundColor: hasFilters ? 'primary.50' : 'transparent',
            '&:hover': { backgroundColor: 'primary.100' }
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            minWidth: 200,
            borderRadius: 2,
            boxShadow: theme.shadows[8],
          }
        }}
      >
        <MenuItem 
          onClick={() => handleMenuItemClick(onOpenFilterDialog)}
          sx={{ 
            color: hasFilters ? 'secondary.main' : 'text.primary',
            backgroundColor: hasFilters ? 'secondary.50' : 'transparent'
          }}
        >
          <ListItemIcon>
            <FilterIcon color={hasFilters ? 'secondary' : 'primary'} />
          </ListItemIcon>
          <ListItemText 
            primary="Filtros" 
            secondary={hasFilters ? 'Filtros ativos' : 'Filtrar dados'}
          />
        </MenuItem>

        <MenuItem onClick={() => handleMenuItemClick(onOpenImportDialog)}>
          <ListItemIcon>
            <ImportIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Importar CSV" secondary="Upload de dados" />
        </MenuItem>

        <MenuItem 
          onClick={() => handleMenuItemClick(onExport)}
          disabled={totalRowsCount === 0}
        >
          <ListItemIcon>
            <DownloadIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Exportar Página Atual" 
            secondary="Registros visíveis na tela"
          />
        </MenuItem>

        {selectedRowsCount > 0 && (
          <MenuItem onClick={() => handleMenuItemClick(onExportSelected)}>
            <ListItemIcon>
              <CheckBoxIcon color="secondary" />
            </ListItemIcon>
            <ListItemText 
              primary="Exportar Selecionados" 
              secondary={`${selectedRowsCount} selecionados`}
            />
          </MenuItem>
        )}

        <MenuItem onClick={() => handleMenuItemClick(onExportAllColumns)}>
          <ListItemIcon>
            <TableChartIcon color="info" />
          </ListItemIcon>
          <ListItemText 
            primary="Exportar Completo" 
            secondary="Todas as colunas"
          />
        </MenuItem>
      </Menu>
    </Stack>
  )
} 