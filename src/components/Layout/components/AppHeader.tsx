import React from 'react'
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import { Dashboard as DashboardIcon } from '@mui/icons-material'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import type { User } from '@/schemas/apiSchemas'
import { APP_CONFIG, LAYOUT_CONSTANTS, LAYOUT_STYLES } from '../constants/layout'

interface AppHeaderProps {
  user: User | null
  onAvatarClick: (event: React.MouseEvent<HTMLElement>) => void
}

export const AppHeader: React.FC<AppHeaderProps> = ({ user, onAvatarClick }) => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ y: -LAYOUT_CONSTANTS.APP_BAR_HEIGHT }}
      animate={{ y: 0 }}
      exit={{ y: -LAYOUT_CONSTANTS.APP_BAR_HEIGHT }}
      transition={{ duration: LAYOUT_CONSTANTS.ANIMATION_DURATION }}
    >
      <AppBar 
        position="sticky" 
        className={LAYOUT_STYLES.glassPanelClass}
        sx={{ 
          ...LAYOUT_STYLES.appBar,
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
              transition: 'opacity 0.2s ease-in-out',
              '&:hover': {
                opacity: 0.8
              }
            }}
            onClick={() => navigate({ to: APP_CONFIG.routes.dashboard })}
          >
            <DashboardIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              {APP_CONFIG.title}
            </Typography>
          </Box>

          {/* User Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={onAvatarClick}
              size="small"
              aria-label="Menu do usuário"
              sx={{
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: LAYOUT_CONSTANTS.AVATAR_SIZE, 
                  height: LAYOUT_CONSTANTS.AVATAR_SIZE,
                  ...LAYOUT_STYLES.userAvatar,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  )
} 