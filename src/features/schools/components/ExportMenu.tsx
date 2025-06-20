import React, { useState } from 'react'
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import {
  CheckBox as CheckBoxIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  SelectAll as SelectAllIcon,
  TableChart as TableIcon,
} from '@mui/icons-material'

interface ExportMenuProps {
  onExportAll: () => void
  onExportSelected: () => void
  onExportAllColumns: () => void
  disabled?: boolean
  selectedRowsCount?: number
  totalRowsCount?: number
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  onExportAll,
  onExportSelected,
  onExportAllColumns,
  disabled = false,
  selectedRowsCount = 0,
  totalRowsCount = 0,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleExportAll = () => {
    onExportAll()
    handleClose()
  }

  const handleExportSelected = () => {
    onExportSelected()
    handleClose()
  }

  const handleExportAllColumns = () => {
    onExportAllColumns()
    handleClose()
  }

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        endIcon={<ExpandMoreIcon />}
        onClick={handleClick}
        disabled={disabled}
        sx={{
          borderColor: 'rgba(25, 118, 210, 0.5)',
          color: 'primary.main',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        }}
      >
        Exportar CSV
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Opções de Exportação
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {totalRowsCount} registros disponíveis
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={handleExportAll}>
          <ListItemIcon>
            <TableIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Exportar Página Atual"
            secondary="Apenas os registros visíveis na tela"
          />
        </MenuItem>

        <MenuItem 
          onClick={handleExportSelected}
          disabled={selectedRowsCount === 0}
        >
          <ListItemIcon>
            <CheckBoxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Exportar Selecionados"
            secondary={
              selectedRowsCount > 0 
                ? `${selectedRowsCount} registros selecionados`
                : 'Nenhum registro selecionado'
            }
          />
        </MenuItem>

        <MenuItem onClick={handleExportAllColumns}>
          <ListItemIcon>
            <SelectAllIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Exportar Todas as Colunas"
            secondary={`Incluir colunas ocultas • ${totalRowsCount} registros`}
          />
        </MenuItem>

        <Divider />

        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            💡 O arquivo será baixado automaticamente em formato CSV
          </Typography>
        </Box>
      </Menu>
    </Box>
  )
} 