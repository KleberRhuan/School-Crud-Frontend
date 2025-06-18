import { UseFormReturn } from 'react-hook-form'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
} from '@mui/material'
import {
  ArrowBack,
  Email,
  Send,
} from '@mui/icons-material'
import { Link as RouterLink } from '@tanstack/react-router'
import { UseMutationResult } from '@tanstack/react-query'

import { ForgotPasswordRequest } from '@/schemas/passwordSchemas'

interface ForgotPasswordFormProps {
  form: UseFormReturn<ForgotPasswordRequest>
  mutation: UseMutationResult<void, Error, ForgotPasswordRequest, unknown>
  onSubmit: (data: ForgotPasswordRequest) => Promise<void>
}

export function ForgotPasswordForm({ 
  form, 
  mutation, 
  onSubmit 
}: Readonly<ForgotPasswordFormProps>) {
  const { register, handleSubmit, formState: { errors, isValid } } = form

  return (
    <>
      {/* Alert de erro da API */}
      {mutation.error && (
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
          {mutation.error?.message || 'Erro ao enviar e-mail. Tente novamente.'}
        </Alert>
      )}

      {/* Formulário */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register('email')}
          fullWidth
          label="E-mail"
          type="email"
          autoComplete="email"
          autoFocus
          error={!!errors.email}
          helperText={errors.email?.message}
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
              startAdornment: <Email sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
            }
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={!isValid || mutation.isPending}
          startIcon={
            mutation.isPending ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              <Send />
            )
          }
          sx={{ 
            mb: 3,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '12px',
            height: '48px',
            fontSize: '16px',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              boxShadow: '0 12px 35px rgba(59, 130, 246, 0.4)',
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.5)',
              boxShadow: 'none',
            }
          }}
        >
          {mutation.isPending ? 'Enviando...' : 'Enviar Instruções'}
        </Button>

        {/* Links */}
        <Box sx={{ textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 1,
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: 'white',
                textDecoration: 'none',
              }
            }}
          >
            <ArrowBack fontSize="small" />
            Voltar ao login
          </Link>
        </Box>
      </Box>
    </>
  )
} 