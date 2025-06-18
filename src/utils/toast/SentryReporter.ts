import * as Sentry from '@sentry/react';
import { ApiErrorContext, ApiErrorResponse } from './types';

class SentryReporter {
  public static reportApiError(error: any, context?: ApiErrorContext): void {
    this.addBreadcrumb(error, context);
    
    if (this.isApiErrorResponse(error)) {
      this.captureApiErrorResponse(error, context);
    } else {
      this.captureGenericError(error, context);
    }
  }

  private static addBreadcrumb(error: any, context?: ApiErrorContext): void {
    Sentry.addBreadcrumb({
      message: 'API Error Toast',
      level: 'error',
      data: {
        status: error.response?.status || error.status,
        url: context?.url || error.config?.url,
        method: context?.method || error.config?.method,
        traceId: context?.traceId,
        timestamp: context?.timestamp || new Date().toISOString(),
      },
    });
  }

  private static isApiErrorResponse(error: any): error is ApiErrorResponse {
    return error && typeof error.status === 'number' && error.type;
  }

  private static captureApiErrorResponse(
    apiError: ApiErrorResponse,
    context?: ApiErrorContext
  ): void {
    Sentry.withScope((scope) => {
      scope.setLevel('error');
      scope.setTag('errorType', 'api-error-response');
      scope.setTag('errorStatus', apiError.status);
      
      if (context?.traceId) {
        scope.setTag('traceId', context.traceId);
      }
      
      if (context?.method) {
        scope.setTag('httpMethod', context.method);
      }
      
      scope.setContext('apiError', this.buildApiErrorContext(apiError));
      
      if (context) {
        scope.setContext('requestContext', context);
      }
      
      Sentry.captureMessage(`API Error: ${apiError.title}`, 'error');
    });
  }

  private static buildApiErrorContext(apiError: ApiErrorResponse) {
    return {
      status: apiError.status,
      type: apiError.type,
      title: apiError.title,
      detail: apiError.detail,
      userMessage: apiError.userMessage,
      timestamp: apiError.timestamp,
      violationsCount: apiError.violations?.items.length ?? 0,
    };
  }

  private static captureGenericError(error: any, context?: ApiErrorContext): void {
    Sentry.withScope((scope) => {
      scope.setTag('errorType', 'generic-api-error');
      
      if (context) {
        scope.setContext('requestContext', context);
      }
      
      scope.setContext('errorData', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          method: error.config?.method,
          url: error.config?.url,
        }
      });
      
      Sentry.captureException(error);
    });
  }

  public static reportToastDeduplication(cacheKey: string): void {
    Sentry.addBreadcrumb({
      message: 'Toast Deduplication',
      level: 'info',
      data: { cacheKey },
    });
  }
}

export default SentryReporter; 