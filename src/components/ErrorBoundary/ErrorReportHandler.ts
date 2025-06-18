import * as Sentry from '@sentry/react'
import { ErrorDetails } from './ErrorDetailsExtractor'
import React from "react";

export class ErrorReportHandler {
  captureToSentry(error: Error, errorDetails: ErrorDetails, errorInfo: React.ErrorInfo): string {
    let eventId = ''

    Sentry.withScope((scope) => {
      // Tags para filtragem
      scope.setTag('errorBoundary', errorDetails.errorBoundary)
      scope.setTag('errorType', 'react-error-boundary')
      scope.setLevel('error')

      // Contexto adicional
      scope.setContext('errorDetails', errorDetails)
      scope.setContext('componentStack', {
        componentStack: errorInfo.componentStack,
      })

      // Capturar o erro
      eventId = Sentry.captureException(error)
    })

    return eventId
  }

  showReportDialog(eventId: string | null, errorDetailsText: string): void {
    if (eventId) {
      Sentry.showReportDialog({ eventId })
    } else {
      // TODO: Colocar email em uma variável de ambiente
      const mailtoUrl = `mailto:kleber_rhuan@hotmail.com?subject=Bug Report&body=${encodeURIComponent(errorDetailsText)}`
      window.open(mailtoUrl)
    }
  }
} 