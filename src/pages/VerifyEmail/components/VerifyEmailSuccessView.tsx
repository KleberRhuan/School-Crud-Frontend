import { Box, Button, Typography } from '@mui/material'
import { Login as LoginIcon } from '@mui/icons-material'

interface VerifyEmailSuccessViewProps {
  onGoToLogin: () => void
}

export function VerifyEmailSuccessView({ onGoToLogin }: VerifyEmailSuccessViewProps) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.9)',
          mb: 3
        }}
      >
        Parabéns! Seu endereço de e-mail foi verificado com sucesso. 
        Agora você pode fazer login em sua conta.
      </Typography>

      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<LoginIcon />}
        onClick={onGoToLogin}
        sx={{
          backgroundColor: '#10b981',
          color: 'white',
          py: 1.5,
          fontSize: '16px',
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#059669',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
          },
        }}
      >
        Fazer Login
      </Button>
    </Box>
  )
} 