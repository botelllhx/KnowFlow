# CLAUDE.md — KnowFlow

Guia completo para o assistente AI trabalhar no projeto KnowFlow.
Leia este arquivo inteiro antes de qualquer implementação.

---

## 1. O QUE É O KNOWFLOW

KnowFlow é uma **plataforma de conhecimento operacional vivo**.

Ela resolve problemas reais de organizações:
- Dependência de pessoas-chave (quando alguém sai, o conhecimento some)
- Onboarding complexo e demorado
- Documentação morta que ninguém lê
- Dificuldade de continuidade operacional
- Processos que existem só na cabeça de uma pessoa

**O KnowFlow transforma conhecimento em:**
- Fluxos navegáveis e interativos
- Estruturas visuais vivas
- Playbooks operacionais colaborativos
- Experiências de documentação que as pessoas realmente usam

**Posicionamento:** produto SaaS nível startup internacional — Linear, Notion AI, Vercel, Arc Browser.

---

## 2. ESTADO ATUAL DO PROJETO

### O que existe e funciona

| Área | Estado |
|------|--------|
| Editor de fluxos (FlowEditor) | Funcional — 3 etapas, React Flow, 3 tipos de nó |
| Visualizador de fluxos (FlowViewer) | Funcional — comentários, curtidas, salvar |
| Feed de fluxos | Funcional — lista flows públicos com filtros |
| Comunidade | Funcional — posts, upvotes, comentários |
| Autenticação | Funcional — JWT, login, cadastro, recuperação |
| Perfil de usuário | Funcional — flows do usuário, stats, posts |
| Sidebar | Funcional — navegação principal com Liquid Glass |
| Landing page | Existente |
| Backend API REST | Funcional — Express + Sequelize + PostgreSQL |
| Docker Compose | Configurado — postgres, redis, server, client |
| Migrations | Configuradas — Sequelize CLI |

### Telas existentes

```
client/src/pages/
├── Auth/
│   ├── Landing/       — página inicial pública
│   ├── Login/         — autenticação
│   ├── Register/      — cadastro
│   └── RecuperarSenha/
├── Feed/              — lista de flows (Flow Network futuro)
├── Community/         — posts e discussões
├── FlowEditor/        — editor de fluxos (3 steps)
├── FlowViewer/        — visualização e interação com flow
├── PostPage/          — página de post individual
└── Profile/           — perfil do usuário logado
```

### Telas que NÃO existem ainda

- Dashboard (primeira tela pós-login)
- Flow Network (versão evoluída do Feed — centro do produto)
- Pulse (analytics operacional)
- Workspaces
- Analytics detalhado
- Modo Execução
- Admin
- Requests

---

## 3. STACK REAL DO PROJETO

> ATENÇÃO: o spec menciona TypeScript e TailwindCSS. O projeto usa JSX e styled-components. NÃO migrar sem decisão explícita do usuário.

### Frontend (`client/`)

| Tech | Versão | Uso |
|------|--------|-----|
| React | 19 | Framework principal |
| React Router | 6 | Roteamento |
| styled-components | 6 | Estilização — padrão do projeto |
| React Flow | 11 | Editor e visualizador de fluxos |
| Zustand | 5 | State management global |
| Framer Motion | — | Animações |
| Lucide React | — | Ícones |
| Axios | — | HTTP via `client/src/services/api.js` |
| React Toastify + Sonner | — | Notificações (dois sistemas — unificar futuro) |
| GSAP | — | Animações avançadas (preparado) |

### Backend (`server/`)

| Tech | Versão | Uso |
|------|--------|-----|
| Node.js | 20 | Runtime |
| Express | 4 | Framework HTTP |
| Sequelize | 6 | ORM |
| PostgreSQL | 16 | Banco principal |
| JWT + bcryptjs | — | Autenticação |
| Helmet | — | Segurança HTTP |
| express-rate-limit | — | Rate limiting |
| Redis | — | Container pronto, zero uso no código |

### Infra

