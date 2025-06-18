import { Button, CircularProgress } from '@mui/material'

interface LoginButtonProps {
  isLoading: boolean
}

export function LoginButton({ isLoading }: LoginButtonProps) {
  return (
    <Button
      type="submit"
      fullWidth
      disabled={isLoading}
      sx={{
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        color: 'white',
        py: 1.5,
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 600,
        textTransform: 'none',
        mb: 2,
        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          transform: 'translateY(-1px)',
          boxShadow: '0 12px 35px rgba(59, 130, 246, 0.4)'
        },
        '&:active': {
          transform: 'translateY(0px)'
        },
        '&.Mui-disabled': {
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.5)'
        }
      }}
    >
      {isLoading ? (
        <CircularProgress size={24} sx={{ color: 'white' }} />
      ) : (
        'Entrar'
      )}
    </Button>
  )
} 