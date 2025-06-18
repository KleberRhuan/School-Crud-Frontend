import {QueryKey, UseMutationOptions} from "@tanstack/react-query";
import {ApiError} from "@/lib/api-client.ts";
import {useToast} from "@/hooks/useToast.ts";
import {LoginRequest, RegisterRequest, User} from "@/schemas/apiSchemas.ts";

export interface CsvColumn {
  id: string
  key: string
  label: string
  type: 'string' | 'number' | 'date' | 'boolean'
  visible: boolean
  width?: number
  sortable: boolean
  filterable: boolean
}

export interface CsvRow {
  id: string
  [key: string]: any
}

export interface CsvData {
  columns: CsvColumn[]
  rows: CsvRow[]
  totalRows: number
  fileName: string
  uploadedAt: string
}

export interface TablePreferences {
  columnVisibility: Record<string, boolean>
  columnOrder: string[]
  columnWidths: Record<string, number>
  sorting: Array<{
    id: string
    desc: boolean
  }>
  filters: Record<string, any>
  pageSize: number
}

export interface ApiMutationOptions<TData, TVariables> extends Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'> {
  showSuccessToast?: boolean | string
  showErrorToast?: boolean
  invalidateQueries?: QueryKey[]
  successMessage?: string
  toastService?: ReturnType<typeof useToast>
}

export interface ApiQueryOptions {
  showErrorToast?: boolean
  toastService?: ReturnType<typeof useToast>
}

export type {
  HttpMethod,
  MutationConfig,
  MutationFactoryOptions
} from '@/factories/mutationFactory'

export interface QueuedRequest {
  id: string
  resolve: (token: string) => void
  reject: (error: ApiError) => void
  timestamp: number
  retryCount: number
  originalUrl: string
}

export interface RefreshMetrics {
  totalRequests: number
  successfulRefreshes: number
  failedRefreshes: number
  averageQueueTime: number
  maxQueueSize: number
  timeouts: number
}

export interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  user: User | null
  isInitialized: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  setUser: (user: User) => void
  setAccessToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearSession: () => void
  initialize: () => Promise<void>
}