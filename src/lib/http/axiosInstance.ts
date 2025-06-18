import axios from 'axios'
import { API_CONFIG } from '../config/constants'

/**
 * Instância básica do Axios
 * Não contém interceptadores - eles são registrados separadamente
 * Isso facilita testes unitários e isolamento de responsabilidades
 */
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

/**
 * Função para configurar accessToken no header Authorization
 * Usado pelo AuthStore para injetar token em memória
 */
export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

/**
 * Configurar headers customizados para SPA (CSRF protection)
 */
export const configureApiHeaders = (headers: Record<string, string>): void => {
  Object.entries(headers).forEach(([key, value]) => {
    api.defaults.headers.common[key] = value
  })
} 