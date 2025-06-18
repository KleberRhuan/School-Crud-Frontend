import {
  Box,
  Button,
  CircularProgress,
  Link,
} from '@mui/material'
import {
  ArrowBack,
  Save,
} from '@mui/icons-material'
import { Link as RouterLink } from '@tanstack/react-router'

interface ResetPasswordActionsProps {
  isValid: boolean
  isPending: boolean
}

export function ResetPasswordActions({ isValid, isPending }: Readonly<ResetPasswordActionsProps>) {
  return (
    <>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={!isValid || isPending}
        startIcon={
          isPending ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            <Save />
          )
        }
        sx={{ 
          mb: 3,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '12px',
          height: '48px',
          fontSize: '16px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669, #047857)',
            boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
          },
          '&:disabled': {
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.5)',
            boxShadow: 'none',
          }
        }}
      >
        {isPending ? 'Redefinindo...' : 'Redefinir Senha'}
      </Button>

      {/* Links */}
      <Box sx={{ textAlign: 'center' }}>
        <Link
          component={RouterLink}
          to="/login"
          variant="body2"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 1,
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: 'white',
              textDecoration: 'none',
            }
          }}
        >
          <ArrowBack fontSize="small" />
          Voltar ao login
        </Link>
      </Box>
    </>
  )
} 