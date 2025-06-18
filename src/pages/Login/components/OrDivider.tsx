import { Box, Typography } from '@mui/material'

export function OrDivider() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        my: 3,
        width: '100%'
      }}
    >
      <Box
        sx={{
          flex: 1,
          height: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        }}
      />
      <Typography
        variant="body2"
        sx={{
          px: 3,
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '12px',
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          whiteSpace: 'nowrap'
        }}
      >
        Ou
      </Typography>
      <Box
        sx={{
          flex: 1,
          height: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        }}
      />
    </Box>
  )
} 