# ROADMAP — KnowFlow

Plano de evolução do KnowFlow de projeto acadêmico para produto SaaS real.
Cada fase é independente e entregável. Trabalhar uma fase por vez.

---

## Legenda

- ✅ Concluído
- 🔄 Em andamento
- ⬜ Pendente
- 🔴 Crítico / Bloqueante
- 🟡 Alta prioridade
- 🟢 Pode aguardar

---

## FASE 0 — Fundação e Saneamento
> Limpar a casa antes de construir. Base sólida para tudo que vem.

**Status: ✅ Concluída**

### Estrutura
- [x] Mover projeto de `2025-1-p3-tiapn-si-grupo-1/` → `knowflow-v1/`
- [x] Renomear `src/back` → `server/`
- [x] Renomear `src/front` → `client/`
- [x] Remover arquivos acadêmicos (docs/, presentation/, CITATION.cff, LICENSE.txt)
- [x] Atualizar `.gitignore`

### Backend
- [x] Remover `sequelize.sync({alter:true})` → `sequelize.authenticate()`
- [x] Remover `console.log` que expunha credenciais do banco em `db.js`
- [x] Adicionar Helmet
- [x] Adicionar rate limiting (300 req/15min)
- [x] CORS dinâmico via `process.env.CORS_ORIGIN`
- [x] Global error handler
- [x] Health check em `/health`
- [x] Corrigir bug de `return` ausente no `flowController.criar()`
- [x] Remover import não utilizado em `postagemComunidadeController.js`
- [x] Limpar `package.json` (remover duplicatas, mover devDeps)

### Frontend
- [x] Centralizar HTTP em `client/src/services/api.js`
- [x] Remover todas as URLs hardcoded do Azure (13 arquivos)
- [x] Remover interceptors duplicados de axios
- [x] Corrigir `console.log()` dentro do JSX no FlowViewer (bug de produção)
- [x] Corrigir views hardcoded `"1921"` no FlowCard
- [x] Corrigir endpoint `/Usuario/me` (uppercase) → `/usuario/me`
- [x] Corrigir flows sempre salvando como `rascunho`
- [x] Habilitar checkbox "Tornar público" no FlowEditor
- [x] Remover console.logs de debug (FlowEditor, FlowViewer, Profile)

### Modelos e Migrations
- [x] Adicionar campo `visualizacoes` ao Flow
- [x] Adicionar campo `fork_de` ao Flow (rastrear origem do fork)
- [x] Expandir ENUM status: `rascunho | publicado | arquivado`
- [x] Adicionar campo `avatar_url` ao Usuario
- [x] Criar migration para campos do Flow
- [x] Criar migration para avatar_url

### API — novos endpoints
- [x] `POST /api/flow/:id/fork` — forkar flow
- [x] `PUT /api/usuario/me` — atualizar perfil

### Infra
- [x] Dockerfile para server (Node 20 alpine)
- [x] Dockerfile para client (multi-stage: Node → Nginx)
- [x] docker-compose.yml (postgres, redis, server, client)
- [x] nginx.conf com SPA routing e gzip
- [x] `server/.env.example`
- [x] `client/.env.example`

### Design
- [x] Expandir `theme.js` com tokens Liquid Glass
- [x] Melhorar `GlobalStyle.js` (CSS vars, scrollbar, focus-visible)
- [x] Redesenhar Sidebar com glass e indicador ativo

### Documentação
- [x] `README.md` profissional
- [x] `CLAUDE.md` completo
- [x] `ROADMAP.md`

---

## FASE 1 — Segurança e Estabilidade
> Fechar os buracos de segurança antes de expandir.

**Status: ✅ Concluída**

### ProtectedRoute
- [x] Criar `client/src/routes/ProtectedRoute.jsx`
  - Verifica `localStorage.getItem('token')` antes de renderizar
  - Redireciona para `/login` com `state.from` para retorno pós-login
- [x] Aplicar ProtectedRoute em todas as rotas autenticadas:
  - `/feed`, `/criar-flow`, `/editar-flow/:id`
  - `/comunidade`, `/post/:id`, `/perfil`
  - `/flow/:id` permanece pública (visualização sem login)

### Validação de ownership
- [x] FlowViewer já verifica `criado_por === usuarioId` para exibir Editar/Deletar
- [ ] Garantir que o backend rejeita operações em resources alheios (validação extra)

