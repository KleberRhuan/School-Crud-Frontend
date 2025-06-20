import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client.ts'
import { 
  createApiMutation, 
  createDeleteMutation,
  createPatchMutation,
  createPostMutation,
  createPutMutation
} from '@/factories/mutationFactory.ts'

// Mock do useToast
const mockToastService = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  handleApiError: vi.fn(),
  dismiss: vi.fn(),
  dismissAll: vi.fn(),
}

// Mock do apiClient
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  ApiError: class MockApiError extends Error {
    constructor(public status: number, public statusText: string, public data?: any) {
      super(data?.userMessage || statusText)
      this.name = 'ApiError'
    }
  }
}))

// Mock dos handlers
vi.mock('../handlers/successHandler', () => ({
  SuccessHandler: {
    createMutationSuccessHandler: vi.fn().mockReturnValue(vi.fn())
  }
}))

vi.mock('../handlers/errorHandler', () => ({
  ErrorHandler: {
    handleMutationError: vi.fn()
  }
}))

const { apiClient } = await import('@/lib/api-client.ts')

describe('ETAPA 3 - Mutation Factory', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    vi.clearAllMocks()
  })

  describe('createApiMutation - Factory Principal', () => {
    it('deve criar mutation POST corretamente', async () => {
      const mockResponse = { data: { id: 1, name: 'Test' } }
      // @ts-expect-error mock do vitest
      apiClient.post.mockResolvedValue(mockResponse)

      const mutationOptions = createApiMutation({
        method: 'POST',
        url: '/api/test',
        defaultSuccessMessage: 'Criado com sucesso!',
        queryClient,
        options: {
          toastService: mockToastService
        }
      })

      const result = await mutationOptions.mutationFn!({ name: 'Test' })

      expect(apiClient.post).toHaveBeenCalledWith('/api/test', { name: 'Test' })
      expect(result).toEqual({ id: 1, name: 'Test' })
    })

    it('deve criar mutation PUT corretamente', async () => {
      const mockResponse = { data: { id: 1, name: 'Updated' } }
      // @ts-expect-error mock do vitest
      apiClient.put.mockResolvedValue(mockResponse)

      const mutationOptions = createApiMutation({
        method: 'PUT',
        url: '/api/test/1',
        defaultSuccessMessage: 'Atualizado com sucesso!',
        queryClient,
        options: {
          toastService: mockToastService
        }
      })

      const result = await mutationOptions.mutationFn!({ name: 'Updated' })

      expect(apiClient.put).toHaveBeenCalledWith('/api/test/1', { name: 'Updated' })
      expect(result).toEqual({ id: 1, name: 'Updated' })
    })

    it('deve criar mutation PATCH corretamente', async () => {
      const mockResponse = { data: { id: 1, name: 'Patched' } }
      // @ts-expect-error mock do vitest
      apiClient.patch.mockResolvedValue(mockResponse)

      const mutationOptions = createApiMutation({
        method: 'PATCH',
        url: '/api/test/1',
        defaultSuccessMessage: 'Atualizado com sucesso!',
        queryClient
      })

      const result = await mutationOptions.mutationFn!({ name: 'Patched' })

      expect(apiClient.patch).toHaveBeenCalledWith('/api/test/1', { name: 'Patched' })
      expect(result).toEqual({ id: 1, name: 'Patched' })
    })

    it('deve criar mutation DELETE corretamente', async () => {
      const mockResponse = { data: undefined }
      // @ts-expect-error mock do vitest
      apiClient.delete.mockResolvedValue(mockResponse)

      const mutationOptions = createApiMutation({
        method: 'DELETE',
        url: '/api/test/1',
        defaultSuccessMessage: 'Removido com sucesso!',
        queryClient
      })

      const result = await mutationOptions.mutationFn!(1)

      expect(apiClient.delete).toHaveBeenCalledWith('/api/test/1')
      expect(result).toBeUndefined()
    })

    it('deve funcionar com URL dinâmica', async () => {
      const mockResponse = { data: { id: 1 } }
      // @ts-expect-error mock do vitest
      apiClient.post.mockResolvedValue(mockResponse)

      const mutationOptions = createApiMutation({
        method: 'POST',
        url: (variables: { userId: number }) => `/api/users/${variables.userId}/posts`,
        defaultSuccessMessage: 'Post criado!',
        queryClient
      })

      await mutationOptions.mutationFn!({ userId: 123, title: 'Test Post' })

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/users/123/posts', 
        { userId: 123, title: 'Test Post' }
      )
    })

    it('deve propagar erros da API corretamente', async () => {
      const apiError = new ApiError(400, 'Bad Request', { 
        userMessage: 'Dados inválidos' 
      })
      // @ts-expect-error mock do vitest
      apiClient.post.mockRejectedValue(apiError)

      const mutationOptions = createApiMutation({
        method: 'POST',
        url: '/api/test',
        defaultSuccessMessage: 'Sucesso!',
        queryClient
      })

      await expect(mutationOptions.mutationFn!({ data: 'invalid' }))
        .rejects.toThrow('Dados inválidos')
    })
  })

  describe('Helpers de Mutation Específicas', () => {
    it('createPostMutation deve usar método POST', async () => {
      const mockResponse = { data: { id: 1 } }
      // @ts-expect-error mock do vitest
      apiClient.post.mockResolvedValue(mockResponse)

      const mutationOptions = createPostMutation('/api/posts', queryClient, {
        toastService: mockToastService
      })

      await mutationOptions.mutationFn!({ title: 'New Post' })

      expect(apiClient.post).toHaveBeenCalledWith('/api/posts', { title: 'New Post' })
    })

    it('createPutMutation deve usar método PUT', async () => {
      const mockResponse = { data: { id: 1 } }
      // @ts-expect-error mock do vitest
      apiClient.put.mockResolvedValue(mockResponse)

      const mutationOptions = createPutMutation('/api/posts/1', queryClient)

      await mutationOptions.mutationFn!({ title: 'Updated Post' })

      expect(apiClient.put).toHaveBeenCalledWith('/api/posts/1', { title: 'Updated Post' })
    })

    it('createPatchMutation deve usar método PATCH', async () => {
      const mockResponse = { data: { id: 1 } }
      // @ts-expect-error mock do vitest
      apiClient.patch.mockResolvedValue(mockResponse)

      const mutationOptions = createPatchMutation('/api/posts/1', queryClient)

      await mutationOptions.mutationFn!({ title: 'Patched Post' })

      expect(apiClient.patch).toHaveBeenCalledWith('/api/posts/1', { title: 'Patched Post' })
    })

    it('createDeleteMutation deve usar método DELETE', async () => {
      const mockResponse = { data: undefined }
      // @ts-expect-error mock do vitest
      apiClient.delete.mockResolvedValue(mockResponse)

      const mutationOptions = createDeleteMutation(
        (id: number) => `/api/posts/${id}`, 
        queryClient
      )

      await mutationOptions.mutationFn!(123)

      expect(apiClient.delete).toHaveBeenCalledWith('/api/posts/123')
    })
  })

  describe('Integração com Handlers', () => {
    it('deve chamar SuccessHandler com parâmetros corretos', async () => {
      const { SuccessHandler } = await import('@/handlers/successHandler.ts')

      createApiMutation({
        method: 'POST',
        url: '/api/test',
        defaultSuccessMessage: 'Sucesso personalizado!',
        queryClient,
        options: {
          toastService: mockToastService,
          invalidateQueries: [['posts'], ['users']],
          successMessage: 'Mensagem customizada!'
        }
      })

      expect(SuccessHandler.createMutationSuccessHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          queryClient,
          invalidateQueries: [['posts'], ['users']],
          showSuccess: true,
          successMessage: 'Mensagem customizada!',
          toastService: mockToastService
        })
      )
    })

    it('deve configurar ErrorHandler corretamente', async () => {
      const { ErrorHandler } = await import('@/handlers/errorHandler.ts')
      const apiError = new ApiError(500, 'Server Error')
      const onErrorMock = vi.fn()

      const mutationOptions = createApiMutation({
        method: 'POST',
        url: '/api/test',
        defaultSuccessMessage: 'Sucesso!',
        queryClient,
        options: {
          toastService: mockToastService,
          onError: onErrorMock
        }
      })

      // Simular erro na mutation
      mutationOptions.onError?.(apiError, { data: 'test' }, undefined)

      expect(ErrorHandler.handleMutationError).toHaveBeenCalledWith(
        'POST',
        '/api/test',
        apiError,
        true, // showError padrão
        mockToastService
      )
      expect(onErrorMock).toHaveBeenCalledWith(apiError, { data: 'test' }, undefined)
    })
  })

  describe('Configurações e Opções', () => {
    it('deve respeitar showSuccessToast: false', async () => {
      const { SuccessHandler } = await import('@/handlers/successHandler.ts')

      createApiMutation({
        method: 'POST',
        url: '/api/test',
        defaultSuccessMessage: 'Sucesso!',
        queryClient,
        options: {
          showSuccessToast: false
        }
      })

      expect(SuccessHandler.createMutationSuccessHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          showSuccess: false
        })
      )
    })

    it('deve usar mensagem padrão quando successMessage não fornecida', async () => {
      const { SuccessHandler } = await import('@/handlers/successHandler.ts')

      createApiMutation({
        method: 'DELETE',
        url: '/api/test/1',
        defaultSuccessMessage: 'Item removido com sucesso!',
        queryClient
      })

      expect(SuccessHandler.createMutationSuccessHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          successMessage: 'Item removido com sucesso!'
        })
      )
    })

    it('deve preservar opções customizadas do React Query', () => {
      const mutationOptions = createApiMutation({
        method: 'POST',
        url: '/api/test',
        defaultSuccessMessage: 'Sucesso!',
        queryClient,
        options: {
          retry: 3,
          retryDelay: 1000,
          meta: { customData: 'test' }
        }
      })

      expect(mutationOptions.retry).toBe(3)
      expect(mutationOptions.retryDelay).toBe(1000)
      expect(mutationOptions.meta).toEqual({ customData: 'test' })
    })
  })
}) 