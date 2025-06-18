import { ApiError } from '@/lib/api-client.ts'
import { useToast } from '@/hooks/useToast.ts'

/**
 * Classe para tratamento de erros
 */
export class ErrorHandler {
  public static handleMutationError(
    method: string, 
    url: string, 
    error: ApiError, 
    showError: boolean,
    toastService?: ReturnType<typeof useToast>
  ): void {
    console.error(`❌ [useApi${method}] Erro em ${method} ${url}:`, error)

    if (showError && this.shouldShowErrorToast(error)) {
      if (toastService) {
        toastService.error(error.message || `Erro na operação ${method}`)
      } else {
        // Fallback usando o hook diretamente (apenas em contextos onde hooks são permitidos)
        console.error(`Toast service not available: ${error.message || `Erro na operação ${method}`}`)
      }
    }
  }

  private static shouldShowErrorToast(error: ApiError): boolean {
    // Não mostrar toast para erros 401 (será tratado pelo interceptor)
    return error.status !== 401
  }
} 