### Unificação de toast
- [x] Migrado react-toastify → Sonner em todos os arquivos (7 arquivos)
- [x] Removidos todos os `<ToastContainer>` das páginas
- [x] Removidas todas as importações de CSS do react-toastify
- [x] `toast.warn` → `toast.warning` (API do Sonner)
- [x] Único `<Toaster>` global no App.jsx

### Tratamento de erros
- [x] Criar componente `ErrorBoundary` (`client/src/components/ErrorBoundary/index.jsx`)
- [x] Adicionar ErrorBoundary no App.jsx cobrindo toda a aplicação
- [x] Criar página `NotFound` (`client/src/pages/NotFound/index.jsx`)
- [x] Rota `*` no router apontando para NotFound

---

## FASE 2 — Flow Network
> O coração do produto. A primeira tela que o usuário vê após login.
> Não é uma biblioteca de documentos — é conhecimento organizacional fluindo.

**Status: ✅ Concluída**

### Conceito
Não é uma biblioteca de documentos. É um ecossistema vivo onde o conhecimento
organizacional circula, evolui e se conecta. Inspirado em GitHub activity + Reddit + Linear.

### Backend
- [ ] Endpoint `GET /api/flow-network` — seções implementadas client-side via `useMemo` (sem novo endpoint)
- [ ] Parâmetros de filtro: período, ordem — usa endpoint `/api/flow` existente com categoria/search
- [ ] Paginação com cursor (não page/offset)

### Frontend — evoluir `client/src/pages/Feed/`
- [x] Renomear conceitualmente para "Flow Network" (título + subtítulo atualizados, rota `/feed` mantida)
- [x] Seção "Em Alta" — ordenação por engagement score via `useMemo`
- [x] Seção "Recentes" — ordenação por `criado_em` via `useMemo`
- [x] Seção "Forks Ativos" — filtro por `fork_de !== null` via `useMemo`
- [x] Seção "Discussões Abertas" — `DiscussaoCard`, filtra posts com 0 comentários
- [x] Seção "Atividade da Equipe" — flows de outros usuários, ordenados por data
- [x] Filtros por categoria — componente `Categories` existente
- [x] Filtros por período — chips "Sempre / 30 dias / 7 dias / Hoje" (client-side)
- [x] FlowCard evoluído:
  - [x] Indicador de fork (`ForkBadge` com ícone GitFork)
  - [x] Badge de status (`StatusBadge` para flows publicados)
  - [x] Visualizações reais
  - [x] Indicador visual se o usuário já salvou/curtiu (Heart/Bookmark preenchidos)
  - [x] Preview do número de nós e tipo (`conteudo_nos.length`)
- [x] Paginação "Carregar mais" — PAGE_SIZE=5, botão incremental
- [x] Estado vazio elegante — componente `FlowsNotFound`
- [x] Loading skeleton animado (shimmer, 3 cards)

---

## FASE 3 — Pulse System
> Analytics operacional — mostrar o comportamento vivo da organização.

**Status: ✅ Concluída**

### Conceito
Não é um dashboard de métricas. É um radar operacional.
Mostra onde a organização está com dificuldades, onde o conhecimento cresce,
onde há gargalos emergentes.

### Backend
- [x] Endpoint `GET /api/pulse` — dados operacionais:
  - Flows com mais visualizações (últimos 7/30 dias)
  - Flows com mais comentários (possíveis gargalos)
  - Categorias com mais atividade
  - Flows sem atualizações há mais de 90 dias (risco de obsolescência)
  - Crescimento de flows por período
  - Taxa de fork (conhecimento sendo reutilizado)
- [x] Queries otimizadas com agregações no PostgreSQL

### Frontend — nova página `client/src/pages/Pulse/`
- [x] Criar `index.jsx` e `style.jsx`
- [x] Rota `/pulse` no router (PulseRoutes.jsx + ProtectedRoute)
- [x] Adicionar na Sidebar (ícone Activity)
- [x] Card: "Flows em alta" — top 5 mais acessados com barras de progresso
- [x] Card: "Possíveis gargalos" — flows com muitos comentários/dúvidas
- [x] Card: "Categorias ativas" — barras coloridas por categoria
- [x] Card: "Flows em risco" — não atualizados há mais de 90 dias, com badge de idade
- [x] Card: "Conhecimento Sendo Derivado" — taxa de fork, flows mais derivados
- [x] Stats row: total publicados, novos (30d), taxa de reutilização
- [x] Visual minimalista, sofisticado — não gráficos de BI genéricos
- [x] Sem bibliotecas de gráfico pesadas — barras CSS + styled-components
- [x] Loading skeleton animado

