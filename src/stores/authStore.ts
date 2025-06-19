import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'
import { authApi, setAuthToken } from '@/lib/api-client'
import { runWithLoading } from './utils'
import {LoginRequest, RegisterRequest} from "@/schemas/apiSchemas.ts";
import {AuthState} from "@/types";

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => {
        const runAsync = runWithLoading<AuthState>(set)

        return {
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          isInitialized: false,

          login: async (credentials: LoginRequest) => {
            return runAsync(async () => {
              const response = await authApi.login(credentials)
              const { accessToken } = response

              setAuthToken(accessToken)
              const user = await authApi.getCurrentUser()

              set((state) => {
                state.accessToken = accessToken
                state.user = user
                state.isAuthenticated = true
              })

            })
          },

          register: async (data: RegisterRequest) => {
            return runAsync(async () => {
              await authApi.register(data)

            })
          },

          logout: async () => {
            return runAsync(async () => {
              try {
                await authApi.logout()
                
              } catch (error) {
              } finally {
                setAuthToken(null)
                set((state) => {
                  state.user = null
                  state.accessToken = null
                  state.isAuthenticated = false
                })
                
              }
            })
          },

          refreshToken: async () => {
            try {
              // Renovando token usando cookie HttpOnly...

              const response = await authApi.refresh()
              const { accessToken } = response

              setAuthToken(accessToken)
              set((state) => {
                state.accessToken = accessToken
                state.error = null
              })
              
            } catch (error) {
              
              get().clearSession()
              throw error
            }
          },

          initialize: async () => {
            try {
              set((state) => {
                state.isLoading = true
              })

              await get().refreshToken()
              const user = await authApi.getCurrentUser()

              set((state) => {
                state.user = user
                state.isAuthenticated = true
                state.isInitialized = true
                state.isLoading = false
              })

            } catch {
              
              set((state) => {
                state.user = null
                state.accessToken = null
                state.isAuthenticated = false
                state.isInitialized = true
                state.isLoading = false
              })
              setAuthToken(null)
            }
          },

          setUser: (user) =>
            set((state) => {
              state.user = user
              state.isAuthenticated = true
              state.error = null
            }),

          setAccessToken: (token) =>
            set((state) => {
              state.accessToken = token
              if (token) {
                setAuthToken(token)
              } else {
                setAuthToken(null)
                state.isAuthenticated = false
              }
            }),

          setLoading: (loading) =>
            set((state) => {
              state.isLoading = loading
            }),

          setError: (error) =>
            set((state) => {
              state.error = error
            }),

          clearSession: () => {
            setAuthToken(null)
            set((state) => {
              state.user = null
              state.accessToken = null
              state.isAuthenticated = false
              state.error = null
              state.isLoading = false
            })
          },
        }}),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          isInitialized: state.isInitialized,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)

export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)
export const useIsInitialized = () => useAuthStore((state) => state.isInitialized)

export const useAuthStatus = () =>
  useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
      isInitialized: state.isInitialized,
    }))
  )

export const useLogin = () => useAuthStore((state) => state.login)
export const useRegister = () => useAuthStore((state) => state.register)
export const useLogout = () => useAuthStore((state) => state.logout)

export const useUserInfo = () =>
  useAuthStore(
    useShallow((state) => ({
      email: state.user?.email,
      name: state.user?.name,
      id: state.user?.id,
    }))
  )

export const useUserEmail = () => useAuthStore((state) => state.user?.email)
export const useUserName = () => useAuthStore((state) => state.user?.name) 