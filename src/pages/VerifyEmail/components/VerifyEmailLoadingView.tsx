import { Box, CircularProgress, Typography } from '@mui/material'

export function VerifyEmailLoadingView() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress 
          size={48} 
          sx={{ 
            color: '#3b82f6',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
        />
      </Box>
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.9)',
          mb: 2
        }}
      >
        Validando seu token de verificação...
      </Typography>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        Isso pode levar alguns segundos
      </Typography>
    </Box>
  )
} 