---

## FASE 4 — Dashboard
> Ferramenta de visão pessoal. Acessada via Sidebar quando o usuário quer
> uma visão consolidada da sua própria atividade — não é a tela inicial.

**Status: ✅ Concluída**

### Backend
- [x] Endpoint `GET /api/dashboard` — dados consolidados do usuário:
  - [x] Flows recentes do usuário (últimos 5)
  - [x] Stats pessoais (flows criados, visualizações totais, curtidas recebidas, forks recebidos)
  - [x] Atividade recente (comentários + forks nos flows do usuário, mesclados e ordenados)

### Frontend — nova página `client/src/pages/Dashboard/`
- [x] Criar `index.jsx` e `style.jsx`
- [x] Rota `/dashboard` com `DashboardRoutes.jsx` + `ProtectedRoute`
- [x] Ícone `LayoutDashboard` na Sidebar (entre Feed e Pulse)
- [x] Saudação contextual (Bom dia/tarde/noite) com avatar de iniciais
- [x] Stats: flows criados, visualizações totais, curtidas recebidas, forks recebidos
- [x] "Meus Flows Recentes" — lista com StatusDot, ações Editar/Ver ao hover
- [x] "Atividade Recente" — comentários e forks com ícone por tipo e timestamp
- [x] Card de ação rápida "Criar Flow" no header
- [x] Estados vazios elegantes com call-to-action
- [x] Loading skeleton completo
- [x] Visual Liquid Glass — ferramenta pessoal, não BI

---

## FASE 5 — Perfil Evoluído
> Transformar o perfil em uma identidade operacional real.

**Status: ✅ Concluída**

### Backend
- [ ] Upload de avatar (integrar com storage — local ou S3) — requer infraestrutura de storage
- [ ] Endpoint de estatísticas detalhadas do usuário — stats computadas client-side a partir dos flows

### Frontend — evoluir `client/src/pages/Profile/`
- [ ] Upload de foto de perfil — aguarda infraestrutura de storage
- [x] Formulário real de edição de perfil (nome, cargo, empresa, bio) via `PUT /api/usuario/me`
- [x] Aba "Forks" — flows que o usuário derivou de outros (filtro client-side: `fork_de !== null`)
- [x] Aba "Salvos" — flows salvos (cross-reference `savedPosts` do flowStore com flows)
- [x] Stats detalhadas: flows criados, visualizações totais, forks recebidos, flows salvos
- [ ] Seção de "Contribuições" (inspirado em GitHub contributions) — complexidade alta, adiado
- [ ] Perfil público `/perfil/:id` (visualizável por outros) — requer novo endpoint backend
- [x] Redesign completo com Liquid Glass (substituiu hardcoded hex por theme tokens)
- [x] Tabs: Visão Geral | Meus Flows | Forks | Salvos | Posts (removido limite de 1 post)

---

## FASE 6 — Workspaces
> Isolar conhecimento organizacional. Uma empresa = um workspace.

**Status: ✅ Concluída**

### Backend
- [x] Modelo `Workspace` (id, nome, descricao, logo_url, criado_por, criado_em)
- [x] Modelo `WorkspaceMembro` (workspace_id, usuario_id, role: admin|editor|viewer)
- [x] Migrations: create-workspace, create-workspace-membro, add-workspace-id-to-flow
- [x] Middleware `workspaceAuth.js` com hierarquia de roles (admin > editor > viewer)
- [x] Endpoints CRUD: `GET|POST /api/workspace`, `GET|PUT|DELETE /api/workspace/:id`
- [x] Endpoints de membros: `POST|DELETE|PUT /api/workspace/:id/membros[/:userId]`
- [x] Endpoints de flows: `POST|DELETE /api/workspace/:id/flows/:flowId`
- [x] Campo `workspace_id` adicionado ao modelo Flow

