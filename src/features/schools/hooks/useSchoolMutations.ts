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
      queryClient.invalidateQueries({ 
        queryKey: ['schools-batch'],
        exact: false 
      })
      queryClient.invalidateQueries({ queryKey: ['school-metrics-list'] })
      queryClient.invalidateQueries({ queryKey: ['school-columns'] })
      
      queryClient.refetchQueries({ 
        queryKey: ['schools'],
        exact: false 
      })
    },
    forceRefreshAll: () => {
      // Função mais agressiva que limpa cache e força reload
      queryClient.resetQueries({
        queryKey: ['schools'],
        exact: false
      })
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
      // Forçar refetch após remoção
      queryClient.refetchQueries({ 
        queryKey: ['schools'],
        exact: false 
      })
    }
  }
}

// Hook público para forçar refresh em casos extremos
export const useForceSchoolsRefresh = () => {
  const { forceRefreshAll } = useSchoolQueryInvalidation()
  return forceRefreshAll
}

export const useCreateSchool = () => {
  const { invalidateAll } = useSchoolQueryInvalidation()
  const { success, error } = useToast()

  return useApiCreate<School, SchoolCreateRequest>(
    '/schools',
    {
      successMessage: 'Escola criada com sucesso!',
      onSuccess: async (newSchool) => {
        // Invalidar queries para atualizar a tabela
        invalidateAll()
        
        // Pequeno delay para garantir que o backend processou
        setTimeout(() => {
          invalidateAll()
        }, 100)
        
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
      
      // Dupla invalidação para garantir atualização
      setTimeout(() => {
        invalidateAll()
      }, 100)
      
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
        
        // Dupla invalidação para garantir atualização
        setTimeout(() => {
          invalidateAll()
        }, 100)
        
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