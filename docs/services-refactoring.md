# Refatoração da Camada de Services

Este documento descreve as melhorias implementadas na camada de services do projeto, seguindo as recomendações da revisão de código.

## Resumo das Melhorias

### ✅ Implementadas

1. **Centralização do tratamento de erros**
2. **Wrapper genérico para requests**
3. **Validação com Zod**
4. **Tipagem com generics**
5. **Unificação da instância Axios**
6. **Cancelamento de requests**
7. **Hooks com React Query**

### ⏳ Pendentes

1. **Remoção de side-effects dos services** (localStorage)
2. **Eliminação das convenience functions**

## Detalhes das Implementações

### 1. Tratamento Centralizado de Erros

**Arquivo:** `src/utils/axios.ts`

```typescript
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static fromAxiosError(error: AxiosError): ApiError {
    // Normalização automática de erros da API
  }
}
```

**Benefícios:**
- Todos os erros da API são normalizados
- Informações estruturadas (status, code, message)
- Interceptor centraliza o tratamento

### 2. Wrapper Genérico para Requests

**Arquivo:** `src/utils/axios.ts`

```typescript
export const apiRequest = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    request<T>({ ...config, method: 'GET', url }),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    request<T>({ ...config, method: 'POST', url, data }),
  // ... outros métodos
}
```

**Benefícios:**
- Elimina repetição de `response.data`
- Tipagem automática do retorno
- Configuração consistente

### 3. Validação com Zod

**Arquivo:** `src/validation/apiSchemas.ts`

```typescript
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()),
  // ...
})

export type User = z.infer<typeof userSchema>
```

**Benefícios:**
- Validação de entrada e saída
- Tipos TypeScript gerados automaticamente
- Contratos de API garantidos

### 4. BaseApiService Refatorado

**Arquivo:** `src/services/apiService.ts`

```typescript
abstract class BaseApiService {
  protected async get<T>(
    path?: string,
    config?: AxiosRequestConfig,
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    const url = this.buildUrl(path)
    const data = await apiRequest.get<unknown>(url, config)
    
    if (schema) {
      return schema.parse(data) // Validação automática
    }
    
    return data as T
  }
}
```

**Benefícios:**
- Métodos reutilizáveis com validação opcional
- Menos código duplicado
- Tipagem consistente

### 5. Services com Tipagem Melhorada

```typescript
class AuthService extends BaseApiService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const validCredentials = loginRequestSchema.parse(credentials)
    
    return this.post<LoginResponse>(
      'login',
      validCredentials,
      undefined,
      loginResponseSchema // Validação do retorno
    )
  }
}
```

### 6. DataService Genérico

```typescript
class DataService<T = any> extends BaseApiService {
  constructor(endpoint: string, private itemSchema?: z.ZodSchema<T>) {
    super(endpoint)
  }

  async fetchTableData(params: FetchTableParams = {}): Promise<PaginatedResponse<T>> {
    const schema = this.itemSchema 
      ? paginatedResponseSchema(this.itemSchema)
      : undefined
      
    return this.get<PaginatedResponse<T>>(undefined, { params }, schema)
  }
}
```

### 7. Hooks com React Query

**Arquivo:** `src/hooks/useApiServices.ts`

```typescript
export const useUploadCsv = (options: UseUploadOptions = {}) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ file, signal }: { file: File; signal?: AbortSignal }) =>
      csvService.upload(file, { 
        onProgress: options.onProgress,
        signal // Cancelamento integrado
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['csv', 'uploads'] })
      options.onSuccess?.(data)
    },
  })
}
```

**Benefícios:**
- Cache automático
- Invalidação inteligente
- Loading states
- Cancelamento de requests

## Como Usar

### Migração Gradual

1. **Novos componentes:** Use os hooks do `useApiServices.ts`
2. **Componentes existentes:** Migre gradualmente das convenience functions para os hooks
3. **Services diretos:** Use as instâncias tipadas (`authService`, `csvService`, etc.)

### Exemplos de Uso

#### Com Hooks (Recomendado)

```tsx
import { useUploadCsv, useUploadHistory } from '@/hooks/useApiServices'

function UploadComponent() {
  const uploadMutation = useUploadCsv({
    onProgress: (progress) => console.log(`${progress}%`),
    onSuccess: (data) => console.log('Upload concluído:', data)
  })
  
  const { data: history, isLoading } = useUploadHistory()
  
  const handleUpload = (file: File) => {
    uploadMutation.mutate({ file })
  }
  
  return (
    // JSX
  )
}
```

#### Com Services Diretos

```tsx
import { csvService } from '@/services/apiService'

const uploadFile = async (file: File) => {
  try {
    const result = await csvService.upload(file, {
      onProgress: (progress) => console.log(`${progress}%`)
    })
    console.log('Upload concluído:', result)
  } catch (error) {
    console.error('Erro no upload:', error)
  }
}
```

#### DataService Tipado

```tsx
import { createDataService } from '@/services/apiService'
import { userSchema } from '@/validation/apiSchemas'

const userService = createDataService('/users', userSchema)

const users = await userService.fetchTableData({
  page: 1,
  pageSize: 20,
  search: 'João'
})
// users é do tipo PaginatedResponse<User>
```

## Benefícios Alcançados

### Performance
- ✅ Cancelamento de requests
- ✅ Cache inteligente com React Query
- ✅ Debounce automático em queries

### Manutenibilidade
- ✅ Código menos duplicado
- ✅ Tipagem forte e consistente
- ✅ Validação centralizada

### Confiabilidade
- ✅ Tratamento de erro padronizado
- ✅ Validação de dados com Zod
- ✅ Contratos de API garantidos

### Developer Experience
- ✅ Autocomplete melhorado
- ✅ Menos código boilerplate
- ✅ Hooks reutilizáveis

## Próximos Passos

1. **Migrar componentes existentes** para usar os novos hooks
2. **Remover convenience functions** quando não houver mais dependências
3. **Extrair localStorage logic** dos services para auth context
4. **Adicionar retry automático** em requests críticos
5. **Implementar batching** para requests múltiplos

## Compatibilidade

As mudanças são **backward compatible**. Os exports antigos ainda funcionam:

```typescript
// ✅ Ainda funciona
import { login, getCurrentUser } from '@/services/apiService'

// ✅ Recomendado para novos códigos
import { useLogin, useCurrentUser } from '@/hooks/useApiServices'
``` 