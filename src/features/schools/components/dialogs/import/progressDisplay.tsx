import React from 'react'
import { Badge, Box, LinearProgress, Stack, Typography } from '@mui/material'
import type { CsvProgressData } from './types'

interface ProgressDisplayProps {
  jobId: string | null
  progressData: CsvProgressData | null
}

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  jobId,
  progressData
}) => {
  if (!jobId) return null

  const progress = progressData?.progress ?? 0
  const status = progressData?.status ?? 'PENDING'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success'
      case 'FAILED': case 'CANCELLED': return 'error'
      case 'PROCESSING': return 'primary'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendente'
      case 'PROCESSING': return 'Processando'
      case 'COMPLETED': return 'Concluído'
      case 'FAILED': return 'Falha'
      case 'CANCELLED': return 'Cancelado'
      default: return status
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="body2">
          Progresso da importação: {progress}%
        </Typography>
        
        <Badge 
          badgeContent={getStatusText(status)} 
          color={getStatusColor(status)}
          variant="standard"
        />
      </Stack>
      
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          '& .MuiLinearProgress-bar': {
            borderRadius: 4
          }
        }} 
      />
      
      {progressData?.totalRecords && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {progressData.processedRecords || 0} de {progressData.totalRecords} registros processados
          {progressData.failedRecords ? ` (${progressData.failedRecords} falhas)` : ''}
        </Typography>
      )}
      
      {progressData?.error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          ⚠️ Erro: {progressData.error}
        </Typography>
      )}
    </Box>
  )
} 