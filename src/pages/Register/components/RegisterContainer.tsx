import { Box, Container, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { PersonOutlined } from '@mui/icons-material'
import { ParticleBackground } from '@/components/Background/ParticleBackground'

interface RegisterContainerProps {
  children: React.ReactNode
}

export function RegisterContainer({ children }: RegisterContainerProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <ParticleBackground />
      
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <Box
            sx={{
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '48px 32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'xor',
                WebkitMaskComposite: 'xor',
                pointerEvents: 'none'
              }
            }}
          >
            {/* Logo/Ícone */}
            <Box 
              display="flex" 
              justifyContent="center" 
              mb={3}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                }}
              >
                <PersonOutlined sx={{ color: 'white', fontSize: 24 }} />
              </Box>
            </Box>

            {/* Título */}
            <Typography
              variant="h4"
              component="h1"
              align="center"
              sx={{
                color: 'white',
                fontWeight: 600,
                mb: 1,
                fontSize: '28px'
              }}
            >
              Criar Conta
            </Typography>

            <Typography
              variant="body1"
              align="center"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 4,
                fontSize: '16px'
              }}
            >
              Preencha os dados para criar sua conta
            </Typography>

            {children}
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
} 