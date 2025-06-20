import React from 'react'
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography
} from '@mui/material'
import { Schedule as ScheduleIcon, Speed as SpeedIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import {
  ACTIVITY_COLORS,
  ACTIVITY_ICONS,
  DASHBOARD_ANIMATIONS,
  DASHBOARD_STYLES
} from '../constants/dashboard'
import type { RecentActivitiesProps } from '../types/dashboard'

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
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
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5">
            Atividades Recentes
          </Typography>
          <Chip
            icon={<SpeedIcon />}
            label="Tempo Real"
            size="small"
            sx={{
              backgroundColor: '#10b98120',
              color: '#10b981',
              border: '1px solid #10b98140'
            }}
          />
        </Stack>
        
        <List sx={{ p: 0 }}>
          {activities.map((activity, index) => {
            const IconComponent = ACTIVITY_ICONS[activity.type]
            const colorConfig = ACTIVITY_COLORS[activity.type]
            
            return (
              <motion.div
                key={`${activity.title}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: DASHBOARD_ANIMATIONS.cardDuration, 
                  delay: index * DASHBOARD_ANIMATIONS.activityDelay 
                }}
              >
                <ListItem
                  sx={{
                    px: 0,
                    py: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 1
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: colorConfig.background,
                        border: colorConfig.border
                      }}
                    >
                      <IconComponent sx={{ color: colorConfig.color, fontSize: 20 }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={activity.title}
                    secondary={activity.subtitle}
                    primaryTypographyProps={{
                      color: DASHBOARD_STYLES.textWhite,
                      fontWeight: 500
                    }}
                    secondaryTypographyProps={{
                      color: DASHBOARD_STYLES.textSecondary
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    color={DASHBOARD_STYLES.textTertiary} 
                    sx={{ ml: 2 }}
                  >
                    <ScheduleIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                    {activity.time}
                  </Typography>
                </ListItem>
                {index < activities.length - 1 && (
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                )}
              </motion.div>
            )
          })}
        </List>
      </CardContent>
    </Card>
  )
} 