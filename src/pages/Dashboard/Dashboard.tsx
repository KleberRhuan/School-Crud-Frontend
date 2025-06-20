import { Box, Container, Stack } from '@mui/material'
import { motion } from 'framer-motion'
import {
  DashboardHeader,
  MetricsGrid,
  QuickActions,
  QuickStats,
  RecentActivities,
} from './components'
import { useDashboard } from './hooks'
import {
  DASHBOARD_ANIMATIONS,
  DASHBOARD_STYLES,
  MOCK_ACTIVITIES,
  MOCK_METRICS,
  MOCK_QUICK_STATS,
} from './constants/dashboard'

/**
 * Componente principal do Dashboard
 * Apresenta métricas, ações rápidas, estatísticas e atividades recentes
 */
export function Dashboard() {
  const dashboard = useDashboard()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: DASHBOARD_STYLES.background,
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DASHBOARD_ANIMATIONS.containerDuration }}
        >
          {/* Header */}
          <DashboardHeader
            onRefresh={dashboard.handleRefreshData}
            onExport={dashboard.handleExportData}
          />

          <Stack spacing={4}>
            {/* Métricas Principais */}
            <MetricsGrid metrics={MOCK_METRICS} />

            {/* Conteúdo Principal */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '2fr 1fr'
                },
                gap: 4
              }}
            >
              {/* Ações Rápidas */}
              <QuickActions
                onViewTable={dashboard.handleViewTable}
                onTestToasts={dashboard.handleTestToasts}
              />

              {/* Estatísticas Rápidas */}
              <QuickStats stats={MOCK_QUICK_STATS} />
            </Box>

            {/* Atividades Recentes */}
            <RecentActivities activities={MOCK_ACTIVITIES} />
          </Stack>
        </motion.div>
      </Container>
    </Box>
  )
} 