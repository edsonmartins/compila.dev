# CodeBR - Arquitetura Técnica

## 1. Visão Geral da Arquitetura

### 1.1 Stack Tecnológico

#### Frontend Web
- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Estado**: Zustand + React Query
- **Real-time**: Socket.io client

#### Mobile
- **Framework**: Flutter 3.19+
- **Linguagem**: Dart
- **Estado**: Riverpod
- **Local DB**: Drift (SQLite)

#### Backend Core (Java)
- **Framework**: Spring Boot 3.2
- **Linguagem**: Java 21 (Virtual Threads)
- **APIs**: REST + WebSocket
- **Segurança**: Spring Security + JWT

#### Backend Events (Node.js)
- **Framework**: Express + Socket.io
- **Linguagem**: TypeScript
- **Propósito**: Real-time, batalhas, chat

#### Backend AI (Python)
- **Framework**: FastAPI
- **Propósito**: Análise de código, feedback IA
- **ML**: Transformers, LLMs locais

#### Bancos de Dados
- **PostgreSQL 16**: Dados principais
- **MongoDB**: Feed, analytics
- **Redis**: Cache, sessions, leaderboards
- **Elasticsearch**: Busca avançada

#### Infraestrutura
- **Cloud**: AWS ou Google Cloud
- **Container**: Docker + Kubernetes
- **CDN**: CloudFlare
- **Storage**: S3-compatible
- **Message Queue**: RabbitMQ

### 1.2 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                          CDN (CloudFlare)                     │
│                   Assets, Imagens, Cache Edge                │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                  │
┌───────▼─────────┐              ┌────────▼──────────┐
│   Next.js Web   │              │   Flutter Mobile  │
│   (Vercel/AWS)  │              │   (App Stores)    │
└───────┬─────────┘              └────────┬──────────┘
        │                                  │
        └────────────────┬─────────────────┘
                         │
              ┌──────────▼───────────┐
              │   API Gateway (Kong) │
              │  Auth, Rate Limit    │
              └──────────┬───────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐ ┌────▼──────┐ ┌──────▼──────┐
│  Spring Boot   │ │  Node.js  │ │   FastAPI   │
│  (Core APIs)   │ │  (Events) │ │    (AI)     │
│  Port 8080     │ │  Port 3001│ │  Port 8000  │
└───────┬────────┘ └────┬──────┘ └──────┬──────┘
        │               │               │
        └───────┬───────┴───────┬───────┘
                │               │
    ┌───────────▼───────────────▼───────────┐
    │         Data Layer                     │
    │  ┌──────────┐  ┌──────────┐           │
    │  │PostgreSQL│  │   Redis  │           │
    │  │ (Primary)│  │  (Cache) │           │
    │  └──────────┘  └──────────┘           │
    │  ┌──────────┐  ┌──────────┐           │
    │  │ MongoDB  │  │Elasticsearch│         │
    │  │  (Feed)  │  │  (Search)  │         │
    │  └──────────┘  └──────────┘           │
    └───────────────────────────────────────┘
