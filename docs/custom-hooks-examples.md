# Hooks Customizados - Exemplos de Uso

Esta documentação mostra como usar os hooks customizados implementados, combinando a arquitetura genérica existente com funcionalidades específicas.

## 🔐 Autenticação

### Login com Validação Automática

```tsx
import { useLogin } from '@/hooks/api'

function LoginForm() {
  const loginMutation = useLogin()
  
  const handleSubmit = (data: { email: string; password: string }) => {
    loginMutation.mutate(data)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* formulário */}
      <button 
        type="submit" 
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
```

### Usuário Atual com Cache

```tsx
import { useCurrentUser, useLogout } from '@/hooks/api'

function UserProfile() {
  const { data: user, isLoading } = useCurrentUser()
  const logoutMutation = useLogout()
  
  if (isLoading) return <div>Carregando...</div>
  
  return (
    <div>
      <h1>Olá, {user?.name}!</h1>
      <button onClick={() => logoutMutation.mutate()}>
        Sair
      </button>
    </div>
  )
}
```

## 🔄 Reset de Senha

### Fluxo Completo de Reset

```tsx
import { usePasswordResetFlow } from '@/hooks/api'

// Página 1: Solicitar reset
function ForgotPasswordPage() {
  const { requestReset } = usePasswordResetFlow()
  
  const handleSubmit = (email: string) => {
    requestReset.mutate(email)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Seu e-mail" />
      <button 
        type="submit" 
        disabled={requestReset.isPending}
      >
        Enviar
      </button>
    </form>
  )
}

// Página 2: Redefinir senha
function ResetPasswordPage({ token }: { token: string }) {
  const { resetPassword, useValidateToken } = usePasswordResetFlow()
  
  // Validar token automaticamente
  const { data: validation, isLoading } = useValidateToken(token)
  
  if (isLoading) return <div>Validando...</div>
  
  if (!validation?.valid) {
    return <div>Link inválido ou expirado</div>
  }
  
  const handleSubmit = (newPassword: string) => {
    resetPassword.mutate({ token, newPassword })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="password" placeholder="Nova senha" />
      <button type="submit">Redefinir Senha</button>
    </form>
  )
}
```

## 📁 Upload de Arquivos

### Upload com Progress e Cancelamento

```tsx
import { useUploadCsv } from '@/hooks/api'
import { useState } from 'react'

function FileUploader() {
  const [progress, setProgress] = useState(0)
  
  const uploadMutation = useUploadCsv({
    onProgress: setProgress,
    onSuccess: (data) => {
      console.log('Upload concluído:', data.id)
    }
  })
  
  const handleFileSelect = (file: File) => {
    uploadMutation.mutate(file)
  }
  
  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
      />
      
      {uploadMutation.isPending && (
        <div>
          <div>Progress: {progress}%</div>
          <button onClick={uploadMutation.cancel}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
```

### Gerenciador Completo de Upload

```tsx
import { useUploadManager } from '@/hooks/api'

function UploadManager() {
  const {
    upload,
    status,
    history,
    delete: deleteUpload,
    currentUploadId,
    isPolling,
    clearCurrentUpload
  } = useUploadManager()
  
  return (
    <div>
      {/* Upload atual */}
      {currentUploadId && (
        <div>
          <h3>Upload em andamento</h3>
          <p>Status: {status.data?.status}</p>
          <p>Progress: {status.data?.progress}%</p>
          {isPolling && <div>Atualizando...</div>}
        </div>
      )}
      
      {/* Histórico */}
      <h3>Histórico de Uploads</h3>
      {history.data?.pages.map(page => 
        page.data.map(upload => (
          <div key={upload.id}>
            <span>{upload.filename}</span>
            <button onClick={() => deleteUpload.mutate(upload.id)}>
              Remover
            </button>
          </div>
        ))
      )}
    </div>
  )
}
```

## 📊 Dados e CRUD

### CRUD Completo com Hooks

```tsx
import { useTableCrud, userSchema } from '@/hooks/api'

function UsersTable() {
  const {
    useList,
    useCreate,
    useUpdate,
    useDelete
  } = useTableCrud('/users', userSchema)
  
  // Queries
  const { data: users, isLoading } = useList({ page: 1, pageSize: 10 })
  
  // Mutations
  const createUser = useCreate()
  const updateUser = useUpdate()
  const deleteUser = useDelete()
  
  return (
    <div>
      <button onClick={() => createUser.mutate({ name: 'Novo Usuário' })}>
        Criar Usuário
      </button>
      
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <table>
          {users?.data.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>
                <button onClick={() => updateUser.mutate({ 
                  id: user.id, 
                  name: 'Nome Atualizado' 
                })}>
                  Editar
                </button>
                <button onClick={() => deleteUser.mutate(user.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  )
}
```

### Busca com Debounce

```tsx
import { useSearchData } from '@/hooks/api'
import { useState } from 'react'

function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data: results, isLoading } = useSearchData(
    '/users',
    searchTerm,
    300 // debounce de 300ms
  )
  
  return (
    <div>
      <input
        type="text"
        placeholder="Buscar usuários..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {isLoading && <div>Buscando...</div>}
      
      {results?.data.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

## 🔧 Preferências e Sistema

### Preferências com Auto-Save

```tsx
import { useUserPreferences } from '@/hooks/api'

function PreferencesPanel() {
  const { data: preferences, update } = useUserPreferences()
  
  const handleThemeChange = (theme: 'light' | 'dark') => {
    update.mutate({
      ...preferences,
      theme
    })
  }
  
  return (
    <div>
      <h3>Preferências</h3>
      <label>
        Tema:
        <select 
          value={preferences?.theme} 
          onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
        </select>
      </label>
    </div>
  )
}
```

### Dashboard com Estatísticas

```tsx
import { useSystemStats } from '@/hooks/api'

function SystemDashboard() {
  const { health, stats } = useSystemStats()
  
  return (
    <div>
      <h2>Status do Sistema</h2>
      
      {/* Health Check */}
      <div>
        Status: {health.data?.status}
        <span style={{ 
          color: health.data?.status === 'healthy' ? 'green' : 'red' 
        }}>
          ●
        </span>
      </div>
      
      {/* Estatísticas */}
      <div>
        <p>Usuários ativos: {stats.data?.users.active}</p>
        <p>Taxa de sucesso: {stats.data?.uploads.successRate}%</p>
        <p>Tempo médio de resposta: {stats.data?.performance.avgResponseTime}ms</p>
      </div>
    </div>
  )
}
```

## 🎯 Vantagens dos Hooks Customizados

### ✅ **O que foi alcançado:**

1. **Combina hooks genéricos com lógica específica**
2. **Validação automática com Zod**
3. **Tratamento de erro especializado**
4. **Integração com sistema de toasts**
5. **Cache inteligente e invalidação automática**
6. **Cancelamento e polling quando necessário**
7. **Tipagem forte mantida**

### 🔄 **Como usar:**

```tsx
// Para casos simples: use hooks genéricos
import { useApiQuery, useApiCreate } from '@/hooks/api'

// Para casos específicos: use hooks customizados
import { useLogin, useUploadCsv, useTableCrud } from '@/hooks/api'
```

### 🚀 **Resultado:**

- **Menos código repetitivo** nos componentes
- **Lógica de negócio centralizada** nos hooks
- **Melhor experiência de desenvolvedor** com tipagem e autocomplete
- **Performance otimizada** com cache e polling inteligente 