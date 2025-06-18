import React, { Component, ReactNode } from 'react'
import { ErrorBoundaryUI } from './ErrorBoundaryUI'
import { ErrorReportHandler } from './ErrorReportHandler'
import { ErrorDetailsExtractor } from './ErrorDetailsExtractor'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  eventId: string | null
}

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetKeys?: Array<string | number>
  resetOnPropsChange?: boolean
}

export class ErrorBoundaryComponent extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private readonly resetTimeoutId: number | null = null
  private readonly errorReportHandler: ErrorReportHandler
  private readonly errorDetailsExtractor: ErrorDetailsExtractor

  constructor(props: ErrorBoundaryProps) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    }

    this.errorReportHandler = new ErrorReportHandler()
    this.errorDetailsExtractor = new ErrorDetailsExtractor()
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (error.message?.includes('ChunkLoadError') || error.message?.includes('Loading chunk')) {
      window.location.reload()
      return
    }

    // Log para desenvolvimento
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    const errorDetails = this.errorDetailsExtractor.extract(error, errorInfo, this.constructor.name)
    const eventId = this.errorReportHandler.captureToSentry(error, errorDetails, errorInfo)

    this.setState({
      errorInfo,
      eventId,
    })

    this.props.onError?.(error, errorInfo)
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.shouldResetError(prevProps)) {
      this.resetError()
    }
  }

  override componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  private shouldResetError(prevProps: ErrorBoundaryProps): boolean {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    if (!hasError) return false

    // Reset automático baseado em mudanças de props
    if (resetOnPropsChange && prevProps.children !== this.props.children) {
      return true
    }

    // Reset baseado em resetKeys
    if (resetKeys && prevProps.resetKeys) {
      return resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index])
    }

    return false
  }

  private readonly resetError = () => {
    console.log('🔄 [ErrorBoundary] Resetando estado de erro')
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    })
  }

  private readonly handleRetry = () => {
    this.resetError()
  }

  private readonly handleGoHome = () => {
    window.location.href = '/'
  }

  private readonly handleReportBug = () => {
    this.errorReportHandler.showReportDialog(
      this.state.eventId,
      this.errorDetailsExtractor.getReportDetails(this.state.error, this.state.errorInfo)
    )
  }

  override render() {
    const { hasError, error, eventId } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      if (fallback) {
        return fallback
      }

      return (
        <ErrorBoundaryUI
          error={error}
          eventId={eventId}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
          onReportBug={this.handleReportBug}
        />
      )
    }

    return children
  }
} 