```

---

## 2. Backend Core (Spring Boot)

### 2.1 Estrutura de Pacotes

```
com.codebr/
├── config/
│   ├── SecurityConfig.java         # JWT, CORS, Auth
│   ├── RedisConfig.java            # Cache configuration
│   ├── DatabaseConfig.java         # JPA, connection pooling
│   ├── WebSocketConfig.java        # WebSocket setup
│   └── AsyncConfig.java            # Thread pools
│
├── controller/
│   ├── AuthController.java         # Login, register, refresh
│   ├── ChallengeController.java    # CRUD desafios
│   ├── SubmissionController.java   # Submissions e feed
│   ├── BattleController.java       # Batalhas
│   ├── CommunityController.java    # Comunidades
│   ├── PortfolioController.java    # Portfólio
│   ├── JobController.java          # Vagas
│   ├── ToolController.java         # Ferramentas
│   └── UserController.java         # Perfil, settings
│
├── service/
│   ├── AuthService.java
│   ├── ChallengeService.java
│   ├── SubmissionService.java
│   ├── GamificationService.java    # XP, badges, levels
│   ├── FeedService.java            # Feed algorítmico
│   ├── JobMatchingService.java     # Matching vagas
│   ├── PortfolioService.java
│   ├── CommunityService.java
│   └── NotificationService.java
│
├── repository/
│   ├── UserRepository.java
│   ├── ChallengeRepository.java
│   ├── SubmissionRepository.java
│   ├── BattleRepository.java
│   ├── CommunityRepository.java
│   ├── JobRepository.java
│   └── ApplicationRepository.java
│
├── entity/
│   ├── User.java
│   ├── Challenge.java
│   ├── Submission.java
│   ├── Battle.java
│   ├── Community.java
│   ├── Job.java
│   ├── Application.java
│   └── Portfolio.java
│
├── dto/
│   ├── request/
│   │   ├── CreateChallengeRequest.java
│   │   ├── SubmitChallengeRequest.java
│   │   └── ...
│   └── response/
│       ├── ChallengeDTO.java
│       ├── SubmissionDTO.java
│       └── ...
│
├── security/
│   ├── JwtTokenProvider.java       # Gera/valida JWT
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
│
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── NotFoundException.java
│   ├── UnauthorizedException.java
│   └── ValidationException.java
│
└── util/
    ├── StringUtils.java
    ├── DateUtils.java
    └── SlugGenerator.java
```

### 2.2 Modelo de Dados Principal

Ver arquivo separado: `03-DATABASE-SCHEMA.sql`

### 2.3 APIs REST Principais

#### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
```

#### Challenges
```
GET    /api/v1/challenges                 # Lista com filtros
GET    /api/v1/challenges/{slug}          # Detalhe
GET    /api/v1/challenges/{slug}/starter  # Download starter files
GET    /api/v1/challenges/{slug}/leaderboard
```

#### Submissions
```
POST   /api/v1/submissions                # Criar
PUT    /api/v1/submissions/{id}           # Editar
POST   /api/v1/submissions/{id}/submit    # Submeter para análise
POST   /api/v1/submissions/{id}/like      # Toggle like
GET    /api/v1/submissions/feed           # Feed social
GET    /api/v1/submissions/me             # Minhas submissions
```

#### Battles
```
GET    /api/v1/battles                    # Lista
POST   /api/v1/battles                    # Criar (admin)
GET    /api/v1/battles/{id}               # Detalhe
POST   /api/v1/battles/{id}/join          # Inscrever-se
GET    /api/v1/battles/{id}/live          # Dados real-time
```

#### Communities
```
GET    /api/v1/communities                # Lista
POST   /api/v1/communities                # Criar
GET    /api/v1/communities/{slug}         # Detalhe
POST   /api/v1/communities/{slug}/join    # Entrar
GET    /api/v1/communities/{slug}/posts   # Posts
POST   /api/v1/communities/{slug}/posts   # Criar post
```

#### Portfolio
```
GET    /api/v1/portfolio/{slug}           # Público
GET    /api/v1/portfolio/me               # Meu portfolio
PUT    /api/v1/portfolio/me               # Atualizar
POST   /api/v1/portfolio/me/experiences   # Adicionar experiência
POST   /api/v1/portfolio/me/export/pdf    # Gerar PDF
```

#### Jobs
```
GET    /api/v1/jobs                       # Lista com filtros
GET    /api/v1/jobs/{slug}                # Detalhe
POST   /api/v1/jobs/{id}/apply            # Candidatar-se
GET    /api/v1/jobs/matches               # Vagas com match
```

#### Company (para empresas)
```
POST   /api/v1/company/jobs               # Criar vaga
GET    /api/v1/company/jobs               # Minhas vagas
GET    /api/v1/company/jobs/{id}/applications
PUT    /api/v1/company/jobs/{id}/applications/{appId}/status
```

### 2.4 Autenticação e Segurança

#### JWT Token
```json
{
  "sub": "user-uuid",
  "email": "dev@codebr.dev",
  "roles": ["USER", "PRO"],
  "exp": 1234567890,
  "iat": 1234567890
}
```

