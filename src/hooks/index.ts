// === API HOOKS ===
export { 
  useApiQuery,
  usePaginatedQuery,
} from './useApiQuery.ts'

export { 
  useApiCreate, 
  useApiUpdate, 
  useApiDelete 
} from './useApiMutation.ts'

export { 
  useTableData, 
  useTableItem, 
  useCreateTableItem, 
  useUpdateTableItem, 
  useDeleteTableItem, 
  useExportData, 
  useTableCrud, 
  useSystemStats 
} from './useData.ts'

// === AUTH HOOKS ===
export { useSentryUserContext, useSentryCapture } from './useSentry.ts'

// === UTILITY HOOKS ===
export { useAuth, useLogin, useRegister, useLogout, useCurrentUser } from './useAuth.ts'
export { useToast } from './useToast.ts'
export { useQueryStats } from './useQueryStats.ts'
export { usePasswordStrength } from './usePasswordStrength.ts'

// === QUERY CLIENT UTILS ===
export { QueryClientUtils } from './utils/queryClientUtils.ts'

// === HANDLERS ===
export { SuccessHandler } from '@/handlers/successHandler.ts'
export { ErrorHandler } from '@/handlers/errorHandler.ts'

// Password Reset - Migrado para useAuth.ts
export {
  useForgotPassword,
  useValidateResetToken,
  useResetPassword,
  usePasswordResetFlow
} from './useAuth.ts'

export { createApiMutation } from '@/factories/mutationFactory.ts'
export type { 
  MutationConfig, 
  MutationFactoryOptions, 
  HttpMethod 
} from '@/factories/mutationFactory.ts'

export { DefaultQueryConfig } from '@/config/queryConfig.ts'

export { 
  createQueryKeys, 
  clearQueryKeysCache, 
  getQueryKeysCacheStats 
} from '@/config/queryConfig.ts'

export { queryClient } from './queryClient.ts'
export type { ApiQueryOptions } from '@/types'