### Frontend
- [x] Página `Workspaces` (`/workspaces`) — grid de cards com meta (membros, flows, role)
- [x] Página `WorkspaceDetail` (`/workspace/:id`) — tabs Flows | Membros
- [x] Modal de criação de workspace (nome + descrição)
- [x] Modal "Convidar Membro" — busca por email + seleção de role (admin)
- [x] Modal "Adicionar Flow" — lista flows do usuário não associados ao workspace
- [x] Remoção de membro e desassociação de flow no detail
- [x] Ícone `Layers` na Sidebar (entre Pulse e Comunidade)
- [ ] Filtro de flows por workspace no Feed/Flow Network — adiado para Fase 9+

---

## FASE 7 — Modo Execução
> Transformar flows de leitura em experiências guiadas de execução.

**Status: ✅ Concluído**

### Conceito
Um usuário pode "executar" um flow — seguir os passos, marcar como concluído,
registrar observações, anexar evidências. Como um checklist vivo.

### Backend
- [x] Modelo `Execucao` (id, flow_id, usuario_id, status, iniciado_em, concluido_em)
- [x] Modelo `ExecutacaoEtapa` (execucao_id, no_id, status, observacao, evidencia_url, concluido_em)
- [x] Endpoints CRUD de execução
- [x] Endpoint para concluir etapa (PATCH /api/execucao/:id/etapas/:noId)
- [x] Endpoint para concluir execução (PATCH /api/execucao/:id/concluir)
- [x] Endpoint para cancelar execução (PATCH /api/execucao/:id/cancelar)
- [x] Migrations 000005 e 000006

### Frontend — modo de visualização no FlowViewer
- [x] Botão "Executar Flow" no FlowViewer (sidebar, novo card)
- [x] Banner de execução no topo (gradiente azul-roxo)
- [x] Painel lateral de progresso (320px, lista de nós com status)
- [x] Nós com outline visual: verde concluído / cinza pendente
- [x] Campo de observação por etapa (dialog ao clicar no nó)
- [x] Barra de progresso geral da execução
- [x] Histórico de execuções de um flow (modal)

---

## FASE 8 — Nós Avançados
> Elevar os fluxos de diagramas a estruturas operacionais ricas.

**Status: ✅ Concluído**

### Implementado

#### VideoNode (novo — `client/src/components/VideoNode/`)
- [x] Preview de thumbnail YouTube (extrai ID via regex, usa `img.youtube.com/vi/{id}/mqdefault.jpg`)
- [x] Play overlay sobre thumbnail
- [x] Placeholder "Vídeo externo" para URLs não-YouTube
- [x] Player inline no FlowViewer: iframe embed para YouTube, `<video controls>` para direto
- [x] Campo título e descrição

#### ChecklistNode (novo — `client/src/components/ChecklistNode/`)
- [x] Lista de itens `{ id, label, done }` com checkbox visual (read-only no canvas)
- [x] Badge de progresso (X/Y concluídos)
- [x] Placeholder quando sem itens
- [x] Interativo no modal do FlowViewer: checkboxes funcionais com estado local
- [x] No editor: adicionar/remover/editar itens inline

#### TextNode — evoluído
- [x] Callouts com ícone (info/warning/danger/tip) — barra colorida à esquerda + ícone contextual
- [x] Select de callout no modal do editor

#### TextNode — rich text
- [x] `client/src/utils/renderMarkdown.jsx` — parser React sem dangerouslySetInnerHTML
- [x] Suporte a `**bold**`, `*italic*`, `` `code` ``, listas `- ` e `1. `, quebras de linha
- [x] Aplicado no canvas (TextNode) e no modal do FlowViewer

#### AudioNode (novo — `client/src/components/AudioNode/`)
- [x] Waveform CSS com barras de altura senoidal (`$height` transient prop)
- [x] `<audio controls>` player no modal do FlowViewer
- [x] Paleta do editor + formulário (título, URL, descrição)

#### MediaNode — Image Hotspots
- [x] `data.hotspots`: array de `{ id, x, y, label, description }` (coordenadas em %)
- [x] Pins numerados no canvas (`HotspotPin` absolutamente posicionado)
- [x] Editor: clicar na imagem posiciona novo hotspot; lista de labels/descrições editáveis
- [x] FlowViewer: `HotspotMarker` com tooltip hover (label + descrição)

