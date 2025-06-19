import { z } from 'zod'

// Status dos jobs CSV
export const csvJobStatusSchema = z.enum(['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'])

// Esquema para resposta do job CSV
export const csvImportResponseSchema = z.object({
  jobId: z.string().uuid(),
  filename: z.string(),
  status: csvJobStatusSchema,
  totalRecords: z.number().int().nullable(),
  processedRecords: z.number().int(),
  errorRecords: z.number().int(),
  errorMessage: z.string().nullable(),
  startedAt: z.string().datetime().nullable(),
  finishedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
})

// Esquema para requisição de importação CSV
export const csvImportRequestSchema = z.object({
  file: z.instanceof(File),
  description: z.string().min(1, 'Descrição é obrigatória'),
})

// Esquema para notificação WebSocket
export const csvWebSocketNotificationSchema = z.object({
  jobId: z.string().uuid(),
  status: csvJobStatusSchema,
  progress: z.number().min(0).max(100).optional(),
  message: z.string().optional(),
  totalRecords: z.number().int().optional(),
  processedRecords: z.number().int().optional(),
  errorRecords: z.number().int().optional(),
  errorMessage: z.string().optional(),
  timestamp: z.string().datetime(),
})

// Tipos TypeScript
export type CsvJobStatus = z.infer<typeof csvJobStatusSchema>
export type CsvImportResponse = z.infer<typeof csvImportResponseSchema>
export type CsvImportRequest = z.infer<typeof csvImportRequestSchema>
export type CsvWebSocketNotification = z.infer<typeof csvWebSocketNotificationSchema>

// Configuração WebSocket
export interface WebSocketConfig {
  url: string
  connectHeaders?: Record<string, string>
  heartbeatIncoming?: number
  heartbeatOutgoing?: number
  reconnectDelay?: number
  maxReconnectAttempts?: number
} 