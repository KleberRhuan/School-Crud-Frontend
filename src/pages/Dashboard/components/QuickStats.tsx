import React from 'react'
import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { DASHBOARD_ANIMATIONS, DASHBOARD_STYLES } from '../constants/dashboard'
import type { QuickStatsProps } from '../types/dashboard'

export const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
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
          Distribuição de Escolas
        </Typography>
        
        <Stack spacing={2}>
          {stats.map((stat, index) => (
            <Box key={stat.label}>
              <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center" 
                sx={{ mb: 1 }}
              >
                <Typography variant="body2" color={DASHBOARD_STYLES.textSecondary}>
                  {stat.label}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stat.value.toLocaleString()}
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: '100%',
                  height: 6,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.value / stat.total) * 100}%` }}
                  transition={{ 
                    duration: DASHBOARD_ANIMATIONS.progressDuration, 
                    delay: index * DASHBOARD_ANIMATIONS.progressDelay 
                  }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                    borderRadius: 3
                  }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
} 