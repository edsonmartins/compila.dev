# Plano de Implementação - compila.dev

> Documento vivo com o plano de desenvolvimento da plataforma

## Status Atual

- ✅ Landing Page completa (11 seções)
- ✅ Dark/Light mode funcionando
- ✅ Estrutura Next.js 16 + React 19 configurada
- ⏳ Próximo: Reorganizar estrutura para suportar plataforma

---

## 1. Reorganização Frontend (Next.js)

### Estrutura Proposta

```
app/
├── (marketing)/              # Rotas públicas (sem auth)
│   ├── page.tsx             # Landing page atual (MOVER da raiz)
│   ├── como-funciona/
│   │   └── page.tsx         # Página "Como Funciona"
│   ├── comunidade/
│   │   └── page.tsx         # Página "Comunidade"
│   └── pricing/
│       └── page.tsx         # Página "Pricing"
│
├── (auth)/                   # Autenticação
│   ├── login/
│   │   └── page.tsx
│   ├── cadastro/
│   │   └── page.tsx
│   └── layout.tsx           # Layout simples para auth
│
├── app/                      # Área logada (require auth)
│   ├── desafios/
│   │   ├── page.tsx         # Listagem de desafios
│   │   ├── [id]/
│   │   │   └── page.tsx     # Detalhe do desafio
│   │   └── [id]/editor/
│   │       └── page.tsx     # Editor de código
│   ├── dashboard/
│   │   └── page.tsx
│   ├── portfolio/
│   │   ├── editar/
│   │   │   └── page.tsx
│   │   └── page.tsx         # Meu portfólio
│   ├── trilhas/
│   │   └── page.tsx
│   └── layout.tsx           # Layout interno (sidebar + header)
│
├── u/[username]/             # Perfis públicos
│   └── page.tsx
├── feed/
│   └── page.tsx             # Feed social (público)
├── vagas/
│   └── page.tsx             # Marketplace de vagas
│
├── api/                      # API Routes (middleware para backend)
│   ├── auth/
│   ├── challenges/
│   └── ...
│
├── layout.tsx               # Root layout (ATUAL - manter)
├── globals.css              # Estilos globais (ATUAL - manter)
├── robots.ts
└── sitemap.ts
```

### Componentes a Reorganizar

```
components/
├── layout/                   # Layouts
│   ├── Header.tsx           # ATUAL (manter)
│   ├── Footer.tsx           # ATUAL (manter)
│   ├── Sidebar.tsx          # NOVO: Sidebar da área logada
│   ├── AppShell.tsx         # NOVO: Shell da aplicação
│   └── SkipLink.tsx         # ATUAL
│
├── sections/                # Seções da LP (ATUAL - manter todas)
│   ├── HeroSection.tsx
│   ├── SocialProof.tsx
│   └── ...
│
├── app/                     # Componentes da área logada
│   ├── desafios/
│   │   ├── ChallengeCard.tsx
│   │   ├── ChallengeList.tsx
│   │   ├── ChallengeDetail.tsx
│   │   ├── CodeEditor.tsx
│   │   └── SubmissionForm.tsx
│   ├── portfolio/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectForm.tsx
│   │   └── PortfolioPreview.tsx
│   ├── social/
│   │   ├── Feed.tsx
│   │   ├── PostCard.tsx
│   │   └── CommentSection.tsx
│   └── Dashboard/
│       ├── StatsOverview.tsx
│       ├── RecentActivity.tsx
│       └── ProgressCard.tsx
│
├── ui/                      # UI Components (ATUAL + novos)
│   ├── Button.tsx           # ATUAL
│   ├── Card.tsx             # ATUAL
│   ├── Accordion.tsx        # ATUAL
│   ├── Container.tsx        # ATUAL
│   ├── ThemeToggle.tsx      # ATUAL
│   └── ...                  # Mais componentes shadcn/ui
│
├── providers/               # Context providers
│   ├── ThemeProvider.tsx    # ATUAL
│   └── AuthProvider.tsx     # NOVO: Autenticação
│
└── lib/                     # Utilitários
    ├── api.ts               # NOVO: Cliente API
    ├── auth.ts              # NOVO: Auth helpers
    ├── utils.ts             # ATUAL
    └── data.ts              # ATUAL
```

---

## 2. Backend (Spring Boot) - NOVO

### Estrutura Proposta

