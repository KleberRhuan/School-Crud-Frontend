import toast from 'react-hot-toast';
import { ApiErrorContext, ApiErrorResponse, ToastOptions, ToastResult, ViolationItem } from './types';
import ErrorMessageExtractor from './ErrorMessageExtractor';
import SentryReporter from './SentryReporter';
import { ToastContent } from './ToastContent';

class ApiErrorInterpreter {
  private static readonly CRITICAL_STATUS_CODES = [401, 403, 500, 502, 503, 504];

  public static interpret(
    error: unknown,
    context?: ApiErrorContext,
    options?: ToastOptions
  ): ToastResult {
    // Verificar se é ApiErrorResponse estruturado
    if (this.isApiErrorResponse(error)) {
      return this.interpretApiErrorResponse(error, context, options);
    }

    // Verificar se é erro do Axios com response
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = (error.response as any).data;
      
      // Tentar extrair ApiErrorResponse da resposta
      if (responseData.status && responseData.type) {
        return this.interpretApiErrorResponse(responseData as ApiErrorResponse, context, options);
      }
    }

    // Tratar como erro genérico
    return this.interpretGenericError(error, context, options);
  }

  private static isApiErrorResponse(error: any): error is ApiErrorResponse {
    return error && typeof error.status === 'number' && error.type;
  }

  private static interpretApiErrorResponse(
    apiError: ApiErrorResponse,
    context?: ApiErrorContext,
    options?: ToastOptions
  ): ToastResult {
    console.log('📋 [Toast] Processando ApiErrorResponse:', apiError);
    
    SentryReporter.reportApiError(apiError, context);

    // Verificar se há erros de validação
    if (this.hasValidationErrors(apiError)) {
      return this.interpretValidationErrors(apiError.violations!.items);
    }

    // Determinar mensagem baseada no status
    const statusMessage = ErrorMessageExtractor.fromStatusCode(apiError.status);
    const message = statusMessage || ErrorMessageExtractor.fromApiError(apiError);
    
    const shouldPersist = this.shouldPersistError(apiError.status);
    
    return {
      message,
      persist: shouldPersist || options?.persist || false,
    };
  }

  private static interpretValidationErrors(
    violations: ViolationItem[]
  ): ToastResult {
    console.log('📝 [Toast] Processando erros de validação:', violations);

    const message = ErrorMessageExtractor.fromValidationErrors(violations);
    
    return {
      message,
      persist: true, // Erros de validação sempre persistem
    };
  }

  private static interpretGenericError(
    error: any,
    context?: ApiErrorContext,
    options?: ToastOptions
  ): ToastResult {
    console.log('⚠️ [Toast] Processando erro genérico:', error);
    
    SentryReporter.reportApiError(error, context);

    const message = ErrorMessageExtractor.fromGenericError(error);
    
    return {
      message,
      persist: options?.persist || false,
    };
  }

  private static hasValidationErrors(apiError: ApiErrorResponse): boolean {
    return Boolean(apiError.violations?.items?.length);
  }

  private static shouldPersistError(status?: number): boolean {
    return this.CRITICAL_STATUS_CODES.includes(status || 0);
  }

  public static handle(
    error: any,
    context?: ApiErrorContext,
    options?: ToastOptions
  ): string {
    try {
      const result = this.interpret(error, context, options);
      
      const toastOptions = {
        duration: result.persist ? 0 : 5000, // 0 = não auto-dismiss
        ...options,
      };

      return toast.custom(
        (t) => ToastContent({ t, type: 'error', msg: result.message }),
        {
          id: `error-${result.message.substring(0, 50)}`,
          ...toastOptions,
        }
      );

    } catch (toastError) {
      console.error('❌ [Toast] Erro ao exibir toast:', toastError);
      
      // Fallback para erro crítico
      return toast.custom(
        (t) => ToastContent({ t, type: 'error', msg: 'Erro inesperado no sistema' }),
        {
          id: 'critical-error',
          duration: 0, // Não auto-dismiss para erros críticos
        }
      );
    }
  }
}

export default ApiErrorInterpreter; 