import { Navigate } from '@tanstack/react-router'
import { Suspense } from 'react'
import { FullPageLoader } from '@/components/FullPageLoader'
import { useAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isInitialized, isAuthenticated, isLoading } = useAuth()

  if (!isInitialized) {
    return (
      <Suspense fallback={<FullPageLoader />}>
        <FullPageLoader 
          title="Inicializando sessão..."
        />
      </Suspense>
    )
  }

  if (isLoading) {
    return (
      <Suspense fallback={<FullPageLoader />}>
        <FullPageLoader 
          title="Verificando autenticação..."
        />
      </Suspense>
    )
  }

  try {
    if (isAuthenticated) {
      return <>{children}</>
    }
    return <Navigate to="/login" />
  } catch {
    return <Navigate to="/login" />
  }
}

export function GuestGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return <>{children}</>
}