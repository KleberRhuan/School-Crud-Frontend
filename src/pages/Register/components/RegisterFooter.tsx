import { Box, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'

export function RegisterFooter() {
  return (
    <Box textAlign="center">
      <Typography
        variant="body2"
        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
      >
        Já tem uma conta?{' '}
        <Link
          to="/login"
          style={{
            color: '#10b981',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#3b82f6'
            e.currentTarget.style.textDecoration = 'underline'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#10b981'
            e.currentTarget.style.textDecoration = 'none'
          }}
        >
          Faça login
        </Link>
      </Typography>
    </Box>
  )
} 