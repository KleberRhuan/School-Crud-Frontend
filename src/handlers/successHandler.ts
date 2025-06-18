import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/useToast.ts'

/**
 * Classe para tratamento de sucesso
 */
export class SuccessHandler {
  public static createMutationSuccessHandler<TData, TVariables>(
    method: string,
    url: string,
    options: {
      queryClient: ReturnType<typeof useQueryClient>
      invalidateQueries: QueryKey[]
      showSuccess: boolean | string
      successMessage: string
      toastService?: ReturnType<typeof useToast>
      onSuccess?: ((data: TData, variables: TVariables, context: unknown) => void) | undefined
    }
  ) {
    return (data: TData, variables: TVariables, context: unknown) => {
      this.invalidateRelatedQueries(options.queryClient, options.invalidateQueries)
      this.showSuccessMessage(
        options.showSuccess, 
        options.successMessage, 
        options.toastService
      )
      this.logSuccess(method, url)
      
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    }
  }

  private static invalidateRelatedQueries(
    queryClient: ReturnType<typeof useQueryClient>,
    invalidateQueries: QueryKey[]
  ): void {
    invalidateQueries.forEach(queryKey => {
      void queryClient.invalidateQueries({ queryKey })
    })
  }

  private static showSuccessMessage(
    showSuccess: boolean | string, 
    defaultMessage: string,
    toastService?: ReturnType<typeof useToast>
  ): void {
    if (showSuccess) {
      const message = typeof showSuccess === 'string' ? showSuccess : defaultMessage
      if (toastService) {
        toastService.success(message)
      } else {
        // Fallback log quando toast service não está disponível
        console.log(`✅ SUCCESS: ${message}`)
      }
    }
  }

  private static logSuccess(method: string, url: string): void {
    console.log(`✅ [useApi${method}] ${method} ${url} bem-sucedido`)
  }
} 