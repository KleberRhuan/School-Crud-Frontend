import {
  Box,
  CircularProgress,
  Skeleton,
} from '@mui/material'
import { VpnKey } from '@mui/icons-material'

import { AuthContainer } from '@/components/Auth'

export function LoadingState() {
  const loadingIcon = (
    <Box
      sx={{
        width: 48,
        height: 48,
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
      }}
    >
      <VpnKey sx={{ color: 'white', fontSize: 24 }} />
    </Box>
  )

  return (
    <AuthContainer
      title="Validando Token"
      subtitle="Aguarde enquanto verificamos seu link de redefinição"
      icon={loadingIcon}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CircularProgress sx={{ color: '#f59e0b' }} />
      </Box>
      
      {/* Skeleton do formulário */}
      <Box>
        <Skeleton 
          variant="rectangular" 
          height={56} 
          sx={{ 
            mb: 2, 
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }} 
        />
        <Skeleton 
          variant="rectangular" 
          height={56} 
          sx={{ 
            mb: 2, 
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }} 
        />
        <Skeleton 
          variant="rectangular" 
          height={48} 
          sx={{ 
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }} 
        />
      </Box>
    </AuthContainer>
  )
} 