// === EXPORTAÇÕES PRINCIPAIS ===
export { useToast } from '@hooks/useToast.ts';
export { ToastContent } from './ToastContent';
export { default as ErrorMessageExtractor } from './ErrorMessageExtractor';
export { default as SentryReporter } from './SentryReporter';
export { default as ApiErrorInterpreter } from './ApiErrorInterpreter';
export * from './types';
export * from './utils';

// === FUNÇÕES DE CONVENIÊNCIA (backward compatibility) ===
import toast from 'react-hot-toast';
import ApiErrorInterpreter from './ApiErrorInterpreter';
import { ApiErrorContext, ToastOptions, ViolationItem } from './types';
import { ToastContent } from './ToastContent';

/**
 * Função única para tratar qualquer erro de API
 * Esta é a função recomendada para uso geral
 */
export const handleApiError = (
  error: unknown, 
  context?: ApiErrorContext,
  options?: ToastOptions
): string => {
  return ApiErrorInterpreter.handle(error, context, options);
};

// Funções de conveniência para retrocompatibilidade
export const showSuccessToast = (message: string, options?: ToastOptions): string =>
  toast.custom(
    (t) => ToastContent({ t, type: 'success', msg: message }),
    { id: `success-${message.substring(0, 50)}`, duration: 2000, ...options }
  );

export const showErrorToast = (message: string, options?: ToastOptions): string =>
  toast.custom(
    (t) => ToastContent({ t, type: 'error', msg: message }),
    { id: `error-${message.substring(0, 50)}`, duration: 5000, ...options }
  );

export const showWarningToast = (message: string, options?: ToastOptions): string =>
  toast.custom(
    (t) => ToastContent({ t, type: 'warning', msg: message }),
    { id: `warning-${message.substring(0, 50)}`, duration: 4000, ...options }
  );

export const showInfoToast = (message: string, options?: ToastOptions): string =>
  toast.custom(
    (t) => ToastContent({ t, type: 'info', msg: message }),
    { id: `info-${message.substring(0, 50)}`, duration: 3000, ...options }
  );

export const showValidationErrorToast = (violations: ViolationItem[], options?: ToastOptions): string =>
  ApiErrorInterpreter.handle({ violations: { items: violations } }, undefined, options);

export const dismissToast = (id?: string): void => toast.dismiss(id);

export const dismissAllToasts = (): void => toast.dismiss();


export const showApiErrorToast = handleApiError; 