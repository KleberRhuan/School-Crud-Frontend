import { ReactNode } from 'react'
import { QueryProvider } from './QueryProvider'
import { AuthProvider } from './AuthProvider'
import { ToastProvider } from './ToastProvider'
import { SentryProvider } from './SentryProvider'

interface AppProviderProps {
  children: ReactNode
}

/**
 * Provider único que agrega todos os providers da aplicação
 * Reduz aninhamento e evita repetição de children em cada camada
 */
export function AppProvider({ children }: Readonly<AppProviderProps>) {
  return (
    <SentryProvider>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </SentryProvider>
  )
} 