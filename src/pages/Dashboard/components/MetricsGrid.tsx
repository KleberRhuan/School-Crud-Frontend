import React from 'react'
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { DASHBOARD_ANIMATIONS, DASHBOARD_STYLES } from '../constants/dashboard'
import type { MetricsGridProps } from '../types/dashboard'

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3
        }}
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: DASHBOARD_ANIMATIONS.cardDuration, 
              delay: index * DASHBOARD_ANIMATIONS.cardDelay 
            }}
          >
            <Card
              sx={{
                background: DASHBOARD_STYLES.cardBackground,
                backdropFilter: DASHBOARD_STYLES.backdropFilter,
                border: DASHBOARD_STYLES.border,
                borderRadius: 0,
                color: DASHBOARD_STYLES.textWhite,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      backgroundColor: `${metric.color}20`,
                      border: `1px solid ${metric.color}40`,
                    }}
                  >
                    <metric.icon sx={{ color: metric.color, fontSize: 24 }} />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="body2" color={DASHBOARD_STYLES.textSecondary}>
                      {metric.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {metric.value}
                    </Typography>
                    <Chip
                      label={metric.change}
                      size="small"
                      sx={{
                        backgroundColor: '#10b98120',
                        color: '#10b981',
                        border: '1px solid #10b98140',
                        mt: 1
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  )
} 