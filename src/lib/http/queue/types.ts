import type { ApiError } from '@/lib/http'

/**
 * Request enfileirado aguardando refresh
 */
export interface QueuedRequest {
  id: string
  resolve: (token: string) => void
  reject: (error: ApiError) => void
  timestamp: number
  retryCount: number
  originalUrl: string
}

/**
 * Métricas de monitoramento da fila
 */
export interface RefreshMetrics {
  totalRequests: number
  successfulRefreshes: number
  failedRefreshes: number
  averageQueueTime: number
  maxQueueSize: number
  timeouts: number
}

/**
 * Configurações da fila de refresh
 */
export interface QueueConfig {
  readonly MAX_QUEUE_SIZE: number
  readonly QUEUE_TIMEOUT: number
  readonly MAX_RETRIES: number
  readonly CLEANUP_INTERVAL: number
} 