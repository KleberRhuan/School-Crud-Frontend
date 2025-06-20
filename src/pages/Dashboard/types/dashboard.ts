import type { SvgIconComponent } from '@mui/icons-material'

// Tipo para métricas do dashboard
export interface Metric {
  title: string
  value: string
  change: string
  icon: SvgIconComponent
  color: string
}

// Tipo para atividades recentes
export interface Activity {
  title: string
  subtitle: string
  time: string
  type: 'success' | 'warning' | 'info'
}

// Tipo para estatísticas rápidas
export interface QuickStat {
  label: string
  value: number
  total: number
}

// Props para componentes do dashboard
export interface DashboardHeaderProps {
  onRefresh: () => void
  onExport: () => void
}

export interface MetricsGridProps {
  metrics: readonly Metric[]
}

export interface QuickActionsProps {
  onViewTable: () => void
  onTestToasts: () => void
}

export interface QuickStatsProps {
  stats: readonly QuickStat[]
}

export interface RecentActivitiesProps {
  activities: readonly Activity[]
} 