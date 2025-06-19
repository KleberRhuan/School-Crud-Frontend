import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useAuthError, useAuthLoading, useRegister } from '@/stores/authStore'
import { RegisterRequest, registerRequestSchema } from '@/schemas/apiSchemas'
import { RegisterButton, RegisterContainer, RegisterFields, RegisterFooter, RegisterTerms } from './Register/components'

const registerFormSchema = registerRequestSchema.extend({
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  terms: z.boolean().refine((v) => v, 'Você deve aceitar os termos'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  
  const register = useRegister()
  const isLoading = useAuthLoading()
  const error = useAuthError()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { terms: false },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const registerData: RegisterRequest = {
        name: data.name,
        email: data.email,
        password: data.password,
      }

      await register(registerData)
      
      navigate({ to: '/dashboard' })
    } catch {
      // Error handling já é feito pelo mutation
    }
  }

  const handleTogglePassword = () => setShowPassword(!showPassword)
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  return (
    <RegisterContainer>
      {error && (
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
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <RegisterFields
          register={registerField}
          errors={errors}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          isLoading={isLoading}
          onTogglePassword={handleTogglePassword}
          onToggleConfirmPassword={handleToggleConfirmPassword}
        />

        <RegisterTerms
          register={registerField}
          errors={errors}
          isLoading={isLoading}
        />

        <RegisterButton isLoading={isLoading} />
      </Box>

      <RegisterFooter />
    </RegisterContainer>
  )
} 