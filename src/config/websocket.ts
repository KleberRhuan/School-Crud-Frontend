export interface WebSocketConfig {
  // URLs dos endpoints
  nativeEndpoint: string
  sockjsEndpoint: string
  
  // Configurações de conexão
  heartbeatIncoming: number
  heartbeatOutgoing: number
  reconnectDelay: number
  maxReconnectAttempts: number
  
  // Configurações de debug
  enableDebug: boolean
}

/**
 * Determina as URLs WebSocket baseado no protocolo atual
 */
export const getWebSocketUrls = () => {
  const isHttps = window.location.protocol === 'https:'
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const host = baseUrl.replace(/^https?:\/\//, '')
  
  return {
    native: `${isHttps ? 'wss' : 'ws'}://${host}/ws-native`,
    sockjs: `${isHttps ? 'https' : 'http'}://${host}/ws`
  }
}

/**
 * Configuração padrão do WebSocket
 */
export const defaultWebSocketConfig: WebSocketConfig = {
  nativeEndpoint: getWebSocketUrls().native,
  sockjsEndpoint: getWebSocketUrls().sockjs,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  reconnectDelay: 5000,
  maxReconnectAttempts: 5,
  enableDebug: import.meta.env.DEV || false
}

/**
 * Verifica se WebSocket nativo está disponível
 */
export const isNativeWebSocketSupported = (): boolean => {
  return typeof WebSocket !== 'undefined'
}

/**
 * Verifica se está em ambiente HTTPS
 */
export const isSecureContext = (): boolean => {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost'
}

/**
 * Determina a melhor estratégia de conexão baseado no ambiente
 */
export const getPreferredConnectionStrategy = (): 'native' | 'sockjs' => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'sockjs'
  }
  
  if (isNativeWebSocketSupported()) {
    return 'native'
  }
  
  return 'sockjs'
}

/**
 * Configurações específicas por ambiente
 */
export const getEnvironmentConfig = (): Partial<WebSocketConfig> => {
  const isDevelopment = import.meta.env.DEV
  const isProduction = import.meta.env.PROD
  
  if (isDevelopment) {
    return {
      enableDebug: true,
      reconnectDelay: 2000, 
      maxReconnectAttempts: 10
    }
  }
  
  if (isProduction) {
    return {
      enableDebug: false,
      reconnectDelay: 5000,
      maxReconnectAttempts: 5
    }
  }
  
  return {}
}

/**
 * Configuração completa mesclando defaults com ambiente
 */
export const getWebSocketConfig = (): WebSocketConfig => {
  const urls = getWebSocketUrls()
  const envConfig = getEnvironmentConfig()
  
  return {
    ...defaultWebSocketConfig,
    nativeEndpoint: urls.native,
    sockjsEndpoint: urls.sockjs,
    ...envConfig
  }
} 