| Tech | Uso |
|------|-----|
| Docker + Docker Compose | Desenvolvimento e produção |
| Nginx | Serve o client em produção (SPA routing) |
| Redis | Container existe, não integrado à aplicação ainda |

---

## 4. ARQUITETURA

### Frontend

```
client/src/
├── components/          — componentes reutilizáveis
│   ├── Sidebar/         — navegação principal
│   ├── FlowCard/        — card de flow no feed
│   ├── TextNode/        — nó de texto no React Flow
│   ├── DecisionNode/    — nó de decisão
│   ├── MediaNode/       — nó de imagem
│   └── ...
├── pages/               — páginas/rotas
├── routes/              — configuração de rotas React Router
│   ├── index.jsx        — roteador principal
│   ├── AuthRoutes.jsx
│   ├── FeedRoutes.jsx
│   ├── FlowRoutes.jsx
│   ├── CommunityRoutes.jsx
│   └── ProfileRoutes.jsx
├── store/               — Zustand stores
│   ├── flowStore.js     — flows, CRUD, fork
│   ├── userStore.js     — usuário logado
│   ├── statisticsStore.js
│   ├── filterStore.js
│   └── uiStore.js       — overlay, modais, search
├── services/
│   └── api.js           — axios instance centralizada (ÚNICO ponto de HTTP)
└── styles/
    ├── theme.js          — design tokens (Liquid Glass)
    └── GlobalStyle.js    — reset + CSS global
```

### Padrão de componente

Cada componente/página usa dois arquivos:
- `index.jsx` — lógica e JSX
- `style.jsx` — styled-components exportados como `* as S`

Exemplo de uso:
```jsx
import * as S from './style';
// uso: <S.Container>, <S.Title>, etc.
```

### Chamadas HTTP

**SEMPRE usar `api` de `../../services/api`.**
Nunca importar axios diretamente. Nunca colocar URLs hardcoded.
O interceptor de auth e o baseURL já estão configurados em `api.js`.

```js
// CORRETO
import api from '../../services/api';
const response = await api.get('/flow');

// ERRADO — nunca fazer
import axios from 'axios';
axios.get('https://...azure.../api/flow');
```

### Backend

```
server/
├── app.js               — Express app, middlewares, rotas, health check
├── db.js                — conexão Sequelize
├── src/
│   ├── controllers/     — lógica de negócio
│   ├── models/          — modelos Sequelize
│   ├── middlewares/
│   │   └── auth.js      — validação JWT
│   └── routes/          — rotas Express
└── migrations/          — schema do banco (NUNCA usar sync)
```

**Schema sempre via migrations.** Jamais usar `sequelize.sync()` ou `sync({alter:true})` em produção.

---

## 5. MODELOS DE DADOS

### Usuario
```
id (UUID), nome, email, senha, cargo, empresa, descricao, avatar_url, criado_em
```

### Flow
```
id (UUID), titulo, descricao, conteudo_nos (JSON), conteudo_conexoes (JSON),
categoria, tags (ARRAY), status (ENUM: rascunho|publicado|arquivado),
visualizacoes (INT), fork_de (UUID nullable), criado_por (FK Usuario), criado_em
```

### Comentario
```
id (UUID), mensagem, flow_id (FK), usuario_id (FK), criado_em
```

### Curtida
```
usuario_id (FK), flow_id (FK) — chave composta
```

### FlowSalvo
```
usuario_id (FK), flow_id (FK) — chave composta
```

### PostagemComunidade
```
id (UUID), titulo, conteudo, tipo, categoria, tags (ARRAY),
upvotes, downvotes, criado_por (FK), criado_em
```

---

## 6. DESIGN SYSTEM — LIQUID GLASS

### Filosofia visual

O KnowFlow deve parecer um produto premium de 2026.
Referências: Linear, Arc Browser, Raycast, Notion AI, Vercel, Apple.

**Nunca:**
- Cards genéricos com bordas pesadas
- Aparência Bootstrap
- Aparência BPM corporativa
- Dashboard de BI

**Sempre:**
- Superfícies translúcidas com backdrop-filter
- Profundidade suave com blur e sombras sutis
- Espaço em branco generoso
- Tipografia com hierarquia clara
- Animações fluidas (não flashy)

