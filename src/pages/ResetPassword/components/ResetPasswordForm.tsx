import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import {
  Alert,
  Box,
} from '@mui/material'

import { ResetPasswordFormData, resetPasswordFormSchema } from '@/schemas/passwordSchemas'
import { useResetPassword } from '@/hooks'
import { ResetPasswordActions, ResetPasswordFields } from '.'

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: Readonly<ResetPasswordFormProps>) {
  const navigate = useNavigate()
  const resetPasswordMutation = useResetPassword()

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: 'onChange',
    defaultValues: {
      token,
    },
  })

  const { handleSubmit, formState: { isValid }, watch } = form
  const newPassword = watch('newPassword') ?? ''

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPasswordMutation.mutateAsync({
        token: data.token,
        newPassword: data.newPassword,
      })
      
      navigate({ to: '/login' })
    } catch {
      // Error handling já é feito pelo mutation
    }
  }

  return (
    <>
      {/* Alert de erro da API */}
      {resetPasswordMutation.error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            borderColor: 'rgba(244, 67, 54, 0.3)',
            color: 'white',
            borderRadius: '12px',
            '& .MuiAlert-icon': {
              color: '#ef5350'
            }
          }}
        >
          {resetPasswordMutation.error?.message || 'Erro ao redefinir senha. Tente novamente.'}
        </Alert>
      )}

      {/* Formulário */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <ResetPasswordFields form={form} newPassword={newPassword} />
        <ResetPasswordActions 
          isValid={isValid} 
          isPending={resetPasswordMutation.isPending} 
        />
      </Box>
    </>
  )
} 