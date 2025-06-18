import { createRoute, createRouter, redirect } from '@tanstack/react-router'

import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { ForgotPasswordPage } from '@/pages/ForgotPassword/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/ResetPassword/ResetPasswordPage'
import { AuthGuard, GuestGuard } from '@/components/guards/AuthGuard'
import { useAuthStore } from '@/stores/authStore'
import { Route as rootRoute } from '@/routes/__root'

const GuestLogin = () => (
  <GuestGuard>
    <Login />
  </GuestGuard>
)

const GuestRegister = () => (
  <GuestGuard>
    <Register />
  </GuestGuard>
)

const GuestForgotPassword = () => (
  <GuestGuard>
    <ForgotPasswordPage />
  </GuestGuard>
)

const GuestResetPassword = () => (
  <GuestGuard>
    <ResetPasswordPage />
  </GuestGuard>
)

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: GuestLogin,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || undefined,
    }
  },
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: GuestRegister,
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: GuestForgotPassword,
})

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: GuestResetPassword,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || '',
    }
  },
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: async () => {
    console.log('🏠 Carregando página inicial...')
    const { isInitialized, initialize } = useAuthStore.getState()

    if (!isInitialized) {
      console.log('🏠 Inicializando sessão...')
        await initialize()
    }

    const { isAuthenticated } = useAuthStore.getState()
    console.log('🏠 Usuário autenticado:', isAuthenticated)
    
    const redirectTo = isAuthenticated ? '/dashboard' : '/login'
    console.log('🏠 Redirecionando para:', redirectTo)
    
    throw redirect({ to: redirectTo })
  },
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <AuthGuard>
      <div>
        <h1>Perfil do Usuário</h1>
        <p>Esta é uma página protegida</p>
      </div>
    </AuthGuard>
  ),
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <AuthGuard>
      <div>
        <h1>Configurações</h1>
        <p>Esta é uma página protegida</p>
      </div>
    </AuthGuard>
  ),
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  ),
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/404',
  component: () => (
    <div>
      <h1>Página não encontrada</h1>
      <p>A página que você está procurando não existe.</p>
    </div>
  ),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  dashboardRoute,
  profileRoute,
  settingsRoute,
  notFoundRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {}