import { z } from 'zod'
import { apiErrorSchema } from '@/schemas/apiErrorSchemas'
import { AxiosError } from 'axios'
import {QUEUE_CONFIG} from "@/lib/config/constants.ts";

type ApiErrorResponse = z.infer<typeof apiErrorSchema>

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: ApiErrorResponse
  ) {
    super((data?.userMessage ?? data?.detail) ?? statusText)
    this.name = 'ApiError'
  }

  static fromHttpError(error: {
    response?: {
      status?: number
      statusText?: string
      data?: unknown
    }
  }): ApiError {
    const data = error.response?.data as ApiErrorResponse
    return new ApiError(
      error.response?.status ?? 0,
      error.response?.statusText ?? 'Unknown Error',
      data
    )
  }

  static fromAxiosError(error: AxiosError): ApiError {
    return this.fromHttpError(error)
  }

  static sessionExpired(): ApiError {
    return new ApiError(401, 'Session expired', {
      status: 401,
      type: 'about:blank',
      title: 'Session Expired',
      detail: 'Sua sessão expirou. Faça login novamente.',
      userMessage: 'Sua sessão expirou. Faça login novamente.',
      timestamp: new Date().toISOString()
    })
  }

  static requestRetriesExceeded(): ApiError {
    return new ApiError(429, 'Request retries exceeded', {
      status: 429,
      type: 'about:blank',
      title: 'Queue Full',
      detail: `Fila de refresh atingiu limite máximo de ${QUEUE_CONFIG.MAX_QUEUE_SIZE} requests`,
      userMessage: 'Sistema temporariamente sobrecarregado. Tente novamente em alguns segundos.',
      timestamp: new Date().toISOString()
    })
  }

  static requestTimeout(requestId: string): ApiError {
    return new ApiError(408, 'Request timeout', {
      status: 408,
      type: 'about:blank',
      title: 'Request Timeout',
      detail: `Request ${requestId} expirou na fila após ${QUEUE_CONFIG.QUEUE_TIMEOUT}ms`,
      userMessage: 'Operação expirou. Tente novamente.',
      timestamp: new Date().toISOString()
    })
  }

  static requestRetryFailed(requestId: string): ApiError {
    return new ApiError(500, 'Request retry failed', {
      status: 500,
      type: 'about:blank',
      title: 'Request Retry Failed',
      detail: `Erro ao reexecutar request ${requestId}`,
      userMessage: 'Erro interno do sistema. Tente novamente.',
      timestamp: new Date().toISOString()
    })
  }
} 