import axios, { AxiosError, AxiosResponse } from 'axios';
import ApiErrorInterpreter from './ApiErrorInterpreter';
import { createErrorContextFromAxios, createErrorContextFromResponse, extractTraceIdFromHeaders } from './utils';
import { ToastOptions } from './types';

// === INTERCEPTOR AXIOS ===
interface AxiosErrorInterceptorOptions {
  enabled?: boolean;
  excludeUrls?: string[];
  excludeStatuses?: number[];
  toastOptions?: ToastOptions;
}

class AxiosErrorInterceptor {
  private static options: AxiosErrorInterceptorOptions = {
    enabled: true,
    excludeUrls: [],
    excludeStatuses: [],
  };

  public static configure(options: Partial<AxiosErrorInterceptorOptions>): void {
    this.options = { ...this.options, ...options };
  }

  public static install(axiosInstance = axios): void {
    axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (this.shouldHandleError(error)) {
          this.handleError(error);
        }
        return Promise.reject(error);
      }
    );
  }

  private static shouldHandleError(error: AxiosError): boolean {
    if (!this.options.enabled) return false;

    const url = error.config?.url || '';
    const status = error.response?.status;

    // Excluir URLs específicas
    if (this.options.excludeUrls?.some(excludeUrl => url.includes(excludeUrl))) {
      return false;
    }

    // Excluir status específicos
    if (status && this.options.excludeStatuses?.includes(status)) {
      return false;
    }

    // Apenas erros 4xx e 5xx
    return Boolean(status && status >= 400);
  }

  private static handleError(error: AxiosError): void {
    console.log('🔄 [Interceptor] Processando erro do Axios:', error);
    
    const context = createErrorContextFromAxios(error);
    
    // Extrair trace ID dos headers de resposta
    if (error.response?.headers) {
      const traceId = extractTraceIdFromHeaders(error.response.headers);
      if (traceId) {
        context.traceId = traceId;
      }
    }

    ApiErrorInterpreter.handle(error, context, this.options.toastOptions);
  }
}

// === INTERCEPTOR FETCH ===
interface FetchErrorInterceptorOptions {
  enabled?: boolean;
  excludeUrls?: string[];
  excludeStatuses?: number[];
  toastOptions?: ToastOptions;
}

class FetchErrorInterceptor {
  private static options: FetchErrorInterceptorOptions = {
    enabled: true,
    excludeUrls: [],
    excludeStatuses: [],
  };

  private static originalFetch = globalThis.fetch;

  public static configure(options: Partial<FetchErrorInterceptorOptions>): void {
    this.options = { ...this.options, ...options };
  }

  public static install(): void {
    if (globalThis.fetch === this.interceptedFetch) {
      console.warn('🔄 [FetchInterceptor] Já está instalado');
      return;
    }

    globalThis.fetch = this.interceptedFetch;
    console.log('✅ [FetchInterceptor] Interceptor instalado');
  }

  public static uninstall(): void {
    globalThis.fetch = this.originalFetch;
    console.log('🗑️ [FetchInterceptor] Interceptor removido');
  }

  private static interceptedFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const requestUrl = typeof input === 'string' ? input : input.toString();
    const requestMethod = init?.method || 'GET';

    try {
      const response = await this.originalFetch(input, init);
      
      if (!response.ok && this.shouldHandleError(response, requestUrl)) {
        await this.handleError(response, requestUrl, requestMethod);
      }

      return response;
    } catch (error) {
      // Tratar erros de rede
      if (this.options.enabled) {
        ApiErrorInterpreter.handle(error, {
          method: requestMethod,
          url: requestUrl,
          timestamp: new Date().toISOString(),
        }, this.options.toastOptions);
      }
      throw error;
    }
  };

  private static shouldHandleError(response: Response, url: string): boolean {
    if (!this.options.enabled) return false;

    // Excluir URLs específicas
    if (this.options.excludeUrls?.some(excludeUrl => url.includes(excludeUrl))) {
      return false;
    }

    // Excluir status específicos
    if (this.options.excludeStatuses?.includes(response.status)) {
      return false;
    }

    // Apenas erros 4xx e 5xx
    return response.status >= 400;
  }

  private static async handleError(
    response: Response, 
    requestUrl: string, 
    requestMethod: string
  ): Promise<void> {
    console.log('🔄 [FetchInterceptor] Processando erro do Fetch:', response);
    
    const traceId = extractTraceIdFromHeaders(response.headers);
    const context = createErrorContextFromResponse(response, requestUrl, requestMethod, traceId);

    try {
      // Tentar extrair dados do erro da resposta
      const contentType = response.headers.get('content-type');
      let errorData = null;

      if (contentType?.includes('application/json')) {
        errorData = await response.clone().json();
      }

      ApiErrorInterpreter.handle(errorData || {
        status: response.status,
        statusText: response.statusText,
      }, context, this.options.toastOptions);

    } catch (parseError) {
      console.warn('⚠️ [FetchInterceptor] Erro ao fazer parse da resposta:', parseError);
      
      // Fallback para erro genérico
      ApiErrorInterpreter.handle({
        status: response.status,
        statusText: response.statusText,
        message: `Erro ${response.status}: ${response.statusText}`,
      }, context, this.options.toastOptions);
    }
  }
}

// === EXPORTS E CONFIGURAÇÃO GLOBAL ===
export { AxiosErrorInterceptor, FetchErrorInterceptor };

export interface GlobalInterceptorConfig {
  axios?: AxiosErrorInterceptorOptions;
  fetch?: FetchErrorInterceptorOptions;
  autoInstall?: boolean;
}

export const configureToastInterceptors = (config: GlobalInterceptorConfig = {}): void => {
  if (config.axios) {
    AxiosErrorInterceptor.configure(config.axios);
  }

  if (config.fetch) {
    FetchErrorInterceptor.configure(config.fetch);
  }

  if (config.autoInstall !== false) {
    AxiosErrorInterceptor.install();
    FetchErrorInterceptor.install();
  }
};

// Configuração padrão para desenvolvimento
export const defaultInterceptorConfig: GlobalInterceptorConfig = {
  axios: {
    enabled: true,
    excludeUrls: ['/health', '/ping'],
    excludeStatuses: [401], // Deixar auth errors para componentes específicos
  },
  fetch: {
    enabled: true,
    excludeUrls: ['/health', '/ping'],
    excludeStatuses: [401],
  },
  autoInstall: true,
}; 