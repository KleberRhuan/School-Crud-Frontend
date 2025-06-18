import type { RefreshMetrics } from './types'
import { FEATURE_FLAGS } from '../../config/constants'

/**
 * Estado das métricas (privado deste módulo)
 */
let metrics: RefreshMetrics = {
  totalRequests: 0,
  successfulRefreshes: 0,
  failedRefreshes: 0,
  averageQueueTime: 0,
  maxQueueSize: 0,
  timeouts: 0,
}

/**
 * Incrementa o contador de requests totais
 */
export const incrementTotalRequests = (): void => {
  if (!FEATURE_FLAGS.ENABLE_METRICS) return
  metrics.totalRequests++
}

/**
 * Atualiza o tamanho máximo da fila
 */
export const updateMaxQueueSize = (currentSize: number): void => {
  if (!FEATURE_FLAGS.ENABLE_METRICS) return
  metrics.maxQueueSize = Math.max(metrics.maxQueueSize, currentSize)
}

/**
 * Incrementa refreshes bem-sucedidos
 */
export const incrementSuccessfulRefreshes = (): void => {
  if (!FEATURE_FLAGS.ENABLE_METRICS) return
  metrics.successfulRefreshes++
}

/**
 * Incrementa refreshes falhados
 */
export const incrementFailedRefreshes = (): void => {
  if (!FEATURE_FLAGS.ENABLE_METRICS) return
  metrics.failedRefreshes++
}

/**
 * Incrementa timeouts
 */
export const incrementTimeouts = (): void => {
  if (!FEATURE_FLAGS.ENABLE_METRICS) return
  metrics.timeouts++
}

/**
 * Atualiza tempo médio de fila
 */
export const updateAverageQueueTime = (queueTime: number): void => {
  if (!FEATURE_FLAGS.ENABLE_METRICS) return
  metrics.averageQueueTime = (metrics.averageQueueTime + queueTime) / 2
}

/**
 * Obtém uma cópia das métricas atuais
 */
export const getMetrics = (): RefreshMetrics => ({ ...metrics })

/**
 * Reseta todas as métricas
 */
export const resetMetrics = (): void => {
  metrics = {
    totalRequests: 0,
    successfulRefreshes: 0,
    failedRefreshes: 0,
    averageQueueTime: 0,
    maxQueueSize: 0,
    timeouts: 0,
  }
}

/**
 * Obtém métricas estendidas (útil para debugging)
 */
export const getExtendedMetrics = (currentQueueSize: number, isRefreshing: boolean, refreshRetryCount: number) => ({
  ...getMetrics(),
  currentQueueSize,
  isRefreshing,
  refreshRetryCount,
}) 