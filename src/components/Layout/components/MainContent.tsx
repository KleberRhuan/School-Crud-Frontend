import React from 'react'
import { Box } from '@mui/material'
import { Outlet, useLocation } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { LAYOUT_CONSTANTS } from '../constants/layout'

interface MainContentProps {
  isAuthenticated: boolean
}

export const MainContent: React.FC<MainContentProps> = ({ isAuthenticated }) => {
  const location = useLocation()

  return (
    <Box 
      component="main" 
      sx={{ 
        flexGrow: 1,
        backgroundColor: 'background.default',
        minHeight: isAuthenticated 
          ? `calc(100vh - ${LAYOUT_CONSTANTS.APP_BAR_HEIGHT}px)` 
          : '100vh',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: LAYOUT_CONSTANTS.ANIMATION_DURATION,
            ease: 'easeInOut'
          }}
          style={{ 
            height: '100%',
            overflow: 'auto'
          }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </Box>
  )
} 