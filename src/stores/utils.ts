import { ApiError } from '@/lib/api-client'

export const runWithLoading = <T extends { isLoading: boolean; error: string | null }>(
  setState: (updater: (state: T) => void) => void
) => {
  return async <R>(fn: () => Promise<R>): Promise<R> => {
    try {
      setState((state) => {
        state.isLoading = true
        state.error = null
      })

      const result = await fn()

      setState((state) => {
        state.isLoading = false
      })

      return result
    } catch (error) {
      const apiError = error as ApiError
      setState((state) => {
        state.isLoading = false
        state.error = apiError.message || 'Erro inesperado'
      })
      
      throw error
    }
  }
}