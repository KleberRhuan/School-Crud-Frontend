import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { CONNECTION_QUALITY_TIMEOUTS, type ConnectionType } from './types'

// Cache de conexão global com controle de estado
export let globalStompClient: Client | null = null
export let globalConnectionType: ConnectionType = null
export let connectionPromise: Promise<Client> | null = null
export let isConnecting = false 

let isCleanupListenerAdded = false

const addModernCleanupListeners = () => {
  if (isCleanupListenerAdded || typeof window === 'undefined') return
  
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      cleanupGlobalConnections()
    }
  }
  
  const handlePageHide = () => {
    cleanupGlobalConnections()
  }
  
  const handleBeforeUnload = () => {
    cleanupGlobalConnections()
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('pagehide', handlePageHide)
  window.addEventListener('beforeunload', handleBeforeUnload)
  
  isCleanupListenerAdded = true
}

export const setGlobalStompClient = (client: Client | null) => {
  globalStompClient = client
  isConnecting = false 
  
  if (client?.connected) {
    addModernCleanupListeners()
  }
}

export const setGlobalConnectionType = (type: ConnectionType) => {
  globalConnectionType = type
}

export const setConnectionPromise = (promise: Promise<Client> | null) => {
  connectionPromise = promise
  isConnecting = !!promise
}

export const calculateReconnectDelay = (reconnectDelay: number, attempts: number) => {
  const exponentialDelay = Math.min(
    reconnectDelay * Math.pow(2, attempts), 
    CONNECTION_QUALITY_TIMEOUTS.MAX_RECONNECT_DELAY
  )
  return exponentialDelay + Math.random() * CONNECTION_QUALITY_TIMEOUTS.JITTER
}

export const createClientConfig = (
  endpoint: string,
  accessToken: string,
  config: any,
  isNative: boolean
) => {
  const baseConfig: any = {
    connectHeaders: {
      'Authorization': `Bearer ${accessToken}`
    },
    reconnectDelay: 0,
    heartbeatIncoming: config.heartbeatIncoming,
    heartbeatOutgoing: config.heartbeatOutgoing,
  }

  return isNative 
    ? { 
        ...baseConfig, 
        brokerURL: `${endpoint}?token=${encodeURIComponent(accessToken)}`
      }
    : { 
        ...baseConfig, 
        webSocketFactory: () => {
          const sockjsUrl = accessToken ? `${endpoint}?token=${encodeURIComponent(accessToken)}` : endpoint
          return new SockJS(sockjsUrl)
        }
      }
}

// Função para limpar conexões globais com controle aprimorado
export const cleanupGlobalConnections = () => {
  
  
  if (globalStompClient?.connected) {
    try {
      globalStompClient.deactivate()
    } catch {
      // Silenciar erros de desconexão
    }
  }
  
  globalStompClient = null
  globalConnectionType = null
  connectionPromise = null
  isConnecting = false
}

export const canStartNewConnection = (): boolean => {
  return !isConnecting && !globalStompClient?.connected
} 