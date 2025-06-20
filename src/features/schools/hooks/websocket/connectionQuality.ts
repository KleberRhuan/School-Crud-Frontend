import { useCallback, useEffect, useRef, useState } from 'react'
import { CONNECTION_QUALITY_TIMEOUTS, type ConnectionQuality } from './types'

// Hook para monitorar qualidade da conexão
export const useConnectionQuality = (isConnected: boolean) => {
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>('disconnected')
  const lastHeartbeatRef = useRef<Date>(new Date())
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const updateConnectionQuality = useCallback(() => {
    const now = new Date()
    const timeSinceLastHeartbeat = now.getTime() - lastHeartbeatRef.current.getTime()
    
    if (!isConnected) {
      setConnectionQuality('disconnected')
    } else if (timeSinceLastHeartbeat < CONNECTION_QUALITY_TIMEOUTS.EXCELLENT) {
      setConnectionQuality('excellent')
    } else if (timeSinceLastHeartbeat < CONNECTION_QUALITY_TIMEOUTS.GOOD) {
      setConnectionQuality('good')
    } else {
      setConnectionQuality('poor')
    }
  }, [isConnected])

  useEffect(() => {
    if (isConnected) {
      heartbeatIntervalRef.current = setInterval(
        updateConnectionQuality, 
        CONNECTION_QUALITY_TIMEOUTS.HEARTBEAT_INTERVAL
      )
    }
    
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
        heartbeatIntervalRef.current = null
      }
    }
  }, [isConnected, updateConnectionQuality])

  const updateHeartbeat = useCallback(() => {
    lastHeartbeatRef.current = new Date()
  }, [])

  return { connectionQuality, updateHeartbeat }
} 