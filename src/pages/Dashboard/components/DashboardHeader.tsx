import React from 'react'
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material'
import { FileDownload as FileDownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material'
import { DASHBOARD_STYLES } from '../constants/dashboard'
import type { DashboardHeaderProps } from '../types/dashboard'

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  onExport,
}) => {
  return (
    <Paper
      sx={{
        p: 4,
        mb: 4,
        background: DASHBOARD_STYLES.headerBackground,
        backdropFilter: DASHBOARD_STYLES.headerBackdropFilter,
        border: DASHBOARD_STYLES.border,
        borderRadius: 0,
        color: DASHBOARD_STYLES.textWhite
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="h6" color={DASHBOARD_STYLES.textSecondary}>
            Bem-vindo ao sistema! Visão geral do desempenho educacional.
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <IconButton
            onClick={onRefresh}
            aria-label="Atualizar dados"
            sx={{
              color: DASHBOARD_STYLES.textWhite,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.05)',
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
          <IconButton
            onClick={onExport}
            aria-label="Exportar dados"
            sx={{
              color: DASHBOARD_STYLES.textWhite,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.05)',
              }
            }}
          >
            <FileDownloadIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  )
} 