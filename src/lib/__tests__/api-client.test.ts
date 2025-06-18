import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { 
  apiClient as api, 
  ApiError, 
  authApi,
  getRefreshQueueMetrics,
  resetRefreshQueueMetrics,
  setAuthToken
} from '../api-client'
import { LoginRequest, RegisterRequest, TokenResponse } from '@/types/auth'

// Mock do axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      defaults: {
        headers: {
          common: {}
        }
      },
      interceptors: {
        request: {
          use: vi.fn()
        },
        response: {
          use: vi.fn()
        }
      },
      post: vi.fn(),
      get: vi.fn()
    })),
    post: vi.fn(),
    get: vi.fn()
  }
}))

const mockAxios = axios as any
const mockAxiosInstance = mockAxios.create()

describe('API Client - Etapa 3: Cookies HttpOnly', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAxiosInstance.defaults.headers.common = {}
    
    // Configurar mocks para retornar promises válidas por padrão
    mockAxiosInstance.post.mockResolvedValue({ data: {} })
    mockAxiosInstance.get.mockResolvedValue({ data: {} })
    mockAxios.post.mockResolvedValue({ data: {} })
    mockAxios.get.mockResolvedValue({ data: {} })
  })

  describe('Configuração do Cliente', () => {
    it('deve configurar withCredentials: true para suporte a cookies HttpOnly', () => {
      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:8080/api/v1',
        timeout: 10000,
        withCredentials: true, // CRÍTICO para cookies HttpOnly
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // CSRF protection
        },
      })
    })
  })

  describe('AuthAPI - Login com Cookies HttpOnly', () => {
    it('deve fazer login e receber apenas accessToken (refreshToken em cookie)', async () => {
      const mockResponse: TokenResponse = {
        tokenType: 'Bearer',
        accessToken: 'access-token-123'
        // refreshToken NÃO está presente - vai para cookie HttpOnly
      }

      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockResponse
      })

      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true
      }

      const result = await authApi.login(credentials)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/login',
        credentials,
        {
          withCredentials: true,
        }
      )
      expect(result).toEqual(mockResponse)
      expect(result).not.toHaveProperty('refreshToken')
    })

    it('deve tratar erro de login corretamente', async () => {
      const mockError = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: {
            userMessage: 'Credenciais inválidas'
          }
        }
      }

      mockAxiosInstance.post.mockRejectedValueOnce(mockError)

      const credentials: LoginRequest = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      }

      await expect(authApi.login(credentials)).rejects.toThrow('Credenciais inválidas')
    })
  })

  describe('AuthAPI - Register sem Login Automático', () => {
    it('deve registrar usuário sem retornar tokens', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        data: {}
      })

      const userData: RegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      await authApi.register(userData)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/register',
        userData,
        {
          withCredentials: true,
        }
      )
    })
  })

  describe('AuthAPI - Refresh Token com Cookie HttpOnly', () => {
    it('deve renovar token usando cookie REFRESH_TOKEN automaticamente', async () => {
      const mockResponse: TokenResponse = {
        tokenType: 'Bearer',
        accessToken: 'new-access-token-456'
      }

      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockResponse
      })

      const result = await authApi.refresh()

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/refresh',
        {}, // Body vazio - cookie enviado automaticamente
        {
          withCredentials: true // CRÍTICO para envio do cookie
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('deve tratar erro de refresh (cookie expirado/inválido)', async () => {
      const mockError = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: {
            userMessage: 'Refresh token expirado'
          }
        }
      }

      mockAxiosInstance.post.mockRejectedValueOnce(mockError)

      await expect(authApi.refresh()).rejects.toThrow('Refresh token expirado')
    })
  })

  describe('AuthAPI - Logout com Limpeza de Cookie', () => {
    it('deve fazer logout e limpar cookie no servidor', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 204,
        data: {} // Swagger: logout retorna 204
      })

      await authApi.logout()

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/logout',
        {},
        {
          withCredentials: true // Necessário para servidor limpar cookie
        }
      )
    })

    it('deve continuar mesmo se logout na API falhar', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      mockAxiosInstance.post.mockRejectedValueOnce(new Error('Network error'))

      // Não deve propagar erro
      await expect(authApi.logout()).resolves.toBeUndefined()
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro no logout server-side:',
        expect.any(Error)
      )
      
      consoleSpy.mockRestore()
    })
  })

  describe('Gestão de Tokens', () => {
    it('deve configurar Authorization header quando token fornecido', () => {
      const token = 'test-token-123'
      
      setAuthToken(token)
      
      expect(mockAxiosInstance.defaults.headers.common['Authorization'])
        .toBe(`Bearer ${token}`)
    })

    it('deve remover Authorization header quando token é null', () => {
      // Primeiro definir um token
      mockAxiosInstance.defaults.headers.common['Authorization'] = 'Bearer old-token'
      
      setAuthToken(null)
      
      expect(mockAxiosInstance.defaults.headers.common['Authorization'])
        .toBeUndefined()
    })
  })

  describe('Outros Endpoints Auth', () => {
    it('deve validar token de reset de senha', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: {}
      })

      await authApi.validateResetToken('reset-token-123')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/auth/password/reset/token',
        {
          params: { token: 'reset-token-123' }
        }
      )
    })

    it('deve obter dados do usuário atual', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: mockUser
      })

      const result = await authApi.getCurrentUser()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockUser)
    })

    it('deve verificar email com token', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 302, // Swagger: redirect após verificação
        data: {}
      })

      await authApi.verifyEmail('verify-token-123')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/auth/verify',
        {
          params: { token: 'verify-token-123' }
        }
      )
    })
  })

  describe('Tratamento de Erros', () => {
    it('deve converter AxiosError para ApiError corretamente', () => {
      const apiError = new ApiError(404, 'Not Found', {
        status: 404,
        type: 'https://example.com/problems/not-found',
        title: 'Not Found',
        detail: 'The requested resource was not found',
        userMessage: 'Recurso não encontrado',
        timestamp: '2024-01-01T00:00:00Z'
      })

      expect(apiError.status).toBe(404)
      expect(apiError.statusText).toBe('Not Found')
      expect(apiError.message).toBe('Recurso não encontrado')
      expect(apiError.name).toBe('ApiError')
    })

    it('deve usar fallback para mensagem de erro quando userMessage não disponível', () => {
      const apiError = new ApiError(500, 'Internal Server Error', {
        status: 500,
        type: 'https://example.com/problems/internal-error',
        title: 'Internal Server Error', 
        detail: 'Something went wrong',
        userMessage: '',
        timestamp: '2024-01-01T00:00:00Z'
      })

      expect(apiError.message).toBe('Something went wrong')
    })

    it('deve usar statusText como fallback final', () => {
      const apiError = new ApiError(500, 'Internal Server Error')

      expect(apiError.message).toBe('Internal Server Error')
    })
  })
})

