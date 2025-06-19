import { useApiCreate, useApiDelete } from '@/hooks/useApiMutation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/useToast'
import type { School, SchoolCreateRequest, SchoolUpdateRequest } from '@/schemas/schoolSchemas'

export const useCreateSchool = () => {
  const queryClient = useQueryClient()

  return useApiCreate<School, SchoolCreateRequest>(
    '/schools',
    {
      successMessage: 'Escola criada com sucesso!',
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['schools'] })
      }
    }
  )
}

export const useUpdateSchool = () => {
  const queryClient = useQueryClient()
  const { success } = useToast()

  return useMutation({
    mutationFn: async ({ code, data }: { code: number; data: SchoolUpdateRequest }) => {
      const response = await apiClient.put<School>(`/schools/${code}`, data)
      return response.data
    },
    onSuccess: (updatedSchool) => {
      success('Escola atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['schools'] })
      queryClient.invalidateQueries({ queryKey: ['school', updatedSchool.code] })
      queryClient.invalidateQueries({ queryKey: ['school-metrics', updatedSchool.code] })
    }
  })
}

export const useDeleteSchool = () => {
  const queryClient = useQueryClient()

  return useApiDelete<number>(
    (code) => `/schools/${code}`,
    {
      successMessage: 'Escola excluída com sucesso!',
      onSuccess: (_deletedResponse, code) => {
        queryClient.invalidateQueries({ queryKey: ['schools'] })
        queryClient.removeQueries({ queryKey: ['school', code] })
      }
    }
  )
} 