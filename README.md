# KnowFlow

**Plataforma de conhecimento operacional vivo.**

KnowFlow transforma processos, rotinas e expertise em fluxos navegáveis, estruturas visuais colaborativas e playbooks operacionais vivos — eliminando a dependência de pessoas-chave, acelerando onboarding e mantendo o conhecimento organizacional acessível, atualizado e fluindo.

---

## O Problema

Toda organização enfrenta os mesmos problemas de conhecimento:

- **Dependência de pessoas-chave** — quando alguém sai, o conhecimento vai junto
- **Onboarding complexo** — semanas para entender o que poderia ser documentado em horas
- **Documentação morta** — arquivos que ninguém lê, wikis desatualizadas, PDFs perdidos
- **Continuidade frágil** — "fulano está de férias, não sei como fazer isso"
- **Conhecimento invisível** — processos que existem só na cabeça das pessoas

## A Solução

KnowFlow não é uma wiki. Não é um repositório de documentos. É um ecossistema de conhecimento operacional onde processos se tornam experiências navegáveis e o conhecimento da organização circula, evolui e se conecta organicamente.

```
Processo na cabeça de alguém
        ↓
Flow navegável no KnowFlow
        ↓
Qualquer pessoa da equipe executa com confiança
```

---

## Stack

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 19, React Flow 11, styled-components 6, Framer Motion, Zustand 5, Lucide React |
| **Backend** | Node.js 20, Express 4, Sequelize 6, PostgreSQL 16 |
| **Auth** | JWT + bcryptjs |
| **Infra** | Docker, Docker Compose, Redis, Nginx |
| **Design** | Liquid Glass UI, tokens customizados, Framer Motion |

---

## Estrutura do Projeto

```
knowflow-v1/
├── client/                  # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   │   ├── Sidebar/
│   │   │   ├── FlowCard/
│   │   │   ├── TextNode/
│   │   │   ├── DecisionNode/
│   │   │   └── MediaNode/
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── Auth/        # Landing, Login, Register, RecuperarSenha
│   │   │   ├── Feed/        # Flow Network
│   │   │   ├── FlowEditor/  # Editor de fluxos
│   │   │   ├── FlowViewer/  # Visualizador interativo
│   │   │   ├── Community/   # Comunidade e discussões
│   │   │   ├── Profile/     # Perfil do usuário
│   │   │   └── PostPage/    # Post individual
│   │   ├── routes/          # Configuração de rotas
│   │   ├── store/           # Zustand — estado global
│   │   ├── services/
│   │   │   └── api.js       # Axios instance centralizada
│   │   └── styles/
│   │       ├── theme.js     # Design tokens (Liquid Glass)
│   │       └── GlobalStyle.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
│
├── server/                  # Backend Node.js
│   ├── app.js               # Express app + middlewares
│   ├── db.js                # Conexão PostgreSQL/Sequelize
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── models/          # Modelos Sequelize
│   │   ├── middlewares/
│   │   │   └── auth.js      # Validação JWT
│   │   └── routes/          # Rotas da API
│   ├── migrations/          # Schema do banco
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml       # Orquestração completa
├── CLAUDE.md                # Guia para desenvolvimento com AI
├── ROADMAP.md               # Plano de evolução do produto
└── README.md
```

---

## Início Rápido

### Pré-requisitos

- Docker e Docker Compose instalados
- Git

### Com Docker (recomendado)

```bash
# 1. Clone o repositório
git clone <repo-url>
cd knowflow-v1

# 2. Configure as variáveis de ambiente
cp server/.env.example server/.env
cp client/.env.example client/.env

# 3. Edite server/.env com suas credenciais
nano server/.env

# 4. Suba todos os containers
docker compose up -d

# 5. Execute as migrações do banco
docker compose exec server npm run migrate

# 6. Acesse a aplicação
open http://localhost:3005
```

### Sem Docker (desenvolvimento local)

**Backend:**
```bash
cd server
cp .env.example .env       # configure suas credenciais
npm install
npm run migrate            # executa as migrations
npm run dev                # servidor na porta 3000
```

**Frontend:**
```bash
cd client
cp .env.example .env       # configure VITE_API_URL
npm install
npm run dev                # aplicação na porta 5173
```

---

## Variáveis de Ambiente

### `server/.env`

```env
# Banco de dados
DATABASE_DIALECT=postgres
PGHOST=localhost
PGUSER=knowflow
PGPORT=5432
PGDATABASE=knowflow
PGPASSWORD=sua_senha_segura

# Autenticação
JWT_SECRET=sua_chave_jwt_longa_e_segura

# Servidor
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# Redis (opcional em dev)
REDIS_URL=redis://localhost:6379
```

### `client/.env`

```env
VITE_API_URL=http://localhost:3000/api
```

---

## API Reference

### Autenticação