### Tokens disponíveis em `theme.js`

```js
theme.colors.primary         // #233DFF — azul principal
theme.colors.glass           // rgba translúcido para superfícies
theme.colors.glassStrong     // glass mais opaco
theme.colors.surface         // fundo de cards
theme.colors.surfaceHover
theme.colors.gradients.primary
theme.colors.gradients.glass
theme.blur.md                // backdrop-filter blur padrão
theme.transitions.smooth     // cubic-bezier premium
theme.typography.fontSizes
theme.zIndex
```

### Padrão de superfície glass

```css
background: ${({ theme }) => theme.colors.glass};
backdrop-filter: blur(${({ theme }) => theme.blur.md});
border: 1px solid rgba(255, 255, 255, 0.12);
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
```

---

## 7. ROTEAMENTO ATUAL

```jsx
// App.jsx — sidebar oculta em:
const hideSidebarOn = ["/", "/login", "/cadastro", "/recuperar-senha"];

// routes/index.jsx — rotas existentes:
/              → Landing
/login         → Login
/cadastro      → Register
/recuperar-senha → RecuperarSenha
/feed          → Feed
/flow/:id      → FlowViewer
/criar-flow    → FlowEditor
/editar-flow/:id → FlowEditor (modo edição)
/comunidade    → Community
/post/:id      → PostPage
/perfil        → Profile
```

**Rotas a criar:**
```
/flow-network  → Flow Network (primeira tela pós-login — centro do produto)
/dashboard     → Dashboard (ferramenta de visão pessoal, acessada via Sidebar)
/pulse         → Pulse System
/workspaces    → Workspaces
/workspace/:id → Workspace individual
/analytics     → Analytics
/requests      → Requests
/admin         → Admin
```

---

## 8. AUTENTICAÇÃO

O token JWT é armazenado em `localStorage.getItem('token')`.
O `usuarioId` é armazenado em `localStorage.getItem('usuarioId')`.

O interceptor em `api.js` já injeta o token em todas as requisições automaticamente.
Ao receber 401, o interceptor faz logout automático e redireciona para `/login`.

**Problema atual:** não existe `ProtectedRoute`. A verificação de auth é feita dentro de cada componente via `useEffect`. Isso deve ser corrigido criando um `ProtectedRoute` em `client/src/routes/`.

---

## 9. STORES ZUSTAND

```js
// flowStore.js
{ flows, fetchFlows, createFlow, updateFlow, deleteFlow, loading }

// userStore.js
{ user, fetchUser, loading }

// statisticsStore.js
{ statistics, fetchStatistics }

// filterStore.js
{ filtros, fetchFiltros }

// uiStore.js
{ isOverlayActive, isSearchModalOpen, isLogoutModalOpen, setters... }
```

---