**Duração:**
- Access token: 1 hora
- Refresh token: 30 dias

**Headers obrigatórios:**
```
Authorization: Bearer {access_token}
```

#### Rate Limiting
- Anonymous: 100 req/min
- Authenticated: 500 req/min
- PRO: 1000 req/min

---

## 3. Backend Events (Node.js)

### 3.1 Propósito
Gerenciar comunicação real-time via WebSocket para:
- Batalhas ao vivo
- Chat de comunidades
- Notificações instantâneas
- Progresso de eventos

### 3.2 Estrutura

```typescript
src/
├── server.ts                 # Entry point
├── socket/
│   ├── handlers/
│   │   ├── battleHandler.ts
│   │   ├── chatHandler.ts
│   │   └── notificationHandler.ts
│   └── middleware/
│       ├── auth.ts
│       └── rateLimiter.ts
├── services/
│   ├── battleService.ts
│   └── notificationService.ts
└── utils/
    └── redis.ts
```

### 3.3 Socket.io Events

#### Battle Room
```typescript
// Client → Server
socket.emit('join:battle', { battleId, userId, token })
socket.emit('progress:update', { battleId, linesOfCode })
socket.emit('chat:message', { battleId, message })

// Server → Client
socket.on('battle:state', (state) => {})
socket.on('battle:started', () => {})
socket.on('ranking:update', (ranking) => {})
socket.on('battle:ended', (result) => {})
socket.on('participant:joined', (user) => {})
```

#### Notifications
```typescript
// Server → Client (broadcast)
socket.on('notification:new', (notification) => {})
socket.on('badge:earned', (badge) => {})
socket.on('level:up', (newLevel) => {})
```

### 3.4 Integração com Backend Core
- Redis Pub/Sub para eventos entre serviços
- Shared JWT validation
- PostgreSQL para persistência

---

## 4. Backend AI (FastAPI)

### 4.1 Propósito
Análise automatizada de código das submissions.

### 4.2 Endpoints

```python
POST /analyze
    Input: { html, css, js, challenge_requirements }
    Output: { score, feedback[], suggestions[] }

POST /compare-visual
    Input: { submission_image, design_reference }
    Output: { similarity_score, differences[] }

POST /optimize-curriculum (PRO)
    Input: { curriculum_text, job_description }
    Output: { optimized_text, keywords_added[], ats_score }
```

### 4.3 Análises Realizadas

#### HTML Semantic Analysis
- Tags semânticas vs divs
- Hierarquia de headings
- Alt text em imagens
- ARIA labels

#### CSS Quality
- Seletores complexos demais
- !important excessivo
- Unidades relativas vs fixas
- Media queries (responsividade)

#### Accessibility
- Contraste de cores
- Focus indicators
- Keyboard navigation
- Screen reader compatibility

#### Performance
- Tamanho total do bundle
- Número de requests
- Otimização de imagens

### 4.4 Modelos Utilizados
- **Code analysis**: CodeBERT fine-tuned
- **Visual comparison**: SSIM + perceptual hash
- **Text optimization**: GPT-3.5-turbo via API

---

## 5. Frontend Web (Next.js)

### 5.1 Estrutura de Diretórios

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Layout com sidebar
│   │   ├── page.tsx              # Dashboard/Feed
│   │   ├── challenges/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── battles/
│   │   ├── communities/
│   │   ├── jobs/
│   │   ├── portfolio/
│   │   └── tools/
│   │
│   ├── @[username]/page.tsx      # Portfolio público
│   ├── api/                      # API routes (proxies)
│   └── layout.tsx                # Root layout
│
├── components/
│   ├── ui/                       # shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── features/
│   │   ├── challenge/
│   │   │   ├── ChallengeCard.tsx
│   │   │   ├── ChallengeFilters.tsx
│   │   │   └── SubmissionForm.tsx
│   │   ├── battle/
│   │   ├── feed/
│   │   ├── portfolio/
│   │   └── ...
│   │
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── api.ts                    # Axios instance
│   ├── socket.ts                 # Socket.io client
│   └── utils.ts                  # Helpers
│
├── hooks/
│   ├── useAuth.ts
│   ├── useFeed.ts
│   ├── useBattle.ts
│   └── useWebSocket.ts
│
└── stores/                       # Zustand
    ├── authStore.ts
    ├── uiStore.ts
    └── battleStore.ts
