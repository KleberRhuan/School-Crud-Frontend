import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useToast } from '../useToast'

// Mock do notistack
const mockEnqueueSnackbar = vi.fn().mockReturnValue('snackbar-id')
const mockCloseSnackbar = vi.fn()

vi.mock('notistack', () => ({
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueueSnackbar,
    closeSnackbar: mockCloseSnackbar,
  }),
}))

// Mock dos outros módulos
vi.mock('@utils/toast/types.ts', () => ({
  ApiErrorContext: {},
}))

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve chamar enqueueSnackbar para sucesso', () => {
    const { result } = renderHook(() => useToast())
    
    result.current.success('Mensagem de sucesso')
    
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Mensagem de sucesso', {
      variant: 'success',
      autoHideDuration: 3000,
      persist: false,
    })
  })

  it('deve chamar enqueueSnackbar para erro', () => {
    const { result } = renderHook(() => useToast())
    
    result.current.error('Mensagem de erro')
    
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Mensagem de erro', {
      variant: 'error',
      autoHideDuration: 5000,
      persist: false,
    })
  })

  it('deve chamar closeSnackbar para dismiss', () => {
    const { result } = renderHook(() => useToast())
    
    result.current.dismiss('test-id' as any)
    
    expect(mockCloseSnackbar).toHaveBeenCalledWith('test-id')
  })

  it('deve chamar closeSnackbar sem ID para dismissAll', () => {
    const { result } = renderHook(() => useToast())
    
    result.current.dismissAll()
    
    expect(mockCloseSnackbar).toHaveBeenCalledWith()
  })
}) 