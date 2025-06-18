import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearch } from '@tanstack/react-router'
import { Lock } from '@mui/icons-material'
import { Box } from '@mui/material'

import { ResetPasswordFormData, resetPasswordSchema } from '@/schemas/passwordSchemas'
import { useValidateResetToken } from '@/hooks'
import { AuthContainer } from '@/components/Auth'
import {
  InvalidTokenState,
  LoadingState,
  ResetPasswordForm,
} from './components'

export function ResetPasswordPage() {
  const search = useSearch({ from: '/reset-password' })
  const token = search.token || null

  // Validar token imediatamente quando componente montar
  const { 
    data: tokenValidation, 
    isLoading: isValidatingToken, 
    error: tokenError 
  } = useValidateResetToken(token)

  // Form apenas para gerenciar o token
  const { setValue } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      token: token || '',
    },
  })

  // Atualizar token no formulário quando disponível
  useEffect(() => {
    if (token) {
      setValue('token', token)
    }
  }, [token, setValue])

  // Loading state durante validação do token
  if (isValidatingToken) {
    return <LoadingState />
  }

  // Token inválido ou erro
  if (!token || tokenError || (tokenValidation && !tokenValidation.valid)) {
    return <InvalidTokenState tokenValidation={tokenValidation} />
  }

  // Ícone para o formulário de reset
  const resetIcon = (
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
      <Lock sx={{ color: 'white', fontSize: 24 }} />
    </Box>
  )

  // Token válido - mostrar formulário
  return (
    <AuthContainer
      title="Redefinir Senha"
      subtitle="Digite sua nova senha. Ela deve ser forte e segura."
      icon={resetIcon}
    >
      <ResetPasswordForm token={token} />
    </AuthContainer>
  )
} 