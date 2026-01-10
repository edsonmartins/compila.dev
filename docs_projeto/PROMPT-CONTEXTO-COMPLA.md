# Prompt de Contexto - compila.dev

Use este prompt para continuar o desenvolvimento do compila.dev com o Claude Code.

---

## Contexto do Projeto

**O que é o compila.dev?**

Plataforma brasileira de desafios de programação com IA multi-agentes, baseada em fork do DeepTutor.

**Estratégia:** Fork completo do DeepTutor + adaptações para desafios de código

```
DeepTutor (base)
    ↓ fork + adaptações
compila.dev
```

---

## Arquitetura

```
compila-dev/
├── frontend/          ← Fork de DeepTutor/web (Next.js 16 + React 19)
├── backend/           ← NOVO: Spring Boot (Java 21)
├── ai-service/        ← Fork de DeepTutor/src (FastAPI + Python)
├── mobile/            ← NOVO: Flutter
├── db/                ← PostgreSQL schema
└── docs/              ← Documentação (4 arquivos MD)
```

---

## Mapeamento: DeepTutor → compila.dev

| DeepTutor | compila.dev |
|-----------|-------------|
| Home/Chat | Home (dashboard + tutor IA) |
| Solver | Editor de Desafios + Smart Solver |
| Question | Challenge Generator (admin) |
| Notebook | Portfólio de Projetos |
| Research | Tutorial Generator (content) |
| Guide | Trilhas de Aprendizado |
| IdeaGen | Project Ideas (portfólio) |
| Co-writer | Portfolio Assistant |
| - | Sistema de Desafios (NOVO) |
| - | Gamificação (NOVO) |
| - | Feed Social (NOVO) |
| - | Marketplace de Vagas (NOVO) |
| - | Batalhas ao Vivo (NOVO) |

---

## Próximos Passos Imediatos

### 1. Fork do DeepTutor

```bash
# Criar estrutura do projeto
mkdir -p compila-dev

# Copiar frontend do DeepTutor
cp -r /Users/edsonmartins/DeepTutor/web compila-dev/frontend

# Copiar ai-service do DeepTutor
cp -r /Users/edsonmartins/DeepTutor/src compila-dev/ai-service

# Copiar configurações
cp /Users/edsonmartins/DeepTutor/config compila-dev/ai-service/config
cp /Users/edsonmartins/DeepTutor/requirements.txt compila-dev/ai-service/
```

### 2. Primeiras Adaptações no Frontend

**Arquivos para editar:**

1. `frontend/package.json`
   - Alterar nome: "compila-dev-frontend"
   - Atualizar descrição

2. `frontend/app/layout.tsx`
   - Alterar título para "compila.dev"
   - Atualizar metadados

3. `frontend/styles/globals.css`
   - Alterar cores primárias (branding)
   - Atualizar CSS variables

4. `frontend/lib/api.ts`
   - Atualizar baseURL para apontar para ai-service

### 3. Setup do ai-service

**Arquivos para criar/editar:**

1. `ai-service/.env`
   ```bash
   LLM_BINDING=openai
   LLM_MODEL=gpt-4o
   LLM_API_KEY=sua_chave_aqui
   EMBEDDING_BINDING=openai
   EMBEDDING_MODEL=text-embedding-3-large
   EMBEDDING_API_KEY=sua_chave_aqui
   ```

2. `ai-service/Dockerfile` (backend-only)
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 8001
   CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8001"]
   ```

### 4. Criar Estrutura do Backend (Spring Boot)

```bash
mkdir -p compila-dev/backend/src/main/java/dev/compila
mkdir -p compila-dev/backend/src/main/resources
```

---

## Documentação Disponível

Os seguintes documentos estão na pasta atual:

1. **COMPILA-DEV-VISAO-DE-NEGOCIO.md**
   - Estratégia, análise de mercado, modelo de negócio
   - Projeções financeiras
   - Go-to-market

2. **COMPILA-DEV-ESPECIFICACAO-FUNCIONAL.md**
   - Features detalhadas
   - Fluxos de usuário
   - APIs e schemas
   - Gamificação

3. **COMPILA-DEV-ARQUITETURA-TECNICA.md**
   - Stack tecnológico
   - Banco de dados (schema SQL)
   - Infraestrutura (Docker, K8s)

4. **COMPILA-DEV-MOBILE.md**
   - App mobile (Flutter)
   - Features mobile-first
   - Notificações push

---

## Comandos Úteis

```bash
# Entrar no diretório do projeto
cd compila-dev

# Ver estrutura
ls -la

# Testar ai-service localmente
cd ai-service
uvicorn api.main:app --host 0.0.0.0 --port 8001 --reload

# Testar frontend localmente
cd frontend
npm install
npm run dev
```

---

## Prompt para o Claude Code

```
Olá! Estou desenvolvendo o compila.dev, uma plataforma brasileira de desafios de programação com IA multi-agentes.

## Contexto

O projeto é um fork do DeepTutor com as seguintes adaptações:
- Frontend (Next.js): fork de /web - adaptar para desafios de código
- AI Service (FastAPI): fork de /src - adaptar agentes para código
- Backend (Spring Boot): NOVO - auth, desafios, gamificação, social
- Mobile (Flutter): NOVO - app mobile

## Documentos

Tenho 4 documentos de especificação:
- COMPILA-DEV-VISAO-DE-NEGOCIO.md
- COMPILA-DEV-ESPECIFICACAO-FUNCIONAL.md
- COMPILA-DEV-ARQUITETURA-TECNICA.md
- COMPILA-DEV-MOBILE.md

## O que preciso fazer

[DESCREVA A TAREFA ESPECÍFICA AQUI]

## Arquivos existentes

[Liste os arquivos já criados ou copiados]

## Perguntas

[Se houver dúvidas específicas]
```

---

## Checklist Inicial

- [ ] Criar estrutura de pastas
- [ ] Copiar frontend do DeepTutor
- [ ] Copiar ai-service do DeepTutor
- [ ] Configurar .env do ai-service
- [ ] Testar ai-service standalone
- [ ] Adaptar branding do frontend
- [ ] Criar estrutura do backend Spring Boot
- [ ] Criar schema do banco de dados

---

## Stack Resumido

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind |
| Backend Core | Spring Boot 3.2, Java 21 |
| AI Service | FastAPI, Python 3.10+ |
| Mobile | Flutter 3.19+ |
| DB | PostgreSQL 16, Redis 7 |
| Vector | Qdrant/Pinecone |
| LLM | OpenAI, Anthropic, DeepSeek, Groq |
