# Migração do Sistema de Password Reset

## 📋 Resumo

O sistema de password reset foi refatorado e migrado do arquivo `usePasswordReset.ts` para `useAuth.ts`, seguindo as práticas mais recentes e padronizações do projeto.

## 🎯 Principais Melhorias

### ✅ Padronização com useApiMutation/useApiQuery
- Uso consistente do `useApiMutation` e `useApiQuery`
- Integração automática com sistema de toast
- Query keys padronizadas
- Melhor gerenciamento de cache

### ✅ Validação Automática com Zod
- Validação automática usando schemas: `forgotPasswordSchema`, `resetPasswordSchema`
- Melhor tipagem TypeScript
- Tratamento de erros mais robusto

### ✅ API Simplificada e Consistente
- Funções seguem o mesmo padrão do `useAuth.ts`
- Melhor organização e legibilidade
- Eliminação de dependências manuais do `useToastService`

## 🔄 Guia de Migração

### Antes (usePasswordReset.ts)
```typescript
import { useRequestPasswordReset, useResetPassword, useValidateResetToken } from '@/hooks'

// Solicitação de reset
const requestReset = useRequestPasswordReset()
requestReset.mutate(email)

// Reset de senha
const resetPassword = useResetPassword()
resetPassword.mutate({ token, newPassword })

// Validação de token
const { data } = useValidateResetToken(token)
```

### Depois (useAuth.ts)
```typescript
import { useForgotPassword, useResetPassword, useValidateResetToken } from '@/hooks'

// Solicitação de reset (novo nome)
const forgotPassword = useForgotPassword()
forgotPassword.mutate({ email }) // ← Note que agora é um objeto

// Reset de senha (compatível)
const resetPassword = useResetPassword()
resetPassword.mutate({ token, newPassword })

// Validação de token (compatível)
const { data } = useValidateResetToken(token)
```

### Hook Composto Simplificado
```typescript
import { usePasswordResetFlow } from '@/hooks'

const {
  forgotPassword,
  resetPassword,
  useValidateToken,
  isRequestingReset,
  isResetting
} = usePasswordResetFlow()
```

## 🛠️ Mudanças na API

### useForgotPassword (novo)
- **Antes:** `useRequestPasswordReset()` - recebia string
- **Depois:** `useForgotPassword()` - recebe objeto `{ email }`
- ✅ Validação automática com `forgotPasswordSchema`
- ✅ Toast integrado

### useResetPassword (melhorado)
- ✅ Mantém compatibilidade com a API existente
- ✅ Validação automática com `resetPasswordSchema`
- ✅ Tratamento de erro melhorado
- ✅ Toast integrado

### useValidateResetToken (melhorado)
- ✅ Mantém compatibilidade total
- ✅ Query keys padronizadas
- ✅ Melhor cache management

## 📁 Estrutura de Arquivos

```
src/hooks/
├── useAuth.ts              # ← Contém todas as funções de auth + password reset
├── usePasswordReset.ts     # ← DEPRECATED (mantido para compatibilidade)
└── index.ts               # ← Exporta ambas as versões
```

## 🔧 Exports Disponíveis

### Novas Implementações (Recomendadas)
```typescript
import {
  useForgotPassword,
  useResetPassword,
  useValidateResetToken,
  usePasswordResetFlow
} from '@/hooks'
```

### Legacy (Compatibilidade)
```typescript
import {
  useRequestPasswordReset,
  useValidateResetTokenLegacy,
  useResetPasswordLegacy,
  usePasswordResetFlowLegacy
} from '@/hooks'
```

## 🎨 Exemplo de Uso Completo

```typescript
import { usePasswordResetFlow } from '@/hooks'
import { useState } from 'react'

export function PasswordResetExample() {
  const [step, setStep] = useState<'request' | 'reset'>('request')
  const [token, setToken] = useState('')
  
  const {
    forgotPassword,
    resetPassword,
    useValidateToken,
    isRequestingReset,
    isResetting
  } = usePasswordResetFlow()
  
  // Validar token automaticamente
  const { data: tokenValidation } = useValidateToken(token)
  
  const handleForgotPassword = async (email: string) => {
    forgotPassword.mutate({ email }, {
      onSuccess: () => setStep('reset')
    })
  }
  
  const handleResetPassword = async (newPassword: string) => {
    resetPassword.mutate({ token, newPassword }, {
      onSuccess: () => {
        // Redirecionar para login
      }
    })
  }
  
  return (
    <div>
      {/* Implementação dos formulários */}
    </div>
  )
}
```

## ⚠️ Notas Importantes

1. **Compatibilidade**: O arquivo `usePasswordReset.ts` é mantido para evitar breaking changes
2. **Depreciação**: Novos projetos devem usar as funções do `useAuth.ts`
3. **Migração Gradual**: Você pode migrar gradualmente, função por função
4. **Remoção Futura**: O arquivo legacy será removido em versões futuras

## 🧪 Testing

As novas implementações mantêm a mesma interface de teste, mas com melhor tipagem:

```typescript
// Teste das novas funções
import { renderHook } from '@testing-library/react'
import { useForgotPassword } from '@/hooks'

test('should handle forgot password', async () => {
  const { result } = renderHook(() => useForgotPassword())
  
  act(() => {
    result.current.mutate({ email: 'test@example.com' })
  })
  
  // Asserções...
})
``` 