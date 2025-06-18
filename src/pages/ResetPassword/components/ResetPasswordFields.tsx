import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import {
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import {
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'

import { ResetPasswordFormData } from '@/schemas/passwordSchemas'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'

interface ResetPasswordFieldsProps {
  form: UseFormReturn<ResetPasswordFormData>
  newPassword: string
}

export function ResetPasswordFields({ form, newPassword }: Readonly<ResetPasswordFieldsProps>) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { register, formState: { errors } } = form

  return (
    <>
      {/* Campo de nova senha */}
      <TextField
        {...register('newPassword')}
        fullWidth
        label="Nova Senha"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        autoFocus
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
        sx={{ 
          mb: 2,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputBase-input': {
            color: 'white',
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
                <Lock sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />
            ),
            endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                      sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
            ),
          },
        }}
      />

      {/* Indicador de força da senha */}
      <PasswordStrengthIndicator password={newPassword} />

      {/* Campo de confirmação */}
      <TextField
        {...register('confirmPassword')}
        fullWidth
        label="Confirmar Nova Senha"
        type={showConfirmPassword ? 'text' : 'password'}
        autoComplete="new-password"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        sx={{ 
          mb: 3,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputBase-input': {
            color: 'white',
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
                <Lock sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />
            ),
            endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                      sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
            ),
          },
        }}
      />
    </>
  )
} 