```
backend/
├── src/main/java/dev/compila/
│   ├── CompilaApplication.java
│   │
│   ├── config/              # Configurações
│   │   ├── SecurityConfig.java
│   │   ├── JWTConfig.java
│   │   ├── OAuthConfig.java
│   │   └── RedisConfig.java
│   │
│   ├── auth/               # Autenticação
│   │   ├── AuthController.java
│   │   ├── AuthService.java
│   │   ├── JWTService.java
│   │   └── OAuthService.java
│   │
│   ├── user/               # Usuários
│   │   ├── UserController.java
│   │   ├── UserService.java
│   │   ├── UserRepository.java
│   │   └── User.java (entity)
│   │
│   ├── challenge/          # Desafios
│   │   ├── ChallengeController.java
│   │   ├── ChallengeService.java
│   │   ├── ChallengeRepository.java
│   │   └── Challenge.java (entity)
│   │
│   ├── submission/         # Submissões
│   │   ├── SubmissionController.java
│   │   ├── SubmissionService.java
│   │   ├── SubmissionRepository.java
│   │   └── Submission.java (entity)
│   │
│   ├── portfolio/          # Portfólio
│   │   ├── PortfolioController.java
│   │   ├── PortfolioService.java
│   │   └── ...
│   │
│   ├── social/             # Social
│   │   ├── FeedController.java
│   │   ├── PostController.java
│   │   └── ...
│   │
│   ├── gamification/       # Gamificação
│   │   ├── BadgeService.java
│   │   ├── XPService.java
│   │   └── ...
│   │
│   └── ai/                 # Integração AI Service
│       ├── AIService.java
│       └── ...
│
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/       # Flyway migrations
│
└── pom.xml
```

---

## 3. AI Service (FastAPI) - Fork DeepTutor

### Estrutura

```
ai-service/
├── app/
│   ├── main.py
│   ├── api/
│   │   └── routes/
│   ├── agents/
│   │   ├── base.py         # BaseAgent
│   │   ├── investigate.py   # InvestigateAgent
│   │   ├── note.py          # NoteAgent
│   │   ├── manager.py       # ManagerAgent
│   │   ├── solve.py         # SolveAgent
│   │   ├── check.py         # CheckAgent
│   │   ├── response.py      # ResponseAgent
│   │   └── precision.py     # PrecisionAgent
│   ├── services/
│   │   ├── rag.py          # RAG Service
│   │   └── code_executor.py # Code Executor
│   └── config.py
├── requirements.txt
└── Dockerfile
```

---

## Roadmap de Desenvolvimento

### Fase 1: Fundação (Semanas 1-2)
- [ ] Reorganizar estrutura do Next.js
- [ ] Criar estrutura do backend Spring Boot
- [ ] Configurar PostgreSQL local
- [ ] Implementar autenticação (JWT)
- [ ] Criar páginas de login/cadastro

### Fase 2: Desafios MVP (Semanas 3-4)
- [ ] Model de dados: Challenge
- [ ] CRUD de desafios (admin)
- [ ] Listagem de desafios (pública)
- [ ] Página de detalhe do desafio
- [ ] Seed com 5 desafios iniciais

### Fase 3: Editor e Submissões (Semanas 5-6)
- [ ] Editor Monaco integrado
- [ ] Sistema de submissões
- [ ] Testes automatizados
- [ ] Integração com AI Service

### Fase 4: Portfólio (Semanas 7-8)
- [ ] Perfil público
- [ ] Gerenciador de projetos
- [ ] Exportação PDF
- [ ] Stats e analytics

### Fase 5: Gamificação (Semana 9)
- [ ] Sistema de XP
- [ ] Níveis
- [ ] Badges
- [ ] Leaderboards

### Fase 6: Social (Semanas 10-11)
- [ ] Feed social
- [ ] Likes e comentários
- [ ] Seguir usuários
- [ ] Comunidades básicas

### Fase 7: Lançamento MVP (Semana 12)
- [ ] Polish geral
- [ ] SEO otimizado
- [ ] Testes E2E
- [ ] Deploy produção

---

## Próximos Passos Imediatos

1. **Reorganizar o Next.js** - Mover landing page para (marketing)/
2. **Criar estrutura do backend** - Spring Boot scaffold
3. **Implementar autenticação** - Login/Cadastro com JWT
4. **Criar modelo de dados** - Schema PostgreSQL

---

**Documento criado em:** 10/01/2026
**Última atualização:** 10/01/2026
