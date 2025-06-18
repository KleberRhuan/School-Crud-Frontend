# 🎯 Setup do Zero - Checklist Completo

Guia passo-a-passo para configurar o projeto Houer Frontend do zero. **Meta: onboarding em ≤ 30 minutos**.

## 📋 Pré-requisitos (5 minutos)

### ✅ Software Necessário

- [ ] **Node.js 18+** - [Download aqui](https://nodejs.org/)
- [ ] **pnpm 8+** - `npm install -g pnpm@latest`
- [ ] **Git** - [Download aqui](https://git-scm.com/)
- [ ] **VS Code** (recomendado) - [Download aqui](https://code.visualstudio.com/)

### ✅ Verificar Instalações

```bash
# Verificar versões
node --version    # >= 18.0.0
pnpm --version    # >= 8.0.0
git --version     # qualquer versão recente
```

### ✅ Extensões VS Code (Opcional mas Recomendado)

- [ ] **TypeScript Importer** - Auto import TS
- [ ] **ES7+ React/Redux/React-Native snippets** - Snippets React
- [ ] **Prettier** - Formatação automática
- [ ] **ESLint** - Linting em tempo real
- [ ] **Auto Rename Tag** - Renomear tags JSX
- [ ] **Bracket Pair Colorizer** - Colorir brackets
- [ ] **GitLens** - Integração Git avançada

## 🚀 Setup do Projeto (10 minutos)

### 1. ✅ Clone e Configuração Inicial

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd houer-frontend

# Instalar dependências (pode demorar 2-3 minutos)
pnpm install

# Verificar se instalação foi bem-sucedida
pnpm --version
```

### 2. ✅ Configuração de Ambiente

```bash
# Copiar arquivo de ambiente
cp .env.example .env.local

# Editar variáveis de ambiente
# Abrir .env.local e configurar:
```

**Arquivo `.env.local`:**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_JWT_SECRET=your-jwt-secret-here
VITE_REFRESH_TOKEN_ENDPOINT=/auth/refresh

# Features Flags
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_MSW=false

# Sentry (opcional para monitoramento)
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=development
```

### 3. ✅ Primeira Execução

```bash
# Executar em modo desenvolvimento
pnpm dev

# ✅ Se tudo estiver correto, você verá:
# ➜ Local:   http://localhost:5173/
# ➜ Network: http://192.168.x.x:5173/
```

**Abra http://localhost:5173** - você deve ver a aplicação funcionando!

## 🧪 Verificação dos Hooks API (5 minutos)

### ✅ Teste dos Hooks Principais

Criar arquivo de teste temporário: `src/TestHooks.tsx`

```tsx
import { useApiQuery, useApiUpdate, useToastService } from '@/hooks/api'

export function TestHooks() {
  // ✅ Teste useApiQuery - buscar perfil
  const { data: profile, isLoading } = useApiQuery({
    endpoint: '/auth/me',
    queryKey: ['profile'],
    // Mock data se API não estiver disponível
    initialData: { id: 1, name: 'João Teste', email: 'joao@teste.com' }
  })

  // ✅ Teste useApiUpdate - atualizar perfil
  const updateProfile = useApiUpdate({
    endpoint: '/auth/profile',
    successMessage: 'Perfil atualizado com sucesso!',
    invalidateQueries: [['profile']]
  })

  // ✅ Teste useToastService
  const toast = useToastService()

  const handleTestToast = () => {
    toast.success('Toast funcionando! 🎉')
    toast.warning('Aviso de teste')
    toast.error('Erro de teste')
  }

  const handleTestUpdateProfile = () => {
    updateProfile.mutate({
      name: 'João Atualizado',
      email: 'joao.novo@teste.com'
    })
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">🧪 Teste dos Hooks API - Auth</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">👤 useApiQuery - Perfil</h3>
        <p>Loading: {isLoading ? '✅ Sim' : '❌ Não'}</p>
        <p>Nome: {profile?.name}</p>
        <p>Email: {profile?.email}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">🎨 Toast Service</h3>
        <button 
          onClick={handleTestToast}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Testar Toasts
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">✏️ Update Profile</h3>
        <button 
          onClick={handleTestUpdateProfile}
          disabled={updateProfile.isPending}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {updateProfile.isPending ? 'Atualizando...' : 'Testar Update Perfil'}
        </button>
      </div>

      {/* Status dos hooks */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h4 className="font-semibold">Status dos Hooks:</h4>
        <ul className="mt-2 space-y-1">
          <li>✅ useApiQuery: {profile ? 'Funcionando' : 'Erro'}</li>
          <li>✅ useToastService: {toast ? 'Funcionando' : 'Erro'}</li>
          <li>✅ useApiUpdate: {updateProfile ? 'Funcionando' : 'Erro'}</li>
        </ul>
      </div>
    </div>
  )
}
```

### ✅ Adicionar ao Router Principal

Editar `src/router.tsx` e adicionar rota de teste:

```tsx
// Adicionar import
import { TestHooks } from './TestHooks'

// Adicionar rota (temporária)
{
  path: '/test-hooks',
  element: <TestHooks />
}
```

**Acessar http://localhost:5173/test-hooks** e verificar se tudo funciona!

## 🛠️ Configuração de Ferramentas (5 minutos)

### ✅ Configurar ESLint e Prettier

```bash
# Verificar configuração do ESLint
pnpm lint

# Verificar formatação
pnpm format:check

# Corrigir problemas automaticamente
pnpm lint:fix
pnpm format
```

### ✅ Configurar Testes

```bash
# Executar testes
pnpm test

# Executar com UI (Vitest UI)
pnpm test:ui

# Coverage de testes
pnpm test:coverage
```

### ✅ Configurar Git Hooks (Opcional)

```bash
# Instalar husky para git hooks
pnpm add -D husky

# Configurar pre-commit
npx husky add .husky/pre-commit "pnpm lint:fix && pnpm format"
```

## 🎯 Verificação Final (5 minutos)

### ✅ Checklist de Funcionamento

- [ ] ✅ Aplicação carrega em http://localhost:5173
- [ ] ✅ Não há erros no console do navegador
- [ ] ✅ Hot reload funciona (salvar arquivo e ver mudança instantânea)
- [ ] ✅ Hooks API respondem corretamente em `/test-hooks`
- [ ] ✅ Toast notifications aparecem
- [ ] ✅ ESLint não mostra erros: `pnpm lint`
- [ ] ✅ Testes passam: `pnpm test:run`
- [ ] ✅ Build de produção funciona: `pnpm build`

### ✅ Executar Quality Check Completo

```bash
# Análise completa de qualidade
pnpm quality:full

# ✅ Deve mostrar algo como:
# ✅ ESLint: 0 errors, 0 warnings  
# ✅ TypeScript: 0 errors
# ✅ Tests: All passed
# ✅ Quality Score: 85%+
```

## 📚 Próximos Passos

### ✅ Limpar Arquivos de Teste

```bash
# Remover arquivo de teste
rm src/TestHooks.tsx

# Remover rota de teste do router.tsx
# (editar manualmente src/router.tsx)
```

### ✅ Explorar Documentação

- [ ] 📖 [README principal](../README.md) - Guia dos hooks com exemplos
- [ ] 📋 [Documentação técnica](./api-hooks-documentation.adoc) - Detalhes técnicos
- [ ] 🔄 [Guia de migração](./migration-guide.md) - Se migrando de versão anterior
- [ ] 📈 [Relatório de refatoração](../README-REFACTORING.md) - Melhorias implementadas

### ✅ Configurações Opcionais

#### Configurar Storybook (Design System)

```bash
# Instalar Storybook
npx storybook@latest init

# Executar Storybook
pnpm storybook
```

#### Configurar MSW (Mock Service Worker)

```bash
# Para desenvolvimento sem backend
pnpm add -D msw

# Inicializar MSW
npx msw init public/

# Configurar em src/mocks/handlers.ts
```

#### Configurar Docker (Containerização)

```bash
# Build da imagem Docker
docker build -t houer-frontend .

# Executar container
docker run -p 3000:80 houer-frontend
```

## 🚨 Troubleshooting

### ❌ Problemas Comuns

#### **Erro: "Cannot resolve '@/hooks/api'"**

```bash
# Verificar se paths estão configurados em tsconfig.json
# Deve conter:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

#### **Erro: "pnpm command not found"**

```bash
# Instalar pnpm globalmente
npm install -g pnpm@latest

# Ou usar npx
npx pnpm install
```

#### **Erro de porta em uso (localhost:5173)**

```bash
# Matar processo na porta 5173
npx kill-port 5173

# Ou usar porta diferente
pnpm dev --port 3001
```

#### **Erro: "Failed to fetch" nos hooks API**

1. Verificar se VITE_API_BASE_URL está correto no .env.local
2. Verificar se backend está rodando
3. Verificar CORS no backend
4. Usar mock data temporariamente

#### **Toast não aparece**

1. Verificar se ToastProvider está configurado no App.tsx
2. Verificar imports dos hooks
3. Verificar se notistack está instalado

#### **Testes falhando**

```bash
# Limpar cache dos testes
pnpm test:run --run --reporter=verbose

# Verificar setup de testes
cat src/setupTests.ts
```

## 📊 Métricas de Sucesso

### ✅ KPIs do Setup

- **⏱️ Tempo total**: ≤ 30 minutos
- **🚫 Erros**: 0 erros no console
- **🧪 Testes**: 100% passando
- **📊 Quality Score**: ≥ 85%
- **🏃‍♂️ Performance**: Build < 30 segundos

### ✅ Checklist Final

- [ ] Projeto clonado e dependências instaladas
- [ ] Aplicação rodando em desenvolvimento
- [ ] Hooks API testados e funcionando
- [ ] Ferramentas de qualidade configuradas
- [ ] Documentação lida e compreendida
- [ ] Ambiente pronto para desenvolvimento

---

## 🎉 Parabéns!

Se chegou até aqui com todas as verificações ✅, seu ambiente está **100% configurado** e pronto para desenvolvimento!

### 📞 Suporte

Se encontrar problemas:

1. 📖 Consulte a [documentação técnica](./api-hooks-documentation.adoc)
2. 🔍 Procure no [troubleshooting](#-troubleshooting) acima
3. 📋 Abra uma issue no repositório
4. 💬 Contate o time de desenvolvimento

**🚀 Bom desenvolvimento!** 