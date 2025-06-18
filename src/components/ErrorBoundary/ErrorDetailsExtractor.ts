// === CLASSE PARA EXTRAÇÃO DE DETALHES DO ERRO ===
export interface ErrorDetails {
  message: string
  stack?: string | undefined
  componentStack?: string | undefined
  errorBoundary?: string
  timestamp: string
  userAgent: string
  url: string
  [key: string]: any
}

export class ErrorDetailsExtractor {
  extract(error: Error, errorInfo: React.ErrorInfo, boundaryName: string): ErrorDetails {
    return {
      message: error.message,
      stack: error.stack || undefined,
      componentStack: errorInfo.componentStack || undefined,
      errorBoundary: boundaryName,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }
  }

  getReportDetails(error: Error | null, errorInfo: React.ErrorInfo | null): string {
    return `
Bug Report
==========

Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Error Message: ${error?.message || 'Unknown error'}

Stack Trace:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}

Additional Context:
Please describe what you were doing when this error occurred.
    `.trim()
  }
} 