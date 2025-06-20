import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import type { FormSectionProps } from './types'

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" gutterBottom color="primary">
      {title}
    </Typography>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 2,
      }}
    >
      {children}
    </Box>
  </Paper>
) 