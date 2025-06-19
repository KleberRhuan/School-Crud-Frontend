import { useCallback, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

interface CsvImportProgressData {
  id: string
  fileName?: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  totalRecords?: number
  processedRecords?: number
  successfulRecords?: number
  failedRecords?: number
  progress?: number
  error?: string
  createdAt?: string
  finishedAt?: string
}

interface UseCsvWebSocketProps {
  accessToken: string
  onProgressUpdate?: (data: CsvImportProgressData) => void
  _onError?: (error: string) => void
}

interface UseCsvWebSocketReturn {
  isConnected: boolean
  error: string | null
  subscribe: (jobId: string) => void
  unsubscribe: (jobId: string) => void
  disconnect: () => void
}

export const useCsvWebSocket = ({
  accessToken,
  onProgressUpdate,
  _onError
}: UseCsvWebSocketProps): UseCsvWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const stompClientRef = useRef<Client | null>(null)
  const subscribedJobsRef = useRef<Set<string>>(new Set())
  const subscriptionsRef = useRef<Map<string, any>>(new Map())

  const cleanup = useCallback(() => {
    subscriptionsRef.current.forEach(subscription => {
      try {
        subscription.unsubscribe()
      } catch {
        // Silent error handling
      }
    })
    subscriptionsRef.current.clear()
    
    if (stompClientRef.current?.connected) {
      try {
        stompClientRef.current.deactivate()
      } catch {
        // Silent error handling
      }
    }
    
    setIsConnected(false)
    setError(null)
  }, [])

  const connect = useCallback(() => {
    if (stompClientRef.current?.connected) {
      return
    }

    cleanup()

    const client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.VITE_API_URL || 'http://localhost:8080'}/ws`),
      connectHeaders: {
        'Authorization': `Bearer ${accessToken}`
      },
      debug: () => {
        // Debug callback - desenvolvimento apenas
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true)
        setError(null)
        
        // Re-inscrever em jobs ativos
        subscribedJobsRef.current.forEach(jobId => {
          subscribeToJob(jobId)
        })
      },
      onStompError: () => {
        // Erro STOMP
        setError('Erro STOMP')
        _onError?.('Erro STOMP')
      },
      onWebSocketError: () => {
        // Erro WebSocket
        setError('Erro de conexão WebSocket')
        _onError?.('Erro de conexão WebSocket')
      },
      onDisconnect: () => {
        // STOMP desconectado
        setIsConnected(false)
      }
    })

    stompClientRef.current = client
    client.activate()
  }, [accessToken, _onError, cleanup, onProgressUpdate])

  const subscribeToJob = useCallback((jobId: string) => {
    if (!stompClientRef.current?.connected) {
      return
    }

    const subscription = stompClientRef.current.subscribe(
      `/topic/csv-import/${jobId}`,
      (message) => {
        try {
          const data = JSON.parse(message.body)
          if (data && data.progress === undefined && data.totalRecords && data.processedRecords) {
            data.progress = Math.floor((data.processedRecords / data.totalRecords) * 100)
          }
          onProgressUpdate?.(data)
        } catch {
          // Erro ao parsear mensagem - ignorado
        }
      }
    )

    subscriptionsRef.current.set(jobId, subscription)
  }, [onProgressUpdate])

  const subscribe = useCallback((jobId: string) => {
    subscribedJobsRef.current.add(jobId)
    
    if (stompClientRef.current?.connected) {
      subscribeToJob(jobId)
    } else {
      connect()
    }
  }, [subscribeToJob, connect])

  const unsubscribe = useCallback((jobId: string) => {
    subscribedJobsRef.current.delete(jobId)
    
    const subscription = subscriptionsRef.current.get(jobId)
    if (subscription) {
      try {
        subscription.unsubscribe()
        subscriptionsRef.current.delete(jobId)
      } catch {
        // Silent error handling
      }
    }
  }, [])

  const disconnect = useCallback(() => {
    subscribedJobsRef.current.clear()
    cleanup()
  }, [cleanup])

  useEffect(() => {
    if (accessToken && accessToken !== 'temp-token') {
      connect()
    } else {
      disconnect()
    }

    return cleanup
  }, [accessToken, connect, disconnect, cleanup])

  return {
    isConnected,
    error,
    subscribe,
    unsubscribe,
    disconnect
  }
} 