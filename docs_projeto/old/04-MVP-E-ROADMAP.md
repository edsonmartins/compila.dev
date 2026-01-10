# CodeBR - MVP e Roadmap de Desenvolvimento

## 1. Definição do MVP (Produto Mínimo Viável)

### 1.1 Objetivo do MVP
Validar as 3 hipóteses principais:
1. Desenvolvedores brasileiros querem praticar frontend com desafios em português
2. Sistema de portfólio + currículo agrega valor
3. Usuários pagarão R$ 29,90/mês por features PRO

**Meta de sucesso:** 500 usuários em 3 meses, 3% conversão FREE → PRO (15 pagantes)

### 1.2 Features do MVP

#### ✅ Incluir no MVP

**Core (obrigatório):**
- [ ] Sistema de autenticação (email/senha + OAuth Google)
- [ ] 20 desafios (5 por nível: Newbie, Junior, Intermediate, Advanced)
- [ ] Sistema de submissions (URL + GitHub + screenshots)
- [ ] Análise automática básica (HTML válido, responsivo, Lighthouse)
- [ ] Portfólio público (codebr.dev/@username)
- [ ] Feed simples (últimas submissions)
- [ ] Sistema de XP e levels
- [ ] 3 badges básicos

**Diferenciadores:**
- [ ] Desafios 100% em português
- [ ] Feedback IA em português
- [ ] Geração de currículo PDF

#### ❌ Não incluir no MVP (fazer depois)

**Deixar para V2:**
- Batalhas ao vivo
- Comunidades
- Vagas/Jobs
- Ferramentas online
- Mobile app
- Eventos ao vivo
- Mentoria

**Justificativa:** Foco em provar que desafios + portfólio funcionam antes de adicionar complexidade.

---

## 2. Arquitetura Simplificada do MVP

### 2.1 Stack Reduzida

**Backend:**
- Spring Boot (monolito, sem microserviços)
- PostgreSQL (sem MongoDB/Elasticsearch no MVP)
- Redis (cache básico)

**Frontend:**
- Next.js (SSR + Static)
- Tailwind CSS
- React Query

**Infra:**
- Railway ou Render (deploy fácil)
- Vercel (frontend)
- Supabase ou AWS RDS (database)
- CloudFlare (CDN grátis)

**Sem no MVP:**
- Kubernetes (overkill)
- WebSocket/real-time
- Message queues
- Elasticsearch

### 2.2 Diagrama Simplificado

```
┌──────────────┐
│  Next.js     │
│  (Vercel)    │
└──────┬───────┘
       │
       │ HTTPS
       │
┌──────▼────────┐       ┌──────────┐
│  Spring Boot  │──────▶│PostgreSQL│
│  (Railway)    │       │(Supabase)│
└──────┬────────┘       └──────────┘
       │
       │
  ┌────▼────┐
  │  Redis  │
  │ (Cache) │
  └─────────┘
```

---

## 3. Roadmap de Desenvolvimento

### 3.1 Sprint 0 - Setup (Semana 1)

**Infra:**
- [ ] Criar repos GitHub (backend, frontend)
- [ ] Setup Railway para backend
- [ ] Setup Vercel para frontend
- [ ] Provisionar PostgreSQL (Supabase)
- [ ] Configurar Redis (Railway add-on)
- [ ] CI/CD básico

**Backend:**
- [ ] Scaffold Spring Boot
- [ ] Configurar JPA + PostgreSQL
- [ ] Configurar Spring Security
- [ ] Health check endpoint

**Frontend:**
- [ ] Scaffold Next.js
- [ ] Setup Tailwind + shadcn/ui
- [ ] Configurar Axios
- [ ] Layout base (Header, Footer)

**Deliverable:** Ambientes funcionando, deploy automático

---

### 3.2 Sprint 1 - Autenticação (Semana 2)

**Backend:**
- [ ] Modelo User (JPA entity)
- [ ] UserRepository
- [ ] AuthService (register, login, refresh)
- [ ] JWT token generation/validation
- [ ] AuthController (REST endpoints)
- [ ] OAuth Google integration

