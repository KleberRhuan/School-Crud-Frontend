
Segue um roteiro totalmente revisado para substituir a solução baseada em notistack pelo react-hot-toast (última versão disponível). Mantive a divisão em etapas, mas ajustei responsabilidades, APIs e tarefas de migração.

====================================================================
ETAPA 0 – Preparação rápida
--------------------------------------------------------------------
1. Remover dependências antigas  
   • `@types/notistack`, `notistack`, utilitários de MUI relacionados.  

2. Instalar novas dependências  
   • `react-hot-toast@latest`  
   • (opcional) `@sentry/react`, `zod`, `@tanstack/react-query` – se já não existirem.  

3. Ajustar providers na árvore de React  
   • Substituir `<SnackbarProvider …>` por  
     ```tsx
     import { Toaster } from 'react-hot-toast';
     …
     <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
     ```  
   • Não é necessário wrapper extra; o componente é auto-contido.

====================================================================
ETAPA 1 – Nova arquitetura de módulos
--------------------------------------------------------------------
1. Manter quatro arquivos independentes, mas adequar à nova lib:  
   • `toast/useToast.ts`        → retorna helpers de react-hot-toast.  
   • `toast/ErrorMessageExtractor.ts`  
   • `toast/SentryReporter.ts`  
   • `toast/ApiErrorInterpreter.ts`

2. `useToast` expõe:  
   • `success`, `error`, `warning`, `info` (mapeiam para `toast.custom` com ícone/cores)  
   • `handleApiError(error, ctx?, opts?)` – usa `ApiErrorInterpreter`.  
   • `dismiss(id?)`, `dismissAll()` (proxy p/ `toast.dismiss`).  

3. Remover completamente `ToastManager`, `toastCache`, `createCacheKey`.  
   • Deduplicação será tratada via `toast.custom({ id: … })` do hot-toast.  
   • Se o mesmo `id` for enviado duas vezes, o toast é atualizado.

====================================================================
ETAPA 2 – Implementação detalhada
--------------------------------------------------------------------
1. `useToast.ts`  
   ```ts
   import toast, { ToastOptions, Toast } from 'react-hot-toast';

   export function useToast() {
     const base = (type: 'success'|'error'|'info'|'warning', msg: string, opts?: ToastOptions) =>
       toast.custom(t => <ToastContent t={t} type={type} msg={msg} />, { id: `${type}-${msg}`, ...opts });

     return {
       success: (m: string, o?: ToastOptions) => base('success', m, o),
       error:   (m: string, o?: ToastOptions) => base('error',   m, o),
       info:    (m: string, o?: ToastOptions) => base('info',    m, o),
       warning: (m: string, o?: ToastOptions) => base('warning', m, o),
       dismiss: toast.dismiss,
       dismissAll: () => toast.dismiss(),
       handleApiError: ApiErrorInterpreter.handle,
     };
   }
   ```

2. `ApiErrorInterpreter.handle`  
   • Decide mensagem + severidade.  
   • Chama `SentryReporter.report()` quando necessário.  
   • Devolve o id do toast (`string | number`) para eventual dismiss.

3. Componente visual (`ToastContent`)  
   • Recebe `type`, `msg`, `t` (objeto do hot-toast).  
   • Usa MUI, Tailwind ou outro kit ― mantendo consistência de UI.

====================================================================
ETAPA 3 – Integração com HTTP
--------------------------------------------------------------------
1. Interceptor Axios / Fetch  
   ```ts
   axios.interceptors.response.use(
     r => r,
     err => {
       const ctx = createContextFromAxios(err);
       useToast().handleApiError(err, ctx);
       return Promise.reject(err);
     }
   );
   ```

2. Propagar `x-trace-id` no `ctx` para Sentry.

====================================================================
ETAPA 4 – Tipagem forte e utilitários
--------------------------------------------------------------------
1. Definir `ApiErrorResponse`, `ViolationItem` com Zod.  
2. Reexportar tudo em `toast/types/index.ts`.  
3. Tornar `handleApiError()` genérico sobre `T extends ApiErrorResponse`.

====================================================================
ETAPA 5 – Testes e qualidade
--------------------------------------------------------------------
1. Configurar Vitest/Jest + `@testing-library/react`.  
2. Mock de `react-hot-toast` usando:  
   ```ts
   vi.mock('react-hot-toast', () => ({
     default: { custom: vi.fn(), dismiss: vi.fn() }
   }));
   ```  
3. Cobrir:  
   • Chamadas `success/error` retornando id deduplicado.  
   • `ApiErrorInterpreter` gerando mensagem correta.  
   • Sentry sendo chamado quando `shouldReport` é verdadeiro.

====================================================================
ETAPA 6 – Performance & UX
--------------------------------------------------------------------
1. `react-hot-toast` já é leve; ainda assim:  
   • Carregar `Toaster` apenas em ambiente browser (Next.js).  
   • Limitar a 3 toasts (`toast.limit(3)`).  
2. Animações de entrada/saída via props `transition`.

====================================================================
ETAPA 7 – Documentação
--------------------------------------------------------------------
1. `src/utils/toast/README.md`  
   • Como usar `useToast`.  
   • Exemplos de tratamento de erro.  
   • Acessibilidade: `role="status"`, foco, tempo de exibição.  
2. `CONTRIBUTING.md` - convenções de id do toast, testes e mocks.

====================================================================
CHECKLIST FINAL
--------------------------------------------------------------------
☐ Dependências antigas removidas  
☐ `react-hot-toast` funcionando com UI customizada  
☐ Hook `useToast` exportado + deduplicação por id  
☐ Interceptor HTTP ligado a `handleApiError`  
☐ Tipagem via Zod + cobertura ≥ 80 %  
☐ Documentação atualizada  

Com este roteiro você elimina o boilerplate do notistack, simplifica o uso em componentes funcionais e ganha animações/performance melhores providas pelo react-hot-toast.
