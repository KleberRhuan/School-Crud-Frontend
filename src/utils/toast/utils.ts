import { ApiErrorContext } from './types';

// === UTILITÁRIOS PARA CONTEXTO ===
export function createErrorContextFromAxios(error: any): ApiErrorContext {
  return {
    operation: error.config?.method?.toUpperCase(),
    url: error.config?.url,
    traceId: error.response?.headers?.['x-trace-id'],
    timestamp: new Date().toISOString(),
    status: error.response?.status,
    additionalInfo: {
      config: error.config,
      response: error.response?.data,
    },
  };
}

export function createErrorContextFromResponse(
  response: Response,
  url: string,
  method: string,
  traceId?: string
): ApiErrorContext {
  const context: ApiErrorContext = {
    operation: method.toUpperCase(),
    url,
    timestamp: new Date().toISOString(),
  };

  if (traceId) {
    context.traceId = traceId;
  }

  context.status = response.status;

  return context;
}

export function createErrorContextFromFetch(
  error: any,
  url: string,
  requestMethod: string
): ApiErrorContext {
  return {
    operation: requestMethod.toUpperCase(),
    url,
    timestamp: new Date().toISOString(),
    additionalInfo: {
      error: error.message || error.toString(),
    },
  };
}

// === UTILITÁRIOS DE VERIFICAÇÃO ===
export const isNetworkError = (error: any): boolean => 
  !error.response && error.code === 'NETWORK_ERROR';

export const isTimeoutError = (error: any): boolean => 
  error.code === 'ECONNABORTED' || error.message?.includes('timeout');

export function isAuthError(error: any): boolean {
  return error?.response?.status === 401 || error?.status === 401;
}

export function isCriticalError(error: any): boolean {
  const status = error?.response?.status || error?.status;
  return status >= 500;
}

export const isClientError = (error: any): boolean => {
  const status = error.response?.status || error.status;
  return status >= 400 && status < 500;
};

export const isServerError = (error: any): boolean => {
  const status = error.response?.status || error.status;
  return status >= 500 && status < 600;
};

// === UTILITÁRIOS DE EXTRAÇÃO ===
export function extractTraceIdFromHeaders(
  headers: Record<string, string> | Headers
): string | undefined {
  if (headers instanceof Headers) {
    return headers.get('x-trace-id') || headers.get('X-Trace-Id') || undefined;
  }
  return headers['x-trace-id'] || headers['X-Trace-Id'];
}

export const extractRequestIdFromHeaders = (headers: any): string | undefined => {
  if (!headers) return undefined;
  
  return headers['x-request-id'] || 
         headers['X-Request-Id'] || 
         headers['request-id'] || 
         headers.get?.('x-request-id') ||
         headers.get?.('X-Request-Id') ||
         headers.get?.('request-id');
}; 