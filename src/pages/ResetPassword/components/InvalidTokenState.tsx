import {
  Alert,
  Box,
  Button,
  Typography,
} from '@mui/material'
import {
  ArrowBack,
  Warning,
} from '@mui/icons-material'
import { Link as RouterLink } from '@tanstack/react-router'

import { AuthContainer } from '@/components/Auth'

interface InvalidTokenStateProps {
  tokenValidation?: {
    valid: boolean
    expired?: boolean
    used?: boolean
  } | null | undefined
}

export function InvalidTokenState({ tokenValidation }: Readonly<InvalidTokenStateProps>) {
  const getErrorMessage = () => {
    if (tokenValidation?.expired) {
      return 'Este link de redefinição expirou.'
    }
    if (tokenValidation?.used) {
      return 'Este link já foi utilizado.'
    }
    return 'O link de redefinição é inválido ou não foi encontrado.'
  }

  const errorIcon = (
    <Box
      sx={{
        width: 48,
        height: 48,
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
      }}
    >
      <Warning sx={{ color: 'white', fontSize: 24 }} />
    </Box>
  )

  return (
    <AuthContainer
      title="Link Inválido"
      subtitle={getErrorMessage()}
      icon={errorIcon}
    >
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
          <strong>O que fazer agora?</strong>
          <br />
          • Solicite um novo link de redefinição
          <br />
          • Verifique se copiou o link completo do e-mail
          <br />
          • Links expiram em 15 minutos por segurança
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
          component={RouterLink}
          to="/forgot-password"
          sx={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            }
          }}
        >
          Solicitar Novo Link
        </Button>
      </Box>
    </AuthContainer>
  )
} 