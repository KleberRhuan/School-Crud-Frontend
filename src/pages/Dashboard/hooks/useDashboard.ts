import { useNavigate } from '@tanstack/react-router'
import { useToast } from '@/hooks/useToast'

export const useDashboard = () => {
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

  const handleGenerateReport = () => {
    toast.info('Gerando relatório...')
  }

  const handleViewAnalytics = () => {
    toast.info('Carregando analytics...')
  }

  return {
    handleViewTable,
    handleTestToasts,
    handleRefreshData,
    handleExportData,
    handleGenerateReport,
    handleViewAnalytics,
  }
} 