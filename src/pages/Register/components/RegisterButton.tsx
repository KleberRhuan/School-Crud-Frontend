import { Button, CircularProgress } from '@mui/material'

interface RegisterButtonProps {
  isLoading: boolean
}

export function RegisterButton({ isLoading }: RegisterButtonProps) {
  return (
    <Button
      type="submit"
      fullWidth
      disabled={isLoading}
      sx={{
        background: 'linear-gradient(135deg, #10b981, #3b82f6)',
        color: 'white',
        py: 1.5,
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 600,
        textTransform: 'none',
        mb: 3,
        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          background: 'linear-gradient(135deg, #059669, #2563eb)',
          transform: 'translateY(-1px)',
          boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)'
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
        'Criar Conta'
      )}
    </Button>
  )
} 