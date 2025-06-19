import React from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Logout,
  Person,
  Settings,
} from '@mui/icons-material'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'

import { useAuth, useLogout } from '@/hooks/useAuth'

export function RootLayout() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  
  const { user, isAuthenticated } = useAuth()
  const logoutMutation = useLogout()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: '/login', search: { redirect: undefined } })
      }
    })
  }

  const handleProfile = () => {
    handleMenuClose()
    // TODO: Implementar página de perfil
  }

  const handleSettings = () => {
    handleMenuClose()
    // TODO: Implementar página de configurações
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar - apenas quando autenticado */}
      <AnimatePresence>
        {isAuthenticated && (
          <motion.div
            initial={{ y: -64 }}
            animate={{ y: 0 }}
            exit={{ y: -64 }}
            transition={{ duration: 0.3 }}
          >
            <AppBar 
              position="sticky" 
              className="glass-panel"
              sx={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 0,
              }}
            >
              <Toolbar>
                {/* Logo/Title */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    flexGrow: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                  onClick={() => navigate({ to: '/dashboard' })}
                >
                  <DashboardIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" component="div">
                    Data Dashboard
                  </Typography>
                </Box>

                {/* User Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    aria-controls={anchorEl ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorEl ? 'true' : undefined}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Box>
              </Toolbar>
            </AppBar>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        slotProps={{
          paper: {
            className: 'glass-panel',
            sx: {
              minWidth: 200,
              mt: 1.5,
            },
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Perfil</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Configurações</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          backgroundColor: 'background.default',
          minHeight: isAuthenticated ? 'calc(100vh - 64px)' : '100vh',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  )
} 