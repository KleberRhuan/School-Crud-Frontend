import { useContext } from 'react'
import { QueryStatsContext } from '@/providers/QueryProvider'

/**
 * Hook para estatísticas e operações básicas de cache
 */
export const useQueryStats = () => {
  const context = useContext(QueryStatsContext)
  
  if (!context) {
    throw new Error('useQueryStats deve ser usado dentro de QueryProvider')
  }
  
  return context
} 