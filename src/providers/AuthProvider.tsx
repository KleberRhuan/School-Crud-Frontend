import { ReactNode } from 'react'
import { FullPageLoader } from '@/components/FullPageLoader'
import { useAuth } from '@/hooks/useAuth'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * AuthProvider - Inicializa a sessão do usuário antes de renderizar a aplicação
 */
export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const { isReady, isLoading } = useAuth()

  const getLoadingDescription = () => {
    if (isLoading) return 'Validando credenciais...'
    return 'Carregando aplicação...'
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