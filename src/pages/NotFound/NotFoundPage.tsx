import { Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { 
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Login as LoginIcon,
  SearchOff as SearchOffIcon
} from '@mui/icons-material'

import { AuthContainer } from '@/components/Auth'
import { useAuth } from '@/hooks/useAuth'

export function NotFoundPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' })
    } else {
      navigate({ to: '/login' })
    }
  }

  const handleGoBack = () => {
    window.history.back()
  }

  // Ícone para 404
  const notFoundIcon = (
    <Box
      sx={{
        width: 64,
        height: 64,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
      }}
    >
      <SearchOffIcon sx={{ color: 'white', fontSize: 32 }} />
    </Box>
  )

  return (
    <AuthContainer
      title="Página não encontrada"
      subtitle="A página que você está procurando não existe ou foi movida"
      icon={notFoundIcon}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: '6rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 2,
            lineHeight: 1,
          }}
        >
          404
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 4,
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}
        >
          Oops! Parece que você se perdeu no espaço digital.
          <br />
          Não se preocupe, acontece com os melhores exploradores.
        </Typography>

        <Stack spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={isAuthenticated ? <HomeIcon /> : <LoginIcon />}
            onClick={handleGoHome}
            sx={{
              backgroundColor: '#6366f1',
              color: 'white',
              py: 1.5,
              fontSize: '16px',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#5855eb',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
              },
            }}
          >
            {isAuthenticated ? 'Voltar ao Dashboard' : 'Fazer Login'}
          </Button>

          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'rgba(255, 255, 255, 0.9)',
              py: 1.5,
              fontSize: '16px',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Voltar à Página Anterior
          </Button>
        </Stack>

        <Box 
          sx={{ 
            mt: 4, 
            pt: 3, 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.9rem'
            }}
          >
            Se você acredita que isso é um erro, entre em contato com o suporte.
          </Typography>
        </Box>
      </Box>
    </AuthContainer>
  )
} 