#### FlowEditor — atualizado
- [x] Paleta de nós: VideoNode, ChecklistNode, AudioNode
- [x] Modais completos para todos os tipos incluindo hotspot editor
- [x] Campo callout select no textNode

#### FlowViewer — atualizado
- [x] Todos os 6 tipos registrados em nodeTypes
- [x] Modais atualizados: vídeo, checklist, áudio, hotspots interativos

### Fora de escopo (futuro)
- [ ] Undo/Redo no editor

---

## FASE 9 — Redis e Performance
> Integrar Redis que já está no container mas sem uso.

**Status: ✅ Concluído**

- [x] Instalar `ioredis` no server
- [x] `server/redis.js` — conexão com `lazyConnect`, `enableOfflineQueue: false`, retry desiste após 3x, graceful degradation total
- [x] `server/src/middlewares/cache.js` — middleware parametrizável por TTL, intercepta `res.json`, falha silenciosa
- [x] `server/src/middlewares/invalidateCache.js` — apaga chaves por padrão via `redis.keys` + `redis.del`
- [x] Cache de flows públicos `GET /api/flow` (TTL 5 minutos), invalidado em POST/PUT/DELETE
- [x] Cache de estatísticas do Pulse `GET /api/pulse` (TTL 1 hora)
- [ ] Rate limiting por usuário usando Redis (substituir in-memory) — futuro
- [ ] Sessões de execução de flow em Redis — futuro

---

## FASE 10 — Analytics Detalhado
> Métricas que ajudam criadores a entender o impacto do conhecimento.

**Status: ✅ Concluída**

### Backend
- [x] Modelo `ViewEvento` + migration — tracking por nó (flow_id, no_id, usuario_id)
- [x] `POST /api/analytics/evento` — fire-and-forget, auth opcional
- [x] `GET /api/analytics/usuario` — stats agregadas (total_visualizacoes, flows, forks, execuções)
- [x] `GET /api/analytics/flow/:flowId` — visualizações por nó com ranking

### Frontend — `client/src/pages/Analytics/`
- [x] StatsGrid com 4 cards (visualizações, flows criados, forks recebidos, execuções concluídas)
- [x] Lista de flows com barra de progresso relativa
- [x] Painel expandível por flow com ranking de nós
- [x] Sidebar: link `/analytics` com BarChart2 icon
- [x] FlowViewer: fire-and-forget `api.post('/analytics/evento')` em onNodeClick

---

## FASE 11 — Preparação para IA
> Arquitetura que suporta contexto inteligente futuro.

**Status: ✅ Concluída**

### Backend
- [x] Campos `tags_ia` (ARRAY STRING) e `contexto_ia` (JSONB) no modelo Flow + migration
- [x] `GET /api/busca?q=termo` — busca por título/descrição/categoria/tags (Op.iLike + Op.contains)
- [x] `GET /api/flow/:id/relacionados` — flows com categoria ou tags em comum (Op.overlap)
- [x] `GET /api/flow/:id/contexto-ia` — contexto estruturado para uso com LLM

### Frontend
- [x] Página `/busca` — input com busca ao Enter, grid de resultados com cards
- [x] Componente `RelatedFlows` — carregado no sidebar do FlowViewer
- [x] Sidebar: link `/busca` com Search icon
- [x] SearchRoutes registrado em `client/src/routes/index.jsx`
- [x] buscaRoutes registrado em `server/app.js`

---

## FASE 12 — Qualidade e Testes
> Garantir que o produto escala sem quebrar.

**Status: ✅ Concluída**

### Frontend — Vitest
- [x] Setup Vitest 3 + jsdom em `vite.config.js` (test.environment, globals, setupFiles)
- [x] `@testing-library/react` + `@testing-library/jest-dom` + `@vitest/coverage-v8`
- [x] Scripts: `test`, `test:watch`, `test:coverage` em `package.json`
- [x] `client/src/tests/setup.js` — importa `@testing-library/jest-dom`
- [x] `client/src/tests/utils/renderMarkdown.test.jsx` — 9 testes (null, parágrafo, bold, italic, code, ul, ol, multi-parágrafo, br)
- [x] `client/src/tests/stores/flowStore.test.js` — 6 testes com mock de api (fetch success/error, enriquecimento de stats, curtidas/saves falhando, setCategory, setSearchTerm)

