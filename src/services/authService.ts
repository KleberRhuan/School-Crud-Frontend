import type { AxiosInstance } from 'axios'
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User
} from '@/schemas/apiSchemas.ts'
import { ForgotPasswordRequest, ResetPasswordRequest} from "@/schemas/passwordSchemas.ts";

/**
 * Serviço de autenticação que recebe instância do Axios por injeção
 * Facilita testes unitários e isolamento de dependências
 */
export class AuthService {
  constructor(private readonly api: AxiosInstance) {}

  /**
   * Login - retorna accessToken e define refreshToken em cookie HttpOnly
   */
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const response = await this.api.post<TokenResponse>('/auth/login', credentials, {
      withCredentials: true,
    })

    return response.data
  }

  /**
   * Register - cria conta e retorna sem login automático
   */
  async register(data: RegisterRequest): Promise<void> {
    await this.api.post('/auth/register', data, {
      withCredentials: true,
    })
  }

  /**
   * Logout - invalida sessão server-side e limpa cookie
   */
  async logout(): Promise<void> {
      await this.api.post('/auth/logout', {}, {
        withCredentials: true
      })
  }

  /**
   * Refresh Token - usa cookie HttpOnly automaticamente
   */
  async refresh(): Promise<TokenResponse> {
    const response = await this.api.post<TokenResponse>('/auth/refresh', {}, {
      withCredentials: true
    })
    return response.data
  }

  /**
   * Esqueci minha senha
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await this.api.post('/auth/password/forgot', data)
  }

  /**
   * Redefinir senha com token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await this.api.post('/auth/password/reset', data)
  }

  /**
   * Validar token de reset
   */
  async validateResetToken(token: string): Promise<void> {
    await this.api.get('/auth/password/reset/token', {
      params: { token }
    })
  }

  /**
   * Obter dados do usuário atual
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>('/auth/me')
    return response.data
  }

  /**
   * Verificar email com token
   */
  async verifyEmail(token: string): Promise<void> {
    await this.api.get('/auth/verify', {
      params: { token }
    })
  }
}

/**
 * Factory function para criar instância do AuthService
 * Facilita testes e injeção de dependências
 */
export const createAuthService = (api: AxiosInstance): AuthService => {
  return new AuthService(api)
}