| Método | Rota | Corpo | Descrição |
|--------|------|-------|-----------|
| `POST` | `/api/usuario/cadastro` | `{ nome, email, senha }` | Registro de novo usuário |
| `POST` | `/api/usuario/login` | `{ email, senha }` | Login — retorna JWT |
| `GET` | `/api/usuario/me` | — | Perfil do usuário autenticado |
| `PUT` | `/api/usuario/me` | `{ nome, cargo, empresa, descricao, avatar_url }` | Atualizar perfil |

### Flows

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/flow` | — | Listar todos os flows |
| `POST` | `/api/flow` | JWT | Criar flow |
| `GET` | `/api/flow/:id` | — | Detalhes do flow + incrementa visualizações |
| `PUT` | `/api/flow/:id` | JWT | Atualizar flow |
| `DELETE` | `/api/flow/:id` | JWT | Deletar flow |
| `POST` | `/api/flow/:id/fork` | JWT | Forkar flow (cria cópia derivada) |

**Corpo do Flow:**
```json
{
  "titulo": "string",
  "descricao": "string",
  "categoria": "string",
  "tags": ["string"],
  "status": "rascunho | publicado | arquivado",
  "conteudo_nos": [...],
  "conteudo_conexoes": [...]
}
```

### Interações

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/curtidas` | JWT | Listar curtidas do usuário |
| `POST` | `/api/curtidas` | JWT | Curtir flow `{ flow_id }` |
| `DELETE` | `/api/curtidas/:uid/:fid` | JWT | Remover curtida |
| `GET` | `/api/flowsalvos` | JWT | Flows salvos |
| `POST` | `/api/flowsalvos` | JWT | Salvar flow |
| `DELETE` | `/api/flowsalvos/:uid/:fid` | JWT | Remover salvo |

### Comentários

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/api/comentario` | JWT | Adicionar `{ mensagem, flow_id }` |
| `PUT` | `/api/comentario/:id` | JWT | Editar `{ mensagem }` |
| `DELETE` | `/api/comentario/:id` | JWT | Deletar |

### Comunidade

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/PostagemComunidade` | — | Listar posts |
| `POST` | `/api/PostagemComunidade` | JWT | Criar post |

### Sistema

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Health check do servidor |

---

## Funcionalidades

### Editor de Fluxos
Criação de flows em 3 etapas:
1. **Metadados** — título, descrição, categoria, tags e status
2. **Construção** — canvas React Flow com drag & drop, 3 tipos de nó
3. **Revisão** — preview e publicação

**Tipos de nó:**
- **Texto** — conteúdo descritivo e instruções
- **Decisão** — ramificação com opções de escolha
- **Mídia** — imagens e recursos visuais

### Visualizador Interativo
- Navegação pelo flow com zoom e pan
- Clique nos nós para explorar conteúdo em modal
- Sistema de curtidas e salvos
- Comentários com edição e remoção
- Fork de flows (criar derivações)
- Compartilhamento via link

### Flow Network (Feed)
- Lista de flows publicados da plataforma
- Filtros por categoria
- Contagem de visualizações, curtidas e comentários
- Cards com preview de nós

### Comunidade
- Posts de discussão e dúvidas
- Sistema de upvote/downvote
- Comentários por post
- Filtros por categoria e tipo

---

## Design System

O KnowFlow usa **Liquid Glass UI** — uma linguagem visual inspirada em Linear, Arc Browser e Apple, com:

- Superfícies translúcidas com `backdrop-filter`
- Profundidade suave com blur e sombras sutis
- Paleta primária `#233DFF`
- Tipografia com hierarquia clara e tracking refinado
- Animações fluidas com Framer Motion
- Espaço respirável e generoso

---

## Containers Docker

| Container | Imagem | Porta | Descrição |
|-----------|--------|-------|-----------|
| `client` | Node 20 → Nginx alpine | `3005:80` | Frontend React via Nginx |
| `server` | Node 20 alpine | `3000:3000` | Backend Express |
| `postgres` | postgres:16-alpine | `5432:5432` | Banco de dados |
| `redis` | redis:7-alpine | `6379:6379` | Cache e sessões |

---

## Roadmap

O produto está em evolução ativa. Ver `ROADMAP.md` para o plano completo.

**Próximas implementações:**
- ProtectedRoute e segurança no nível de rota
- Dashboard (primeira tela pós-login)
- Flow Network evoluído (feed inteligente com seções)
- Pulse System (analytics operacional)
- Perfil evoluído com upload de avatar
- Workspaces organizacionais
- Modo Execução de flows
- Nós multimídia avançados (vídeo, checklist, rich text)

---

## Contribuindo

1. Leia `CLAUDE.md` antes de qualquer contribuição
2. Consulte `ROADMAP.md` para o estado atual do projeto
3. Preserve a stack existente (React JSX + styled-components + Zustand)
4. Nunca usar `sequelize.sync()` — apenas migrations
5. Nunca hardcodar URLs — usar `api.js` e variáveis de ambiente
6. Remover todos os `console.log` antes de commitar

---

## Equipe

Felipe Rodrigues · Gabriella Martins · Lucas Borges · Mateus Botelho · Rogério Gabriel · Victor Alves

---

*KnowFlow — o conhecimento da sua organização, vivo e acessível.*
