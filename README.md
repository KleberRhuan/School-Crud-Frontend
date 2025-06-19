# Desafio Fullstack – Instalações Escolares

## 💡 Descrição

Aplicação fullstack para gestão de dados escolares com upload de CSV e CRUD completo, desenvolvida com **React 19** + **TypeScript** no frontend e integração com API REST Java Spring Boot.

O sistema permite importar dados de escolas via upload de arquivo CSV, visualizar em tabelas interativas, e realizar operações CRUD (criar, ler, atualizar, deletar) com autenticação JWT.

## 🚀 Tecnologias

### Frontend
- **React 19.1** - Framework principal com React Compiler
- **TypeScript 5.8** - Tipagem estática
- **TanStack Router 1.121** - Roteamento type-safe
- **TanStack Query 5.80** - Data fetching e cache
- **Material UI 7.1** - Componentes de interface
- **AG Grid 33** - Tabelas avançadas com virtualização
- **Zustand 5.0** - Gerenciamento de estado
- **React Hook Form 7.58** - Formulários
- **Zod 3.25** - Validação de schemas
- **Vite 6.3** - Build tool moderna

### Autenticação & Segurança
- **JWT** - Autenticação stateless
- **Refresh Token** - Renovação automática de sessão
- **Guards** - Proteção de rotas

### Styling & UX
- **Tailwind CSS 4.1** - Framework CSS utilitário
- **Framer Motion 12** - Animações
- **Notistack 3.0** - Sistema de notificações

### Testing & Quality
- **Vitest 3.2** - Framework de testes
- **Testing Library 16** - Testes de componentes
- **Playwright 1.53** - Testes E2E
- **ESLint 9** - Linting
- **Prettier 3.5** - Formatação de código

## 🛠 Como Executar

### Pré-requisitos
- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recomendado) ou npm/yarn
- **Docker** (opcional, para execução em containers)

### Clone o repositório
```bash
git clone https://github.com/kleberrhuan/houer-frontend.git
cd houer-frontend
```

### 🐳 Execução com Docker (Recomendado)

#### Desenvolvimento Local
```bash
# Rodar apenas o frontend em modo desenvolvimento
docker compose --profile dev up houer-frontend-dev

# Com logs em tempo real
docker compose --profile dev up houer-frontend-dev --build

# Em segundo plano
docker compose --profile dev up houer-frontend-dev -d
```

**Acesso**: http://localhost:5173

**Características do ambiente de desenvolvimento:**
- ✅ Hot reload automático
- ✅ Volumes montados (edições refletem instantaneamente)
- ✅ Porta 5173 (padrão do Vite)
- ✅ Leve e rápido (sem nginx)

#### Produção
```bash
# Build e execução para produção
docker compose up houer-frontend

# Em segundo plano
docker compose up houer-frontend -d
```

**Acesso**: http://localhost:3000

**Características do ambiente de produção:**
- ✅ Build otimizado com nginx
- ✅ Servir arquivos estáticos
- ✅ Health checks configurados
- ✅ Pronto para deploy

#### Comandos Úteis Docker
```bash
# Ver logs
docker compose logs houer-frontend-dev -f

# Parar containers
docker compose down

# Rebuild forçado
docker compose build --no-cache

# Remover volumes e imagens
docker compose down -v --rmi all
```

### 💻 Execução Local (Sem Docker)

#### 1. Instale as dependências
```bash
pnpm install
# ou
npm install
```

#### 2. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_TITLE=Houer - Gestão Escolar
VITE_SENTRY_DSN=sua_dsn_do_sentry_opcional
```

#### 3. Execute o servidor de desenvolvimento
```bash
pnpm dev
# ou
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

#### 4. Build para produção
```bash
pnpm build
# ou
npm run build
```

### Backend (Instruções para Integração)

O frontend está configurado para integrar com uma API REST Java Spring Boot. Certifique-se de que o backend esteja rodando em `http://localhost:8080` com os seguintes endpoints:

```
POST /api/v1/auth/login          # Autenticação
POST /api/v1/auth/register       # Registro de usuário  
POST /api/v1/auth/refresh        # Refresh token
GET  /api/v1/schools             # Listar escolas
POST /api/v1/schools             # Criar escola
PUT  /api/v1/schools/{code}      # Atualizar escola
DELETE /api/v1/schools/{code}    # Deletar escola
POST /api/v1/schools/import/csv  # Upload CSV
```

