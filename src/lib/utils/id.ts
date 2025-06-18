/**
 * Gera um ‘ID’ único para requests
 * Formato: req_timestamp_randomString
 */
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Gera um UUID v4 simples (alternativa caso não use lib externa)
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Gera um ID curto para uso interno
 */
export const generateShortId = (): string => {
  return Math.random().toString(36).slice(2, 8);
} 