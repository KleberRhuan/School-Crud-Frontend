import { useApiQuery } from '@/hooks/useApiQuery'
import { useAuthStore } from '@/stores/authStore'
import { CACHE_TIME_HOUR, CACHE_TIME_LONG } from '@/constants/pagination'

export const useMetricsList = () => {
  const accessToken = useAuthStore(state => state.accessToken)

  const query = useApiQuery<string[]>(
    ['school-metrics-list'],
    '/schools/metrics',
    {},
    {
      staleTime: CACHE_TIME_LONG,
      gcTime: CACHE_TIME_HOUR,
      retry: 2,
      enabled: !!accessToken,
    }
  )

  return query
} 