```

### 5.2 State Management

#### Global State (Zustand)
```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  login: (credentials) => Promise<void>;
  logout: () => void;
}

// uiStore.ts
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
}
```

#### Server State (React Query)
```typescript
// Challenges
const { data: challenges } = useQuery({
  queryKey: ['challenges', filters],
  queryFn: () => api.get('/challenges', { params: filters })
});

// Mutations
const submitMutation = useMutation({
  mutationFn: (data) => api.post('/submissions', data),
  onSuccess: () => queryClient.invalidateQueries(['submissions'])
});
```

### 5.3 Real-time com WebSocket

```typescript
// hooks/useWebSocket.ts
export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  
  useEffect(() => {
    const token = getToken();
    const s = io('wss://events.codebr.dev', {
      auth: { token }
    });
    
    setSocket(s);
    
    return () => s.disconnect();
  }, []);
  
  return socket;
}

// Usage em componente
const socket = useWebSocket();

useEffect(() => {
  if (!socket) return;
  
  socket.emit('join:battle', { battleId });
  
  socket.on('ranking:update', (ranking) => {
    setRanking(ranking);
  });
}, [socket]);
```

---

## 6. Mobile App (Flutter)

### 6.1 Estrutura

```
lib/
├── main.dart
├── app/
│   ├── routes.dart
│   ├── theme.dart
│   └── config.dart
│
├── core/
│   ├── api/
│   │   └── api_client.dart       # Dio instance
│   ├── models/
│   │   ├── user.dart
│   │   ├── challenge.dart
│   │   └── ...
│   └── utils/
│       └── formatters.dart
│
├── features/
│   ├── auth/
│   │   ├── presentation/
│   │   │   └── login_screen.dart
│   │   ├── providers/
│   │   │   └── auth_provider.dart
│   │   └── widgets/
│   │
│   ├── feed/
│   ├── challenges/
│   ├── battles/
│   └── profile/
│
└── shared/
    ├── widgets/
    │   ├── app_button.dart
    │   └── loading_indicator.dart
    └── constants/
        └── colors.dart
```

### 6.2 State Management (Riverpod)

```dart
// providers/auth_provider.dart
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(apiClientProvider));
});

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._api) : super(AuthState.initial());
  
  final ApiClient _api;
  
  Future<void> login(String email, String password) async {
    state = state.copyWith(loading: true);
    
    try {
      final response = await _api.post('/auth/login', {
        'email': email,
        'password': password,
      });
      
      final user = User.fromJson(response.data['user']);
      final token = response.data['token'];
      
      await _storage.saveToken(token);
      
      state = state.copyWith(
        user: user,
        token: token,
        loading: false,
      );
    } catch (e) {
      state = state.copyWith(
        loading: false,
        error: e.toString(),
      );
    }
  }
}
```

### 6.3 Offline-first

```dart
// Local database com Drift
@DriftDatabase(tables: [Challenges, Submissions])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());
  
  // Queries
  Future<List<Challenge>> getCachedChallenges() {
    return select(challenges).get();
  }
  
  Future<void> cacheChallenge(Challenge challenge) {
    return into(challenges).insert(challenge);
  }
}

// Sync strategy
class SyncService {
  Future<void> syncWhenOnline() async {
    final cached = await _db.getPendingSubmissions();
    
    for (final submission in cached) {
      try {
        await _api.post('/submissions', submission.toJson());
        await _db.markAsSynced(submission.id);
      } catch (e) {
        // Retry later
      }
    }
  }
}
```

---

## 7. Banco de Dados

### 7.1 PostgreSQL

**Configuração:**
- Version: 16
- Connection pool: HikariCP (50 connections)
- Read replicas para queries pesadas

**Principais tabelas:**
- users
- challenges
- submissions
- battles
- communities
- jobs
- portfolios

**Particionamento:**
- `submissions` por created_at (mensal)
- `portfolio_views` por viewed_at (mensal)

**Índices críticos:**
```sql
CREATE INDEX idx_submissions_user_date 
  ON submissions(user_id, created_at DESC);

