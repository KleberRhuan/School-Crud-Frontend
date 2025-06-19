import { showErrorToast } from '@/utils/toast'

export class ErrorHandler {
  private static getErrorMessage(error: any): string {
    if (error?.response?.data?.message) {
      return error.response.data.message
    }
    
    if (error?.message) {
      return error.message
    }
    
    return 'Erro interno do servidor'
  }

  static shouldRetry(error: any): boolean {
    return error.status !== 401
  }

  static handleError(error: any, _method: string, _url: string): never {
    const errorMessage = this.getErrorMessage(error)
    
    try {
      showErrorToast(errorMessage)
    } catch {
      // Toast service não disponível - erro silencioso
    }
    
    throw error
  }
} 