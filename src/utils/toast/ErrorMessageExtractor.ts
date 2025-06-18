import { ApiErrorResponse, ViolationItem } from './types';

class ErrorMessageExtractor {
  private static readonly MAX_VIOLATIONS_SHOWN = 3;

  public static fromApiError(apiError: ApiErrorResponse): string {
    return apiError.userMessage ||
           apiError.title ||
           apiError.detail ||
           'Erro inesperado';
  }

  public static fromGenericError(error: any): string {
    return error.response?.data?.message || 
           error.message || 
           'Erro inesperado. Tente novamente.';
  }

  public static fromValidationErrors(violations: ViolationItem[]): string {
    const messages = violations
      .map(v => v.message || `${v.name || 'Campo'}: valor inválido`)
      .slice(0, this.MAX_VIOLATIONS_SHOWN);

    if (messages.length === 1) {
      return messages[0];
    }
    
    if (messages.length <= this.MAX_VIOLATIONS_SHOWN) {
      return `Erros de validação:\n• ${messages.join('\n• ')}`;
    }

    const remainingCount = violations.length - this.MAX_VIOLATIONS_SHOWN;
    return `Erros de validação:\n• ${messages.join('\n• ')}\n• ... e mais ${remainingCount} erro(s)`;
  }

  public static fromStatusCode(status: number): string | null {
    const STATUS_MESSAGES: Record<number, string> = {
      400: 'Dados inválidos. Verifique as informações enviadas.',
      401: 'Sessão expirada. Faça login novamente.',
      403: 'Você não tem permissão para esta ação.',
      404: 'Recurso não encontrado.',
      408: 'Tempo limite excedido. Tente novamente.',
      409: 'Conflito de dados. Verifique as informações.',
      422: 'Dados não processáveis. Verifique os campos.',
      429: 'Muitas tentativas. Aguarde um momento.',
      500: 'Erro interno do servidor. Tente novamente mais tarde.',
      502: 'Serviço temporariamente indisponível.',
      503: 'Serviço em manutenção.',
      504: 'Tempo limite do servidor excedido.',
    };

    return STATUS_MESSAGES[status] || null;
  }
}

export default ErrorMessageExtractor; 