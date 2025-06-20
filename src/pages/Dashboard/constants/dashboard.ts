import {
  Assessment as AssessmentIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material'

// Constantes de estilo do dashboard
export const DASHBOARD_STYLES = {
  background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #581c87 100%)',
  cardBackground: 'rgba(255, 255, 255, 0.05)',
  headerBackground: 'rgba(15, 23, 42, 0.7)',
  backdropFilter: 'blur(10px)',
  headerBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  textWhite: 'white',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
} as const

// Constantes de animação
export const DASHBOARD_ANIMATIONS = {
  containerDuration: 0.6,
  cardDelay: 0.1,
  cardDuration: 0.5,
  activityDelay: 0.1,
  progressDelay: 0.2,
  progressDuration: 1,
} as const

// Dados mock das métricas principais
export const MOCK_METRICS = [
  { 
    title: 'Total de Escolas', 
    value: '1.247', 
    change: '+12%', 
    icon: SchoolIcon, 
    color: '#3b82f6' 
  },
  { 
    title: 'Estudantes Ativos', 
    value: '89.432', 
    change: '+8%', 
    icon: PeopleIcon, 
    color: '#10b981' 
  },
  { 
    title: 'Taxa de Aprovação', 
    value: '94.2%', 
    change: '+2.1%', 
    icon: TrendingUpIcon, 
    color: '#8b5cf6' 
  },
  { 
    title: 'Relatórios Gerados', 
    value: '156', 
    change: '+25%', 
    icon: AssessmentIcon, 
    color: '#f59e0b' 
  },
] as const

// Dados mock das atividades recentes
export const MOCK_ACTIVITIES = [
  { 
    title: 'Nova escola cadastrada', 
    subtitle: 'Escola Municipal São José', 
    time: '2 min atrás', 
    type: 'success' as const 
  },
  { 
    title: 'Relatório gerado', 
    subtitle: 'Relatório mensal de desempenho', 
    time: '15 min atrás', 
    type: 'info' as const 
  },
  { 
    title: 'Atualização de dados', 
    subtitle: '1.200 registros atualizados', 
    time: '1 hora atrás', 
    type: 'warning' as const 
  },
  { 
    title: 'Backup realizado', 
    subtitle: 'Backup automático concluído', 
    time: '2 horas atrás', 
    type: 'success' as const 
  },
  { 
    title: 'Usuário conectado', 
    subtitle: 'Admin João Silva fez login', 
    time: '3 horas atrás', 
    type: 'info' as const 
  },
] as const

// Dados mock das estatísticas rápidas
export const MOCK_QUICK_STATS = [
  { label: 'Escolas Públicas', value: 892, total: 1247 },
  { label: 'Escolas Privadas', value: 355, total: 1247 },
  { label: 'Ensino Fundamental', value: 745, total: 1247 },
  { label: 'Ensino Médio', value: 502, total: 1247 },
] as const

// Configuração dos ícones por tipo de atividade
export const ACTIVITY_ICONS = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  info: AssignmentIcon,
} as const

// Configuração das cores por tipo de atividade
export const ACTIVITY_COLORS = {
  success: {
    background: '#10b98120',
    border: '1px solid #10b98140',
    color: '#10b981',
  },
  warning: {
    background: '#f59e0b20',
    border: '1px solid #f59e0b40',
    color: '#f59e0b',
  },
  info: {
    background: '#3b82f620',
    border: '1px solid #3b82f640',
    color: '#3b82f6',
  },
} as const 