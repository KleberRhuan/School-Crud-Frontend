import { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from '@tanstack/react-router'
import { Box, CircularProgress, Typography } from '@mui/material'
import { motion } from 'framer-motion'

import { 
  useAuthLoading, 
  useAuthStore, 
  useIsAuthenticated, 
  useIsInitialized 
} from '@/stores/authStore'

interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
  fallback?: ReactNode
}

interface AuthGuardState {
  isChecking: boolean
  shouldRedirect: boolean
  error: string | null
}

/**
 * AuthGuard - Middleware de roteamento para proteção de páginas
 */
export function AuthGuard({ 
  children, 
  redirectTo = '/login',
  fallback 
}: AuthGuardProps) {
  const location = useLocation()
  const isAuthenticated = useIsAuthenticated()
  const isAuthLoading = useAuthLoading()
  const isInitialized = useIsInitialized()
  
  const [state, setState] = useState<AuthGuardState>({
    isChecking: true,
    shouldRedirect: false,
    error: null
  })


  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        if (!isInitialized) {
          console.log('🛡️ AuthGuard: Aguardando inicialização...')
          const authStore = useAuthStore.getState()
          
          setState({
            isChecking: true,
            shouldRedirect: false,
            error: null
          })

          // Inicializar sessão (tentativa de refresh silencioso)
          await authStore.initialize()
          return
        }

        // Se está carregando (processo de auth em andamento), aguardar
        if (isAuthLoading) {
          console.log('🛡️ AuthGuard: Processo de autenticação em andamento...')
          setState({
            isChecking: true,
            shouldRedirect: false,
            error: null
          })
          return
        }

        // Verificação final após inicialização e carregamento
        if (isAuthenticated) {
          console.log('✅ AuthGuard: Usuário autenticado - permitindo acesso')
          setState({
            isChecking: false,
            shouldRedirect: false,
            error: null
          })
        } else {
          console.log('❌ AuthGuard: Usuário não autenticado - redirecionando')
          setState({
            isChecking: false,
            shouldRedirect: true,
            error: null
          })
        }
      } catch (error) {
        console.error('❌ AuthGuard: Erro na verificação:', error)
        setState({
          isChecking: false,
          shouldRedirect: true,
          error: error instanceof Error ? error.message : 'Erro de autenticação'
        })
      }
    }

    checkAuthentication()
  }, [isAuthenticated, isInitialized, isAuthLoading])

  // Loading state durante verificação
  if (state.isChecking || isAuthLoading || !isInitialized) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #581c87 100%)',
        }}
      >
        <Box
          className="glass-panel"
          sx={{
            p: 4,
            borderRadius: '16px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <CircularProgress 
            size={48} 
            sx={{ 
              mb: 2, 
              color: 'primary.main' 
            }} 
          />
          <Typography 
            variant="h6" 
            color="white" 
            sx={{ mb: 1 }}
          >
            Verificando autenticação...
          </Typography>
          <Typography 
            variant="body2" 
            color="rgba(255, 255, 255, 0.7)"
          >
            {!isInitialized && 'Inicializando sessão...'}
            {isInitialized && isAuthLoading && 'Validando credenciais...'}
            {isInitialized && !isAuthLoading && state.isChecking && 'Verificando permissões...'}
          </Typography>
        </Box>
      </Box>
    )
  }

  // Redirect para login se não autenticado
  if (state.shouldRedirect || (!isAuthenticated && isInitialized && !isAuthLoading)) {
    console.log('🔄 AuthGuard: Redirecionando para login...')
    console.log('🔄 AuthGuard: Página atual:', location.pathname)
    
    // Preservar a URL atual para redirecionamento após login
    const currentPath = location.pathname
    const searchParams = new URLSearchParams()
    
    if (currentPath !== '/' && currentPath !== redirectTo) {
      searchParams.set('redirect', currentPath)
    }

    const redirectUrl = `${redirectTo}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
    return <Navigate to={redirectUrl} replace />
  }

  // Mostrar erro se houver
  if (state.error) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #581c87 100%)',
        }}
      >
        <Box
          className="glass-panel"
          sx={{
            p: 4,
            borderRadius: '16px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography variant="h6" color="error.main" sx={{ mb: 2 }}>
            Erro de Autenticação
          </Typography>
          <Typography variant="body2" color="white" sx={{ mb: 3 }}>
            {state.error}
          </Typography>
          <button
            onClick={() => window.location.href = redirectTo}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Ir para Login
          </button>
        </Box>
      </Box>
    )
  }

  // Usuário autenticado - renderizar conteúdo protegido
  console.log('✅ AuthGuard: Renderizando conteúdo protegido')
  return <>{children}</>
}

/**
 * GuestGuard - Proteção para páginas públicas (redireciona se já logado)
 */
interface GuestGuardProps {
  children: ReactNode
  redirectTo?: string
}

export function GuestGuard({ 
  children, 
  redirectTo = '/dashboard' 
}: Readonly<GuestGuardProps>) {
  const isAuthenticated = useIsAuthenticated()
  const isInitialized = useIsInitialized()
  const isAuthLoading = useAuthLoading()

  // Aguardar inicialização
  if (!isInitialized || isAuthLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  // Se autenticado, redirecionar para dashboard
  if (isAuthenticated) {
    console.log('🚪 GuestGuard: Usuário já autenticado - redirecionando')
    return <Navigate to={redirectTo} replace />
  }

  // Usuário não autenticado - renderizar página pública
  return <>{children}</>
} 