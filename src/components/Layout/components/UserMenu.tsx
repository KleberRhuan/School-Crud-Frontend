import React from 'react'
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Logout,
  Person,
  Settings,
} from '@mui/icons-material'
import { LAYOUT_CONSTANTS, LAYOUT_STYLES } from '../constants/layout'

interface UserMenuProps {
  anchorEl: HTMLElement | null
  isOpen: boolean
  isLoggingOut: boolean
  onClose: () => void
  onProfile: () => void
  onSettings: () => void
  onLogout: () => void
}

export const UserMenu: React.FC<UserMenuProps> = ({
  anchorEl,
  isOpen,
  isLoggingOut,
  onClose,
  onProfile,
  onSettings,
  onLogout,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={isOpen}
      onClose={onClose}
      onClick={onClose}
      slotProps={{
        paper: {
          className: LAYOUT_STYLES.glassPanelClass,
          sx: {
            minWidth: LAYOUT_CONSTANTS.USER_MENU_MIN_WIDTH,
            mt: 1.5,
          },
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem 
        onClick={onProfile}
        sx={{ 
          '&:hover': { 
            backgroundColor: 'rgba(59, 130, 246, 0.08)' 
          } 
        }}
      >
        <ListItemIcon>
          <Person fontSize="small" />
        </ListItemIcon>
        <ListItemText>Perfil</ListItemText>
      </MenuItem>
      
      <MenuItem 
        onClick={onSettings}
        sx={{ 
          '&:hover': { 
            backgroundColor: 'rgba(59, 130, 246, 0.08)' 
          } 
        }}
      >
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        <ListItemText>Configurações</ListItemText>
      </MenuItem>
      
      <Divider sx={{ my: 0.5 }} />
      
      <MenuItem 
        onClick={onLogout} 
        disabled={isLoggingOut}
        sx={{ 
          '&:hover': { 
            backgroundColor: 'rgba(239, 68, 68, 0.08)' 
          } 
        }}
      >
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          {isLoggingOut ? 'Saindo...' : 'Sair'}
        </ListItemText>
      </MenuItem>
    </Menu>
  )
} 