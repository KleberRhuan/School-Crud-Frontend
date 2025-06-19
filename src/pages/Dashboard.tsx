import { Avatar, Box, Button, Card, CardContent, Chip, Container, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'
import { 
  Assessment as AssessmentIcon, 
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  FileDownload as FileDownloadIcon,
  NotificationsActive as NotificationIcon,
  People as PeopleIcon,
  PieChart as PieChartIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Speed as SpeedIcon,
  TableView as TableIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material'
import { useToast } from '@/hooks/useToast'

export function Dashboard() {
  const navigate = useNavigate()
  const toast = useToast()

  const handleViewTable = () => {
    navigate({ to: '/schools' })
  }

  const handleTestToasts = () => {
    toast.success('Login realizado com sucesso!')
    
    setTimeout(() => {
      toast.info('Sistema carregado completamente')
    }, 1000)
    
    setTimeout(() => {
      toast.warning('Lembre-se de salvar suas alterações')
    }, 2000)
  }

  const handleRefreshData = () => {
    toast.info('Atualizando dados do sistema...')
  }

  const handleExportData = () => {
    toast.success('Iniciando exportação de dados...')
  }

  // Dados mock para demonstração
  const metrics = [
    { title: 'Total de Escolas', value: '1.247', change: '+12%', icon: SchoolIcon, color: '#3b82f6' },
    { title: 'Estudantes Ativos', value: '89.432', change: '+8%', icon: PeopleIcon, color: '#10b981' },
    { title: 'Taxa de Aprovação', value: '94.2%', change: '+2.1%', icon: TrendingUpIcon, color: '#8b5cf6' },
    { title: 'Relatórios Gerados', value: '156', change: '+25%', icon: AssessmentIcon, color: '#f59e0b' },
  ]

  const recentActivities = [
    { title: 'Nova escola cadastrada', subtitle: 'Escola Municipal São José', time: '2 min atrás', type: 'success' },
    { title: 'Relatório gerado', subtitle: 'Relatório mensal de desempenho', time: '15 min atrás', type: 'info' },
    { title: 'Atualização de dados', subtitle: '1.200 registros atualizados', time: '1 hora atrás', type: 'warning' },
    { title: 'Backup realizado', subtitle: 'Backup automático concluído', time: '2 horas atrás', type: 'success' },
    { title: 'Usuário conectado', subtitle: 'Admin João Silva fez login', time: '3 horas atrás', type: 'info' },
  ]

  const quickStats = [
    { label: 'Escolas Públicas', value: 892, total: 1247 },
    { label: 'Escolas Privadas', value: 355, total: 1247 },
    { label: 'Ensino Fundamental', value: 745, total: 1247 },
    { label: 'Ensino Médio', value: 502, total: 1247 },
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #581c87 100%)',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Paper
            sx={{
              p: 4,
              mb: 4,
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 0,
              color: 'white'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h3" component="h1" gutterBottom>
                  Dashboard
                </Typography>
                <Typography variant="h6" color="rgba(255, 255, 255, 0.7)">
                  Bem-vindo ao sistema! Visão geral do desempenho educacional.
                </Typography>
              </Box>
              
              <Stack direction="row" spacing={2}>
                <IconButton
                  onClick={handleRefreshData}
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
                <IconButton
                  onClick={handleExportData}
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  <FileDownloadIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>

          <Stack spacing={4}>
            {/* Métricas Principais */}
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
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 0,
                        color: 'white',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                        },
                        transition: 'all 0.3s ease'
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
                            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
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
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 0,
                  color: 'white'
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
                      onClick={handleViewTable}
                      sx={{
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: 0,
                        color: 'white',
                        py: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(59, 130, 246, 1)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Visualizar Tabela de Escolas
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      startIcon={<NotificationIcon />}
                      onClick={handleTestToasts}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        borderRadius: 0,
                        py: 2,
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease'
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
                        '&:hover': {
                          borderColor: 'rgba(139, 92, 246, 0.8)',
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease'
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
                        '&:hover': {
                          borderColor: 'rgba(16, 185, 129, 0.8)',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Ver Analytics
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Estatísticas Rápidas */}
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 0,
                  color: 'white'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    Distribuição de Escolas
                  </Typography>
                  
                  <Stack spacing={2}>
                    {quickStats.map((stat, index) => (
                      <Box key={stat.label}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                            {stat.label}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {stat.value}
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
                            transition={{ duration: 1, delay: index * 0.2 }}
                            style={{
                              height: '100%',
                              background: `linear-gradient(90deg, #3b82f6, #8b5cf6)`,
                              borderRadius: 3
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* Atividades Recentes */}
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 0,
                color: 'white'
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
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ListItem
                        sx={{
                          px: 0,
                          py: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: 1
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              backgroundColor: activity.type === 'success' ? '#10b98120' :
                                              activity.type === 'warning' ? '#f59e0b20' : '#3b82f620',
                              border: activity.type === 'success' ? '1px solid #10b98140' :
                                      activity.type === 'warning' ? '1px solid #f59e0b40' : '1px solid #3b82f640'
                            }}
                          >
                            {activity.type === 'success' ? (
                              <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                            ) : activity.type === 'warning' ? (
                              <WarningIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                            ) : (
                              <AssignmentIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.title}
                          secondary={activity.subtitle}
                          primaryTypographyProps={{
                            color: 'white',
                            fontWeight: 500
                          }}
                          secondaryTypographyProps={{
                            color: 'rgba(255, 255, 255, 0.7)'
                          }}
                        />
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" sx={{ ml: 2 }}>
                          <ScheduleIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          {activity.time}
                        </Typography>
                      </ListItem>
                      {index < recentActivities.length - 1 && (
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      )}
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  )
} 