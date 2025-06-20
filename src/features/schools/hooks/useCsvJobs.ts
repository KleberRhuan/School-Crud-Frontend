import { useMemo } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useApiCreate } from '@/hooks/useApiMutation'
import { useQueryClient } from '@tanstack/react-query'
import type { CsvImportResponse } from '@/schemas/csvSchemas'
import type { PageableRequest, PaginatedResponse } from '@/schemas/schoolSchemas'
import { CACHE_TIME_SHORT } from '@/constants/pagination'

export const useCsvImport = () => {
  const queryClient = useQueryClient()

  return useApiCreate<CsvImportResponse, FormData>(
    '/csv/import',
    {
      successMessage: 'Importação iniciada com sucesso!',
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['csv-jobs'] })
      }
    }
  )
}

interface UseCsvJobsProps {
  status?: string
  pageable?: PageableRequest
  enabled?: boolean
  includeAll?: boolean
}

export const useCsvJobs = ({
  status,
  pageable = { page: 1, size: 20, direction: 'DESC' },
  enabled = true,
  includeAll = false
}: UseCsvJobsProps = {}) => {

  // Query para jobs do usuário
  const userJobsQuery = useApiQuery<PaginatedResponse<CsvImportResponse>>(
    ['csv-jobs', 'user', pageable],
    '/csv/jobs',
    { params: pageable },
    {
      enabled: enabled && !includeAll && !status,
      staleTime: CACHE_TIME_SHORT,
    }
  )

  // Query para jobs por status
  const statusJobsQuery = useApiQuery<PaginatedResponse<CsvImportResponse>>(
    ['csv-jobs', 'status', status, pageable],
    `/csv/jobs/status/${status}`,
    { params: pageable },
    {
      enabled: enabled && !includeAll && !!status,
      staleTime: CACHE_TIME_SHORT,
    }
  )

  // Query para todos os jobs (admin)
  const allJobsQuery = useApiQuery<PaginatedResponse<CsvImportResponse>>(
    ['csv-jobs', 'all', pageable],
    '/csv/jobs/all',
    { params: pageable },
    {
      enabled: enabled && includeAll,
      staleTime: CACHE_TIME_SHORT,
    }
  )

  // Determinar qual query usar
  const activeQuery = useMemo(() => {
    if (includeAll) return allJobsQuery
    if (status) return statusJobsQuery
    return userJobsQuery
  }, [includeAll, status, allJobsQuery, statusJobsQuery, userJobsQuery])

  return {
    data: activeQuery.data,
    isLoading: activeQuery.isLoading,
    error: activeQuery.error,
    refetch: activeQuery.refetch,
    isFetching: activeQuery.isFetching,
  }
}

export const useCsvJob = (jobId: string, enabled = true) => {
  return useApiQuery<CsvImportResponse>(
    ['csv-job', jobId],
    `/csv/jobs/${jobId}`,
    {},
    {
      enabled: enabled && !!jobId,
      staleTime: CACHE_TIME_SHORT,
    }
  )
}

export const useCsvJobsByStatus = (
  status: string,
  pageable: PageableRequest = { page: 1, size: 20, direction: 'DESC' },
  enabled = true
) => {
  return useApiQuery<PaginatedResponse<CsvImportResponse>>(
    ['csv-jobs-status', status, pageable],
    `/csv/jobs/status/${status}`,
    { params: pageable },
    {
      enabled: enabled && !!status,
      staleTime: CACHE_TIME_SHORT,
    }
  )
}

export const useAllCsvJobs = (
  pageable: PageableRequest = { page: 1, size: 20, direction: 'DESC' },
  enabled = true
) => {
  return useApiQuery<PaginatedResponse<CsvImportResponse>>(
    ['csv-jobs-all', pageable],
    '/csv/jobs/all',
    { params: pageable },
    {
      enabled,
      staleTime: CACHE_TIME_SHORT,
    }
  )
}

export const useCancelCsvJob = () => {
  const queryClient = useQueryClient()

  return useApiCreate<CsvImportResponse, { jobId: string }>(
    '/csv/jobs/cancel',
    {
      successMessage: 'Job cancelado com sucesso!',
      onSuccess: (_, variables) => {
        void queryClient.invalidateQueries({ queryKey: ['csv-jobs'] })
          void queryClient.invalidateQueries({ queryKey: ['csv-job', variables.jobId] })
      }
    }
  )
} 