**Frontend:**
- [ ] Página de login
- [ ] Página de registro
- [ ] AuthContext/Store
- [ ] Protected routes
- [ ] Google OAuth button

**Testes:**
- [ ] Criar conta
- [ ] Login com email/senha
- [ ] Login com Google
- [ ] Refresh token

**Deliverable:** Usuários podem criar conta e logar

---

### 3.3 Sprint 2 - Desafios (Semanas 3-4)

**Design:**
- [ ] Criar 5 designs para MVP (Figma)
  - 1 Newbie: Card de produto simples
  - 1 Junior: Landing page responsiva
  - 1 Intermediate: Dashboard com sidebar
  - 1 Advanced: E-commerce com carrinho
  - 1 Advanced: Portfólio pessoal

**Backend:**
- [ ] Modelo Challenge
- [ ] ChallengeRepository
- [ ] ChallengeService
- [ ] ChallengeController
- [ ] Seeds com 5 desafios iniciais

**Frontend:**
- [ ] Página de listagem de desafios
- [ ] Filtros (dificuldade, tecnologia)
- [ ] ChallengeCard component
- [ ] Página de detalhe do desafio
- [ ] Download de starter files

**Testes:**
- [ ] Listar desafios
- [ ] Filtrar por dificuldade
- [ ] Ver detalhes
- [ ] Download dos arquivos

**Deliverable:** 5 desafios navegáveis

---

### 3.4 Sprint 3 - Submissions (Semanas 5-6)

**Backend:**
- [ ] Modelo Submission
- [ ] SubmissionRepository
- [ ] SubmissionService
- [ ] SubmissionController
- [ ] Validação de URL (HTTP check)
- [ ] Screenshot automático (Puppeteer)
- [ ] Lighthouse integration

**Frontend:**
- [ ] SubmissionForm (URL, GitHub, screenshots)
- [ ] Upload de imagens (drag & drop)
- [ ] Preview de submission
- [ ] Página "Minhas Submissions"
- [ ] Edição de submission

**Testes:**
- [ ] Submeter solução
- [ ] Ver minhas submissions
- [ ] Editar submission
- [ ] Validação funciona

**Deliverable:** Usuários podem submeter soluções

---

### 3.5 Sprint 4 - Análise IA Básica (Semana 7)

**Backend (Python):**
- [ ] Setup FastAPI
- [ ] Endpoint /analyze
- [ ] HTML validation (W3C API)
- [ ] CSS linting básico
- [ ] Accessibility checks (axe-core)
- [ ] Score calculation

**Backend (Java):**
- [ ] Job assíncrono para chamar IA
- [ ] Salvar feedback em Submission
- [ ] Atualizar score

**Frontend:**
- [ ] Exibir feedback IA
- [ ] Badge de score
- [ ] Sugestões de melhoria

**Testes:**
- [ ] Submission recebe análise
- [ ] Score é calculado
- [ ] Feedback aparece

**Deliverable:** Feedback automático funciona

---

### 3.6 Sprint 5 - Gamificação (Semana 8)

**Backend:**
- [ ] Sistema de XP
- [ ] Cálculo de levels
- [ ] Modelo Badge
- [ ] UserBadge (many-to-many)
- [ ] GamificationService
- [ ] 3 badges iniciais

**Frontend:**
- [ ] XP bar no header
- [ ] Level indicator
- [ ] Página de badges
- [ ] Notificação de level up
- [ ] Leaderboard simples (top 20)

**Testes:**
- [ ] XP é concedido
- [ ] Level up funciona
- [ ] Badges aparecem

**Deliverable:** Sistema de progressão funciona

---

### 3.7 Sprint 6 - Portfólio (Semanas 9-10)

**Backend:**
- [ ] Modelo Portfolio
- [ ] Modelo Experience
- [ ] Modelo Education
- [ ] PortfolioService
- [ ] Featured submissions
- [ ] PDF generation (Flying Saucer)

**Frontend:**
- [ ] Editor de portfólio
- [ ] Seções: About, Experience, Education, Projects
- [ ] Tema visual básico
- [ ] Página pública (@username)
- [ ] Preview do portfólio
- [ ] Botão "Exportar PDF"

