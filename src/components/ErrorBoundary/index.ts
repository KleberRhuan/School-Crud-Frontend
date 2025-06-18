import React from 'react'
import { ErrorBoundaryComponent, ErrorBoundaryProps } from './ErrorBoundaryComponent'

// === EXPORTS PRINCIPAIS ===
export { ErrorBoundaryComponent as ErrorBoundary }
export type { ErrorBoundaryProps }
export { ErrorBoundaryUI } from './ErrorBoundaryUI'
export { ErrorReportHandler } from './ErrorReportHandler'
export { ErrorDetailsExtractor } from './ErrorDetailsExtractor'

// === HOC PARA ENVOLVER COMPONENTES ===
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => 
    React.createElement(
      ErrorBoundaryComponent,
      {
        ...errorBoundaryProps,
      } as ErrorBoundaryProps,
      React.createElement(Component, props)
    )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// === HOOK PARA TRATAMENTO DE ERROS ===
export const useErrorHandler = () => {
  return React.useCallback((error: Error, _errorInfo?: any) => {
    throw error
  }, [])
}

// === COMPONENTE PADRÃO (BACKWARD COMPATIBILITY) ===
export default ErrorBoundaryComponent 