CREATE INDEX idx_jobs_active 
  ON jobs(status, published_at DESC) 
  WHERE status = 'active';

CREATE INDEX idx_challenges_tags 
  ON challenges USING GIN(tags);
```

### 7.2 MongoDB

**Uso:**
- Feed events (alta escrita)
- Analytics
- Logs

**Collections:**
```javascript
// feed_events
{
  _id: ObjectId,
  type: "SUBMISSION",
  userId: UUID,
  referenceId: UUID,
  data: {},
  likesCount: 0,
  createdAt: ISODate
}

// user_analytics
{
  userId: UUID,
  date: ISODate,
  metrics: {
    pageViews: 0,
    submissionsCompleted: 0,
    timeSpent: 0
  }
}
```

### 7.3 Redis

**Estruturas:**

```redis
# Cache de queries (TTL 5min)
GET cache:challenges:list:{hash}

# Sessions (TTL 30 dias)
GET session:{token}

# Leaderboards (Sorted Sets)
ZADD leaderboard:weekly {score} {username}
ZREVRANGE leaderboard:weekly 0 99 WITHSCORES

# Rate limiting
INCR ratelimit:{ip}:{endpoint}
EXPIRE ratelimit:{ip}:{endpoint} 60

# Pub/Sub para eventos
PUBLISH battle:events '{"type":"STARTED","battleId":"..."}'
```

### 7.4 Elasticsearch

**Índices:**

```json
// challenges
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "description": { "type": "text" },
      "tags": { "type": "keyword" },
      "difficulty": { "type": "keyword" },
      "xpReward": { "type": "integer" }
    }
  }
}

// users
{
  "mappings": {
    "properties": {
      "username": { "type": "keyword" },
      "bio": { "type": "text" },
      "skills": { "type": "keyword" },
      "location": { "type": "keyword" }
    }
  }
}
```

**Queries:**
```json
// Busca desafios por texto + filtros
{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "e-commerce" } }
      ],
      "filter": [
        { "term": { "difficulty": "intermediate" } },
        { "terms": { "tags": ["react", "typescript"] } }
      ]
    }
  }
}
```

---

## 8. Infraestrutura e DevOps

### 8.1 Containerização

**Docker Compose (desenvolvimento):**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: codebr
      POSTGRES_USER: codebr
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  mongodb:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: codebr
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    ports:
      - "27017:27017"
  
  backend-core:
    build: ./backend-core
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
    environment:
      SPRING_PROFILES_ACTIVE: development
  
  backend-events:
    build: ./backend-events
    ports:
      - "3001:3001"
    depends_on:
      - redis
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8080
```

### 8.2 Kubernetes (produção)

**Namespaces:**
- `codebr-prod`
- `codebr-staging`

**Deployments principais:**
```yaml
# backend-core-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-core
  namespace: codebr-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend-core
  template:
    spec:
      containers:
      - name: backend-core
        image: gcr.io/codebr/backend-core:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: "500m"
            memory: "1Gi"
          limits:
            cpu: "2"
            memory: "4Gi"
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
```

### 8.3 CI/CD Pipeline

**GitHub Actions:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          cd backend-core
          ./gradlew test
  
  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: docker build -t gcr.io/codebr/backend-core:${{ github.sha }} .
      
      - name: Push to GCR
        run: docker push gcr.io/codebr/backend-core:${{ github.sha }}
  
  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to K8s
        run: |
          kubectl set image deployment/backend-core \
            backend-core=gcr.io/codebr/backend-core:${{ github.sha }} \
            -n codebr-prod
