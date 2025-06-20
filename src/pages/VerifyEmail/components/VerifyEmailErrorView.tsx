import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { 
  Email as EmailIcon, 
  Login as LoginIcon 
} from '@mui/icons-material'
import { useEffect, useState } from 'react'

interface VerifyEmailErrorViewProps {
  error: any
  onGoToLogin: () => void
  onResendVerification: () => void
  autoRedirect?: boolean
}

export function VerifyEmailErrorView({ 
  error, 
  onGoToLogin, 
  onResendVerification,
  autoRedirect = false
}: VerifyEmailErrorViewProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [autoRedirect, countdown])

  const getErrorMessage = () => {
    if (error?.status === 404) {
      return 'Token de verificação não encontrado ou expirado.'
    }
    if (error?.status === 400) {
      return 'Token de verificação inválido.'
    }
    if (error?.message) {
      return error.message
    }
    return 'Ocorreu um erro inesperado durante a verificação.'
  }

  const getErrorTitle = () => {
    if (error?.status === 404 || error?.status === 400) {
      return 'Token Inválido'
    }
    return 'Erro na Verificação'
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Alert 
        severity="error" 
        sx={{ 
          mb: 3, 
          textAlign: 'left',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          color: 'white',
          borderRadius: '12px',
          '& .MuiAlert-icon': {
            color: '#ef4444'
          }
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>{getErrorTitle()}</strong>
        </Typography>
        <Typography variant="body2">
          {getErrorMessage()}
        </Typography>
      </Alert>

      {autoRedirect && countdown > 0 && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3, 
            textAlign: 'center',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            color: 'white',
            borderRadius: '12px',
            '& .MuiAlert-icon': {
              color: '#3b82f6'
            }
          }}
        >
          <Typography variant="body2">
            Redirecionando para login em <strong>{countdown}</strong> segundos...
          </Typography>
        </Alert>
      )}

      <Typography 
        variant="body2" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.7)',
          mb: 3
        }}
      >
        Possíveis causas:
        <br />
        • O link de verificação expirou
        <br />
        • O link já foi usado anteriormente
        <br />
        • O link está corrompido ou inválido
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<EmailIcon />}
          onClick={onResendVerification}
          sx={{
            backgroundColor: '#3b82f6',
            color: 'white',
            py: 1.5,
            fontSize: '16px',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#2563eb',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
            },
          }}
        >
          Solicitar Novo Link
        </Button>

        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<LoginIcon />}
          onClick={onGoToLogin}
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
          Voltar ao Login
        </Button>
      </Stack>
    </Box>
  )
} 