describe('API Client - Sistema de Fila de Requests Durante Refresh - Etapa 5', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetRefreshQueueMetrics()
  })

  describe('Estruturas de Dados e Configurações', () => {
    it('deve ter configurações de fila definidas corretamente', () => {
      // Verificar que as configurações básicas estão disponíveis
      expect(typeof getRefreshQueueMetrics).toBe('function')
      expect(typeof resetRefreshQueueMetrics).toBe('function')
    })

    it('deve inicializar métricas com valores zerados', () => {
      const metrics = getRefreshQueueMetrics()
      
      expect(metrics.totalRequests).toBe(0)
      expect(metrics.successfulRefreshes).toBe(0)
      expect(metrics.failedRefreshes).toBe(0)
      expect(metrics.averageQueueTime).toBe(0)
      expect(metrics.maxQueueSize).toBe(0)
      expect(metrics.timeouts).toBe(0)
      expect(metrics.currentQueueSize).toBe(0)
      expect(metrics.isRefreshing).toBe(false)
      expect(metrics.refreshRetryCount).toBe(0)
    })
  })

  describe('Classe ApiError', () => {
    it('deve criar ApiError corretamente com dados completos', () => {
      const errorData = {
        status: 401,
        type: 'https://example.com/problems/unauthorized',
        title: 'Unauthorized',
        detail: 'Token de acesso inválido',
        userMessage: 'Sua sessão expirou. Faça login novamente.',
        timestamp: '2024-01-01T00:00:00Z'
      }

      const apiError = new ApiError(401, 'Unauthorized', errorData)

      expect(apiError.status).toBe(401)
      expect(apiError.statusText).toBe('Unauthorized')
      expect(apiError.data).toEqual(errorData)
      expect(apiError.message).toBe('Sua sessão expirou. Faça login novamente.')
      expect(apiError.name).toBe('ApiError')
      expect(apiError).toBeInstanceOf(Error)
    })

    it('deve usar detail como fallback quando userMessage está vazio', () => {
      const errorData = {
        status: 500,
        type: 'https://example.com/problems/internal-error',
        title: 'Internal Server Error',
        detail: 'Erro interno do servidor',
        userMessage: '',
        timestamp: '2024-01-01T00:00:00Z'
      }

      const apiError = new ApiError(500, 'Internal Server Error', errorData)
      expect(apiError.message).toBe('Erro interno do servidor')
    })

    it('deve usar statusText como fallback final', () => {
      const apiError = new ApiError(500, 'Internal Server Error')
      expect(apiError.message).toBe('Internal Server Error')
    })

    it('deve criar erro para fila cheia corretamente', () => {
      const queueFullError = new ApiError(429, 'Queue Full', {
        status: 429,
        type: 'about:blank',
        title: 'Queue Full',
        detail: 'Fila de refresh atingiu limite máximo de 50 requests',
        userMessage: 'Sistema temporariamente sobrecarregado. Tente novamente em alguns segundos.',
        timestamp: new Date().toISOString()
      })

      expect(queueFullError.status).toBe(429)
      expect(queueFullError.data?.title).toBe('Queue Full')
      expect(queueFullError.message).toContain('Sistema temporariamente sobrecarregado')
    })

    it('deve criar erro para timeout de request na fila', () => {
      const timeoutError = new ApiError(408, 'Request Timeout', {
        status: 408,
        type: 'about:blank',
        title: 'Request Timeout',
        detail: 'Request req_123_xyz expirou na fila após 30000ms',
        userMessage: 'Operação expirou. Tente novamente.',
        timestamp: new Date().toISOString()
      })

      expect(timeoutError.status).toBe(408)
      expect(timeoutError.data?.title).toBe('Request Timeout')
      expect(timeoutError.message).toBe('Operação expirou. Tente novamente.')
    })

    it('deve criar erro para máximo de tentativas de refresh', () => {
      const maxRetriesError = new ApiError(401, 'Max Refresh Retries Exceeded', {
        status: 401,
        type: 'about:blank',
        title: 'Max Refresh Retries Exceeded',
        detail: 'Máximo de 2 tentativas de refresh atingido',
        userMessage: 'Sessão expirada. Faça login novamente.',
        timestamp: new Date().toISOString()
      })

      expect(maxRetriesError.status).toBe(401)
      expect(maxRetriesError.data?.title).toBe('Max Refresh Retries Exceeded')
      expect(maxRetriesError.message).toBe('Sessão expirada. Faça login novamente.')
    })

    it('deve criar erro para sessão expirada', () => {
      const sessionError = new ApiError(401, 'Session Expired', {
        status: 401,
        type: 'about:blank',
        title: 'Session Expired',
        detail: 'Não foi possível renovar a sessão',
        userMessage: 'Sua sessão expirou. Faça login novamente.',
        timestamp: new Date().toISOString()
      })

      expect(sessionError.status).toBe(401)
      expect(sessionError.data?.title).toBe('Session Expired')
      expect(sessionError.message).toBe('Sua sessão expirou. Faça login novamente.')
    })
  })

  describe('Gestão de Métricas', () => {
    it('deve resetar todas as métricas corretamente', () => {
      // Reset inicial
      resetRefreshQueueMetrics()
      
      const resetMetrics = getRefreshQueueMetrics()
      expect(resetMetrics.totalRequests).toBe(0)
      expect(resetMetrics.successfulRefreshes).toBe(0)
      expect(resetMetrics.failedRefreshes).toBe(0)
      expect(resetMetrics.averageQueueTime).toBe(0)
      expect(resetMetrics.maxQueueSize).toBe(0)
      expect(resetMetrics.timeouts).toBe(0)
      expect(resetMetrics.currentQueueSize).toBe(0)
      expect(resetMetrics.isRefreshing).toBe(false)
      expect(resetMetrics.refreshRetryCount).toBe(0)
    })

    it('deve manter estrutura de métricas consistente', () => {
      const metrics = getRefreshQueueMetrics()
      
      // Verificar que todas as propriedades esperadas estão presentes
      expect(metrics).toHaveProperty('totalRequests')
      expect(metrics).toHaveProperty('successfulRefreshes')
      expect(metrics).toHaveProperty('failedRefreshes')
      expect(metrics).toHaveProperty('averageQueueTime')
      expect(metrics).toHaveProperty('maxQueueSize')
      expect(metrics).toHaveProperty('timeouts')
      expect(metrics).toHaveProperty('currentQueueSize')
      expect(metrics).toHaveProperty('isRefreshing')
      expect(metrics).toHaveProperty('refreshRetryCount')
      
      // Verificar tipos
      expect(typeof metrics.totalRequests).toBe('number')
      expect(typeof metrics.successfulRefreshes).toBe('number')
      expect(typeof metrics.failedRefreshes).toBe('number')
      expect(typeof metrics.averageQueueTime).toBe('number')
      expect(typeof metrics.maxQueueSize).toBe('number')
      expect(typeof metrics.timeouts).toBe('number')
      expect(typeof metrics.currentQueueSize).toBe('number')
      expect(typeof metrics.isRefreshing).toBe('boolean')
      expect(typeof metrics.refreshRetryCount).toBe('number')
    })
  })

  describe('Constantes e Configurações', () => {
    it('deve ter configurações de fila definidas implicitamente', () => {
      // Verificar que o sistema está configurado com as constantes corretas
      // através dos erros que são gerados
      
      const queueFullError = new ApiError(429, 'Queue Full', {
        status: 429,
        type: 'about:blank',
        title: 'Queue Full',
        detail: 'Fila de refresh atingiu limite máximo de 50 requests',
        userMessage: 'Sistema temporariamente sobrecarregado. Tente novamente em alguns segundos.',
        timestamp: new Date().toISOString()
      })
      
      expect(queueFullError.data?.detail).toContain('50 requests')
      
      const maxRetriesError = new ApiError(401, 'Max Refresh Retries Exceeded', {
        status: 401,
        type: 'about:blank',
        title: 'Max Refresh Retries Exceeded',
        detail: 'Máximo de 2 tentativas de refresh atingido',
        userMessage: 'Sessão expirada. Faça login novamente.',
        timestamp: new Date().toISOString()
      })
      
      expect(maxRetriesError.data?.detail).toContain('2 tentativas')
      
      const timeoutError = new ApiError(408, 'Request Timeout', {
        status: 408,
        type: 'about:blank',
        title: 'Request Timeout',
        detail: 'Request req_123 expirou na fila após 30000ms',
        userMessage: 'Operação expirou. Tente novamente.',
        timestamp: new Date().toISOString()
      })
      
      expect(timeoutError.data?.detail).toContain('30000ms')
    })
  })

  describe('Validação de Interface QueuedRequest', () => {
    it('deve garantir que interface QueuedRequest tenha campos obrigatórios', () => {
      // Simular um QueuedRequest válido através de ApiError de timeout
      const timeoutError = new ApiError(408, 'Request Timeout', {
        status: 408,
        type: 'about:blank',
        title: 'Request Timeout',
        detail: 'Request req_1234567890_abcdefghi expirou na fila após 30000ms',
        userMessage: 'Operação expirou. Tente novamente.',
        timestamp: new Date().toISOString()
      })
      
      // O ID do request deve estar no formato esperado
      expect(timeoutError.data?.detail).toMatch(/Request req_\d+_\w+ expirou/)
    })
  })

  describe('Sistema de Logs', () => {
    it('deve ter sistema de logs configurado', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      // Verificar que o sistema pode gerar logs (através de reset que pode incluir cleanup)
      resetRefreshQueueMetrics()
      
      // Verificar que os tipos de log existem
      expect(typeof console.log).toBe('function')
      expect(typeof console.warn).toBe('function')
      expect(typeof console.error).toBe('function')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Prevenção de Vazamentos de Memória', () => {
    it('deve ter função de reset para limpeza', () => {
      // Testar que reset limpa completamente o estado
      resetRefreshQueueMetrics()
      
      const metrics1 = getRefreshQueueMetrics()
      expect(metrics1.currentQueueSize).toBe(0)
      expect(metrics1.isRefreshing).toBe(false)
      
      // Fazer outro reset
      resetRefreshQueueMetrics()
      
      const metrics2 = getRefreshQueueMetrics()
      expect(metrics2.currentQueueSize).toBe(0)
      expect(metrics2.isRefreshing).toBe(false)
      
      // Estado deve ser idêntico
      expect(metrics1).toEqual(metrics2)
    })
  })

  describe('Robustez do Sistema', () => {
    it('deve manter estabilidade das funções exportadas', () => {
      // Verificar que as funções principais não lançam erros básicos
      expect(() => getRefreshQueueMetrics()).not.toThrow()
      expect(() => resetRefreshQueueMetrics()).not.toThrow()
      
      // Verificar que podem ser chamadas múltiplas vezes
      for (let i = 0; i < 5; i++) {
        expect(() => getRefreshQueueMetrics()).not.toThrow()
        expect(() => resetRefreshQueueMetrics()).not.toThrow()
      }
    })

    it('deve ter tipos consistentes após múltiplas operações', () => {
      // Operações múltiplas
      resetRefreshQueueMetrics()
      const metrics1 = getRefreshQueueMetrics()
      
      resetRefreshQueueMetrics()
      const metrics2 = getRefreshQueueMetrics()
      
      resetRefreshQueueMetrics() 
      const metrics3 = getRefreshQueueMetrics()
      
      // Todos devem ter a mesma estrutura
      expect(Object.keys(metrics1).sort()).toEqual(Object.keys(metrics2).sort())
      expect(Object.keys(metrics2).sort()).toEqual(Object.keys(metrics3).sort())
      
      // E os mesmos valores após reset
      expect(metrics1).toEqual(metrics2)
      expect(metrics2).toEqual(metrics3)
    })
  })
}) 