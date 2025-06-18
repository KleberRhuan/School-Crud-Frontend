import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useToast } from '../useToast'

// Mock do react-hot-toast
const mockToast = {
  custom: vi.fn().mockReturnValue('toast-id'),
  dismiss: vi.fn(),
}

vi.mock('react-hot-toast', () => ({
  default: mockToast,
}))

// Mock do ApiErrorInterpreter
vi.mock('@utils/toast/ApiErrorInterpreter.ts', () => ({
  default: {
    handle: vi.fn().mockReturnValue('error-toast-id'),
  },
}))

// Mock do ToastContent
vi.mock('@utils/toast/ToastContent.tsx', () => ({
  ToastContent: vi.fn(({ type, msg }) => `ToastContent-${type}-${msg}`),
}))

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar todas as funções esperadas', () => {
    const { result } = renderHook(() => useToast())

    expect(result.current).toHaveProperty('success')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('warning')
    expect(result.current).toHaveProperty('info')
    expect(result.current).toHaveProperty('handleApiError')
    expect(result.current).toHaveProperty('dismiss')
    expect(result.current).toHaveProperty('dismissAll')
  })

  it('deve chamar toast.custom para success', () => {
    const { result } = renderHook(() => useToast())
    
    const toastId = result.current.success('Sucesso!')

    expect(mockToast.custom).toHaveBeenCalled()
    expect(toastId).toBe('toast-id')
  })

  it('deve chamar toast.custom para error', () => {
    const { result } = renderHook(() => useToast())
    
    const toastId = result.current.error('Erro!')

    expect(mockToast.custom).toHaveBeenCalled()
    expect(toastId).toBe('toast-id')
  })

  it('deve chamar ApiErrorInterpreter.handle para handleApiError', () => {
    const { result } = renderHook(() => useToast())
    const mockError = new Error('API Error')
    
    const toastId = result.current.handleApiError(mockError)

    expect(toastId).toBe('error-toast-id')
  })

  it('deve chamar toast.dismiss para dismiss', () => {
    const { result } = renderHook(() => useToast())
    
    result.current.dismiss('toast-id')

    expect(mockToast.dismiss).toHaveBeenCalledWith('toast-id')
  })

  it('deve chamar toast.dismiss sem parâmetros para dismissAll', () => {
    const { result } = renderHook(() => useToast())
    
    result.current.dismissAll()

    expect(mockToast.dismiss).toHaveBeenCalledWith()
  })
}) 