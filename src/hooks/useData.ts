import { z } from 'zod'
import { useApiQuery, usePaginatedQuery } from './useApiQuery.ts'
import { useApiCreate, useApiDelete, useApiUpdate } from './useApiMutation.ts'
import { useQueryClient } from '@tanstack/react-query'
import { createQueryKeys } from '@/config/queryConfig.ts'

export interface TableParams {
  page?: number
  size?: number
  sort?: string
  order?: 'asc' | 'desc'
  filters?: Record<string, any>
  search?: string
}

interface ExportDataParams {
  format?: 'csv' | 'xlsx' | 'pdf'
  columns?: string[]
  filters?: Record<string, any>
}

/**
 * Hook genérico para dados de tabela com tipagem opcional
 */
export const useTableData = <T = any>(
  endpoint: string,
  params: TableParams = {},
  _itemSchema?: z.ZodSchema<T>
) => {
  const keys = createQueryKeys(endpoint.replace('/', ''))
  
  return usePaginatedQuery<T>(
    keys.list(params),
    endpoint,
    params,
    {
      staleTime: 30 * 1000, // 30 segundos
    }
  )
}

/**
 * Hook para item específico com tipagem opcional
 */
export const useTableItem = <T = any>(
  endpoint: string,
  id: string | number,
  _itemSchema?: z.ZodSchema<T>
) => {
  const keys = createQueryKeys(endpoint.replace('/', ''))
  
  return useApiQuery<T>(
    keys.detail(id),
    `${endpoint}/${id}`,
    {},
    {
      enabled: !!id,
      staleTime: 2 * 60 * 1000, // 2 minutos
    }
  )
}

/**
 * Hook para criar item
 */
export const useCreateTableItem = <T = any>(endpoint: string) => {
  const queryClient = useQueryClient()
  const keys = createQueryKeys(endpoint.replace('/', ''))
  
  return useApiCreate<T, any>(endpoint, {
    showSuccessToast: 'Item criado com sucesso!',
    onSuccess: () => {
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: keys.lists() })
    }
  })
}

/**
 * Hook para atualizar item
 */
export const useUpdateTableItem = <T = any>(endpoint: string) => {
  const queryClient = useQueryClient()
  const keys = createQueryKeys(endpoint.replace('/', ''))
  
  return useApiUpdate<T, any>(
    (variables: any) => `${endpoint}/${variables.id}`,
    'PUT',
    {
      showSuccessToast: 'Item atualizado com sucesso!',
      onSuccess: (_data, variables) => {
        // Invalidar item específico e listas
        queryClient.invalidateQueries({ queryKey: keys.detail(variables.id) })
        queryClient.invalidateQueries({ queryKey: keys.lists() })
      }
    }
  )
}

/**
 * Hook para deletar item
 */
export const useDeleteTableItem = (endpoint: string) => {
  const queryClient = useQueryClient()
  const keys = createQueryKeys(endpoint.replace('/', ''))
  
  return useApiDelete<string | number>(
    (id) => `${endpoint}/${id}`,
    {
      showSuccessToast: 'Item removido com sucesso!',
      onSuccess: (_data, id) => {
        // Remover do cache e invalidar listas
        queryClient.removeQueries({ queryKey: keys.detail(id) })
        queryClient.invalidateQueries({ queryKey: keys.lists() })
      }
    }
  )
}

/**
 * Hook para exportação de dados
 */
export const useExportData = (endpoint: string) => {
  return useApiCreate<Blob, ExportDataParams>(`${endpoint}/export`, {
    showSuccessToast: 'Exportação iniciada!',
    showErrorToast: true,
  })
}

/**
 * Hook composto para CRUD completo de uma entidade
 */
export const useTableCrud = <T = any>(
  endpoint: string,
  itemSchema?: z.ZodSchema<T>
) => {
  return {
    // Queries
    useList: (params: TableParams = {}) => 
      useTableData<T>(endpoint, params, itemSchema),
    
    useItem: (id: string | number) => 
      useTableItem<T>(endpoint, id, itemSchema),
    
    // Mutations
    useCreate: () => useCreateTableItem<T>(endpoint),
    useUpdate: () => useUpdateTableItem<T>(endpoint),
    useDelete: () => useDeleteTableItem(endpoint),
    useExport: () => useExportData(endpoint),
  }
}

/**
 * Hook para estatísticas do sistema
 */
export const useSystemStats = () => {
  const keys = createQueryKeys('system')
  
  return useApiQuery(
    keys.detail('stats'),
    '/system/stats',
    {},
    {
      refetchInterval: 30000, // Atualiza a cada 30 segundos
      staleTime: 5 * 60 * 1000, // 5 minutos
    }
  )
} 