```

### 8.4 Monitoring

**Stack de observabilidade:**
- **Métricas**: Prometheus + Grafana
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Jaeger
- **Alertas**: AlertManager + PagerDuty

**Dashboards críticos:**
1. API Performance (latência, throughput, error rate)
2. Database (connections, query time, slow queries)
3. User Activity (DAU, submissions/day, engagement)
4. Business Metrics (conversões, MRR, churn)

**Alerts:**
- Error rate > 5%
- API latency p95 > 2s
- Database connections > 80%
- Disk usage > 85%

---

## 9. Segurança

### 9.1 Autenticação

**JWT Strategy:**
- RS256 algorithm (chaves assimétricas)
- Refresh token rotation
- Token revocation list em Redis

**OAuth2 Providers:**
- Google
- GitHub
- LinkedIn

### 9.2 Autorização

**Roles:**
- USER (padrão)
- PRO (assinante)
- COMPANY (empresa)
- ADMIN (staff)
- MODERATOR (comunidades)

**Permissions:**
```java
@PreAuthorize("hasRole('PRO')")
public void proFeature() {}

@PreAuthorize("hasRole('COMPANY') or hasRole('ADMIN')")
public void companyFeature() {}
```

### 9.3 Proteções

**Rate Limiting:**
- Por IP
- Por usuário
- Por endpoint

**Input Validation:**
- Bean Validation no backend
- Zod schemas no frontend
- Sanitização de HTML

**SQL Injection:**
- Prepared statements
- JPA/Hibernate (escapa automaticamente)

**XSS:**
- CSP headers
- DOMPurify no frontend

**CSRF:**
- SameSite cookies
- CSRF tokens

---

## 10. Performance

### 10.1 Caching Strategy

**Níveis:**
1. CDN (CloudFlare) - assets estáticos
2. Redis - queries frequentes
3. Browser - localStorage, service worker

**TTLs:**
- Challenges: 1 hora
- User profile: 5 min
- Feed: 2 min
- Leaderboard: 30 seg

### 10.2 Database Optimization

**Query optimization:**
- Índices em colunas de busca/filtro
- EXPLAIN ANALYZE para queries lentas
- Connection pooling

**Caching:**
- Hibernate second-level cache
- Query result cache

### 10.3 API Optimization

**Pagination:**
- Cursor-based para feeds
- Offset-based para listas
- Limite: 50 items/request

**GraphQL (futuro):**
- Reduz over-fetching
- Batch queries

### 10.4 Frontend

**Code Splitting:**
```typescript
const BattleRoom = lazy(() => import('./BattleRoom'));
```

**Image Optimization:**
- Next.js Image component
- WebP format
- Lazy loading

**Bundle Size:**
- Tree shaking
- Dynamic imports
- Análise com webpack-bundle-analyzer

---

## 11. Escalabilidade

### 11.1 Horizontal Scaling

**Backend:**
- Stateless (JWT, sessão em Redis)
- Load balancer (Nginx/AWS ALB)
- Auto-scaling baseado em CPU/memória

**Database:**
- Read replicas para queries
- Sharding por user_id (futuro)

### 11.2 Capacity Planning

**Estimativas para 100k MAU:**
- Requests/segundo: ~1000
- Database writes/segundo: ~50
- Storage: ~500GB
- Bandwidth: ~5TB/mês

**Custos mensais estimados:**
- Compute (K8s): R$ 5.000
- Database (managed): R$ 3.000
- Storage + CDN: R$ 2.000
- Outros serviços: R$ 1.000
- **Total: R$ 11.000**

---

## 12. Disaster Recovery

### 12.1 Backups

**PostgreSQL:**
- Full backup diário (retenção 30 dias)
- WAL archiving contínuo
- Restore time: ~30 min

**MongoDB:**
- Snapshot diário
- Retenção: 7 dias

**Redis:**
- RDB snapshots a cada 6h
- AOF para durabilidade

### 12.2 Alta Disponibilidade

**Database:**
- Primary + 2 replicas (sync + async)
- Automatic failover

**Application:**
- Multi-AZ deployment
- Health checks automáticos

**Objetivo:**
- RTO (Recovery Time Objective): 1 hora
- RPO (Recovery Point Objective): 15 minutos
