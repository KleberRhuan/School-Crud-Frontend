import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Box } from '@mui/material'
import { CheckCircle, Email, Error as ErrorIcon } from '@mui/icons-material'

import { useVerifyEmail } from '@/hooks/useAuth'
import { AuthContainer } from '@/components/Auth'
import { VerifyEmailErrorView, VerifyEmailLoadingView, VerifyEmailSuccessView } from '@/pages/VerifyEmail/components'

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/auth/verified' })
  const token = search.token as string
  
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading')
  
  const { error, isLoading, isError, isSuccess } = useVerifyEmail(token)

  useEffect(() => {
    if (!token || token.trim() === '') {
      navigate({ to: '/login' })
      return
    }
  }, [token, navigate])

  useEffect(() => {
    if (isSuccess) {
      setVerificationState('success')
    } else if (isError) {
      setVerificationState('error')
      
      if ((error as any)?.status === 404 || (error as any)?.status === 400) {
        const timeout = setTimeout(() => {
          navigate({ to: '/login' })
        }, 5000)
        
        return () => clearTimeout(timeout)
      }
    }
    return undefined
  }, [isSuccess, isError, error, navigate])

  const handleGoToLogin = () => {
    navigate({ to: '/login' })
  }

  const handleResendVerification = () => {
    // Navegar de volta para o registro ou login
    navigate({ to: '/register' })
  }

  // Se não há token, não renderizar nada (será redirecionado)
  if (!token || token.trim() === '') {
    return null
  }

  // Ícone para carregamento
  const loadingIcon = (
    <Box
      sx={{
        width: 48,
        height: 48,
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
      }}
    >
      <Email sx={{ color: 'white', fontSize: 24 }} />
    </Box>
  )

  // Ícone para sucesso
  const successIcon = (
    <Box
      sx={{
        width: 48,
        height: 48,
        background: 'linear-gradient(135deg, #10b981, #059669)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
      }}
    >
      <CheckCircle sx={{ color: 'white', fontSize: 24 }} />
    </Box>
  )

  // Ícone para erro
  const errorIcon = (
    <Box
      sx={{
        width: 48,
        height: 48,
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
      }}
    >
      <ErrorIcon sx={{ color: 'white', fontSize: 24 }} />
    </Box>
  )

  if (verificationState === 'loading' || isLoading) {
    return (
      <AuthContainer
        title="Verificando E-mail"
        subtitle="Aguarde enquanto verificamos seu e-mail..."
        icon={loadingIcon}
      >
        <VerifyEmailLoadingView />
      </AuthContainer>
    )
  }

  if (verificationState === 'success') {
    return (
      <AuthContainer
        title="E-mail Verificado!"
        subtitle="Sua conta foi verificada com sucesso"
        icon={successIcon}
      >
        <VerifyEmailSuccessView onGoToLogin={handleGoToLogin} />
      </AuthContainer>
    )
  }

  return (
    <AuthContainer
      title="Erro na Verificação"
      subtitle="Não foi possível verificar seu e-mail"
      icon={errorIcon}
    >
      <VerifyEmailErrorView 
        error={error}
        onGoToLogin={handleGoToLogin}
        onResendVerification={handleResendVerification}
        autoRedirect={(error as any)?.status === 404 || (error as any)?.status === 400}
      />
    </AuthContainer>
  )
} 