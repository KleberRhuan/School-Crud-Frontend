import { api, configureApiHeaders, setAuthToken } from './axiosInstance'
import { getRefreshQueueMetrics, registerAuthInterceptor, resetAuthInterceptorState } from './interceptors/authInterceptor'
import { createAuthService } from '@/services/authService.ts'
import { getMetrics, resetMetrics } from './queue/refreshMetrics'
import { resetQueue } from './queue/refreshQueue'

registerAuthInterceptor()
export const authApi = createAuthService(api)
export { api as apiClient }
export { setAuthToken, configureApiHeaders }
export { getRefreshQueueMetrics }
export { ApiError } from './errors/ApiError'

export const getRefreshQueueBasicMetrics = getMetrics

export const resetRefreshQueueMetrics = (): void => {
  resetMetrics()
  resetQueue()
  resetAuthInterceptorState()
}

export type { 
  QueuedRequest, 
  RefreshMetrics, 
  QueueConfig 
} from './queue/types' 