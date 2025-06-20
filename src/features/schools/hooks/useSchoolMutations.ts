import { useApiCreate, useApiDelete } from '@/hooks/useApiMutation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/useToast'
import type { School, SchoolCreateRequest, SchoolUpdateRequest } from '@/schemas/schoolSchemas'

const useSchoolQueryInvalidation = () => {
  const queryClient = useQueryClient()

  return {
    invalidateAll: async () => {
      await queryClient.removeQueries({ 
        queryKey: ['schools'],
        exact: false 
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['schools'],
        exact: false,
        refetchType: 'all'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['school-metrics-list'],
        exact: true
      })
      await queryClient.invalidateQueries({ 
        queryKey: ['school-columns'],
        exact: true
      })
      
      await queryClient.refetchQueries({ 
        queryKey: ['schools'],
        exact: false,
        type: 'all'
      })
    },
    forceRefreshAll: async () => {
      // Reset completo do cache
      await queryClient.resetQueries({
        queryKey: ['schools'],
        exact: false
      })
      
      // Força refetch de tudo
      await queryClient.refetchQueries({
        queryKey: ['schools'],
        exact: false,
        type: 'all'
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
        exact: false,
        refetchType: 'all'
      })
      
      queryClient.refetchQueries({ 
        queryKey: ['schools'],
        exact: false,
        type: 'all'
      })
    }
  }
}

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
        await invalidateAll()
        
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
  const { invalidateAll } = useSchoolQueryInvalidation()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: async ({ code, data }: { code: number; data: SchoolUpdateRequest }) => {
      const response = await apiClient.put<School>(`/schools/${code}`, data)
      return response.data
    },
    onSuccess: async (updatedSchool) => {
      // Invalidar e forçar refetch imediatamente
      await invalidateAll()
      
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
      onSuccess: async (_, code) => {
        try {
          removeSchool(code)
          await invalidateAll()
          
          success(
            `Escola (Código: ${code}) excluída com sucesso!`,
            { duration: 4000 }
          )
        } catch (err) {
          console.error('Erro ao limpar cache após deleção:', err)
          success(
            `Escola (Código: ${code}) excluída com sucesso, mas houve um erro ao atualizar a tabela. Por favor, atualize a página.`,
            { duration: 6000 }
          )
        }
      },
      onError: (err: any) => {
        const errorMsg = err.response?.data?.message || 'Erro ao excluir escola'
        error(`Falha ao excluir escola: ${errorMsg}`)
      }
    }
  )
} 