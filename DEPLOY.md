# KnowFlow — Guia Completo de Deploy no Railway

> Guia passo a passo, tela a tela, do primeiro commit até a produção.
> Tempo estimado: 45–90 minutos (primeira vez).

---

## SUMÁRIO

1. [Pré-requisitos](#1-pré-requisitos)
2. [Preparar o repositório no GitHub](#2-preparar-o-repositório-no-github)
3. [Configurar o Cloudinary (storage de mídias)](#3-configurar-o-cloudinary-storage-de-mídias)
4. [Criar o projeto no Railway](#4-criar-o-projeto-no-railway)
5. [Adicionar PostgreSQL](#5-adicionar-postgresql)
6. [Adicionar Redis](#6-adicionar-redis)
7. [Fazer deploy do servidor (API)](#7-fazer-deploy-do-servidor-api)
8. [Fazer deploy do cliente (Frontend)](#8-fazer-deploy-do-cliente-frontend)
9. [Configurar domínio personalizado (opcional)](#9-configurar-domínio-personalizado-opcional)
10. [CI/CD automático com Railway](#10-cicd-automático-com-railway)
11. [CI/CD com GitHub Actions](#11-cicd-com-github-actions)
12. [Monitoramento e Troubleshooting](#12-monitoramento-e-troubleshooting)
13. [Checklist final de produção](#13-checklist-final-de-produção)

---

## 1. Pré-requisitos

### Contas necessárias
- **GitHub** — repositório do código (gratuito)
- **Railway** — plataforma de deploy: railway.app (plano Hobby: $5/mês)
- **Cloudinary** — armazenamento de imagens/áudios: cloudinary.com (gratuito: 25GB)

### Ferramentas locais
```bash
# Verificar que estão instalados
node --version      # >= 20.x
npm --version       # >= 10.x
git --version       # qualquer versão
```

### Gerar JWT_SECRET seguro
```bash
# No terminal, gere uma string aleatória de 64 caracteres:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copie e guarde o resultado — você vai precisar no passo 7
```

---

## 2. Preparar o repositório no GitHub

### 2.1 — Criar repositório no GitHub

1. Acesse **github.com** → clique em **"New"** (botão verde, canto superior esquerdo)
2. Preencha:
   - **Repository name**: `knowflow`
   - **Visibility**: `Public` (Railway grátis exige público) ou `Private` (plano pago)
   - **NÃO** marque "Initialize this repository with a README"
3. Clique **"Create repository"**
4. Anote a URL do repositório: `https://github.com/SEU_USUARIO/knowflow`

### 2.2 — Conectar repositório local ao GitHub

```bash
# Na raiz do projeto (knowflow-v1/)
cd "C:/Users/Mateus Corporativo/knowflow-v1"

# Verificar que o .gitignore está correto (não deve ter node_modules, .env)
cat .gitignore

# Inicializar git (se ainda não foi feito)
git init
git branch -M main

# Conectar ao repositório remoto
git remote add origin https://github.com/SEU_USUARIO/knowflow.git
```

### 2.3 — Primeiro commit e push

```bash
# Ver o status — confirme que .env NÃO aparece
git status

# Adicionar todos os arquivos (exceto o que está no .gitignore)
git add .

# Fazer o commit inicial
git commit -m "feat: initial commit — KnowFlow v2.0"

# Enviar para o GitHub
git push -u origin main
```

> Acesse `https://github.com/SEU_USUARIO/knowflow` e confirme que os arquivos aparecem.

---

## 3. Configurar o Cloudinary (storage de mídias)

O KnowFlow usa o Cloudinary para armazenar imagens e áudios enviados nos flows.
O plano gratuito oferece **25GB de armazenamento** e **25 créditos/mês** — mais que suficiente para começar.

### 3.1 — Criar conta no Cloudinary

1. Acesse **cloudinary.com** → clique **"Sign Up for Free"**
2. Preencha: nome, email, senha → clique **"Create Account"**
3. Confirme o email (cheque sua caixa de entrada)
4. Ao entrar, você verá o **Dashboard** (tela principal)

### 3.2 — Copiar credenciais

No Dashboard do Cloudinary, você verá uma seção **"Product Environment Credentials"**:

```
Cloud Name:    sua-cloud-name        ← copie isso
API Key:       123456789012345       ← copie isso
API Secret:    AbCdEf_seu_secret     ← copie isso (clique no olho para revelar)
```

**Guarde essas 3 informações** — você vai usá-las na configuração do servidor.

### 3.3 — Criar uma pasta no Cloudinary (opcional, recomendado)

1. No menu lateral, clique **"Media Library"**
2. Clique **"New Folder"** → nomeie `knowflow`
3. Dentro, crie duas subpastas: `images` e `audio`

> As subpastas serão criadas automaticamente pelo código ao primeiro upload, mas criar manualmente organiza melhor.

---

## 4. Criar o projeto no Railway

### 4.1 — Criar conta e projeto

1. Acesse **railway.app** → clique **"Start a New Project"**
2. Clique **"Login with GitHub"** → autorize o Railway a acessar sua conta
3. Na tela inicial, clique **"New Project"** (botão roxo, canto superior direito)
4. Selecione **"Empty Project"**
5. Railway cria um projeto em branco. Você verá uma tela com **"+ New"** no centro

> Renomeie o projeto: clique no nome do projeto (topo da página) → edite para `knowflow-production`

---

## 5. Adicionar PostgreSQL

### 5.1 — Criar serviço PostgreSQL

1. No projeto Railway, clique **"+ New"**
2. Selecione **"Database"**
3. Selecione **"Add PostgreSQL"**
4. Railway provisiona o banco em ~30 segundos. Você verá um card roxo "Postgres"

### 5.2 — Copiar as credenciais do banco

1. Clique no card **"Postgres"**
2. Vá na aba **"Variables"**
3. Você verá as variáveis automaticamente criadas:
   ```
   PGHOST=....railway.internal
   PGPORT=5432
   PGDATABASE=railway
   PGUSER=postgres
   PGPASSWORD=xxxxxxxxxxxxxxxxxx
   DATABASE_URL=postgresql://postgres:xxx@xxx:5432/railway
   ```
4. **NÃO copie manualmente** — o Railway injeta essas variáveis automaticamente nos outros serviços quando você referenciar o banco.

> **Atenção**: O `DATABASE_URL` completo pode ser usado no lugar das variáveis separadas, mas nosso `db.js` usa variáveis individuais (`PGHOST`, `PGUSER`, etc.) — isso já está configurado corretamente.

---

## 6. Adicionar Redis

### 6.1 — Criar serviço Redis

1. No projeto Railway, clique **"+ New"**
2. Selecione **"Database"**
3. Selecione **"Add Redis"**
4. Railway provisiona o Redis em ~20 segundos. Card aparece como "Redis"

### 6.2 — Verificar a variável REDIS_URL

1. Clique no card **"Redis"**
2. Aba **"Variables"** → você verá `REDIS_URL=redis://default:xxx@xxx.railway.internal:6379`
3. Essa variável será injetada automaticamente no serviço do servidor.

> O KnowFlow tem **graceful degradation para Redis** — se não estiver disponível, o servidor funciona normalmente, apenas sem cache.

---

## 7. Fazer deploy do servidor (API)

### 7.1 — Criar serviço do servidor

1. No projeto Railway, clique **"+ New"**
2. Selecione **"GitHub Repo"**
3. Escolha o repositório `knowflow` que você criou
4. Railway detecta o projeto. Clique **"Add Variables"** (ainda não faça deploy)

### 7.2 — Configurar o Root Directory

> ⚠️ IMPORTANTE: O servidor está em `server/`, não na raiz do projeto.

1. No card do novo serviço, clique nos **"..."** (três pontos) → **"Settings"**
2. Em **"Source"**, encontre **"Root Directory"**
3. Digite: `server`
4. Railway vai usar `server/Dockerfile` para o build

### 7.3 — Configurar variáveis de ambiente do servidor

1. No card do serviço do servidor, vá na aba **"Variables"**
2. Clique **"New Variable"** e adicione cada uma das variáveis abaixo:

| Variável | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | *(a string de 64 chars que você gerou no passo 1)* |
| `CLOUDINARY_CLOUD_NAME` | *(do passo 3.2)* |
| `CLOUDINARY_API_KEY` | *(do passo 3.2)* |
| `CLOUDINARY_API_SECRET` | *(do passo 3.2)* |

> **NÃO adicione manualmente** as variáveis de banco (`PGHOST`, `PGPASSWORD`, etc.) — você vai **referenciar** o serviço PostgreSQL:

3. Clique **"New Variable"** → **"Reference another service"**
4. Selecione o serviço **"Postgres"**
5. Selecione cada variável: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
6. Repita para **Redis**: referencie o serviço Redis → selecione `REDIS_URL`

Resultado final nas variáveis do servidor:
```
NODE_ENV=production
JWT_SECRET=sua_string_secreta_64_chars
CLOUDINARY_CLOUD_NAME=sua-cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=AbCdEf...
PGHOST=${{Postgres.PGHOST}}
PGPORT=${{Postgres.PGPORT}}
PGUSER=${{Postgres.PGUSER}}
PGPASSWORD=${{Postgres.PGPASSWORD}}
PGDATABASE=${{Postgres.PGDATABASE}}
REDIS_URL=${{Redis.REDIS_URL}}
DATABASE_DIALECT=postgres
```

> Para `CORS_ORIGIN`: deixe em branco por agora — você vai adicionar depois de ter a URL do cliente.

### 7.4 — Iniciar o deploy do servidor

1. Volte para a aba **"Deployments"** do serviço do servidor
2. Clique **"Deploy"**
3. Acompanhe os logs em tempo real. O processo:
   - `npm ci --only=production` (~1-2 min)
   - `npx sequelize-cli db:migrate` (aplica todas as migrations no PostgreSQL)
   - `node app.js` (servidor inicia)
4. Você verá `Servidor KnowFlow rodando na porta 3000` nos logs

### 7.5 — Gerar a URL pública do servidor

1. Na aba **"Settings"** do serviço do servidor
2. Em **"Networking"** → **"Public Networking"** → clique **"Generate Domain"**
3. Railway gera uma URL como: `knowflow-server-production.up.railway.app`
4. **Copie esta URL** — você vai precisar dela para configurar o cliente

### 7.6 — Testar a API

Abra no navegador:
```
https://knowflow-server-production.up.railway.app/health
```
Deve retornar: `{"status":"ok","timestamp":"..."}`

---

## 8. Fazer deploy do cliente (Frontend)

### 8.1 — Criar serviço do cliente

1. No projeto Railway, clique **"+ New"**
2. Selecione **"GitHub Repo"** → escolha `knowflow` novamente
3. Clique **"Add Variables"** (não faça deploy ainda)

### 8.2 — Configurar Root Directory do cliente

1. Aba **"Settings"** do serviço do cliente
2. **"Root Directory"** → digite: `client`
3. Railway vai usar `client/Dockerfile` (build multi-stage com Nginx)

### 8.3 — Configurar variáveis do cliente

1. Aba **"Variables"** do serviço do cliente
2. Adicione a variável de build do Vite:

| Variável | Valor |
|----------|-------|
| `VITE_API_URL` | `https://knowflow-server-production.up.railway.app/api` |

> Substitua pela URL real do seu servidor (gerada no passo 7.5).

### 8.4 — Configurar Build Args no Dockerfile (já está configurado)

O `client/Dockerfile` já aceita `VITE_API_URL` como ARG:
```dockerfile
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL
```

Railway passa automaticamente as variáveis de ambiente como build args quando você define via **Variables**.

### 8.5 — Iniciar o deploy do cliente

1. Aba **"Deployments"** do serviço do cliente → **"Deploy"**
2. O build leva ~3-5 minutos (instala deps, roda `vite build`, configura nginx)
3. Acompanhe os logs:
   ```
   npm ci
   vite build
   ...
   ✓ built in Xs
   ```

### 8.6 — Gerar URL do cliente e testar

1. Aba **"Settings"** → **"Networking"** → **"Generate Domain"**
2. URL gerada: ex. `knowflow-client-production.up.railway.app`
3. Abra no navegador — você deve ver a Landing Page do KnowFlow

### 8.7 — Configurar CORS no servidor

Agora que tem a URL do cliente:
1. Volte ao serviço do **servidor**
2. Aba **"Variables"** → adicione:
   ```
   CORS_ORIGIN=https://knowflow-client-production.up.railway.app
   ```
3. Railway reinicia o servidor automaticamente

---

## 9. Configurar domínio personalizado (opcional)

Se você tem um domínio (ex: `knowflow.com.br`), siga estes passos.

### 9.1 — Domínio para o backend (API)

1. No serviço do servidor → **"Settings"** → **"Networking"**
2. **"Custom Domain"** → clique **"+"**
3. Digite: `api.knowflow.com.br`
4. Railway mostra um registro CNAME:
   ```
   Tipo:  CNAME
   Nome:  api
   Valor: knowflow-server-production.up.railway.app
   TTL:   3600
   ```
5. Acesse o painel DNS do seu provedor (Registro.br, Cloudflare, GoDaddy...)
6. Adicione o registro CNAME conforme acima
7. De volta no Railway, clique **"Verify"**
8. Aguarde propagação DNS (pode levar até 48h, geralmente ~5 min no Cloudflare)

### 9.2 — Domínio para o frontend

1. Serviço do cliente → **"Settings"** → **"Custom Domain"**
2. Digite: `app.knowflow.com.br` (ou `knowflow.com.br` se for o domínio raiz)
3. Adicione o CNAME no seu DNS
4. Atualize `CORS_ORIGIN` no servidor:
   ```
   CORS_ORIGIN=https://app.knowflow.com.br,https://knowflow-client-production.up.railway.app
   ```
5. Atualize `VITE_API_URL` no cliente:
   ```
   VITE_API_URL=https://api.knowflow.com.br/api
   ```
6. Redeploy o cliente (o Vite precisa rebuildar com a nova URL)

---

## 10. CI/CD automático com Railway

Railway monitora o GitHub e faz deploy automático a cada push. Verifique:

1. Serviço do servidor → **"Settings"** → **"Deploy"**
2. Confirme que **"Auto Deploy"** está ativado (toggle verde)
3. **"Branch"** está como `main`
4. **"Watch Paths"** → configure para: `server/**` (deploy do servidor só quando `server/` mudar)

Repita para o serviço do cliente:
- **"Watch Paths"**: `client/**`

Isso evita rebuild desnecessário do frontend quando apenas o backend muda.

---

## 11. CI/CD com GitHub Actions

O arquivo `.github/workflows/ci.yml` já está configurado para rodar testes automaticamente a cada push e PR.

### 11.1 — Configurar Secrets no GitHub

1. Acesse `github.com/SEU_USUARIO/knowflow` → **"Settings"**
2. No menu lateral: **"Secrets and variables"** → **"Actions"**
3. Clique **"New repository secret"** e adicione:

| Secret | Valor |
|--------|-------|
| `JWT_SECRET` | *(mesma string usada no Railway)* |

> Os testes mocam o banco e não precisam de credenciais de banco reais.

### 11.2 — Como o pipeline funciona

```
Push para main/develop
        │
        ▼
┌─────────────────────────────────────┐
│  server-tests    client-tests       │  ← rodam em paralelo
│  (Jest, ~30s)   (Vitest, ~20s)      │
└───────────────────┬─────────────────┘
                    │ (se ambos passarem)
                    ▼
          client-build (~3 min)
          (vite build de produção)
                    │
                    ▼
          Railway auto-deploy
          (detecta push em main)
```

### 11.3 — Ver resultado do pipeline

1. No GitHub, clique na aba **"Actions"**
2. Você verá cada run com status (✅ ou ❌)
3. Clique em um run para ver logs detalhados de cada job

---

## 12. Monitoramento e Troubleshooting

### 12.1 — Ver logs em tempo real

No Railway, para cada serviço:
1. Clique no card do serviço
2. Aba **"Logs"**
3. Você vê logs em tempo real. Filtros úteis:
   - `error` — apenas erros
   - `migration` — ver status das migrations

### 12.2 — Verificar saúde dos serviços

```bash
# Health check da API
curl https://knowflow-server-production.up.railway.app/health

# Resposta esperada:
# {"status":"ok","timestamp":"2026-05-14T..."}
```

### 12.3 — Erros comuns e soluções

#### ❌ `relation "usuario" does not exist`
**Causa**: Migrations não rodaram.
**Solução**:
1. Aba **"Logs"** do servidor — veja se `npx sequelize-cli db:migrate` aparece
2. Se falhou, verifique se `PGHOST`, `PGPASSWORD`, etc. estão corretamente referenciados
3. Para forçar re-run: Deployments → clique nos **"..."** do deploy mais recente → **"Redeploy"**

#### ❌ `CORS error` no navegador
**Causa**: `CORS_ORIGIN` não inclui a URL do frontend.
**Solução**: Adicione a URL do cliente (incluindo `https://`) em `CORS_ORIGIN` no servidor.

#### ❌ `JWT_SECRET is undefined`
**Causa**: Variável não configurada no Railway.
**Solução**: Servidor → Variables → confirme que `JWT_SECRET` está definido.

#### ❌ Upload de imagem falha (`500 Erro ao fazer upload`)
**Causa**: Credenciais Cloudinary ausentes ou incorretas.
**Solução**: Verifique `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` no servidor.

#### ❌ Frontend mostra "Network Error" em todas as chamadas
**Causa**: `VITE_API_URL` aponta para URL errada ou o servidor está offline.
**Solução**:
1. Verifique o health check do servidor
2. Confirme que `VITE_API_URL` no cliente termina em `/api` (sem trailing slash)
3. Rebuilde o cliente após corrigir a variável

#### ❌ Redis connection warnings nos logs (mas tudo funciona)
**Normal!** O KnowFlow tem graceful degradation — funciona sem Redis. Verifique se `REDIS_URL` está referenciado ao serviço Redis.

### 12.4 — Conectar ao banco de produção (emergência)

Para inspecionar o banco via psql:
1. No Railway, clique no card **"Postgres"**
2. Aba **"Data"** → Railway tem um editor SQL visual embutido
3. Ou use a aba **"Connect"** → copie a connection string e use no psql/TablePlus/DBeaver

### 12.5 — Rollback de deploy

Se um deploy quebrar:
1. Serviço → aba **"Deployments"**
2. Encontre o deploy anterior (verde)
3. Clique **"Redeploy"** nele

As migrations já rodadas NÃO são revertidas automaticamente. Se necessário:
```bash
# Rodar localmente apontando para o banco de produção (cuidado!)
DATABASE_URL=postgresql://... npx sequelize-cli db:migrate:undo
```

---

## 13. Checklist final de produção

Antes de anunciar o produto, verifique cada item:

### Segurança
- [ ] `JWT_SECRET` tem pelo menos 32 caracteres aleatórios
- [ ] `NODE_ENV=production` no servidor Railway
- [ ] `.env` não está no repositório GitHub (confirme no `git log`)
- [ ] CORS configurado apenas para origens conhecidas
- [ ] Rate limiting ativo (já configurado: 300 req/15min)
- [ ] Helmet ativo (já configurado)

### Banco de dados
- [ ] Todas as migrations rodaram (`/health` retorna 200)
- [ ] Conexão SSL com PostgreSQL (`rejectUnauthorized: false` para Railway)
- [ ] Nenhum `sequelize.sync()` no código

### Storage de mídias
- [ ] Cloudinary configurado e testado (fazer um upload de imagem de teste)
- [ ] Imagens aparecem corretamente nos flows após upload
- [ ] Áudios aparecem corretamente

### Frontend
- [ ] `VITE_API_URL` aponta para a URL de produção da API
- [ ] Login e cadastro funcionam
- [ ] Criar flow, salvar e visualizar funciona
- [ ] Uploads de mídia funcionam

### CI/CD
- [ ] Push para `main` dispara deploy automático no Railway
- [ ] GitHub Actions passa (aba Actions mostra ✅)
- [ ] Auto-deploy com Watch Paths configurado

### Performance
- [ ] Redis conectado (ver logs: `Redis conectado.`)
- [ ] Cache funcionando (segunda chamada GET /flow mais rápida)

---

## Resumo das URLs após deploy

| Serviço | URL Railway | Variável |
|---------|------------|---------|
| API (servidor) | `https://knowflow-server-production.up.railway.app` | — |
| Frontend (cliente) | `https://knowflow-client-production.up.railway.app` | `VITE_API_URL` |
| API base | `https://knowflow-server-production.up.railway.app/api` | — |
| Health check | `https://knowflow-server-production.up.railway.app/health` | — |

---

## Custos estimados no Railway (Plano Hobby — $5/mês base)

| Recurso | Uso estimado | Custo extra |
|---------|-------------|-------------|
| Servidor API | ~200MB RAM | ~$0-2/mês |
| PostgreSQL | ~100MB dados | ~$0-1/mês |
| Redis | ~20MB | ~$0/mês |
| Cliente (Nginx) | ~50MB RAM | ~$0-1/mês |
| **Total** | | **~$5-9/mês** |

> O plano Hobby inclui $5 de crédito mensal gratuito, então o custo real pode ser $0–4/mês para projetos pequenos.

---

*Atualizado em: 2026-05-14*
