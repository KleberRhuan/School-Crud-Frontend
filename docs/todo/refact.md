

Read file: src/hooks/api/index.ts


Read file: src/hooks/api/hooks/useApiMutation.ts


Read file: src/hooks/api/factories/mutationFactory.ts


Read file: src/hooks/api/hooks/useApiMutation.ts


Read file: src/hooks/api/factories/mutationFactory.ts

```markdown
## 1. Visão Geral  
- Nível atual de boilerplate: **≈ 22 %** dentro da pasta `src/hooks/api/*` (código que a própria TanStack Query ou o TypeScript já resolve).  
- Bibliotecas sub-utilizadas: **TanStack React Query** (`QueryClient` defaults, `onError`, `useInfiniteQuery`), **TypeScript** (tipagem condicionada).

---

## 2. Detalhamento por Componente  

### 2.1 `useApiQuery.ts`  
| Trecho | Por que é boilerplate? | Recurso que substitui | Exemplo enxuto |
|--------|-----------------------|-----------------------|----------------|
| ```43:56:src/hooks/api/hooks/useApiQuery.ts``` (bloco `try/catch` interno) | `try/catch` apenas para emitir toast; TanStack Query já expõe `onError`. | `UseQueryOptions.onError` | ```ts queryFn: () => apiClient.get<T>(url,config).then(r=>r.data), onError:(e:ApiError)=>showError&&toastService.error(e.message||'Erro')``` |
| ```55:76:src/hooks/api/hooks/useApiQuery.ts``` (`retry`, `retryDelay`, `staleTime`, `gcTime`) | Lógica repetida em vários hooks; pode ficar em **defaultOptions** do `QueryClient`. | `new QueryClient({ defaultOptions:{ queries:{ … }}})` | Definir em `queryClient.ts` e remover daqui. |
| usePaginatedQuery (86-108) – paginação manual | TanStack já oferece `useInfiniteQuery` que resolve paginação, concatenação e cache. | `useInfiniteQuery` | vide exemplo no passo 3. |

### 2.2 `useApiMutation.ts`  
| Trecho | Por que é boilerplate? | Recurso que substitui | Exemplo enxuto |
|--------|-----------------------|-----------------------|----------------|
| ```18:31:src/hooks/api/hooks/useApiMutation.ts``` & repetido em três hooks – construção de `factoryOptions` | Mesma fusão de `toastService` copiada 3×. | Função utilitária (`buildFactoryOptions`) ou `useMemo`. | ```ts const opts = buildFactoryOptions(options, useToastService());``` |

### 2.3 `mutationFactory.ts`  
| Trecho | Por que é boilerplate? | Recurso que substitui | Exemplo enxuto |
|--------|-----------------------|-----------------------|----------------|
| ```140:178:src/hooks/api/factories/mutationFactory.ts``` – função `retry` + `retryDelay` | Mesma política já definida em `useApiQuery.ts`; deve ser global. | `QueryClient` defaults. | Remover bloco; factory herda defaults. |
| 4 helpers (`createPostMutation` etc.) | Só repassam parâmetros fixos; podem ser geradas via `createApiMutation.bind`. | Função curry/partial do TypeScript. | ```ts export const createPostMutation = (url,qc,o)=>createApiMutation({method:'POST',url,queryClient:qc,...o});``` (reduz 12 linhas/ helper). |

### 2.4 `index.ts` vs `useApi.ts`  
- `src/hooks/useApi.ts` apenas re-exporta tudo que `src/hooks/api/index.ts` já exporta. É mantido por compatibilidade, mas gera duplicação de manutenção.  
- Estratégia: marcar como **deprecated** e remover num _major release_, mantendo alias via `package.json#exports` se necessário.

---

## 3. Plano de Ação  
1. **Configuração global**  
   - Criar `src/hooks/api/queryClient.ts` com:  
     ```ts
     export const queryClient = new QueryClient({
       defaultOptions: {
         queries: { staleTime:5*60e3, gcTime:10*60e3, retry, retryDelay },
         mutations:{ retry, retryDelay }
       }
     })
     ```  
   - Mover lógica de `retry`/`retryDelay` para cá.

2. **Simplificar `useApiQuery`**  
   - Remover `try/catch`; usar `onError`.  
   - Excluir props duplicadas (`retry`, `retryDelay`, `staleTime`, `gcTime`).  
   - Trocar `usePaginatedQuery` por hook baseado em `useInfiniteQuery`:

     ```ts
     export const usePaginatedQuery = <T>(
       key:QueryKey,url:string,params={},opt?:UseInfiniteQueryOptions<PaginatedResponse<T>>
     )=>useInfiniteQuery({
         queryKey:[...key,params],
         queryFn:({pageParam=1})=>apiClient.get(url,{params:{...params,page:pageParam}})
                         .then(r=>r.data),
         getNextPageParam:(last)=>last.hasMore?last.page+1:undefined,
         ...opt
     })
     ```

3. **Refatorar `useApiMutation`**  
   - Criar `buildFactoryOptions(options,ctxToast)` e reutilizar nos três hooks.  
   - Opcional: criar hook único `useApiMutation(method)` se desejado.

4. **Enxugar `mutationFactory.ts`**  
   - Apagar bloco custom de retry/backoff.  
   - Compactar helpers com função `partial`.  
   - Extrair `HTTP_METHOD_MAP` para lib utilitária compartilhada se usado em outros locais.

5. **Road-map para `useApi.ts`**  
   - Anotar `/** @deprecated usar '@/hooks/api' **/`.  
   - Adicionar teste de snapshot garantindo exports equivalentes até a remoção.

---

## 4. Métricas de Validação  

| Critério | Meta | Validação |
|----------|------|-----------|
| Redução de LOC | `useApiQuery.ts` ≤ 80 linhas (-25 %) | `cloc` antes/depois |
| Duplication | 0 ocorrências de bloco `retry:` em hooks/factory | `grep -R "retry: (failureCount"` |
| Cobertura testes | mantém 100 % existentes + novos para `useInfiniteQuery` | `pnpm test --coverage` |
| Deprecation | build sem warnings de export duplicado | `tsc --noEmit` |
| Bundle size | ≈ –0.5 kB após tree-shaking (`index.ts` duplicado) | `vite build --report` |

Após estes passos, o código passa a utilizar totalmente as facilidades nativas do TanStack Query, reduzindo boilerplate, pontos de configuração duplicados e melhora a manutenibilidade.
```
