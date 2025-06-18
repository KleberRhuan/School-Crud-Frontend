# 🚀 Houer Frontend - Sistema de Gestão Moderna

Sistema frontend moderno construído com **React 19**, **TypeScript** e **TanStack Query**, otimizado para performance e escalabilidade.

## 📖 Índice

- [🚀 Houer Frontend - Sistema de Gestão Moderna](#-houer-frontend---sistema-de-gestão-moderna)
  - [📖 Índice](#-índice)
  - [🎯 Início Rápido (< 5 minutos)](#-início-rápido--5-minutos)
  - [⚡ Hooks API - Guia Prático](#-hooks-api---guia-prático)
    - [1. 📋 useApiQuery - Consultas Inteligentes](#1--useapiquery---consultas-inteligentes)
    - [2. ✏️ useApiMutation - Operações CRUD](#2-️-useapimutation---operações-crud)
    - [3. 🏭 Factory Pattern - Mutations Reutilizáveis](#3--factory-pattern---mutations-reutilizáveis)
    - [4. 🔄 Retry Policy Inteligente](#4--retry-policy-inteligente)
    - [5. 🎨 Sistema de Notificações Injetável](#5--sistema-de-notificações-injetável)
  - [🛠️ Configuração do Projeto](#️-configuração-do-projeto)
  - [📚 Exemplos Completos](#-exemplos-completos)
    - [Componente de Listagem com Paginação](#componente-de-listagem-com-paginação)
    - [Formulário CRUD Completo](#formulário-crud-completo)
    - [Upload de CSV com Progress](#upload-de-csv-com-progress)
  - [🧪 Testes e Qualidade](#-testes-e-qualidade)
  - [📋 Scripts Disponíveis](#-scripts-disponíveis)
  - [🔗 Links Úteis](#-links-úteis)

## 🎯 Início Rápido (< 5 minutos)

```bash
# 1. Clone e instale dependências
git clone [repo-url]
cd houer-frontend
pnpm install

# 2. Execute o projeto
pnpm dev

# 3. Abra http://localhost:5173
```

## ⚡ Hooks API - Guia Prático

O sistema possui hooks refatorados que seguem as melhores práticas modernas:

### 1. 📋 useApiQuery - Consultas Inteligentes

Hook para buscar dados com cache automático, retry inteligente e loading states.

```tsx
import { useApiQuery } from '@/hooks/api'

function UsersList() {
  const { 
    data: users, 
    isLoading, 
    error, 
    refetch 
  } = useApiQuery({
    endpoint: '/users',
    queryKey: ['users'],
    // Cache por 5 minutos, retry automático em falhas de rede
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} onRetry={refetch} />

  return (
    <UserTable users={users} onRefresh={refetch} />
  )
}
```

**Funcionalidades avançadas:**

```tsx
// 🔍 Busca com filtros e paginação
const { data, hasNextPage, fetchNextPage } = usePaginatedQuery({
  endpoint: '/users',
  queryKey: ['users', filters],
  filters: { status: 'active', role: 'admin' },
  pageSize: 20
})

// 🎯 Query dependente (só executa quando userId existe)
const { data: userProfile } = useApiQuery({
  endpoint: `/users/${userId}/profile`,
  queryKey: ['user-profile', userId],
  enabled: !!userId
})

// ⚡ Prefetch para melhor UX
const queryClient = useQueryClient()
const prefetchUser = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ['user', id],
    queryFn: () => apiClient.get(`/users/${id}`)
  })
}
```

### 2. ✏️ useApiMutation - Operações CRUD

Hooks especializados para criar, atualizar e deletar dados.

```tsx
import { useApiCreate, useApiUpdate, useApiDelete } from '@/hooks/api'

function UserForm({ user, onSuccess }: UserFormProps) {
  // ✅ Criar usuário
  const createUser = useApiCreate({
    endpoint: '/users',
    invalidateQueries: [['users']], // Atualiza cache automaticamente
    onSuccess: () => {
      toast.success('Usuário criado com sucesso!')
      onSuccess?.()
    }
  })

  // ✏️ Atualizar usuário
  const updateUser = useApiUpdate({
    endpoint: `/users/${user?.id}`,
    invalidateQueries: [['users'], ['user', user?.id]],
    onSuccess: () => toast.success('Usuário atualizado!')
  })

  // 🗑️ Deletar usuário
  const deleteUser = useApiDelete({
    endpoint: `/users/${user?.id}`,
    invalidateQueries: [['users']],
    onSuccess: () => toast.success('Usuário removido!')
  })

  const handleSubmit = async (data: UserFormData) => {
    try {
      if (user?.id) {
        await updateUser.mutateAsync(data)
      } else {
        await createUser.mutateAsync(data)
      }
    } catch (error) {
      // Erro já tratado automaticamente pelo hook
      console.error('Erro na operação:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
      <button 
        type="submit" 
        disabled={createUser.isPending || updateUser.isPending}
      >
        {createUser.isPending || updateUser.isPending ? 'Salvando...' : 'Salvar'}
      </button>
      
      {user?.id && (
        <button 
          type="button"
          onClick={() => deleteUser.mutate()}
          disabled={deleteUser.isPending}
        >
          {deleteUser.isPending ? 'Deletando...' : 'Deletar'}
        </button>
      )}
    </form>
  )
}
```

### 3. 🏭 Factory Pattern - Mutations Reutilizáveis

Crie mutations consistentes para diferentes entidades:

```tsx
import { createApiMutation } from '@/hooks/api'

// 🏭 Factory para operações de usuário
const userMutations = {
  create: createApiMutation('POST', '/users', {
    successMessage: 'Usuário criado com sucesso!',
    invalidateQueries: [['users']]
  }),
  
  update: (id: string) => createApiMutation('PUT', `/users/${id}`, {
    successMessage: 'Usuário atualizado!',
    invalidateQueries: [['users'], ['user', id]]
  }),
  
  delete: (id: string) => createApiMutation('DELETE', `/users/${id}`, {
    successMessage: 'Usuário removido!',
    invalidateQueries: [['users']]
  }),
  
  // 🔄 Ação customizada
  resetPassword: (id: string) => createApiMutation('POST', `/users/${id}/reset-password`, {
    successMessage: 'Senha resetada! Email enviado.',
    // Não invalida cache - é uma ação isolada
  })
}

// 📝 Uso no componente
function UserActions({ userId }: { userId: string }) {
  const resetPassword = userMutations.resetPassword(userId)
  
  return (
    <button 
      onClick={() => resetPassword.mutate()}
      disabled={resetPassword.isPending}
    >
      {resetPassword.isPending ? 'Resetando...' : 'Resetar Senha'}
    </button>
  )
}
```

### 4. 🔄 Retry Policy Inteligente

Sistema de retry com backoff exponencial configurável:

```tsx
import { useApiQuery } from '@/hooks/api'

const { data } = useApiQuery({
  endpoint: '/critical-data',
  queryKey: ['critical'],
  // 🧠 Retry inteligente
  retry: (failureCount, error) => {
    // Não retry em erros 4xx (cliente)
    if (error.response?.status >= 400 && error.response?.status < 500) {
      return false
    }
    // Retry até 3 vezes em erros 5xx ou rede
    return failureCount < 3
  },
  // ⏰ Backoff exponencial: 1s, 2s, 4s
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
})
```

### 5. 🎨 Sistema de Notificações Injetável

Sistema de toast desacoplado e testável:

```tsx
import { ToastProvider, useToastService } from '@/hooks/api'

// 🎯 1. Configure o provider no root da aplicação
function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  )
}

// 🎨 2. Use toast customizado em qualquer componente
function CustomNotifications() {
  const toast = useToastService()
  
  const handleSuccess = () => {
    toast.success('Operação realizada!', {
      duration: 4000,
      position: 'top-right'
    })
  }
  
  const handleError = () => {
    toast.error('Algo deu errado!', {
      action: {
        label: 'Tentar novamente',
        onClick: () => retryOperation()
      }
    })
  }
  
  return (
    <div>
      <button onClick={handleSuccess}>Sucesso</button>
      <button onClick={handleError}>Erro</button>
    </div>
  )
}

// 🧪 3. Para testes - injete toast mock
import { render } from '@testing-library/react'
import { createMockToastService } from '@/hooks/api/testing'

test('componente exibe toast', () => {
  const mockToast = createMockToastService()
  
  render(
    <ToastProvider value={mockToast}>
      <ComponentWithToast />
    </ToastProvider>
  )
  
  // Verificar que toast foi chamado
  expect(mockToast.success).toHaveBeenCalledWith('Mensagem esperada')
})
```

## 🛠️ Configuração do Projeto

O projeto usa as tecnologias mais modernas:

- **React 19.1** - Concurrent Features, Suspense, Actions
- **TypeScript 5.8** - Type safety completa
- **TanStack Query 5.80** - Data fetching e cache
- **TanStack Router 1.121** - Roteamento type-safe
- **Material UI 7.1** - Componentes modernos
- **Zustand 5.0** - Estado global minimalista
- **Vitest 3.2** - Testes rápidos
- **Tailwind CSS 4.1** - Estilização utilitária

## 🧪 Testes e Qualidade

O projeto mantém alta qualidade de código:

```bash
# Executer todos os testes
pnpm test

# Cobertura de testes
pnpm test:coverage

# Testes E2E
pnpm e2e

# Análise de qualidade completa
pnpm quality:full

# Métricas de refatoração
pnpm refactor:metrics
```

## 📋 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm test` | Testes em modo watch |
| `pnpm test:coverage` | Cobertura de testes |
| `pnpm lint` | Verificar código |
| `pnpm format` | Formatar código |
| `pnpm quality:full` | Análise completa de qualidade |

## 🔗 Links Úteis

- 📖 [Documentação Técnica Completa](./docs/api-hooks-documentation.adoc)
- 🔄 [Guia de Migração](./docs/migration-guide.md)
- 📈 [Relatório de Refatoração](./README-REFACTORING.md)
- 🎯 [Setup do Zero](./docs/setup-checklist.md)
- 📋 [Changelog](./CHANGELOG.md)

---

**⚡ Criado com React 19 + TypeScript + TanStack Query para máxima performance e DX** 