## 📌 Funcionalidades

### ✅ Autenticação Completa
- **Login/Logout** com validação de credenciais
- **Registro** de novos usuários
- **Recuperação de senha** via email
- **Refresh token** automático
- **Proteção de rotas** com guards
- **Redirecionamento** inteligente após login

### 📊 Gestão de Escolas
- **CRUD completo** - Criar, listar, editar e excluir escolas
- **Tabela interativa** com AG Grid:
  - Ordenação por colunas
  - Filtros avançados
  - Paginação virtualizada
  - Busca rápida
  - Exportação para CSV
- **Formulários validados** com React Hook Form + Zod
- **Upload de métricas** personalizadas por escola

### 📁 Upload de CSV
- **Drag & drop** para upload de arquivos
- **Validação** de formato e conteúdo
- **Progress tracking** em tempo real via WebSocket
- **Preview** dos dados antes da importação
- **Tratamento de erros** detalhado
- **Suporte a arquivos grandes** com processamento em lotes

### 🎨 Interface Moderna
- **Design responsivo** para desktop e mobile
- **Tema escuro/claro** (configurável)
- **Animações suaves** com Framer Motion
- **Notificações** contextuais
- **Estados de loading** e erro
- **Skeleton loading** para melhor UX

### 🚀 Performance
- **React 19** com React Compiler para otimizações automáticas
- **Code splitting** automático por rotas
- **Cache inteligente** com TanStack Query
- **Virtualização** de listas grandes
- **Memoização** de componentes pesados

## 🔐 Usuário de teste

```
Login: admin@houer.com
Senha: admin123
```

> **Nota**: Este usuário deve ser criado no backend para testes. O sistema também permite registro de novos usuários.

## 📋 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build otimizado para produção |
| `pnpm preview` | Preview do build de produção |
| `pnpm test` | Testes unitários em modo watch |
| `pnpm test:run` | Executar todos os testes |
| `pnpm test:coverage` | Relatório de cobertura |
| `pnpm e2e` | Testes end-to-end |
| `pnpm lint` | Verificação de código |
| `pnpm lint:fix` | Correção automática de linting |
| `pnpm format` | Formatação de código |
| `pnpm type-check` | Verificação de tipos TypeScript |
| `pnpm quality:full` | Análise completa de qualidade |

## 🧪 Testes

O projeto possui cobertura abrangente de testes:

```bash
# Testes unitários
pnpm test

# Testes com cobertura
pnpm test:coverage

# Testes E2E
pnpm e2e

# Verificação completa
pnpm quality:full
```

## 📁 Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
├── features/          # Features específicas (schools, auth)
│   ├── schools/       # Módulo de escolas
│   │   ├── components/  # Componentes do módulo
│   │   ├── hooks/      # Hooks específicos
│   │   ├── pages/      # Páginas do módulo
│   │   └── services/   # Serviços de API
├── hooks/             # Hooks globais
├── lib/               # Configurações de bibliotecas
├── pages/             # Páginas principais
├── providers/         # Context providers
├── schemas/           # Schemas de validação
├── stores/            # Estado global (Zustand)
├── styles/            # Estilos globais
└── utils/             # Utilitários
```

## 🌐 Deploy

O projeto está configurado para deploy em:
- **Vercel** (recomendado para frontend)
- **Netlify**
- **GitHub Pages**
- **Docker** (Dockerfile incluído)

### Build para produção
```bash
pnpm build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 🔗 Links Úteis

- 📖 [Documentação do React 19](https://react.dev)
- 🔄 [TanStack Query](https://tanstack.com/query)
- 🎯 [TanStack Router](https://tanstack.com/router)
- 📊 [AG Grid React](https://ag-grid.com/react-data-grid/)
- 🎨 [Material UI](https://mui.com)

## 📞 Contato

**Desenvolvedor**: Kleber Rhuan  
**Email**: [seu-email@exemplo.com]  
**LinkedIn**: [seu-linkedin]  

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**⚡ Desenvolvido com React 19 + TypeScript para máxima performance e experiência do desenvolvedor** 