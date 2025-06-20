import { useQueryClient } from '@tanstack/react-query'
import { useApiQuery } from './useApiQuery.ts'
import {useApiCreate as useApiMutation} from './useApiMutation.ts'
import { createQueryKeys } from '@/config/queryConfig.ts'
import {
  type LoginRequest,
  loginRequestSchema,
  type RegisterRequest,
  registerRequestSchema, TokenResponse
} from '@/schemas/apiSchemas.ts'
import {
  type ForgotPasswordRequest,
  forgotPasswordSchema,
  type ResetPasswordRequest,
  resetPasswordRequestSchema
} from '@/schemas/passwordSchemas.ts'
import { 
  useAuthError, 
  useAuthLoading, 
  useAuthStore, 
  useIsAuthenticated,
  useIsInitialized,
  useUser
} from '@stores/authStore.ts'

const authKeys = createQueryKeys('auth')

/**
 * Hook principal de autenticação - centraliza toda a lógica de auth
 */
export const useAuth = () => {
  const isInitialized = useIsInitialized()
  const isLoading = useAuthLoading()
  const isAuthenticated = useIsAuthenticated()
  const user = useUser()
  const error = useAuthError()
  const authStore = useAuthStore()

  return {
    isReady: isInitialized && !isLoading,
    isLoading,
    isAuthenticated,
    isInitialized,
    user,
    error,
    
    // Ações
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    initialize: authStore.initialize,
    clearSession: authStore.clearSession,
  }
}

/**
 * Hook para 'login' com validação automática e atualização do store
 */
export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useApiMutation<TokenResponse, LoginRequest>('/auth/login', {
    showSuccessToast: 'Login realizado com sucesso!',
    showErrorToast: false,
    onSuccess: (data : TokenResponse) => {
      if (data.accessToken) {
        localStorage.setItem('access_token', data.accessToken)
      }

      void queryClient.invalidateQueries({ queryKey: authKeys.detail('current') })
    },
    onMutate: (variables) => {
      loginRequestSchema.parse(variables)
    }
  })
}

/**
 * Hook para registro com validação automática
 */
export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useApiMutation<unknown, RegisterRequest>('/auth/register', {
    showSuccessToast: 'Conta criada com sucesso!',
    showErrorToast: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.detail('current') })
    },
    onMutate: (variables) => {
      registerRequestSchema.parse(variables)
    }
  })
}

/**
 * Hook para logout com limpeza completa
 */
export const useLogout = () => {
  const queryClient = useQueryClient()
  const clearSession = useAuthStore(state => state.clearSession)
  const clear = () => {
    localStorage.removeItem('access_token')
    clearSession()
    queryClient.clear()
  }
  
  return useApiMutation('/auth/logout', {
    showSuccessToast: 'Logout realizado com sucesso!',
    onSuccess: () => {
      clear()
    },
    onError: () => {
      clear()
    }
  })
}

/**
 * Hook para obter usuário atual com cache otimizado
 */
export const useCurrentUser = () => {
  return useApiQuery(
    authKeys.detail('current'),
    '/auth/me',
    {},
    {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      showErrorToast: false,
    }
  )
}

/**
 * Hook para refresh token (usado internamente pelo axios)
 */
export const useRefreshToken = () => {
  return useApiMutation('/auth/refresh', {
    showErrorToast: false,
    showSuccessToast: false,
  })
}

/**
 * Hook para solicitar reset de senha
 */
export const useForgotPassword = () => {
  return useApiMutation<void, ForgotPasswordRequest>('/auth/password/forgot', {
    showSuccessToast: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.',
    showErrorToast: false,
    onMutate: (variables) => {
      forgotPasswordSchema.parse(variables)
    }
  })
}

/**
 * Hook para validar token de reset
 */
export const useValidateResetToken = (token?: string) => {
  return useApiQuery(
    authKeys.detail(`validate-reset-token-${token}`),
    `/auth/password/reset/token?token=${token}`,
    {},
    {
      enabled: !!token && token.length > 0,
      retry: false,
      staleTime: 0,
      refetchOnWindowFocus: false,
      showErrorToast: false,
    }
  )
}

/**
 * Hook para redefinir senha
 */
export const useResetPassword = () => {
  return useApiMutation<void, ResetPasswordRequest>('/auth/password/reset', {
    showSuccessToast: 'Senha redefinida com sucesso! Você pode fazer login com sua nova senha.',
    showErrorToast: false,
    onMutate: (variables) => {
      resetPasswordRequestSchema.parse(variables)
    }
  })
}

/**
 * Hook para verificar email
 */
export const useVerifyEmail = (token?: string) => {
  return useApiQuery(
    authKeys.detail(`verify-email-${token}`),
    `/auth/verify?token=${token}`,
    {},
    {
      enabled: !!token && token.length > 0,
      retry: false,
      staleTime: 0,
      refetchOnWindowFocus: false,
      showErrorToast: false,
    }
  )
}

/**
 * Hook composto para o fluxo de reset de senha
 */
export const usePasswordResetFlow = () => {
  const forgotPassword = useForgotPassword()
  const resetPassword = useResetPassword()
  
  return {
    // Mutations
    forgotPassword,
    resetPassword,
    
    // Estado
    isProcessing: forgotPassword.isPending || resetPassword.isPending,
    error: forgotPassword.error || resetPassword.error,
  }
}

/**
 * Função para inicializar sessão (compatibilidade com router)
 */
export const initializeSession = async (): Promise<void> => {
  const store = useAuthStore.getState()
  await store.initialize()
}