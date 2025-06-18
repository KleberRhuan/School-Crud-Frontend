import { ReactNode, useEffect } from 'react'
import { FullPageLoader } from '@/components/FullPageLoader'
import { useAuth } from '@/hooks/useAuth'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * AuthProvider - Provedor de contexto de autenticação
 * Inicializa a sessão do usuário e controla o estado de carregamento
 */
export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const { isReady, isLoading, isInitialized, initialize } = useAuth()

  useEffect(() => {
    if (!isInitialized) {
      console.log('🚀 AuthProvider: Inicializando sessão...')
      initialize()
    }
  }, [isInitialized, initialize])

  const getLoadingDescription = () => {
    if (!isInitialized) return 'Configurando ambiente...'
    if (isLoading) return 'Validando credenciais...'
    return 'Finalizando...'
  }
  
  if (!isReady) {
    return (
      <FullPageLoader
        title="Inicializando aplicação"
        subtitle="Verificando sessão..."
        description={getLoadingDescription()}
      />
    )
  }

  return <>{children}</>
} 