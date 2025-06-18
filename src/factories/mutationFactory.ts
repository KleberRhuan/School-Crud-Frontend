import {QueryClient, QueryKey, UseMutationOptions} from '@tanstack/react-query'
import {apiClient, ApiError} from '@/lib/api-client.ts'
import {SuccessHandler} from '@/handlers/successHandler.ts'
import {ErrorHandler} from '@/handlers/errorHandler.ts'
import {useToast} from '@/hooks/useToast.ts'
import axios, {AxiosError} from "axios";

/**
 * Tipos HTTP suportados pela factory
 */
export type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Configuração para criação de mutations via factory
 */
export interface MutationConfig<TData, TVariables> {
  method: HttpMethod
  url: string | ((variables: TVariables) => string)
  defaultSuccessMessage: string
  queryClient: QueryClient
  options?: MutationFactoryOptions<TData, TVariables>
}

/**
 * Opções da factory de mutations
 */
export interface MutationFactoryOptions<TData, TVariables> extends Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'> {
  showSuccessToast?: boolean | string
  showErrorToast?: boolean
  invalidateQueries?: QueryKey[]
  successMessage?: string
  toastService?: ReturnType<typeof useToast>
}

/**
 * Mapeamento de métodos HTTP para funções do axios
 */
const HTTP_METHOD_MAP = {
  POST: (url: string, data: any) => apiClient.post(url, data),
  PUT: (url: string, data: any) => apiClient.put(url, data),
  PATCH: (url: string, data: any) => apiClient.patch(url, data),
  DELETE: (url: string) => apiClient.delete(url),
} as const

/**
 * Mapeamento de mensagens padrão por método HTTP
 */
const DEFAULT_MESSAGES = {
  POST: 'Item criado com sucesso!',
  PUT: 'Item atualizado com sucesso!',
  PATCH: 'Item atualizado com sucesso!',
  DELETE: 'Item removido com sucesso!',
} as const

/**
 * Factory para criar mutations consolidadas
 * 
 * Esta função elimina a duplicação das classes de mutation,
 * consolidando toda a lógica numa única implementação reutilizável.
 * Agora herda configurações globais de retry/retryDelay do QueryClient.
 * 
 * @param config - Configuração da mutation
 * @returns Opções de mutation prontas para uso com useMutation
 */
export function createApiMutation<TData = any, TVariables = any>(
  config: MutationConfig<TData, TVariables>
): UseMutationOptions<TData, ApiError, TVariables> {
  const {
    method,
    url,
    defaultSuccessMessage,
    queryClient,
    options = {}
  } = config

  const {
    showSuccessToast: showSuccess = true,
    showErrorToast: showError = true,
    invalidateQueries = [],
    successMessage = defaultSuccessMessage,
    toastService,
    onSuccess,
    onError,
    ...mutationOptions
  } = options

  return {
    mutationFn: createMutationFn<TData, TVariables>(method, url),
    onSuccess: SuccessHandler.createMutationSuccessHandler<TData, TVariables>(
      method,
      typeof url === 'string' ? url : 'dynamic-url',
      {
        queryClient,
        invalidateQueries,
        showSuccess,
        successMessage,
        ...(toastService && { toastService }),
        onSuccess,
      }
    ),
    onError: createErrorHandler<TVariables>(method, url, showError, toastService, onError),
    // ✅ Herda configurações globais de retry/retryDelay do QueryClient
    ...mutationOptions,
  }
}

/**
 * Cria a função de mutation baseada no método HTTP
 */
function createMutationFn<TData, TVariables>(
  method: HttpMethod,
  url: string | ((variables: TVariables) => string)
) {
  return async (variables: TVariables): Promise<TData> => {
    try {
      const endpoint = typeof url === 'function' ? url(variables) : url;
      const httpMethod = HTTP_METHOD_MAP[method];

      const response =
          method === 'DELETE' // @ts-ignore
          ? await httpMethod(endpoint)
          : await httpMethod(endpoint, variables);
      
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw ApiError.fromAxiosError(error as AxiosError)
      }
      throw error
    }
  }
}

/**
 * Cria o handler de erro consolidado
 */
function createErrorHandler<TVariables>(
  method: HttpMethod,
  url: string | ((variables: TVariables) => string),
  showError: boolean,
  toastService?: ReturnType<typeof useToast>,
  onError?: (error: ApiError, variables: TVariables, context: unknown) => void
) {
  return (error: ApiError, variables: TVariables, context: unknown) => {
    const urlString = typeof url === 'string' ? url : 'dynamic-url'
    ErrorHandler.handleMutationError(method, urlString, error, showError, toastService)
    onError?.(error, variables, context)
  }
}

/**
 * Helpers para criação rápida de mutations específicas (agora mais compactos)
 */
const createMutationHelper = <TData = any, TVariables = any>(
  method: HttpMethod,
  defaultMessage: string
) => (
  url: string | ((variables: TVariables) => string),
  queryClient: QueryClient,
  options: MutationFactoryOptions<TData, TVariables> = {}
) => createApiMutation<TData, TVariables>({
  method,
  url,
  defaultSuccessMessage: defaultMessage,
  queryClient,
  options,
})

export const createPostMutation = createMutationHelper('POST', DEFAULT_MESSAGES.POST)
export const createPutMutation = createMutationHelper('PUT', DEFAULT_MESSAGES.PUT)
export const createPatchMutation = createMutationHelper('PATCH', DEFAULT_MESSAGES.PATCH)
export const createDeleteMutation = createMutationHelper('DELETE', DEFAULT_MESSAGES.DELETE) 