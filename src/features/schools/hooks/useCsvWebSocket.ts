import { useCallback, useEffect, useRef, useState } from 'react'
import { getPreferredConnectionStrategy } from '@/config/websocket'
import { useConnectionQuality } from './websocket/connectionQuality'
import { useCleanupResources, useJobSubscription } from './websocket/subscription'
import { useConnectionFactory } from './websocket/connectionFactory'
import { calculateReconnectDelay, cleanupGlobalConnections, globalConnectionType, globalStompClient } from './websocket/connectionManager'
import type { 
  ConnectionType,
  CsvImportProgressData,
  UseCsvWebSocketProps, 
  UseCsvWebSocketReturn
} from './websocket/types'

export type { 
  ConnectionType,
  CsvImportProgressData,
  UseCsvWebSocketProps, 
  UseCsvWebSocketReturn
}

const BASE_RECONNECT_DELAY = 1000
const CONNECTION_DEBOUNCE_MS = 500

export const useCsvWebSocket = ({
  accessToken,
  onProgressUpdate,
  onError,
  preferNativeWebSocket
}: UseCsvWebSocketProps): UseCsvWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionType, setConnectionType] = useState<ConnectionType>(null)
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null)
  
  const subscribedJobsRef = useRef<Set<string>>(new Set())
  const connectionAttemptsRef = useRef(0)
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastConnectionAttemptRef = useRef<string | null>(null)
  
  const preferredStrategy = preferNativeWebSocket ?? (getPreferredConnectionStrategy() === 'native')
  const { connectionQuality, updateHeartbeat } = useConnectionQuality(isConnected)
  const { subscriptionsRef, cleanup } = useCleanupResources()

  const getReconnectDelay = useCallback(() => {
    return calculateReconnectDelay(BASE_RECONNECT_DELAY, connectionAttemptsRef.current)
  }, [])

  const { subscribeToJob } = useJobSubscription(
    subscriptionsRef,
    onProgressUpdate,
    setLastMessageTime,
    updateHeartbeat
  )

  const { connect } = useConnectionFactory({
    accessToken,
    onError,
    updateHeartbeat,
    subscribeToJob,
    subscribedJobsRef,
    connectionAttemptsRef,
    getReconnectDelay,
    setIsConnected,
    setError,
    setConnectionType
  })

  const handleConnect = useCallback(async () => {
    // Evitar múltiplas tentativas com o mesmo token
    if (lastConnectionAttemptRef.current === accessToken) {
      
      return
    }

    // Se já está conectado, não tentar novamente
    if (globalStompClient?.connected) {
      setIsConnected(true)
      setConnectionType(globalConnectionType)
      return
    }

    lastConnectionAttemptRef.current = accessToken

    try {
      await connect(preferredStrategy)
    } catch (error) {
      
      // Reset do controle de tentativas após falha
      lastConnectionAttemptRef.current = null
    }
  }, [connect, preferredStrategy, accessToken])

  const debouncedConnect = useCallback(() => {
    // Limpar timeout anterior
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current)
    }

    // Agendar nova conexão com debounce
    connectionTimeoutRef.current = setTimeout(() => {
      handleConnect()
    }, CONNECTION_DEBOUNCE_MS)
  }, [handleConnect])

  const subscribe = useCallback((jobId: string) => {
    subscribedJobsRef.current.add(jobId)
    
    if (globalStompClient?.connected) {
      subscribeToJob(jobId)
    } else {
      debouncedConnect()
    }
  }, [subscribeToJob, debouncedConnect])

  const { unsubscribeFromJob } = useJobSubscription(
    subscriptionsRef,
    onProgressUpdate,
    setLastMessageTime,
    updateHeartbeat
  )

  const unsubscribe = useCallback((jobId: string) => {
    subscribedJobsRef.current.delete(jobId)
    unsubscribeFromJob(jobId)
  }, [unsubscribeFromJob])

  const disconnect = useCallback(() => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current)
      connectionTimeoutRef.current = null
    }
    
    subscribedJobsRef.current.clear()
    connectionAttemptsRef.current = 0
    lastConnectionAttemptRef.current = null
    
    cleanupGlobalConnections()
    setIsConnected(false)
    setError(null)
    setConnectionType(null)
    cleanup()
  }, [cleanup])

  useEffect(() => {
    if (accessToken && accessToken !== 'temp-token' && accessToken.length > 20) {
      debouncedConnect()
    } else {
      disconnect()
    }

    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
      }
      cleanup()
    }
  }, [accessToken, debouncedConnect, disconnect, cleanup])

  return {
    isConnected,
    error,
    subscribe,
    unsubscribe,
    disconnect,
    connectionType,
    connectionQuality,
    lastMessageTime
  }
} 