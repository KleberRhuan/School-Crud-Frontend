import { useCallback } from 'react';
import { SnackbarKey, useSnackbar } from 'notistack';

interface ToastOptions {
  duration?: number;
  persist?: boolean;
}

interface UseToastReturn {
  success: (message: string, options?: ToastOptions) => SnackbarKey;
  error: (message: string, options?: ToastOptions) => SnackbarKey;
  warning: (message: string, options?: ToastOptions) => SnackbarKey;
  info: (message: string, options?: ToastOptions) => SnackbarKey;
  handleApiError: (error: any, options?: ToastOptions) => SnackbarKey;
  dismiss: (id?: SnackbarKey) => void;
  dismissAll: () => void;
}

export const useToast = (): UseToastReturn => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const success = useCallback((message: string, options?: ToastOptions): SnackbarKey => {
    return enqueueSnackbar(message, {
      variant: 'success',
      autoHideDuration: options?.duration || 3000,
      persist: options?.persist || false,
    });
  }, [enqueueSnackbar]);

  const error = useCallback((message: string, options?: ToastOptions): SnackbarKey => {
    return enqueueSnackbar(message, {
      variant: 'error',
      autoHideDuration: options?.duration || 5000,
      persist: options?.persist || false,
    });
  }, [enqueueSnackbar]);

  const warning = useCallback((message: string, options?: ToastOptions): SnackbarKey => {
    return enqueueSnackbar(message, {
      variant: 'warning',
      autoHideDuration: options?.duration || 4000,
      persist: options?.persist || false,
    });
  }, [enqueueSnackbar]);

  const info = useCallback((message: string, options?: ToastOptions): SnackbarKey => {
    return enqueueSnackbar(message, {
      variant: 'info',
      autoHideDuration: options?.duration || 3000,
      persist: options?.persist || false,
    });
  }, [enqueueSnackbar]);

  const handleApiError = useCallback((
    errorData: any, 
    options?: ToastOptions
  ): SnackbarKey => {
    // Extrair mensagem do erro
    const message = errorData?.response?.data?.message || 
                   errorData?.message || 
                   'Erro interno do servidor';
    
    return error(message, options);
  }, [error]);

  const dismiss = useCallback((id?: SnackbarKey): void => {
    if (id) {
      closeSnackbar(id);
    } else {
      closeSnackbar();
    }
  }, [closeSnackbar]);

  const dismissAll = useCallback((): void => {
    closeSnackbar();
  }, [closeSnackbar]);

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