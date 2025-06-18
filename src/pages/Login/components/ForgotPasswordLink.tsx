import { Box, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'

export function ForgotPasswordLink() {
  return (
    <Box textAlign="center" sx={{ mb: 0 }}>
      <Typography variant="body2">
        <Link
          to="/forgot-password"
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#3b82f6'
            e.currentTarget.style.textDecoration = 'underline'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'
            e.currentTarget.style.textDecoration = 'none'
          }}
        >
          Esqueci minha senha
        </Link>
      </Typography>
    </Box>
  )
} 