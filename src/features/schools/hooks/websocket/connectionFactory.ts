import { useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import { getWebSocketConfig } from '@/config/websocket'
import { 
  connectionPromise, 
  createClientConfig,
  globalStompClient,
  setConnectionPromise,
  setGlobalConnectionType,
  setGlobalStompClient
} from './connectionManager'
import type { ConnectionType } from './types'

interface ConnectionFactoryProps {
  accessToken: string
  onError: ((error: string) => void) | undefined
  updateHeartbeat: () => void
  subscribeToJob: (jobId: string) => void
  subscribedJobsRef: React.RefObject<Set<string>>
  connectionAttemptsRef: React.RefObject<number>
  getReconnectDelay: () => number
  setIsConnected: (value: boolean) => void
  setError: (value: string | null) => void
  setConnectionType: (value: ConnectionType) => void
}

export const useConnectionFactory = ({
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
}: ConnectionFactoryProps) => {
  const config = getWebSocketConfig()

  const createConnection = useCallback(async (useNative: boolean): Promise<Client> => {
    const endpoint = useNative ? config.nativeEndpoint : config.sockjsEndpoint
    const clientConfig = createClientConfig(endpoint, accessToken, config, useNative)

    

    try {
      const client = new Client(clientConfig)
      
      await new Promise<boolean>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          client.deactivate()
          reject(new Error('Connection timeout'))
        }, 10000) // 10 segundos
        
        client.onConnect = () => {
          clearTimeout(timeoutId)
          
          setIsConnected(true)
          setError(null)
          setConnectionType(useNative ? 'native' : 'sockjs')
          setGlobalConnectionType(useNative ? 'native' : 'sockjs')
          connectionAttemptsRef.current = 0
          updateHeartbeat()
          
          subscribedJobsRef.current?.forEach(jobId => {
            subscribeToJob(jobId)
          })
          resolve(true)
        }
        
        client.onStompError = (error) => {
          clearTimeout(timeoutId)
          const errorMsg = `STOMP Error: ${error.headers?.message || 'Unknown error'}`
          setError(errorMsg)
          onError?.(errorMsg)
          reject(new Error(errorMsg))
        }
        
        client.onWebSocketError = (error) => {
          clearTimeout(timeoutId)
          const errorMsg = `Erro ${useNative ? 'WebSocket Nativo' : 'de conexão SockJS'}`
          setError(errorMsg)
          onError?.(errorMsg)
          reject(error)
        }
        
        client.onDisconnect = () => {
          setIsConnected(false)
          setConnectionType(null)
          setGlobalConnectionType(null)
          
          if (client.active) {
            const delay = Math.min(config.reconnectDelay * Math.pow(2, 1), 30000)
            setTimeout(() => {
              if (!client.connected) {
                
                client.activate()
              }
            }, delay)
          }
        }
        
        client.activate()
      })

      setGlobalStompClient(client)
      return client
    } catch (error) {
      setIsConnected(false)
      setConnectionType(null)
      setGlobalConnectionType(null)
      
      if (connectionAttemptsRef.current < config.maxReconnectAttempts) {
        connectionAttemptsRef.current++
        const delay = getReconnectDelay()
        
        setTimeout(() => {
          createConnection(true).catch(console.error)
        }, delay)
      }
      throw error
    }
  }, [
    accessToken, 
    config, 
    updateHeartbeat, 
    subscribeToJob, 
    getReconnectDelay, 
    onError,
    subscribedJobsRef,
    connectionAttemptsRef,
    setIsConnected,
    setError,
    setConnectionType
  ])

  const connect = useCallback(async (preferNative: boolean): Promise<Client> => {
    if (globalStompClient?.connected) {
      
      return globalStompClient
    }

    if (connectionPromise) {
      
      try {
        return await connectionPromise
      } catch {
        setConnectionPromise(null)
      }
    }

    const forceNative = preferNative && !import.meta.env.PROD
    
    const promise = forceNative 
      ? createConnection(true).catch((_) => {
          return createConnection(false)
        })
      : createConnection(false)

    setConnectionPromise(promise)

    try {
      const client = await promise
      
      setConnectionPromise(null)
      return client
    } catch (error) {
      
      setConnectionPromise(null)
      throw error
    }
  }, [createConnection])

  return { connect }
} 