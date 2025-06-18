import type { QueueConfig } from '@/lib/http'

/**
 * Configurações da fila de refresh
 * Podem ser sobrescritas via variáveis de ambiente
 */
export const QUEUE_CONFIG: QueueConfig = {
  MAX_QUEUE_SIZE: Number(import.meta.env.VITE_QUEUE_MAX_SIZE) || 50,
  QUEUE_TIMEOUT: Number(import.meta.env.VITE_QUEUE_TIMEOUT) || 30000,
  MAX_RETRIES: Number(import.meta.env.VITE_QUEUE_MAX_RETRIES) || 2,
  CLEANUP_INTERVAL: Number(import.meta.env.VITE_QUEUE_CLEANUP_INTERVAL) || 60000,
} as const

/**
 * URLs da API
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
} as const

/**
 * Feature ‘flags’ para desenvolvimento
 */
export const FEATURE_FLAGS = {
  ENABLE_QUEUE_LOGS: import.meta.env.DEV || import.meta.env.VITE_ENABLE_QUEUE_LOGS === 'true',
  ENABLE_METRICS: import.meta.env.VITE_ENABLE_METRICS !== 'false', // habilitado por padrão
} as const 