import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiMutationOptions } from '@/types'
import { useToast } from '@/hooks/useToast.ts'
import { buildFactoryOptions } from '@hooks/utils/factoryUtils.ts'
import { 
  createDeleteMutation, 
  createPatchMutation, 
  createPostMutation, 
  createPutMutation
} from '@/factories/mutationFactory.ts'

/**
 * Hook para criar recursos via POST
 */
export const useApiCreate = <TData = any, TVariables = any>(
  url: string,
  options?: ApiMutationOptions<TData, TVariables>
) => {
  const queryClient = useQueryClient()
  const contextToastService = useToast()
  const factoryOptions = buildFactoryOptions(options, contextToastService)
  return useMutation(createPostMutation(url, queryClient, factoryOptions))
}

/**
 * Hook para atualizar recursos via PUT ou PATCH
 */
export const useApiUpdate = <TData = any, TVariables = any>(
  url: string | ((variables: TVariables) => string),
  method: 'PUT' | 'PATCH' = 'PUT',
  options?: ApiMutationOptions<TData, TVariables>
) => {
  const queryClient = useQueryClient()
  const contextToastService = useToast()
  
  const factoryOptions = buildFactoryOptions(options, contextToastService)
  
  const createMutation = method === 'PUT' ? createPutMutation : createPatchMutation
  return useMutation(createMutation(url, queryClient, factoryOptions))
}

/**
 * Hook para deletar recursos via DELETE
 */
export const useApiDelete = <TVariables = string | number>(
  url: string | ((id: TVariables) => string),
  options?: ApiMutationOptions<void, TVariables>
) => {
  const queryClient = useQueryClient()
  const contextToastService = useToast()
  
  const factoryOptions = buildFactoryOptions(options, contextToastService)
  
  return useMutation(createDeleteMutation(url, queryClient, factoryOptions))
} 