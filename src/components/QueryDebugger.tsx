import React from 'react'
import { useQueryStats } from '@/hooks/useQueryStats'

/**
 * Componente de debug (apenas desenvolvimento)
 */
export const QueryDebugger: React.FC = () => {
  const { getStats, logStats } = useQueryStats()
  
  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 10, 
      left: 10, 
      zIndex: 9999,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '12px'
    }}>
      <button onClick={logStats} style={{ marginRight: '8px' }}>
        Log Stats
      </button>
      <span>Q: {getStats().queries} | F: {getStats().isFetching}</span>
    </div>
  )
} 