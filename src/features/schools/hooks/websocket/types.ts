export interface CsvImportProgressData {
  id: string
  fileName?: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  totalRecords?: number
  processedRecords?: number
  successfulRecords?: number
  failedRecords?: number
  progress?: number
  error?: string
  createdAt?: string
  finishedAt?: string
}

export interface UseCsvWebSocketProps {
  accessToken: string
  onProgressUpdate?: (data: CsvImportProgressData) => void
  onError?: (error: string) => void
  preferNativeWebSocket?: boolean
}

export interface UseCsvWebSocketReturn {
  isConnected: boolean
  error: string | null
  subscribe: (jobId: string) => void
  unsubscribe: (jobId: string) => void
  disconnect: () => void
  connectionType: 'native' | 'sockjs' | null
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected'
  lastMessageTime: Date | null
}

export type ConnectionType = 'native' | 'sockjs' | null
export type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'disconnected'

// Constantes para timeouts
export const CONNECTION_QUALITY_TIMEOUTS = {
  EXCELLENT: 10000,
  GOOD: 30000,
  HEARTBEAT_INTERVAL: 5000,
  MAX_RECONNECT_DELAY: 30000,
  JITTER: 1000
} as const 