import React from 'react'
import { Checkbox, FormControlLabel, IconButton, InputAdornment, TextField } from '@mui/material'
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material'
import { LoginRequest } from '@/schemas/apiSchemas'

interface LoginFieldsProps {
  formData: LoginRequest
  showPassword: boolean
  isLoading: boolean
  onTogglePassword: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const inputStyles = {
  mb: 2,
  '& .MuiOutlinedInput-root': {
    color: 'white',
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
      borderWidth: '1px'
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#3b82f6',
    },
  },
}

export function LoginFields({ 
  formData, 
  showPassword, 
  isLoading, 
  onTogglePassword, 
  onChange 
}: LoginFieldsProps) {
  return (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={onChange}
        disabled={isLoading}
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlined sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </InputAdornment>
            ),
          }
        }}
        sx={inputStyles}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={onChange}
        disabled={isLoading}
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onTogglePassword}
                  edge="end"
                  sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }
        }}
        sx={{ ...inputStyles, mb: 2 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            name="rememberMe"
            checked={formData.rememberMe || false}
            onChange={onChange}
            disabled={isLoading}
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              '&.Mui-checked': {
                color: '#3b82f6',
              },
              '&.Mui-disabled': {
                color: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          />
        }
        label="Mantenha me conectado"
        sx={{
          color: 'rgba(255, 255, 255, 0.8)',
          mb: 2,
          '& .MuiFormControlLabel-label': {
            fontSize: '14px',
            fontWeight: 400,
          },
          '&.Mui-disabled .MuiFormControlLabel-label': {
            color: 'rgba(255, 255, 255, 0.3)',
          }
        }}
      />
    </>
  )
} 