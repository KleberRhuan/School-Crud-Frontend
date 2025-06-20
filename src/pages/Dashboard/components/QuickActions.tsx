import React from 'react'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import {
  Assessment as AssessmentIcon,
  NotificationsActive as NotificationIcon,
  PieChart as PieChartIcon,
  TableView as TableIcon,
} from '@mui/icons-material'
import { DASHBOARD_STYLES } from '../constants/dashboard'
import type { QuickActionsProps } from '../types/dashboard'

export const QuickActions: React.FC<QuickActionsProps> = ({
  onViewTable,
  onTestToasts,
}) => {
  return (
    <Card
      sx={{
        background: DASHBOARD_STYLES.cardBackground,
        backdropFilter: DASHBOARD_STYLES.backdropFilter,
        border: DASHBOARD_STYLES.border,
        borderRadius: 0,
        color: DASHBOARD_STYLES.textWhite
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Ações Rápidas
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)'
            },
            gap: 2
          }}
        >
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<TableIcon />}
            onClick={onViewTable}
            sx={{
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 0,
              color: 'white',
              py: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
              },
            }}
          >
            Visualizar Tabela de Escolas
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<NotificationIcon />}
            onClick={onTestToasts}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              borderRadius: 0,
              py: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Testar Notificações
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<AssessmentIcon />}
            sx={{
              borderColor: 'rgba(139, 92, 246, 0.5)',
              color: '#a78bfa',
              borderRadius: 0,
              py: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(139, 92, 246, 0.8)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Gerar Relatório
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<PieChartIcon />}
            sx={{
              borderColor: 'rgba(16, 185, 129, 0.5)',
              color: '#6ee7b7',
              borderRadius: 0,
              py: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(16, 185, 129, 0.8)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Ver Analytics
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
} 