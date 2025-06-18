import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Checkbox, FormControlLabel, Link, Typography } from '@mui/material'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

interface RegisterTermsProps {
  register: UseFormRegister<RegisterFormData>
  errors: FieldErrors<RegisterFormData>
  isLoading: boolean
}

export function RegisterTerms({ register, errors, isLoading }: RegisterTermsProps) {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            {...register('terms')}
            disabled={isLoading}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-checked': {
                color: '#10b981',
              },
            }}
          />
        }
        label={
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Aceito os{' '}
            <Link href="#" sx={{ color: '#10b981', textDecoration: 'none' }}>
              termos de uso
            </Link>{' '}
            e{' '}
            <Link href="#" sx={{ color: '#10b981', textDecoration: 'none' }}>
              política de privacidade
            </Link>
          </Typography>
        }
        sx={{ mb: 3 }}
      />

      {errors.terms && (
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(244, 67, 54, 0.8)',
            display: 'block',
            mb: 2,
            mt: -2
          }}
        >
          {errors.terms.message}
        </Typography>
      )}
    </>
  )
} 