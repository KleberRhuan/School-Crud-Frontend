import { useCallback } from 'react';
import toast, { ToastOptions } from 'react-hot-toast';
import { ApiErrorContext } from '@utils/toast/types.ts';
import ApiErrorInterpreter from '@utils/toast/ApiErrorInterpreter.ts';
import { ToastContent } from '@utils/toast/ToastContent.tsx';

interface UseToastReturn {
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  handleApiError: (error: any, context?: ApiErrorContext, options?: ToastOptions) => string;
  dismiss: (id?: string) => void;
  dismissAll: () => void;
}

export const useToast = (): UseToastReturn => {
  const base = useCallback((
    type: 'success' | 'error' | 'warning' | 'info', 
    message: string, 
    options?: ToastOptions
  ): string => {
    return toast.custom(
      (t) => ToastContent({ t, type, msg: message }), 
      { 
        id: `${type}-${message.substring(0, 50)}`, 
        duration: 5000,
        ...options 
      }
    );
  }, []);

  const success = useCallback((message: string, options?: ToastOptions): string => {
    return base('success', message, { duration: 2000, ...options });
  }, [base]);

  const error = useCallback((message: string, options?: ToastOptions): string => {
    return base('error', message, { duration: 5000, ...options });
  }, [base]);

  const warning = useCallback((message: string, options?: ToastOptions): string => {
    return base('warning', message, { duration: 4000, ...options });
  }, [base]);

  const info = useCallback((message: string, options?: ToastOptions): string => {
    return base('info', message, { duration: 3000, ...options });
  }, [base]);

  const handleApiError = useCallback((
    error: any, 
    context?: ApiErrorContext, 
    options?: ToastOptions
  ): string => {
    return ApiErrorInterpreter.handle(error, context, options);
  }, []);

  const dismiss = useCallback((id?: string): void => {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  }, []);

  const dismissAll = useCallback((): void => {
    toast.dismiss();
  }, []);

  return {
    success,
    error,
    warning,
    info,
    handleApiError,
    dismiss,
    dismissAll,
  };
}; 