**Testes:**
- [ ] Editar portfólio
- [ ] Ver público
- [ ] Exportar PDF
- [ ] PDF está bonito

**Deliverable:** Portfólio completo funcional

---

### 3.8 Sprint 7 - Feed Social (Semana 11)

**Backend:**
- [ ] Likes em submissions
- [ ] Comentários básicos
- [ ] Feed query (últimas submissions)
- [ ] Contador de likes/comments

**Frontend:**
- [ ] Feed de submissions
- [ ] Like button
- [ ] Comment box
- [ ] Infinite scroll

**Testes:**
- [ ] Feed carrega
- [ ] Like funciona
- [ ] Comentar funciona

**Deliverable:** Feed social básico

---

### 3.9 Sprint 8 - Monetização (Semana 12)

**Backend:**
- [ ] Planos (FREE, PRO)
- [ ] Stripe integration
- [ ] Webhook handling
- [ ] Atualizar user.isPro

**Frontend:**
- [ ] Página de pricing
- [ ] Checkout flow
- [ ] Área de assinatura
- [ ] Paywall features PRO

**Features PRO:**
- [ ] Figma files nos desafios
- [ ] Feedback IA detalhado
- [ ] Analytics do portfólio
- [ ] Sem limite de submissions

**Testes:**
- [ ] Assinar PRO
- [ ] Features desbloqueadas
- [ ] Cancelar assinatura

**Deliverable:** Monetização funcional

---

### 3.10 Sprint 9 - Polish & Launch (Semana 13)

**Tasks:**
- [ ] Landing page otimizada
- [ ] SEO (meta tags, sitemap)
- [ ] Onboarding tutorial
- [ ] Analytics (Plausible/Posthog)
- [ ] Emails transacionais (Resend)
- [ ] Testes end-to-end (Playwright)
- [ ] Monitoring (Sentry)
- [ ] Performance audit

**Marketing:**
- [ ] Product Hunt page
- [ ] Post no LinkedIn
- [ ] Vídeo demo (3 min)
- [ ] Alcançar YouTubers tech

**Deliverable:** MVP pronto para lançamento público

---

## 4. Cronograma Visual

```
Semana 1  │ Setup
Semana 2  │ Autenticação
Semana 3-4│ Desafios
Semana 5-6│ Submissions
Semana 7  │ IA
Semana 8  │ Gamificação
Semana 9-10│ Portfólio
Semana 11 │ Feed
Semana 12 │ Monetização
Semana 13 │ Polish & Launch
```

**Total:** 13 semanas (~3 meses)

---

## 5. Requisitos de Equipe

### 5.1 Para MVP (mínimo)

**Essencial:**
- 1 Full-stack (Java + React)
- 1 Designer (UI/UX + desafios)

**Opcional mas recomendado:**
- 1 Frontend especialista
- 1 QA/Tester part-time

### 5.2 Custo Estimado

| Perfil | Dedicação | Custo/mês | Total 3 meses |
|--------|-----------|-----------|---------------|
| Full-stack Sênior | 100% | R$ 15.000 | R$ 45.000 |
| Designer | 50% | R$ 4.000 | R$ 12.000 |
| Infra/DevOps | R$ 500 | R$ 1.500 |
| **Total** | | | **R$ 58.500** |

---

## 6. Métricas de Sucesso do MVP

### 6.1 Desenvolvimento

- [ ] 0 bugs críticos
- [ ] <2s load time
- [ ] >90 Lighthouse score
- [ ] 100% features testadas

### 6.2 Produto

- [ ] 500+ usuários registrados
- [ ] 100+ submissions criadas
- [ ] 15+ conversões PRO (3%)
- [ ] 30%+ DAU/MAU
- [ ] NPS >40

### 6.3 Negócio

- [ ] R$ 450+ MRR (15 x R$ 29,90)
- [ ] <R$ 30 CAC
- [ ] LTV/CAC >3
- [ ] <10% churn mensal

---

## 7. Pós-MVP (V2 e além)

