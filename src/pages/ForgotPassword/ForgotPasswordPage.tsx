import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@mui/material'
import { CheckCircle, Email } from '@mui/icons-material'

import { ForgotPasswordRequest, forgotPasswordSchema } from '@/schemas/passwordSchemas'
import { useForgotPassword } from '@/hooks'
import { AuthContainer } from '@/components/Auth'
import { ForgotPasswordForm, ForgotPasswordSuccessView } from './components'

export function ForgotPasswordPage() {
  const [showSuccess, setShowSuccess] = useState(false)
  const forgotPasswordMutation = useForgotPassword()

  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  })

  const email = form.watch('email')

  const onSubmit = async (data: ForgotPasswordRequest) => {
    try {
      await forgotPasswordMutation.mutateAsync(data)
      setShowSuccess(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleResendEmail = () => {
    setShowSuccess(false)
  }

  // Ícone para o formulário de esqueci senha
  const forgotPasswordIcon = (
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

  // Ícone para o estado de sucesso
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

  if (showSuccess) {
    return (
      <AuthContainer
        title="E-mail Enviado!"
        subtitle="Verifique sua caixa de entrada para continuar"
        icon={successIcon}
      >
        <ForgotPasswordSuccessView
          email={email}
          onResendEmail={handleResendEmail}
          isResending={forgotPasswordMutation.isPending}
        />
      </AuthContainer>
    )
  }

  return (
    <AuthContainer
      title="Esqueci minha senha"
      subtitle="Digite seu e-mail para receber as instruções de redefinição de senha"
      icon={forgotPasswordIcon}
    >
      <ForgotPasswordForm
        form={form}
        mutation={forgotPasswordMutation}
        onSubmit={onSubmit}
      />
    </AuthContainer>
  )
} 