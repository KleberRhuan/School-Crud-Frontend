import {
  Alert,
  Box,
  Button,
  Typography,
} from '@mui/material'
import {
  ArrowBack,
} from '@mui/icons-material'
import { Link as RouterLink } from '@tanstack/react-router'

interface ForgotPasswordSuccessViewProps {
  email: string
  onResendEmail: () => void
  isResending: boolean
}

export function ForgotPasswordSuccessView({ 
  email, 
  onResendEmail, 
  isResending 
}: Readonly<ForgotPasswordSuccessViewProps>) {
  return (
    <>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          Se o e-mail <strong>{email}</strong> estiver cadastrado em nosso sistema, 
          você receberá as instruções para redefinir sua senha.
        </Typography>
      </Box>
      
      <Alert 
        severity="info" 
        sx={{ 
          mb: 3, 
          textAlign: 'left',
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
          <strong>Não recebeu o e-mail?</strong>
          <br />
          • Verifique sua caixa de spam
          <br />
          • O link expira em 15 minutos
          <br />
          • Você pode solicitar um novo link abaixo
        </Typography>
      </Alert>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          component={RouterLink}
          to="/login"
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Voltar ao Login
        </Button>
        
        <Button
          variant="contained"
          onClick={onResendEmail}
          disabled={isResending}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.5)',
            }
          }}
        >
          Reenviar E-mail
        </Button>
      </Box>
    </>
  )
} 