## 10. API ENDPOINTS EXISTENTES

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/health` | — | Health check |
| POST | `/api/usuario/cadastro` | — | Registro |
| POST | `/api/usuario/login` | — | Login |
| GET | `/api/usuario/me` | JWT | Perfil do usuário |
| PUT | `/api/usuario/me` | JWT | Atualizar perfil |
| GET | `/api/flow` | — | Listar flows |
| POST | `/api/flow` | JWT | Criar flow |
| GET | `/api/flow/:id` | — | Detalhes + incrementa visualizações |
| PUT | `/api/flow/:id` | JWT | Atualizar flow |
| DELETE | `/api/flow/:id` | JWT | Deletar flow |
| POST | `/api/flow/:id/fork` | JWT | Forkar flow |
| GET | `/api/curtidas` | JWT | Listar curtidas |
| POST | `/api/curtidas` | JWT | Curtir flow |
| DELETE | `/api/curtidas/:uid/:fid` | JWT | Descurtir |
| GET | `/api/flowsalvos` | JWT | Flows salvos |
| POST | `/api/flowsalvos` | JWT | Salvar flow |
| DELETE | `/api/flowsalvos/:uid/:fid` | JWT | Remover salvo |
| GET | `/api/comentario` | — | Comentários |
| POST | `/api/comentario` | JWT | Adicionar comentário |
| PUT | `/api/comentario/:id` | JWT | Editar comentário |
| DELETE | `/api/comentario/:id` | JWT | Deletar comentário |
| GET | `/api/PostagemComunidade` | — | Posts comunidade |
| POST | `/api/PostagemComunidade` | JWT | Criar post |
| GET | `/api/filtros` | — | Filtros disponíveis |

---

## 11. CONVENÇÕES DE CÓDIGO

### Nomenclatura

- Componentes e páginas: PascalCase (`FlowCard`, `FlowViewer`)
- Funções e variáveis: camelCase
- Arquivos de componente: `index.jsx` + `style.jsx`
- Stores: `nomeStore.js`
- Controllers backend: `nomeController.js`
- Rotas backend: `nomeRoutes.js` ou `nomeRouter.js`

### Padrões obrigatórios

1. Nunca importar axios diretamente — usar `api` de `services/api.js`
2. Nunca hardcodar URLs — sempre usar rotas relativas com `api`
3. Nunca usar `sequelize.sync()` — sempre migrations
4. Nunca `console.log` em produção — remover antes de commit
5. Sempre `return` após resposta de erro no controller
6. Styled-components: sempre exportar do `style.jsx` e importar como `* as S`

### Backend — padrão de controller

```js
exports.criar = async (req, res) => {
  try {
    const { campo } = req.body;
    if (!campo) return res.status(400).json({ erro: 'Campo obrigatório.' });
    const resultado = await Model.create({ campo });
    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};
```

---

## 12. O QUE NÃO FAZER

- Não reconstruir do zero — o projeto tem essência, refinar e expandir
- Não trocar styled-components por Tailwind sem decisão do usuário
- Não trocar JSX por TypeScript sem decisão do usuário
- Não usar `sequelize.sync()` ou `sync({alter:true})`
- Não hardcodar URLs de API
- Não adicionar console.logs de debug
- Não criar abstrações desnecessárias para uso único
- Não adicionar features não solicitadas
- Não usar dois sistemas de toast em nova implementação (usar Sonner, já no App.jsx)
- Não quebrar features existentes ao evoluir

---

## 13. PRÓXIMAS IMPLEMENTAÇÕES PRIORITÁRIAS

Em ordem de prioridade:

1. **ProtectedRoute** — auth no nível de rota (`client/src/routes/ProtectedRoute.jsx`)
2. **Flow Network** — primeira tela pós-login, coração do produto (evolução do Feed)
3. **Pulse System** — analytics operacional da organização
4. **Dashboard** — ferramenta de visão pessoal, acessada via Sidebar (não é tela inicial)
5. **Workspaces** — backend + frontend
6. **Modo Execução** — executar steps de um flow
7. **Nós avançados** — vídeo, áudio, checklist executável
8. **Analytics** — métricas detalhadas
9. **Redis** — integrar ao backend (cache, sessões)
10. **WebSockets** — colaboração em tempo real

Ver `ROADMAP.md` para o plano completo com checklists.

---

## 14. AMBIENTE DE DESENVOLVIMENTO

```bash
# Com Docker (recomendado)
docker compose up -d
docker compose exec server npm run migrate

# Sem Docker
cd server && npm run dev    # porta 3000
cd client && npm run dev    # porta 5173
```

Variáveis necessárias:
- `server/.env` — baseado em `server/.env.example`
- `client/.env` — `VITE_API_URL=http://localhost:3000/api`

---

## 15. MEMÓRIA IMPORTANTE

- O projeto vive em `knowflow-v1/` (foi movido de `knowflow-v1/2025-1-p3-tiapn-si-grupo-1/`)
- Stack real: React JSX + styled-components (não TypeScript + Tailwind)
- Paleta primária: `#233DFF` (azul)
- Direção visual: Liquid Glass UI — superfícies translúcidas, blur, profundidade
- Projeto acadêmico evoluindo para SaaS — preservar essência, não reconstruir
