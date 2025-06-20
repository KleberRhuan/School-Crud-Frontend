import { useApiCreate, useApiDelete } from '@/hooks/useApiMutation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/useToast'
import type { School, SchoolCreateRequest, SchoolUpdateRequest } from '@/schemas/schoolSchemas'

const useSchoolQueryInvalidation = () => {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['schools'],
        exact: false 
      })
      queryClient.invalidateQueries({ queryKey: ['schools-batch'] })
      queryClient.invalidateQueries({ queryKey: ['school-metrics-list'] })
      queryClient.invalidateQueries({ queryKey: ['school-columns'] })
    },
    invalidateSchool: (code: number) => {
      queryClient.invalidateQueries({ queryKey: ['school', code] })
      queryClient.invalidateQueries({ queryKey: ['school-metrics', code] })
    },
    removeSchool: (code: number) => {
      queryClient.removeQueries({ queryKey: ['school', code] })
      queryClient.removeQueries({ queryKey: ['school-metrics', code] })
      queryClient.invalidateQueries({ 
        queryKey: ['schools'],
        exact: false
      })
    }
  }
}

export const useCreateSchool = () => {
  const { invalidateAll } = useSchoolQueryInvalidation()
  const { success, error } = useToast()

  return useApiCreate<School, SchoolCreateRequest>(
    '/schools',
    {
      successMessage: 'Escola criada com sucesso!',
      onSuccess: (newSchool) => {
        // Invalidar queries para atualizar a tabela
        invalidateAll()
        
        // Notificação adicional com detalhes
        success(
          `Escola "${newSchool.schoolName}" (Código: ${newSchool.code}) criada com sucesso!`,
          { duration: 4000 }
        )
      },
      onError: (err: any) => {
        const errorMsg = err.response?.data?.message || err.message || 'Erro ao criar escola'
        error(`Falha ao criar escola: ${errorMsg}`)
      }
    }
  )
}

export const useUpdateSchool = () => {
  const { invalidateAll, invalidateSchool } = useSchoolQueryInvalidation()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: async ({ code, data }: { code: number; data: SchoolUpdateRequest }) => {
      const response = await apiClient.put<School>(`/schools/${code}`, data)
      return response.data
    },
    onSuccess: (updatedSchool) => {
      invalidateSchool(updatedSchool.code)
      invalidateAll()
      
      success(
        `Escola "${updatedSchool.schoolName}" atualizada com sucesso!`,
        { duration: 4000 }
      )
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar escola'
      error(`Falha ao atualizar escola: ${errorMsg}`)
    }
  })
}

export const useDeleteSchool = () => {
  const { invalidateAll, removeSchool } = useSchoolQueryInvalidation()
  const { success, error } = useToast()

  return useApiDelete<number>(
    (code) => `/schools/${code}`,
    {
      successMessage: 'Escola excluída com sucesso!',
      onSuccess: (_, code) => {
        // Primeiro remover da cache específica
        removeSchool(code)
        // Depois invalidar todas as listas para garantir atualização
        invalidateAll()
        
        success(
          `Escola (Código: ${code}) excluída com sucesso!`,
          { duration: 4000 }
        )
      },
      onError: (err: any) => {
        const errorMsg = err.response?.data?.message || 'Erro ao excluir escola'
        error(`Falha ao excluir escola: ${errorMsg}`)
      }
    }
  )
} 