import { useEffect } from 'react'
import * as Sentry from '@sentry/react'
import { useAuthStore } from '@/stores/authStore'

/**
 * Hook para configurar contexto do usuário no Sentry
 */
export const useSentryUserContext = () => {
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user) {
      Sentry.setUser({
        id: user.id.toString(),
        email: user.email,
        username: user.name,
      })
    } else {
      Sentry.setUser(null)
    }
  }, [user, isAuthenticated])
}

/**
 * Hook para capturar exceções manualmente
 */
export const useSentryCapture = () => {
  const captureException = (error: Error, contexts?: Record<string, unknown>) => {
    Sentry.withScope((scope) => {
      if (contexts) {
        Object.entries(contexts).forEach(([key, value]) => {
          scope.setContext(key, value)
        })
      }
      Sentry.captureException(error)
    })
  }

  const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
    Sentry.captureMessage(message, level)
  }

  const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
    Sentry.addBreadcrumb(breadcrumb)
  }

  return {
    captureException,
    captureMessage,
    addBreadcrumb,
  }
} 