### Backend — Jest
- [x] Setup Jest 29 em `jest.config.js` + `supertest` em `package.json`
- [x] Scripts: `test`, `test:coverage` em `package.json`
- [x] `server/src/tests/controllers/flow.test.js` — 7 testes: listar (200, 500), obter (404, increment), criar (201, 400 post_id inválido), atualizar (404, 403)
- [x] `server/src/tests/controllers/usuario.test.js` — 5 testes: cadastrar (400, 409, 201), login (404, 401, 200+token)
- [x] `server/src/tests/controllers/analytics.test.js` — 5 testes: registrarEvento (400, 201, sem auth), getAnalyticsUsuario (sem flows, com flows)

### CI — GitHub Actions
- [x] `.github/workflows/ci.yml` — 3 jobs paralelos: server-tests, client-tests, client-build (depende de client-tests)
- [x] Trigger: push em main/develop, PR para main
- [x] Node 20, cache npm por diretório

---

## RESUMO DE PROGRESSO

| Fase | Descrição | Status |
|------|-----------|--------|
| 0 | Fundação e Saneamento | ✅ Concluída |
| 1 | Segurança e Estabilidade | ✅ Concluída |
| 2 | Flow Network — tela inicial pós-login | ✅ Concluída |
| 3 | Pulse System | ⬜ Pendente |
| 4 | Dashboard — ferramenta de visão pessoal | ⬜ Pendente |
| 5 | Perfil Evoluído | ⬜ Pendente |
| 6 | Workspaces | ⬜ Pendente |
| 7 | Modo Execução | ✅ Concluído |
| 8 | Nós Avançados | ✅ Concluído |
| 9 | Redis e Performance | ✅ Concluído |
| 10 | Analytics Detalhado | ✅ Concluída |
| 11 | Preparação para IA | ✅ Concluída |
| 12 | Qualidade e Testes | ✅ Concluída |
| Extra | Deploy Railway + Storage Cloudinary | ✅ Concluída |

---

## FASE EXTRA — Deploy Railway + Storage de Mídias

**Status: ✅ Concluída**

> Guia completo em `DEPLOY.md`

### Código implementado

#### Backend
- [x] `server/config/config.js` — seções `development`, `production` (SSL), `test` para sequelize-cli
- [x] `server/Dockerfile` — CMD atualizado: `npx sequelize-cli db:migrate && node app.js`
- [x] `server/src/controllers/uploadController.js` — upload para Cloudinary (imagens + áudio), validação de tipo e tamanho
- [x] `server/src/routes/uploadRoutes.js` — `POST /api/upload` com multer.memoryStorage + auth
- [x] `server/app.js` — rota `/api/upload` registrada
- [x] `server/package.json` — `cloudinary ^2.6.1` e `multer ^1.4.5-lts.1` adicionados
- [x] `server/.env.example` — variáveis Cloudinary documentadas

#### Frontend
- [x] `client/src/services/upload.js` — helper `uploadMidia(file)` → POST multipart/form-data → retorna URL
- [x] `client/src/pages/FlowEditor/index.jsx` — `handleFileUpload` usa `uploadMidia()` (não mais base64)
- [x] `client/src/pages/FlowEditor/index.jsx` — AudioNode suporta upload de arquivo além de URL manual
- [x] `client/src/pages/FlowEditor/style.jsx` — `FileInputWrapper` e `FileInputLabel` adicionados

#### CI/CD
- [x] `.github/workflows/ci.yml` — 3 jobs: `server-tests`, `client-tests`, `client-build`

### Guia completo em DEPLOY.md
- [x] Pré-requisitos e geração de JWT_SECRET
- [x] Push para GitHub (passo a passo)
- [x] Setup Cloudinary com pastas
- [x] Criar projeto Railway + PostgreSQL + Redis
- [x] Deploy do servidor com migrations automáticas
- [x] Deploy do cliente com VITE_API_URL como build arg
- [x] Domínio personalizado (DNS CNAME)
- [x] Watch Paths para auto-deploy inteligente
- [x] GitHub Actions integrado ao fluxo
- [x] Checklist de 15 itens de segurança e produção
- [x] Troubleshooting dos 6 erros mais comuns
- [x] Tabela de custos Railway estimados

---

*Atualizado em: 2026-05-14*
