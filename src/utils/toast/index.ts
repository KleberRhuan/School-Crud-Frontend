export { useToast } from '@/hooks/useToast';
export { ToastProvider } from '@/providers/ToastProvider';

export type { ApiErrorContext, ViolationItem } from './types';
import { closeSnackbar, enqueueSnackbar, SnackbarKey } from 'notistack';

interface ToastOptions {
  duration?: number;
  persist?: boolean;
}


export const handleApiError = (
  error: unknown, 
  options?: ToastOptions
): void => {
  const message = (error as any)?.response?.data?.message || 
                 (error as any)?.message || 
                 'Erro interno do servidor';
  
  enqueueSnackbar(message, {
    variant: 'error',
    autoHideDuration: options?.duration || 5000,
    persist: options?.persist || false,
  });
};

// === FUNÇÕES DIRETAS DE TOAST ===
export const showSuccessToast = (
  message: string,
  options?: ToastOptions,
): SnackbarKey => {
  return enqueueSnackbar(message, {
    variant: 'success',
    autoHideDuration: options?.duration || 4000,
    persist: options?.persist || false,
  });
};

export const showErrorToast = (
  message: string,
  options?: ToastOptions,
): void => {
  if (!message) return;
  
  enqueueSnackbar(message, {
    variant: 'error',
    autoHideDuration: options?.duration || 6000,
    persist: options?.persist || false,
  });
};

export const showWarningToast = (
  message: string,
  options?: ToastOptions,
): SnackbarKey => {
  return enqueueSnackbar(message, {
    variant: 'warning',
    autoHideDuration: options?.duration || 5000,
    persist: options?.persist || false,
  });
};

export const showInfoToast = (
  message: string,
  options?: ToastOptions,
): SnackbarKey => {
  return enqueueSnackbar(message, {
    variant: 'info',
    autoHideDuration: options?.duration || 4000,
    persist: options?.persist || false,
  });
};

export const showValidationErrorToast = (violations: any[], options?: ToastOptions): void => {
  // Mostrar erro principal
  enqueueSnackbar('Erro de validação', {
    variant: 'error',
    autoHideDuration: options?.duration || 5000,
    persist: options?.persist || false,
  });

  // Mostrar cada violação específica
  violations.forEach((violation, index) => {
    setTimeout(() => {
      enqueueSnackbar(`${violation.field || 'Campo'}: ${violation.message}`, {
        variant: 'warning',
        autoHideDuration: 4000,
      });
    }, index * 200); // Espaçar as mensagens
  });
};

export const dismissToast = (id?: string): void => {
  if (id) {
    closeSnackbar(id);
  } else {
    closeSnackbar();
  }
};

export const dismissAllToasts = (): void => closeSnackbar();


export const showApiErrorToast = handleApiError; 