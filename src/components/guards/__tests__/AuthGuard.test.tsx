import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthGuard, GuestGuard } from '../AuthGuard'

// Mock do AuthStore
const mockUseIsAuthenticated = vi.fn()
const mockUseIsInitialized = vi.fn()
const mockUseAuthLoading = vi.fn()
const mockUseAuthStore = vi.fn()

vi.mock('@/stores/authStore', () => ({
  useIsAuthenticated: () => mockUseIsAuthenticated(),
  useIsInitialized: () => mockUseIsInitialized(),
  useAuthLoading: () => mockUseAuthLoading(),
  useAuthStore: () => mockUseAuthStore(),
}))

// Mock do TanStack Router
const mockUseLocation = vi.fn()
const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => mockUseLocation(),
  Navigate: ({ to }: { to: string }) => (
    <div data-testid="navigate" data-to={to}>
      Redirecting to {to}
    </div>
  ),
}))

// Componentes de teste
const ProtectedComponent = () => <div>Protected Content</div>
const PublicComponent = () => <div>Public Content</div>

describe('AuthGuard - Etapa 4: Middleware de Roteamento', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mocks padrão
    mockUseLocation.mockReturnValue({
      pathname: '/test',
      search: '',
      hash: '',
    })
    
    mockUseAuthStore.mockReturnValue({
      getState: () => ({
        initialize: vi.fn(),
        isInitialized: true,
        isAuthenticated: false,
        isLoading: false,
      }),
    })
  })

  describe('AuthGuard - Proteção de Rotas', () => {
    it('deve mostrar loading durante inicialização', () => {
      // Estado: não inicializado
      mockUseIsInitialized.mockReturnValue(false)
      mockUseIsAuthenticated.mockReturnValue(false)
      mockUseAuthLoading.mockReturnValue(false)

      render(
        <AuthGuard>
          <ProtectedComponent />
        </AuthGuard>
      )

      expect(screen.getByText('Verificando autenticação...')).toBeInTheDocument()
      expect(screen.getByText('Inicializando sessão...')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('deve mostrar loading durante processo de autenticação', () => {
      // Estado: inicializado mas carregando
      mockUseIsInitialized.mockReturnValue(true)
      mockUseIsAuthenticated.mockReturnValue(false)
      mockUseAuthLoading.mockReturnValue(true)

      render(
        <AuthGuard>
          <ProtectedComponent />
        </AuthGuard>
      )

      expect(screen.getByText('Verificando autenticação...')).toBeInTheDocument()
      expect(screen.getByText('Validando credenciais...')).toBeInTheDocument()
    })

    it('deve renderizar conteúdo protegido quando autenticado', async () => {
      // Estado: autenticado
      mockUseIsInitialized.mockReturnValue(true)
      mockUseIsAuthenticated.mockReturnValue(true)
      mockUseAuthLoading.mockReturnValue(false)

      render(
        <AuthGuard>
          <ProtectedComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument()
      })
    })

    it('deve redirecionar para login quando não autenticado', async () => {
      // Estado: não autenticado
      mockUseIsInitialized.mockReturnValue(true)
      mockUseIsAuthenticated.mockReturnValue(false)
      mockUseAuthLoading.mockReturnValue(false)

      render(
        <AuthGuard>
          <ProtectedComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toBeInTheDocument()
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login?redirect=%2Ftest')
      })
    })

    it('deve redirecionar para rota customizada quando especificada', async () => {
      // Estado: não autenticado
      mockUseIsInitialized.mockReturnValue(true)
      mockUseIsAuthenticated.mockReturnValue(false)
      mockUseAuthLoading.mockReturnValue(false)

      render(
        <AuthGuard redirectTo="/custom-login">
          <ProtectedComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/custom-login?redirect=%2Ftest')
      })
    })

    it('deve chamar initialize() quando não inicializado', async () => {
      const mockInitialize = vi.fn().mockResolvedValue(undefined)
      
      mockUseIsInitialized.mockReturnValue(false)
      mockUseIsAuthenticated.mockReturnValue(false)
      mockUseAuthLoading.mockReturnValue(false)
      
      mockUseAuthStore.mockReturnValue({
        getState: () => ({
          initialize: mockInitialize,
          isInitialized: false,
          isAuthenticated: false,
          isLoading: false,
        }),
      })

      render(
        <AuthGuard>
          <ProtectedComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(mockInitialize).toHaveBeenCalledOnce()
      })
    })

    it('deve renderizar fallback customizado quando fornecido', () => {
      mockUseIsInitialized.mockReturnValue(false)
      mockUseIsAuthenticated.mockReturnValue(false)
      mockUseAuthLoading.mockReturnValue(false)

      const CustomFallback = () => <div>Custom Loading...</div>

      render(
        <AuthGuard fallback={<CustomFallback />}>
          <ProtectedComponent />
        </AuthGuard>
      )

      expect(screen.getByText('Custom Loading...')).toBeInTheDocument()
    })
  })

  describe('GuestGuard - Proteção de Páginas Públicas', () => {
    it('deve mostrar loading durante inicialização', () => {
      mockUseIsInitialized.mockReturnValue(false)
      mockUseIsAuthenticated.mockReturnValue(false)
      mockUseAuthLoading.mockReturnValue(false)

      render(
        <GuestGuard>
          <PublicComponent />
        </GuestGuard>
      )

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('deve renderizar conteúdo público quando não autenticado', async () => {
      mockUseIsInitialized.mockReturnValue(true)
      mockUseIsAuthenticated.mockReturnValue(false)
      mockUseAuthLoading.mockReturnValue(false)

      render(
        <GuestGuard>
          <PublicComponent />
        </GuestGuard>
      )

      await waitFor(() => {
        expect(screen.getByText('Public Content')).toBeInTheDocument()
      })
    })

    it('deve redirecionar para dashboard quando autenticado', async () => {
      mockUseIsInitialized.mockReturnValue(true)
      mockUseIsAuthenticated.mockReturnValue(true)
      mockUseAuthLoading.mockReturnValue(false)

      render(
        <GuestGuard>
          <PublicComponent />
        </GuestGuard>
      )

      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toBeInTheDocument()
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/dashboard')
      })
    })

    it('deve redirecionar para rota customizada quando especificada', async () => {
      mockUseIsInitialized.mockReturnValue(true)
      mockUseIsAuthenticated.mockReturnValue(true)
      mockUseAuthLoading.mockReturnValue(false)

      render(
        <GuestGuard redirectTo="/custom-dashboard">
          <PublicComponent />
        </GuestGuard>
      )

      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/custom-dashboard')
      })
    })

    it('deve aguardar carregamento antes de decidir redirect', () => {
      mockUseIsInitialized.mockReturnValue(true)
      mockUseIsAuthenticated.mockReturnValue(true)
      mockUseAuthLoading.mockReturnValue(true) // Ainda carregando

      render(
        <GuestGuard>
          <PublicComponent />
        </GuestGuard>
      )

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
    })
  })

  describe('Preservação de URL para Redirect', () => {
    it('deve preservar URL atual para redirecionamento após login', async () => {
      // Mock location atual
      mockUseLocation.mockReturnValue({
        pathname: '/profile',
        search: '',
        hash: '',
      })

      mockUseIsInitialized.mockReturnValue(true)
      mockUseIsAuthenticated.mockReturnValue(false)
      mockUseAuthLoading.mockReturnValue(false)

      render(
        <AuthGuard>
          <ProtectedComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        const navigate = screen.getByTestId('navigate')
        expect(navigate).toHaveAttribute('data-to', '/login?redirect=%2Fprofile')
      })
    })

    it('deve não adicionar redirect para página inicial', async () => {
      // Mock página inicial
      mockUseLocation.mockReturnValue({
        pathname: '/',
        search: '',
        hash: '',
      })

      mockUseIsInitialized.mockReturnValue(true)
      mockUseIsAuthenticated.mockReturnValue(false)
      mockUseAuthLoading.mockReturnValue(false)

      render(
        <AuthGuard>
          <ProtectedComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        const navigate = screen.getByTestId('navigate')
        expect(navigate).toHaveAttribute('data-to', '/login')
      })
    })
  })

  describe('Estados de Erro', () => {
    it('deve mostrar erro quando initialize falha', async () => {
      const mockInitialize = vi.fn().mockRejectedValue(new Error('Session expired'))
      
      mockUseIsInitialized.mockReturnValue(false)
      mockUseIsAuthenticated.mockReturnValue(false)
      mockUseAuthLoading.mockReturnValue(false)
      
      mockUseAuthStore.mockReturnValue({
        getState: () => ({
          initialize: mockInitialize,
          isInitialized: false,
          isAuthenticated: false,
          isLoading: false,
        }),
      })

      render(
        <AuthGuard>
          <ProtectedComponent />
        </AuthGuard>
      )

      await waitFor(() => {
        expect(screen.getByText('Erro de Autenticação')).toBeInTheDocument()
        expect(screen.getByText('Session expired')).toBeInTheDocument()
        expect(screen.getByText('Ir para Login')).toBeInTheDocument()
      })
    })
  })
}) 