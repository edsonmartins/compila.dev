# Auditoria de Implementacao - Gaps e Pendencias

## Escopo analisado
- Documentos: `docs_projeto/README.md`, `docs_projeto/PROMPT-CONTEXTO-COMPLA.md`,
  `docs_projeto/compila.dev — Brand & Visual Identity.md`,
  `docs_projeto/COMPILA-DEV-VISAO-DE-NEGOCIO.md`,
  `docs_projeto/COMPILA-DEV-ESPECIFICACAO-FUNCIONAL.md`,
  `docs_projeto/COMPILA-DEV-ARQUITETURA-TECNICA.md`,
  `docs_projeto/COMPILA-DEV-MOBILE.md`
- Codigo: frontend (`app/`, `components/`, `lib/`), backend (`backend/`), ai-service (`ai-service/`)

## Principais gaps (resumo)
- Mobile (Flutter) nao existe no repo.
- Marketplace de vagas e portfolio estao com mocks no frontend e sem backend completo.
- Fluxo de desafios depende de requisitos/starter code que nao sao enviados pela API.
- Avaliacao/execucao de codigo e RAG tem placeholders/mocks.
- Infra descrita (Redis, Mongo, Qdrant, fila, CI/CD, Docker Compose) nao esta configurada no repo.

## Gaps por area

### Documentacao e escopo
- `docs_projeto/README.md` referencia `01-...`/`02-...`/`03-...`/`04-...`/`05-...` que nao existem; nomes atuais divergem.
- Estrutura descrita em `PROMPT-CONTEXTO-COMPLA.md` (ex.: `frontend/`, `db/`, `mobile/`) nao bate com a estrutura real.

### Frontend
- Vagas usam dados mock e nao consomem API (ver `app/app/vagas/page.tsx`).
- Portfolio publico carrega usuario, mas projetos estao mockados (ver `app/app/portfolio/[username]/page.tsx`).
- Listagem/detalhe de desafios faz fallback para mock quando API falha (ver `app/app/desafios/page.tsx` e `app/app/desafios/[slug]/page.tsx`).
- Perfil nao chama API para atualizar dados nem trocar senha (ver `app/app/perfil/page.tsx`).
- Feed com TODOs (share, ownership) e sidebar usa usuario mock quando nao ha sessao (ver `app/app/feed/page.tsx`, `components/app/layout/AppSidebar.tsx`).

### Backend
- Refresh token nao implementado (ver `backend/src/main/java/dev/compila/auth/AuthService.java`).
- ChallengeResponse nao parseia `requirements` e `starterCode` (ver `backend/src/main/java/dev/compila/challenge/dto/ChallengeResponse.java`).
- Submission nao persiste `testResults` (ver `backend/src/main/java/dev/compila/submission/SubmissionService.java`).
- Contadores de desafios no perfil retornam zero fixo (ver `backend/src/main/java/dev/compila/user/dto/UserProfileResponse.java`).
- Execucao de codigo sem limites de recurso (ver `backend/src/main/java/dev/compila/execution/language/PythonExecutor.java`).
- Portfolio nao possui implementacao no backend (`backend/src/main/java/dev/compila/portfolio/` vazio).
- Nao ha modulo de vagas/jobs no backend (nao existe package/endpoint).

### AI service
- `code_evaluation` retorna mocks quando o executor nao esta disponivel.
- Parser de PDF usa fallback placeholder.
- Indexacao vetorial usa JSON local (placeholder, sem vector store real).

### Infra/DevOps
- Nao ha configuracao local para Redis, MongoDB, fila, Qdrant/Meilisearch etc.
- Sem Docker Compose/K8s/IaC no repo apesar de descritos na arquitetura.

## Prioridades sugeridas (implementacao)
1) Corrigir APIs base do fluxo de desafios (requirements/starter code/test results).
2) Implementar refresh token e endpoints de perfil (update/password).
3) Substituir mocks do frontend por chamadas reais (vagas, portfolio, feed).
4) Definir execucao segura de codigo (limits, sandbox, isolamento).
5) Escolher stack de infra minima (Postgres + Redis + fila + AI service) e adicionar compose.
6) Planejar MVP mobile ou remover/adiar do escopo documentado.

## Proximos passos
- Validar prioridades e definir um roadmap por sprint.
- Converter os gaps acima em issues com criterios de aceite.
