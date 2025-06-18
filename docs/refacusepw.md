

Read file: /Users/kleberrhuan/Downloads/houer-frontend/src/services/apiService.ts

Read file: /Users/kleberrhuan/Downloads/houer-frontend/src/services/apiService.ts


Read file: /Users/kleberrhuan/Downloads/houer-frontend/src/services/authService.ts

Resumo Executivo  
Os services cumprem o seu papel básico, mas repetem muito código, misturam responsabilidades (ex.: storage/local × requisições) e ignoram recursos já disponíveis (interceptors do Axios, React Query). Há oportunidades de fortalecer a tipagem com generics e validação com Zod, além de melhorar performance (cancelamento) e robustez (retry, timeout centralizado).

Lista de Issues & Sugestões  
1. Problema: Replicação de chamadas `api.<método>` + `return response.data` em todos os métodos.  
   Sugestão: Criar wrapper genérico (`request<T>(...)`) dentro de `BaseApiService` ou usar interceptors para extrair `response.data`.  
   Prioridade: Alta  

2. Problema: Ausência de tratamento padronizado de erros; cada service (ou nenhum) faz `try/catch`.  
   Sugestão: Interceptor Axios para normalizar erros + classe `ApiError`; disponibilizar utilitário `handleError`.  
   Prioridade: Alta  

3. Problema: Falta de tipagem genérica nas respostas (`Promise<any>` em vários pontos; `DataService` não parametriza tipo).  
   Sugestão: Usar generics `<T>` ­ (`fetchTableData<T>() : Promise<PaginatedResponse<T>>`).  
   Prioridade: Média  

4. Problema: Validação de dados inexistente (confia no backend).  
   Sugestão: Validar payload e response com Zod (`loginSchema`, `userSchema`).  
   Prioridade: Média  

5. Problema: Upload grande sem cancelamento nem retry.  
   Sugestão: Passar `AbortSignal` no `axios` e usar lib de retry (`axios-retry`) ou interceptor simples.  
   Prioridade: Baixa  

6. Problema: Duplicação de instâncias Axios (`authService.ts` cria novo client).  
   Sugestão: Reaproveitar `/utils/axios` ou exportar fábrica; manter configuração central única.  
   Prioridade: Alta  

7. Problema: Side-effects misturados em services (ex.: `localStorage.removeItem` dentro de `logout`).  
   Sugestão: Deixar responsabilidade de session storage em camada de auth-context ou hook; service deve só fazer request.  
   Prioridade: Média  

8. Problema: Convenience functions no fim do arquivo geram acoplamento global e podem conflitar em tree-shaking.  
   Sugestão: Expor apenas instâncias/ métodos via factory; migrar gradualmente e remover funções globais.  
   Prioridade: Baixa  

Exemplos de Refatoração  

Antes  
```ts
async login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(this.buildUrl('login'), credentials)
  return response.data
}
```

Depois  
```ts
// BaseApiService.ts
protected async request<T>(cfg: AxiosRequestConfig): Promise<T> {
  const { data } = await api.request<T>(cfg)
  return data
}

// AuthService.ts
login(credentials: LoginRequest) {
  return this.request<LoginResponse>({
    url: this.buildUrl('login'),
    method: 'POST',
    data: credentials,
  })
}
```
Justificativa técnica  
• Elimina repetição, reduzindo chances de erro.  
• `request<T>` garante retorno tipado.  

–––

Antes  
```ts
try {
  await api.post('/auth/password/forgot', { email })
} catch (error) {
  handleApiError(error)
}
```

Depois  
```ts
// utils/axios.ts
api.interceptors.response.use(
  res => res,
  err => Promise.reject(normalizeError(err))
)

// Qualquer service
export const requestPasswordReset = (email: string) =>
  api.post<void>('/auth/password/forgot', { email })
```
Justificativa técnica  
• Centraliza a normalização de erros; serviços ficam enxutos.  

–––

Validação com Zod (exemplo)  
```ts
const loginResponseSchema = z.object({
  access_token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    roles: z.array(z.string()),
    avatar: z.string().url().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
})

const data = await this.request<unknown>({...})
const parsed = loginResponseSchema.parse(data)
```
• Garante contrato de dados no frontend sem dependências extra (Zod já indicado).

Em síntese, movendo lógica comum para interceptors/wrappers, adicionando generics + Zod e separando responsabilidades, os services ficarão mais concisos, seguros e fáceis de manter.
