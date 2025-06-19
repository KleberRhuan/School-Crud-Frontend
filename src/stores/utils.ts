import { ApiError } from '@/lib/api-client'

/**
 * Helper para gerenciar estado de loading e erro de forma consistente
 * Elimina a repetição de código nas actions do store
 */
export const runWithLoading = <T extends { isLoading: boolean; error: string | null }>(
  setState: (updater: (state: T) => void) => void
) => {
  return async <R>(fn: () => Promise<R>): Promise<R> => {
    try {
      // Inicia loading e limpa erro
      setState((state) => {
        state.isLoading = true
        state.error = null
      })

      const result = await fn()

      // Sucesso: remove loading
      setState((state) => {
        state.isLoading = false
      })

      return result
    } catch (error) {
      // Erro: remove loading e define erro
      const apiError = error as ApiError
      setState((state) => {
        state.isLoading = false
        state.error = apiError.message || 'Erro inesperado'
      })
      
      throw error
    }
  }
}

/**
 * Função para criar selectors com tipos automáticos
 * Reduz duplicação nos hooks do store
 */
export function createSelector<T, K extends keyof T>(
  useStore: (selector: (state: T) => T[K]) => T[K],
  key: K
) {
  return () => useStore((state) => state[key])
}

/**
 * Logs condicionais apenas em desenvolvimento
 */
export const log = {
  info: (_message: string, ..._args: any[]) => {
    if (import.meta.env.DEV) {
      // Development logging - informational
    }
  },
  
  success: (_message: string, ..._args: any[]) => {
    if (import.meta.env.DEV) {
      // Success - operation completed
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(`⚠️ ${message}`, ...args)
    }
  },
  
  error: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.error(`❌ ${message}`, ...args)
    }
  }
} 