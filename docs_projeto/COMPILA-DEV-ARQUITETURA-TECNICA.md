# compila.dev - Arquitetura Técnica

> Documento técnico de arquitetura, APIs, infraestrutura e implementação

---

## Sumário

1. [Visão Arquitetural](#visão-arquitetural)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Backend APIs](#backend-apis)
4. [Sistema Multi-Agentes IA](#sistema-multi-agentes-ia)
5. [Banco de Dados](#banco-de-dados)
6. [Infraestrutura](#infraestrutura)
7. [Segurança](#segurança)
8. [Monitoramento](#monitoramento)

---

## Visão Arquitetural

### Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTES                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐        │
│  │   Web App        │  │   Mobile App     │  │   Partners API   │        │
│  │   (Next.js)      │  │   (Flutter)      │  │   (REST)         │        │
│  └─────────┬────────┘  └────────┬─────────┘  └─────────┬────────┘        │
│            │                    │                       │                   │
└────────────┼────────────────────┼───────────────────────┼───────────────────┘
             │                    │                       │
             │                    │                       │
┌────────────┴────────────────────┴───────────────────────┴───────────────────┐
│                           API GATEWAY / CDN                                  │
│                    (CloudFlare / AWS CloudFront)                             │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────────────────┐
│                         LOAD BALANCER                                        │
│                      (AWS ALB / GCP Load Balancer)                          │
└──────┬───────────────────────┬───────────────────────┬──────────────────────┘
       │                       │                       │
┌──────┴───────┐    ┌──────────┴─────────┐    ┌────────┴───────────┐
│   FRONTEND   │    │     BACKEND        │    │   AI SERVICES      │
│   (Next.js)  │    │   (Spring Boot)    │    │   (FastAPI)        │
│              │    │   Java 21          │    │   Python 3.10+     │
├──────────────┤    ├────────────────────┤    ├────────────────────┤
│ • SSR/SSG    │    │ • Auth             │    │ • Smart Solver     │
│ • WebSockets │    │ • Challenges       │    │ • Tutor IA         │
│ • Static     │    │ • Portfolio        │    │ • Question Gen     │
│              │    │ • Social           │    │ • Guide Module     │
│              │    │ • Jobs             │    │ • Co-writer        │
│              │    │ • Payments         │    │ • RAG              │
│              │    │ • Admin            │    │ • Code Executor    │
└──────────────┘    └─────────┬──────────┘    └─────────┬──────────┘
                               │                         │
┌──────────────────────────────┴─────────────────────────┴───────────────────┐
│                           MESSAGE QUEUE                                     │
│                      (RabbitMQ / Redis Streams)                            │
└──────────────────────────────┬─────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴─────────────────────────────────────────────┐
│                          DATA LAYER                                         │
├──────────────┬──────────────┬──────────────┬──────────────┬───────────────┤
│  PostgreSQL  │    Redis     │   MongoDB    │  Qdrant/     │    S3         │
│  (Primary)   │   (Cache)    │  (Analytics) │  Pinecone    │  (Files)      │
│              │              │              │  (Vectors)   │               │
│ • Users      │ • Sessions   │ • Events     │ • Embeddings │ • Uploads     │
│ • Challenges │ • Rate Limit │ • Logs       │ • Docs       │ • Assets      │
│ • Submissions│ • WebSocket  │ • Metrics    │              │               │
│ • Portfolio  │              │              │              │               │
└──────────────┴──────────────┴──────────────┴──────────────┴───────────────┘
                               │
┌──────────────────────────────┴─────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                                     │
├──────────────┬──────────────┬──────────────┬──────────────┬───────────────┤
│   LLMs       │   Payments   │   Auth       │   Email      │   Analytics   │
│              │              │              │              │               │
│ • OpenAI     │ • Stripe     │ • Google     │ • SendGrid   │ • Mixpanel    │
│ • Anthropic  │              │ • GitHub     │              │               │
│ • DeepSeek   │              │              │              │               │
│ • Groq       │              │              │              │               │
└──────────────┴──────────────┴──────────────┴──────────────┴───────────────┘
```

### Arquitetura de Microserviços

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (Kong / AWS API Gateway)               │
└──────┬──────────────┬──────────────┬──────────────┬──────────────┬────────┘
       │              │              │              │              │
┌──────┴──────┐ ┌────┴─────────┐ ┌──┴──────────┐ ┌──┴──────────┐ ┌──┴─────────┐
│   AUTH      │ │  CHALLENGES  │ │  SOCIAL     │ │  AI CORE    │ │  JOBS      │
│  SERVICE    │ │  SERVICE     │ │  SERVICE    │ │  SERVICE    │ │  SERVICE   │
│             │ │              │ │             │ │             │ │            │
│ • Login     │ │ • CRUD       │ │ • Feed      │ │ • Orchest.  │ │ • CRUD     │
│ • JWT       │ │ • Submission │ │ • Comments  │ │ • Agents    │ │ • Matching │
│ • OAuth     │ │ • Tests      │ │ • Follow    │ │ • RAG       │ │ • Apply    │
└─────────────┘ └──────────────┘ └─────────────┘ └─────────────┘ └────────────┘
```

---

## Stack Tecnológico

### Frontend

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js | 16 |
| React | React | 19 |
| Linguagem | TypeScript | 5.3 |
| Styling | TailwindCSS | 3.4 |
| Componentes | Lucide React, shadcn/ui | Latest |
| Estado | Zustand / Jotai | Latest |
| Forms | React Hook Form | 7.x |
| Validação | Zod | 3.x |
| Animations | Framer Motion | 11.x |
| Markdown | react-markdown | 9.x |
| Editor | Monaco Editor | 0.45 |
| WebSocket | Socket.io Client | 4.x |
| Gráficos | Recharts | 2.x |

### Backend Core (Java)

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Spring Boot | 3.2 |
| Java | OpenJDK | 21 |
| Linguagem | Kotlin | 1.9 (opcional) |
| Segurança | Spring Security + JWT | 6.x |
| Banco | Spring Data JPA | 3.x |
| Cache | Spring Data Redis | 3.x |
| Validação | Jakarta Validation | 3.x |
| Docs | SpringDoc OpenAPI | 2.x |
| Testes | JUnit 5 + TestContainers | 5.x |

### Backend AI (Python)

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | FastAPI | 0.110 |
| Python | CPython | 3.10+ |
| Async | asyncio + aiohttp | Latest |
| LLM | LangChain / LlamaIndex | 0.1 |
| Vector Store | Qdrant Client / Pinecone | Latest |
| Embeddings | sentence-transformers | 2.x |
| WebSocket | FastAPI WebSocket | nativo |
| Code Exec | Docker Python SDK | 7.x |
| Parsing | Pydantic | 2.x |

### Banco de Dados

| Dados | Tecnologia | Versão |
|-------|-----------|--------|
| Primary | PostgreSQL | 16 |
| Cache | Redis | 7.2 |
| Analytics | MongoDB | 7.0 |
| Vector | Qdrant / Pinecone | Latest |
| Search | Meilisearch | 1.x |

### Infraestrutura

| Camada | Tecnologia |
|--------|-----------|
| Cloud | AWS / GCP |
| Containers | Docker + Kubernetes |
| Orchestration | AWS EKS / GKE |
| CI/CD | GitHub Actions |
| IaC | Terraform |
| CDN | CloudFlare |
| Monitoring | Prometheus + Grafana |
| Logging | ELK Stack |
| Tracing | Jaeger / OpenTelemetry |
| Secrets | AWS Secrets Manager / Vault |

---

## Backend APIs

### API REST (Spring Boot)

**Base URL:** `https://api.compila.dev/v1`

#### Autenticação

```java
@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    // POST /v1/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Cria nova conta
    }

    // POST /v1/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Retorna JWT
    }

    // POST /v1/auth/oauth/{provider}
    @PostMapping("/oauth/{provider}")
    public ResponseEntity<AuthResponse> oauth(@RequestParam String code) {
        // Google, GitHub
    }

    // POST /v1/auth/refresh
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) {
        // Renova token
    }
}
```

#### Desafios

```java
@RestController
@RequestMapping("/v1/challenges")
public class ChallengeController {

    // GET /v1/challenges
    @GetMapping
    public Page<ChallengeSummary> list(
        @RequestParam String stack,
        @RequestParam String level,
        @RequestParam Pageable pageable
    ) { }

    // GET /v1/challenges/{slug}
    @GetMapping("/{slug}")
    public ChallengeDetail get(@PathVariable String slug) { }

    // POST /v1/challenges/{id}/submit
    @PostMapping("/{id}/submit")
    public SubmissionResult submit(
        @PathVariable UUID id,
        @RequestBody SubmissionRequest request,
        @AuthenticationPrincipal User user
    ) {
        // Envia para AI Service via RabbitMQ
        // Retorna resultado assíncrono
    }

    // GET /v1/challenges/{id}/submissions
    @GetMapping("/{id}/submissions")
    public List<Submission> getSubmissions(@PathVariable UUID id) { }
}
```

#### Portfólio

```java
@RestController
@RequestMapping("/v1/portfolio")
public class PortfolioController {

    // GET /v1/portfolio/{username}
    @GetMapping("/{username}")
    public PortfolioView getPublicProfile(@PathVariable String username) { }

    // POST /v1/portfolio/projects
    @PostMapping("/projects")
    public Project createProject(@RequestBody CreateProjectRequest request) { }

    // PUT /v1/portfolio/projects/{id}
    @PutMapping("/projects/{id}")
    public Project updateProject(@PathVariable UUID id, @RequestBody UpdateProjectRequest request) { }

    // DELETE /v1/portfolio/projects/{id}
    @DeleteMapping("/projects/{id}")
    public void deleteProject(@PathVariable UUID id) { }

    // POST /v1/portfolio/export
    @PostMapping("/export")
    public ResponseEntity<byte[]> export(@RequestBody ExportRequest request) {
        // Gera PDF
    }
}
```

#### Social

```java
@RestController
@RequestMapping("/v1/social")
public class SocialController {

    // GET /v1/social/feed
    @GetMapping("/feed")
    public Page<FeedPost> getFeed(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) { }

    // POST /v1/social/posts/{id}/like
    @PostMapping("/posts/{id}/like")
    public void like(@PathVariable UUID id) { }

    // POST /v1/social/posts/{id}/comments
    @PostMapping("/posts/{id}/comments")
    public Comment addComment(@PathVariable UUID id, @RequestBody CommentRequest request) { }

    // POST /v1/social/follow/{username}
    @PostMapping("/follow/{username}")
    public void follow(@PathVariable String username) { }
}
```

### API AI (FastAPI)

**Base URL:** `https://ai.compila.dev/v1`

#### Smart Solver

```python
from fastapi import FastAPI, WebSocket
from app.agents.solve import MainSolver

app = FastAPI()

@app.websocket("/solve")
async def solve_websocket(websocket: WebSocket):
    await websocket.accept()

    # Recebe dados da submissão
    data = await websocket.receive_json()
    code = data.get("code")
    challenge_id = data.get("challenge_id")

    # Inicia o solver
    solver = MainSolver()

    # Stream de progresso
    async for update in solver.solve_stream(code, challenge_id):
        await websocket.send_json({
            "type": update.type,
            "agent": update.agent,
            "message": update.message,
            "progress": update.progress
        })

    # Resultado final
    await websocket.send_json({
        "type": "complete",
        "feedback": solver.get_feedback()
    })
```

#### Tutor IA

```python
from fastapi import WebSocket
from app.agents.chat import ChatAgent
from app.services.rag import RAGService

@app.websocket("/chat")
async def chat_websocket(websocket: WebSocket):
    await websocket.accept()

    session_id = str(uuid.uuid4())
    chat_agent = ChatAgent(session_id=session_id)
    rag_service = RAGService()

    while True:
        data = await websocket.receive_json()
        message = data.get("message")

        # Busca contexto relevante
        context = await rag_service.search(message)

        # Gera resposta
        response = await chat_agent.chat(
            message=message,
            context=context,
            conversation_history=data.get("history", [])
        )

        await websocket.send_json({
            "message": response.message,
            "resources": response.resources,
            "tokens_used": response.tokens
        })
```

#### Code Executor

```python
from fastapi import HTTPException
from app.tools.code_executor import CodeExecutor

executor = CodeExecutor()

@app.post("/code/execute")
async def execute_code(request: CodeExecutionRequest):
    try:
        result = await executor.execute(
            code=request.code,
            language=request.language,
            timeout=request.timeout or 30
        )

        return {
            "run_id": result.run_id,
            "status": result.status,
            "output": result.output,
            "error": result.error,
            "execution_time": result.execution_time
        }
    except TimeoutError:
        raise HTTPException(status_code=408, detail="Execution timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### GraphQL API (Opcional)

```graphql
type Query {
  challenge(id: ID!): Challenge
  challenges(filter: ChallengeFilter): ChallengeConnection!
  user(username: String!): User
  portfolio(username: String!): Portfolio
  feed(first: Int, after: String): FeedConnection!
}

type Mutation {
  submitChallenge(input: SubmissionInput!): SubmissionResult!
  likePost(postId: ID!): LikeResult!
  followUser(userId: ID!): FollowResult!
  createProject(input: ProjectInput!): Project!
}

type Subscription {
  submissionUpdated(challengeId: ID!): SubmissionUpdate
  feedNewPosts: FeedPost!
}
```

---

## Sistema Multi-Agentes IA

### Arquitetura de Agentes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT ORCHESTRATOR                                   │
│                      (FastAPI + LangChain)                                  │
└──────┬──────────────────────────────────────────────────────────────────────┘
       │
       ├──► INVESTIGATE AGENT ──┐
       │                        │
       ├──► NOTE AGENT ─────────┤
       │                        │
       ├──► MANAGER AGENT ──────┼──► BASE AGENT
       │                        │    (BaseAgent)
       ├──► SOLVE AGENT ────────┤    - LLM config
       │                        │    - Token tracking
       ├──► CHECK AGENT ────────┤    - Prompt management
       │                        │    - Logging
       ├──► RESPONSE AGENT ─────┤
       │                        │
       └──► PRECISION AGENT ────┘
```

### Base Agent

```python
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from langchain.llms.base import LLM
from langchain.callbacks import get_openai_callback

class BaseAgent(ABC):
    """Base class for all AI agents"""

    def __init__(
        self,
        llm: LLM,
        name: str,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ):
        self.llm = llm
        self.name = name
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.token_count = 0

    @abstractmethod
    async def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the agent's main logic"""
        pass

    async def _call_llm(
        self,
        prompt: str,
        **kwargs
    ) -> str:
        """Call LLM with token tracking"""
        with get_openai_callback() as cb:
            response = await self.llm.apredict(
                prompt,
                temperature=kwargs.get('temperature', self.temperature),
                max_tokens=kwargs.get('max_tokens', self.max_tokens)
            )
            self.token_count += cb.total_tokens
            return response

    def get_token_usage(self) -> int:
        """Get total tokens used by this agent"""
        return self.token_count
```

### Smart Solver - Dual Loop

```python
from typing import Dict, Any, Optional
from app.agents.base import BaseAgent

class MainSolver:
    """Main orchestrator for problem solving with dual-loop architecture"""

    def __init__(self):
        # Analysis Loop Agents
        self.investigate_agent = InvestigateAgent()
        self.note_agent = NoteAgent()

        # Solve Loop Agents
        self.manager_agent = ManagerAgent()
        self.solve_agent = SolveAgent()
        self.check_agent = CheckAgent()
        self.response_agent = ResponseAgent()
        self.precision_agent = PrecisionAnswerAgent()

        # Tools
        self.rag_tool = RAGTool()
        self.code_executor = CodeExecutor()

    async def solve_stream(
        self,
        code: str,
        challenge_id: str
    ):
        """Solve with streaming updates"""

        # ==========================================
        # ANALYSIS LOOP
        # ==========================================
        yield {
            "type": "loop_start",
            "loop": "analysis",
            "message": "Analisando seu código..."
        }

        # Step 1: Investigate
        yield {
            "type": "agent_start",
            "agent": "investigate",
            "status": "Investigando código..."
        }

        investigation = await self.investigate_agent.run({
            "code": code,
            "challenge_id": challenge_id
        })

        yield {
            "type": "finding",
            "data": investigation
        }

        # Step 2: Note
        notes = await self.note_agent.run({
            "investigation": investigation
        })

        # ==========================================
        # SOLVE LOOP
        # ==========================================
        yield {
            "type": "loop_start",
            "loop": "solve",
            "message": "Gerando feedback..."
        }

        # Step 3: Manager - Create plan
        plan = await self.manager_agent.run({
            "investigation": investigation,
            "notes": notes
        })

        # Step 4: Solve - Generate reference solution (if needed)
        if investigation.get("has_errors"):
            solution = await self.solve_agent.run({
                "plan": plan,
                "challenge_id": challenge_id
            })
        else:
            solution = None

        # Step 5: Check - Validate against tests
        check_result = await self.check_agent.run({
            "code": code,
            "challenge_id": challenge_id
        })

        yield {
            "type": "check_result",
            "data": check_result
        }

        # Step 6: Response - Format feedback
        feedback = await self.response_agent.run({
            "investigation": investigation,
            "notes": notes,
            "check_result": check_result,
            "solution": solution
        })

        # ==========================================
        # COMPLETE
        # ==========================================
        yield {
            "type": "complete",
            "feedback": feedback,
            "learning_points": notes.get("learning_points", []),
            "next_challenges": self._get_next_challenges(challenge_id)
        }

    def _get_next_challenges(self, challenge_id: str) -> list:
        """Get recommended next challenges"""
        # Query from database based on tags/skills
        return []
```

### Investigate Agent

```python
class InvestigateAgent(BaseAgent):
    """Analyzes code to identify patterns and issues"""

    async def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        code = input_data["code"]
        challenge_id = input_data["challenge_id"]

        # Get challenge requirements
        challenge = await self._get_challenge(challenge_id)

        # Build analysis prompt
        prompt = self._build_analysis_prompt(code, challenge)

        # Call LLM
        analysis = await self._call_llm(prompt)

        # Parse analysis
        findings = self._parse_analysis(analysis)

        return {
            "has_errors": findings["error_count"] > 0,
            "error_count": findings["error_count"],
            "warning_count": findings["warning_count"],
            "issues": findings["issues"],
            "strengths": findings["strengths"],
            "suggested_improvements": findings["suggestions"]
        }

    def _build_analysis_prompt(self, code: str, challenge: Challenge) -> str:
        return f"""Analise o seguinte código com atenção:

DESAFIO: {challenge.title}
REQUISITOS:
{chr(10).join(f"- {r}" for r in challenge.requirements)}

CÓDIGO SUBMETIDO:
```{self._get_language(challenge)}
{code}
```

Forneça análise em JSON com este formato:
{{
    "error_count": <número de erros>,
    "warning_count": <número de avisos>,
    "issues": [
        {{
            "type": "error|warning|info",
            "severity": "critical|high|medium|low",
            "title": "<título breve>",
            "location": {{"file": "<arquivo>", "line": <linha>}},
            "description": "<descrição detalhada>",
            "suggestion": "<sugestão de correção>"
        }}
    ],
    "strengths": ["<ponto forte 1>", "<ponto forte 2>"],
    "overall_score": <0-100>
}}

Responda apenas com o JSON, sem texto adicional."""
```

### Check Agent

```python
class CheckAgent(BaseAgent):
    """Validates code against test cases"""

    def __init__(self):
        super().__init__(llm=None, name="check")
        self.code_executor = CodeExecutor()

    async def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        code = input_data["code"]
        challenge_id = input_data["challenge_id"]

        # Get test cases
        tests = await self._get_tests(challenge_id)

        results = []
        passed = 0

        for test in tests:
            # Execute code with test
            result = await self.code_executor.run_test(
                code=code,
                test_code=test.test_code,
                language=test.language
            )

            results.append({
                "test_name": test.name,
                "status": "passed" if result.success else "failed",
                "expected": test.expected_output,
                "actual": result.output,
                "error": result.error
            })

            if result.success:
                passed += 1

        return {
            "total": len(tests),
            "passed": passed,
            "failed": len(tests) - passed,
            "percentage": (passed / len(tests)) * 100,
            "details": results
        }
```

### RAG Service

```python
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

class RAGService:
    """Retrieval-Augmented Generation service"""

    def __init__(self):
        self.client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.collection = "compila_docs"

    async def search(
        self,
        query: str,
        filters: Optional[Dict] = None,
        limit: int = 5
    ) -> List[Document]:
        """Search for relevant documents"""

        # Generate query embedding
        query_vector = self.embedder.encode(query).tolist()

        # Build filter
        search_filter = self._build_filter(filters)

        # Search
        results = self.client.search(
            collection_name=self.collection,
            query_vector=query_vector,
            query_filter=search_filter,
            limit=limit,
            score_threshold=0.7
        )

        return [
            Document(
                id=hit.id,
                content=hit.payload["content"],
                metadata=hit.payload["metadata"],
                score=hit.score
            )
            for hit in results
        ]

    async def add_document(
        self,
        content: str,
        metadata: Dict[str, Any]
    ) -> str:
        """Add document to knowledge base"""

        # Generate embedding
        vector = self.embedder.encode(content).tolist()

        # Insert
        doc_id = str(uuid.uuid4())
        self.client.upsert(
            collection_name=self.collection,
            points=[{
                "id": doc_id,
                "vector": vector,
                "payload": {
                    "content": content,
                    "metadata": metadata
                }
            }]
        )

        return doc_id
```

---

## Banco de Dados

### Schema PostgreSQL

```sql
-- ============================================
-- USERS
-- ============================================
CREATE TYPE user_level AS ENUM (
    'beginner', 'junior', 'mid', 'senior', 'expert'
);

CREATE TYPE subscription_plan AS ENUM (
    'free', 'pro', 'pro_plus'
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Nullable for OAuth-only users

    -- Profile
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    location VARCHAR(100),
    website_url VARCHAR(500),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),

    -- Gamification
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    streak_current INTEGER DEFAULT 0,
    streak_best INTEGER DEFAULT 0,

    -- Subscription
    subscription_plan subscription_plan DEFAULT 'free',
    subscription_expires_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_active_at TIMESTAMP DEFAULT NOW(),

    CHECK (xp >= 0)
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_xp ON users(xp DESC);

-- ============================================
-- CHALLENGES
-- ============================================
CREATE TYPE challenge_stack AS ENUM (
    'frontend', 'backend', 'mobile', 'devops', 'iot', 'data'
);

CREATE TYPE challenge_level AS ENUM (
    'beginner', 'junior', 'mid', 'senior', 'expert'
);

CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    short_description VARCHAR(500),
    description TEXT NOT NULL,

    -- Classification
    stack challenge_stack NOT NULL,
    level challenge_level NOT NULL,
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
    technologies TEXT[] NOT NULL, -- ['react', 'typescript']
    tags TEXT[] DEFAULT [],

    -- Requirements
    requirements JSONB, -- Array of requirement objects
    starter_code JSONB, -- Files with starter code
    solution_code JSONB, -- Reference solution (hidden)

    -- Metadata
    xp_reward INTEGER DEFAULT 100,
    estimated_time_minutes INTEGER,
    badges TEXT[], -- Badge IDs to award

    -- Stats
    completed_count INTEGER DEFAULT 0,
    attempted_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2),

    -- Published
    published_at TIMESTAMP,
    created_by UUID REFERENCES users(id),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_challenges_slug ON challenges(slug);
CREATE INDEX idx_challenges_stack ON challenges(stack);
CREATE INDEX idx_challenges_level ON challenges(level);
CREATE INDEX idx_challenges_technologies ON challenges USING GIN(technologies);
CREATE INDEX idx_challenges_tags ON challenges USING GIN(tags);

-- ============================================
-- SUBMISSIONS
-- ============================================
CREATE TYPE submission_status AS ENUM (
    'pending', 'passed', 'failed', 'partial'
);

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    challenge_id UUID NOT NULL REFERENCES challenges(id),

    -- Code
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    files JSONB, -- Multiple files

    -- Result
    status submission_status NOT NULL DEFAULT 'pending',
    test_results JSONB,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    xp_gained INTEGER DEFAULT 0,

    -- AI Feedback
    ai_feedback JSONB,
    ai_tokens_used INTEGER,

    -- Timing
    submitted_at TIMESTAMP DEFAULT NOW(),
    execution_time_ms INTEGER,

    -- Version (for resubmissions)
    attempt_number INTEGER DEFAULT 1,

    UNIQUE(user_id, challenge_id, attempt_number)
);

CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_challenge ON submissions(challenge_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created ON submissions(submitted_at DESC);

-- ============================================
-- PORTFOLIO PROJECTS
-- ============================================
CREATE TABLE portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),

    -- Basic info
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(100),
    short_description VARCHAR(500),
    long_description TEXT,

    -- Tech
    stack challenge_stack NOT NULL,
    technologies TEXT[] NOT NULL,

    -- Links
    demo_url VARCHAR(500),
    repo_url VARCHAR(500),

    -- Media
    thumbnail_url VARCHAR(500),
    images TEXT[],

    -- Origin
    challenge_id UUID REFERENCES challenges(id), -- If from challenge
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,

    -- Stats
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, slug)
);

CREATE INDEX idx_portfolio_user ON portfolio_projects(user_id);
CREATE INDEX idx_portfolio_featured ON portfolio_projects(user_id, featured);
CREATE INDEX idx_portfolio_slug ON portfolio_projects(slug);

-- ============================================
-- SOCIAL
-- ============================================
CREATE TABLE follows (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE TYPE post_type AS ENUM (
    'submission', 'project', 'level_up', 'badge', 'post'
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type post_type NOT NULL,

    -- Content
    content TEXT,
    images TEXT[],

    -- References
    challenge_id UUID REFERENCES challenges(id),
    submission_id UUID REFERENCES submissions(id),
    project_id UUID REFERENCES portfolio_projects(id),
    badge_id VARCHAR(100),

    -- Stats
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),

    CHECK (likes_count >= 0)
);

CREATE INDEX idx_posts_user ON posts(user_id, created_at DESC);
CREATE INDEX idx_posts_type ON posts(type, created_at DESC);

CREATE TABLE likes (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    post_id UUID NOT NULL REFERENCES posts(id),
    parent_id UUID REFERENCES comments(id), -- For replies

    content TEXT NOT NULL,

    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at);

-- ============================================
-- JOBS
-- ============================================
CREATE TYPE job_type AS ENUM ('clt', 'pj', 'freelance', 'internship');
CREATE TYPE work_model AS ENUM ('remote', 'hybrid', 'onsite');

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES users(id), -- Company user

    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],

    stack challenge_stack NOT NULL,
    level challenge_level NOT NULL,
    technologies TEXT[] NOT NULL,

    type job_type NOT NULL,
    work_model work_model NOT NULL,
    location VARCHAR(200),

    salary_min INTEGER,
    salary_max INTEGER,
    salary_visible BOOLEAN DEFAULT TRUE,

    applications_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, closed, draft

    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE INDEX idx_jobs_stack ON jobs(stack);
CREATE INDEX idx_jobs_level ON jobs(level);
CREATE INDEX idx_jobs_status ON jobs(status, created_at DESC);

-- ============================================
-- LEARNING PATHS
-- ============================================
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,

    stack challenge_stack NOT NULL,
    level challenge_level,
    estimated_weeks INTEGER,

    modules JSONB, -- Array of module objects

    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_path_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    path_id UUID NOT NULL REFERENCES learning_paths(id),
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,

    current_module_index INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),

    UNIQUE(user_id, path_id)
);

-- ============================================
-- GAMIFICATION
-- ============================================
CREATE TABLE badges (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
    category VARCHAR(50), -- skill, achievement, community
);

CREATE TABLE user_badges (
    user_id UUID REFERENCES users(id),
    badge_id VARCHAR(100) REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT NOW(),
    progress JSONB, -- For progress-based badges
    PRIMARY KEY (user_id, badge_id)
);

-- ============================================
-- AI USAGE TRACKING
-- ============================================
CREATE TABLE ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),

    agent VARCHAR(50), -- solver, chat, guide, etc.
    action VARCHAR(100), -- solve, generate, etc.

    input_tokens INTEGER,
    output_tokens INTEGER,
    total_tokens INTEGER,

    model_used VARCHAR(100),
    cost_cents INTEGER, -- Cost in cents

    latency_ms INTEGER,
    status VARCHAR(20), -- success, error, timeout

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_user ON ai_usage_logs(user_id, created_at);
CREATE INDEX idx_ai_usage_agent ON ai_usage_logs(agent, created_at);
```

---

## Infraestrutura

### Docker Compose (Desenvolvimento)

```yaml
version: '3.9'

services:
  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080
      - NEXT_PUBLIC_WS_URL=ws://localhost:8080
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

  # Backend Core
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=compila_dev
      - DB_USER=compila
      - DB_PASSWORD=compila_dev
      - REDIS_HOST=redis
      - JWT_SECRET=dev-secret-change-me
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app

  # AI Service
  ai-service:
    build:
      context: ./ai-service
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://compila:compila_dev@postgres:5432/compila_dev
      - REDIS_URL=redis://redis:6379
      - QDRANT_URL=http://qdrant:6333
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      - postgres
      - redis
      - qdrant
    volumes:
      - ./ai-service:/app

  # PostgreSQL
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=compila_dev
      - POSTGRES_USER=compila
      - POSTGRES_PASSWORD=compila_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/schema.sql:/docker-entrypoint-initdb.d/schema.sql

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Qdrant Vector DB
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

  # MongoDB (Analytics)
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  postgres_data:
  redis_data:
  qdrant_data:
  mongo_data:
```

### Kubernetes (Produção)

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: compila-dev

---
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: compila-dev
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: ghcr.io/compila-dev/backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: host
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5

---
# ai-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-service
  namespace: compila-dev
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ai-service
  template:
    metadata:
      labels:
        app: ai-service
    spec:
      containers:
      - name: ai-service
        image: ghcr.io/compila-dev/ai-service:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: llm-secrets
              key: openai-key
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
```

---

## Segurança

### Autenticação e Autorização

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/v1/auth/**").permitAll()
                .requestMatchers("/v1/challenges").permitAll()
                .requestMatchers("/v1/challenges/{slug}").permitAll()
                .requestMatchers("/v1/portfolio/{username}").permitAll()
                .requestMatchers("/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                    .jwtAuthenticationConverter(jwtConverter())
                )
            )
            .build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }
}
```

### Rate Limiting

```java
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private static final String RATE_LIMIT_KEY = "rate_limit:%s:%s";

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        String userId = getUserIdFromToken(request);
        String key = String.format(RATE_LIMIT_KEY, userId, request.getRequestURI());

        Long count = redisTemplate.opsForValue().increment(key);

        if (count == 1) {
            redisTemplate.expire(key, 1, TimeUnit.MINUTES);
        }

        int limit = getLimitForEndpoint(request.getRequestURI());
        if (count > limit) {
            response.setStatus(429); // Too Many Requests
            response.getWriter().write("Rate limit exceeded");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private int getLimitForEndpoint(String endpoint) {
        if (endpoint.contains("/ai/")) return 30; // Stricter for AI
        if (endpoint.contains("/submit")) return 10;
        return 100;
    }
}
```

### Input Sanitization

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator
import html

class SubmissionRequest(BaseModel):
    code: str
    language: str

    @validator('code')
    def sanitize_code(cls, v):
        # Remove potential injections
        if '__import__' in v and 'os' in v:
            raise ValueError('Código contém operações não permitidas')
        return v

    @validator('language')
    def validate_language(cls, v):
        allowed = ['javascript', 'typescript', 'python', 'java', 'go']
        if v.lower() not in allowed:
            raise ValueError(f'Linguagem não suportada: {v}')
        return v.lower()
```

---

## Monitoramento

### Prometheus Metrics

```java
@Component
public class MetricsConfig {

    @Bean
    public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
        return registry -> registry.config()
            .commonTags(
                "application", "compila-dev",
                "environment", environment
            );
    }
}

// In controllers
@RestController
public class ChallengeController {

    private final Counter submissionCounter;

    public ChallengeController(MeterRegistry registry) {
        this.submissionCounter = Counter.builder("submissions.total")
            .description("Total number of submissions")
            .tag("status", "unknown")
            .register(registry);
    }

    @PostMapping("/challenges/{id}/submit")
    public ResponseEntity<?> submit(@PathVariable UUID id) {
        submissionCounter.increment();
        // ...
    }
}
```

### Distributed Tracing

```python
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

app = FastAPI()

# Instrument FastAPI
FastAPIInstrumentor.instrument_app(app)

# Create tracer
tracer = trace.get_tracer(__name__)

@app.post("/ai/solve")
async def solve(request: SolveRequest):
    with tracer.start_as_current_span("solve_operation") as span:
        span.set_attribute("challenge_id", request.challenge_id)

        with tracer.start_as_current_span("investigation"):
            result = await investigate(request.code)

        with tracer.start_as_current_span("solve"):
            solution = await solve(request.code)
```

---

**Última atualização:** Janeiro 2026
**Versão:** 1.0
