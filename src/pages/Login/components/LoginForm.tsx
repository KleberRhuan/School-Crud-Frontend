import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Box } from '@mui/material'
import { useAuthError, useAuthLoading, useLogin } from '@/stores/authStore'
import { LoginFields } from './LoginFields'
import { LoginButton } from './LoginButton'
import { ForgotPasswordLink } from './ForgotPasswordLink'
import { LoginRequest } from '@/schemas/apiSchemas'

interface LoginFormProps {
  redirectPath?: string | undefined
}

export function LoginForm({ redirectPath }: LoginFormProps) {
  const navigate = useNavigate()
  const login = useLogin()
  const error = useAuthError()
  const isLoading = useAuthLoading()
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      console.log('🔐 Tentando fazer login...')
      await login(formData)
      
      const targetPath = redirectPath ?? '/dashboard'
      console.log('✅ Login realizado com sucesso, redirecionando para:', targetPath)
      
      navigate({ 
        to: targetPath,
        replace: true
      })
    } catch (error) {
      console.error('❌ Erro no login:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target
    setFormData((prev: LoginRequest) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
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

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <LoginFields
          formData={formData}
          showPassword={showPassword}
          isLoading={isLoading}
          onTogglePassword={handleTogglePassword}
          onChange={handleChange}
        />

        <LoginButton isLoading={isLoading} />
        
        <ForgotPasswordLink />
      </Box>
    </>
  )
} 