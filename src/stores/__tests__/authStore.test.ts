import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAuthStore } from '../authStore'
import { authApi } from '@/lib/api-client'
import { LoginRequest, RegisterRequest, User } from '@/types/auth'

vi.mock('@/lib/api-client', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    getCurrentUser: vi.fn(),
  },
  setAuthToken: vi.fn(),
  ApiError: class ApiError extends Error {
    constructor(public status: number, public statusText: string, public data?: any) {
      super(data?.userMessage || data?.detail || statusText)
      this.name = 'ApiError'
    }
  },
}))

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('AuthStore', () => {
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  const mockLoginRequest: LoginRequest = {
    email: 'test@example.com',
    password: 'password123',
    rememberMe: false,
  }

  const mockRegisterRequest: RegisterRequest = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    
    // Reset store state
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Estado inicial', () => {
    it('deve ter estado inicial correto', () => {
      const { result } = renderHook(() => useAuthStore())

      expect(result.current.user).toBeNull()
      expect(result.current.accessToken).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.isInitialized).toBe(false)
    })
  })

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const mockTokenResponse = {
        tokenType: 'Bearer',
        accessToken: 'mock-access-token',
      }

      vi.mocked(authApi.login).mockResolvedValueOnce(mockTokenResponse)
      vi.mocked(authApi.getCurrentUser).mockResolvedValueOnce(mockUser)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.login(mockLoginRequest)
      })

      expect(authApi.login).toHaveBeenCalledWith(mockLoginRequest)
      expect(authApi.getCurrentUser).toHaveBeenCalled()
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.accessToken).toBe('mock-access-token')
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('deve tratar erro de login', async () => {
      const mockError = new Error('Credenciais inválidas')
      vi.mocked(authApi.login).mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        try {
          await result.current.login(mockLoginRequest)
        } catch (error) {
          // Esperado
        }
      })

      expect(result.current.user).toBeNull()
      expect(result.current.accessToken).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('Credenciais inválidas')
    })
  })

  describe('register', () => {
    it('deve registrar e fazer login automaticamente', async () => {
      const mockTokenResponse = {
        tokenType: 'Bearer',
        accessToken: 'mock-access-token',
      }

      vi.mocked(authApi.register).mockResolvedValueOnce()
      vi.mocked(authApi.login).mockResolvedValueOnce(mockTokenResponse)
      vi.mocked(authApi.getCurrentUser).mockResolvedValueOnce(mockUser)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.register(mockRegisterRequest)
      })

      expect(authApi.register).toHaveBeenCalledWith(mockRegisterRequest)
      expect(authApi.login).toHaveBeenCalledWith({
        email: mockRegisterRequest.email,
        password: mockRegisterRequest.password,
      })
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('deve tratar erro de registro', async () => {
      const mockError = new Error('Email já existe')
      vi.mocked(authApi.register).mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        try {
          await result.current.register(mockRegisterRequest)
        } catch (error) {
          // Esperado
        }
      })

      expect(result.current.error).toBe('Email já existe')
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('deve fazer logout com sucesso', async () => {
      // Configurar estado inicial autenticado
      useAuthStore.setState({
        user: mockUser,
        accessToken: 'mock-token',
        isAuthenticated: true,
      })

      vi.mocked(authApi.logout).mockResolvedValueOnce()

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.logout()
      })

      expect(authApi.logout).toHaveBeenCalled()
      expect(result.current.user).toBeNull()
      expect(result.current.accessToken).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('deve limpar sessão mesmo se API falhar', async () => {
      // Configurar estado inicial autenticado
      useAuthStore.setState({
        user: mockUser,
        accessToken: 'mock-token',
        isAuthenticated: true,
      })

      vi.mocked(authApi.logout).mockRejectedValueOnce(new Error('API Error'))

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.logout()
      })

      // Deve limpar sessão local mesmo com erro na API
      expect(result.current.user).toBeNull()
      expect(result.current.accessToken).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('refreshToken', () => {
    it('deve renovar token com sucesso', async () => {
      const mockTokenResponse = {
        tokenType: 'Bearer',
        accessToken: 'new-access-token',
      }

      vi.mocked(authApi.refresh).mockResolvedValueOnce(mockTokenResponse)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.refreshToken()
      })

      expect(authApi.refresh).toHaveBeenCalled()
      expect(result.current.accessToken).toBe('new-access-token')
      expect(result.current.error).toBeNull()
    })

    it('deve limpar sessão se refresh falhar', async () => {
      // Configurar estado inicial autenticado
      useAuthStore.setState({
        user: mockUser,
        accessToken: 'old-token',
        isAuthenticated: true,
      })

      vi.mocked(authApi.refresh).mockRejectedValueOnce(new Error('Refresh failed'))

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        try {
          await result.current.refreshToken()
        } catch (error) {
          // Esperado
        }
      })

      expect(result.current.user).toBeNull()
      expect(result.current.accessToken).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('initialize', () => {
    it('deve inicializar sessão com sucesso', async () => {
      const mockTokenResponse = {
        tokenType: 'Bearer',
        accessToken: 'refreshed-token',
      }

      vi.mocked(authApi.refresh).mockResolvedValueOnce(mockTokenResponse)
      vi.mocked(authApi.getCurrentUser).mockResolvedValueOnce(mockUser)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.initialize()
      })

      expect(authApi.refresh).toHaveBeenCalled()
      expect(authApi.getCurrentUser).toHaveBeenCalled()
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.isInitialized).toBe(true)
    })

    it('deve marcar como não autenticado se inicialização falhar', async () => {
      vi.mocked(authApi.refresh).mockRejectedValueOnce(new Error('No refresh token'))

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.initialize()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.isInitialized).toBe(true)
    })
  })

  describe('Actions de estado', () => {
    it('deve atualizar usuário', () => {
      useAuthStore.setState({ user: mockUser })

      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.updateUser({ name: 'Updated Name' })
      })

      expect(result.current.user?.name).toBe('Updated Name')
      expect(result.current.user?.email).toBe(mockUser.email) // Outros campos mantidos
    })

    it('deve limpar sessão', () => {
      useAuthStore.setState({
        user: mockUser,
        accessToken: 'token',
        isAuthenticated: true,
        error: 'some error',
      })

      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.clearSession()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.accessToken).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })
}) 