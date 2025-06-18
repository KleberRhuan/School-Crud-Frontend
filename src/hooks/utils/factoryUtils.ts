import { useToast } from '@/hooks/useToast.ts'
import { MutationFactoryOptions } from '@/factories/mutationFactory.ts'

/**
 * Constrói as opções da factory eliminando duplicação nos hooks de mutation
 */
export function buildFactoryOptions<TData, TVariables>(
  options: any = {},
  contextToastService: ReturnType<typeof useToast>
): MutationFactoryOptions<TData, TVariables> {
  return {
    toastService: contextToastService,
    ...options,
    ...(options?.toastService && { toastService: options.toastService })
  }
} 