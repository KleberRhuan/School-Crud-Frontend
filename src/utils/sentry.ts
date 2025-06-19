import * as Sentry from '@sentry/react'

export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  const environment = import.meta.env.MODE || 'development'
  const isProduction = environment === 'production'
  
  if (!dsn) {
    // Modo offline - sem logging
    return
  }
  
  Sentry.init({
    dsn,
    environment,
    debug: !isProduction,
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    profilesSampleRate: isProduction ? 0.1 : 1.0,
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    dist: import.meta.env.VITE_BUILD_NUMBER || 'unknown',
  })
  
  // Sentry inicializado para ambiente: ${environment}
}

/**
 * Configurar trace ID para correlação com backend
 */
export const setTraceId = (traceId: string) => {
  Sentry.setTag('traceId', traceId)
  Sentry.setContext('trace', { traceId })
}

/**
 * Configurar informações de request
 */
export const setRequestContext = (method: string, url: string, status?: number) => {
  Sentry.setContext('request', {
    method,
    url,
    status,
    timestamp: new Date().toISOString(),
  })
} 