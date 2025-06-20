import { createRoute, createRouter, redirect } from '@tanstack/react-router'

import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { ForgotPasswordPage } from '@/pages/ForgotPassword/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/ResetPassword/ResetPasswordPage'
import { VerifyEmailPage } from '@/pages/VerifyEmail'
import { NotFoundPage } from '@/pages/NotFound'
import { AuthGuard, GuestGuard } from '@/components/guards/AuthGuard'
import { useAuthStore } from '@/stores/authStore'
import { Route as rootRoute } from '@/routes/__root'
import { SchoolsPage } from '@/features/schools/pages/SchoolsPage'
import { initializeSession } from '@/hooks/useAuth'

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

const GuestVerifyEmail = () => (
  <GuestGuard>
    <VerifyEmailPage />
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

const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/verified',
  component: GuestVerifyEmail,
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
    await initializeSession()
    const {isAuthenticated} = useAuthStore.getState()

    const redirectTo = isAuthenticated ? '/dashboard' : '/login'

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

const schoolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/schools',
  component: () => (
    <AuthGuard>
      <SchoolsPage />
    </AuthGuard>
  ),
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/404',
  component: NotFoundPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  verifyEmailRoute,
  dashboardRoute,
  profileRoute,
  settingsRoute,
  schoolsRoute,
  notFoundRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFoundPage,
})

declare module '@tanstack/react-router' {}