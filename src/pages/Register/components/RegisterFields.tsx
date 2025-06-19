import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import { EmailOutlined, LockOutlined, PersonOutlined, Visibility, VisibilityOff } from '@mui/icons-material'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

interface RegisterFieldsProps {
  register: UseFormRegister<RegisterFormData>
  errors: FieldErrors<RegisterFormData>
  showPassword: boolean
  showConfirmPassword: boolean
  isLoading: boolean
  onTogglePassword: () => void
  onToggleConfirmPassword: () => void
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
      borderColor: '#10b981',
      borderWidth: '1px'
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#10b981',
    },
  },
  '& .MuiFormHelperText-root': {
    color: 'rgba(244, 67, 54, 0.8)',
  },
}

export function RegisterFields({ 
  register, 
  errors, 
  showPassword, 
  showConfirmPassword, 
  isLoading,
  onTogglePassword,
  onToggleConfirmPassword
}: RegisterFieldsProps) {
  return (
    <>
      <TextField
        {...register('name')}
        margin="normal"
        required
        fullWidth
        id="name"
        label="Nome"
        autoFocus
        disabled={isLoading}
        error={!!errors.name}
        helperText={errors.name?.message}
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlined sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </InputAdornment>
            ),
          }
        }}
        sx={inputStyles}
      />

      <TextField
        {...register('email')}
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        autoComplete="email"
        disabled={isLoading}
        error={!!errors.email}
        helperText={errors.email?.message}
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
        {...register('password')}
        margin="normal"
        required
        fullWidth
        name="password"
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="new-password"
        disabled={isLoading}
        error={!!errors.password}
        helperText={errors.password?.message}
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
        sx={inputStyles}
      />

      <TextField
        {...register('confirmPassword')}
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirmar Senha"
        type={showConfirmPassword ? 'text' : 'password'}
        id="confirmPassword"
        autoComplete="new-password"
        disabled={isLoading}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
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
                  aria-label="toggle confirm password visibility"
                  onClick={onToggleConfirmPassword}
                  edge="end"
                  sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }
        }}
        sx={{ ...inputStyles, mb: 3 }}
      />
    </>
  )
} 