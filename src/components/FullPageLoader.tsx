import { ReactNode } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { motion } from 'framer-motion'

interface FullPageLoaderProps {
  title?: string
  subtitle?: string
  description?: string
  size?: number
  children?: ReactNode
}

/**
 * Componente de loader de página completa reutilizável
 * Centraliza a UI de loading usada pelos providers
 */
export function FullPageLoader({ 
  title = "Carregando...",
  subtitle,
  description,
  size = 56,
  children
}: Readonly<FullPageLoaderProps>) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #581c87 100%)',
      }}
    >
      <Box
        className="glass-panel"
        sx={{
          p: 4,
          borderRadius: '16px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '400px',
          mx: 'auto',
        }}
      >
        <CircularProgress 
          size={size} 
          sx={{ 
            mb: 3, 
            color: 'primary.main' 
          }} 
        />
        
        <Typography 
          variant="h5" 
          color="white" 
          sx={{ mb: 2, fontWeight: 600 }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography 
            variant="body1" 
            color="rgba(255, 255, 255, 0.8)"
            sx={{ mb: 1 }}
          >
            {subtitle}
          </Typography>
        )}
        
        {description && (
          <Typography 
            variant="body2" 
            color="rgba(255, 255, 255, 0.6)"
          >
            {description}
          </Typography>
        )}

        {children}
      </Box>
    </Box>
  )
} 