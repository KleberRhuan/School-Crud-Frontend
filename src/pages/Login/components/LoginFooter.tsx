import { Box, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'

export function LoginFooter() {
  return (
    <Box textAlign="center">
      <Typography
        variant="body2"
        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
      >
        Não tem uma conta?{' '}
        <Link
          to="/register"
          style={{
            color: '#3b82f6',
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          Cadastre-se, é grátis!
        </Link>
      </Typography>
    </Box>
  )
} 