### 7.1 Prioridades Fase 2 (Mês 4-6)

**Se MVP validou:**
1. **Mais desafios** (chegar a 50)
2. **Comunidades** (engajamento + retenção)
3. **Batalhas básicas** (duelos 1v1)
4. **Mobile app** (Flutter MVP)

**Se CAC muito alto:**
1. **SEO** (blog com conteúdo)
2. **Programa de indicação**
3. **Parcerias** (YouTubers, bootcamps)

**Se churn alto:**
1. **Onboarding melhor**
2. **Email drip campaigns**
3. **Features de retenção** (streaks, notificações)

### 7.2 Fase 3 (Mês 7-12)

- Vagas/Jobs (nova receita)
- Ferramentas online
- Certificações profissionais
- Eventos presenciais

---

## 8. Riscos do MVP

### 8.1 Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| IA ruim | Média | Alto | Validar cedo com beta testers |
| Performance lenta | Baixa | Médio | Testes de carga semanais |
| Bugs críticos | Média | Alto | QA rigoroso antes de launch |

### 8.2 Produto

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Desafios muito fáceis | Média | Médio | Testar com 20 devs antes |
| Portfólio feio | Baixa | Alto | Contratar designer bom |
| Paywall mal posicionado | Média | Alto | A/B test com 2 variantes |

### 8.3 Negócio

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Poucos signups | Alta | Crítico | Marketing pré-launch |
| Conversão <1% | Média | Alto | Trial grátis 7 dias |
| Concorrente copia | Baixa | Médio | Velocidade de execução |

---

## 9. Plano de Lançamento

### 9.1 Beta Fechado (2 semanas antes)

**Objetivo:** Encontrar bugs, validar produto

**Ações:**
- [ ] Recrutar 50 beta testers (LinkedIn, Twitter)
- [ ] Criar canal Discord privado
- [ ] Daily bug reports
- [ ] Ajustes rápidos

**Incentivo:**
- PRO grátis por 3 meses
- Badge exclusivo "Beta Tester"

### 9.2 Lançamento Público

**Canais:**
1. **Product Hunt** (terça ou quarta, 00:01 PST)
2. **LinkedIn** (post pessoal founders + empresa)
3. **Twitter** (thread)
4. **Reddit** (/r/brasil, /r/brdev)
5. **WhatsApp/Telegram** (grupos de devs)

**Assets necessários:**
- [ ] Vídeo demo (2-3 min)
- [ ] Screenshots bonitos
- [ ] GIFs de features principais
- [ ] Depoimentos beta testers

**Meta Dia 1:**
- 100 signups
- 5 conversões PRO
- Top 5 Product Hunt Brasil

---

## 10. Checklist Final Pré-Launch

### 10.1 Produto

- [ ] Todas as features do MVP funcionam
- [ ] Testado em Chrome, Safari, Firefox, Edge
- [ ] Responsivo mobile (iPhone, Android)
- [ ] Zero bugs críticos
- [ ] Performance OK (<2s load)

### 10.2 Legal

- [ ] Termos de uso
- [ ] Política de privacidade (LGPD)
- [ ] Cookie consent
- [ ] CNPJ registrado
- [ ] Gateway de pagamento configurado

### 10.3 Marketing

- [ ] Landing page otimizada
- [ ] SEO básico (title, meta, sitemap)
- [ ] Analytics instalado
- [ ] Pixel Meta/Google (retargeting)
- [ ] Email marketing setup (Resend/Loops)

### 10.4 Operações

- [ ] Monitoring (Sentry)
- [ ] Uptime alerts
- [ ] Backups automáticos
- [ ] Runbook para incidentes
- [ ] Email suporte@ configurado

---

## 11. Success Criteria

**Após 30 dias do lançamento, considerar MVP sucesso se:**

✅ 500+ usuários registrados
✅ 15+ assinantes PRO (R$ 450+ MRR)
✅ 30%+ usuários voltam (D7 retention)
✅ NPS >40
✅ <5 bugs críticos reportados

**Se atingir:** Levantar seed round e escalar
**Se não atingir:** Pivotar ou iterar features
