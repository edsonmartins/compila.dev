# compila.dev - Especificação Funcional

> Documento detalhado de features, fluxos e requisitos do produto

---

## Sumário

1. [Visão Geral dos Módulos](#visão-geral-dos-módulos)
2. [Módulo de Desafios](#módulo-de-desafios)
3. [Módulo de IA Multi-Agentes](#módulo-de-ia-multi-agentes)
4. [Módulo de Portfólio](#módulo-de-portfólio)
5. [Módulo Social](#módulo-social)
6. [Módulo de Trilhas](#módulo-de-trilhas)
7. [Módulo de Vagas](#módulo-de-vagas)
8. [Módulo Admin](#módulo-admin)
9. [Gamificação](#gamificação)
10. [Integrações](#integrações)

---

## Visão Geral dos Módulos

```
┌─────────────────────────────────────────────────────────────────┐
│                        compila.dev                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐  │
│  │ DESAFIOS   │  │ PORTFÓLIO  │  │  SOCIAL    │  │ TRILHAS  │  │
│  │            │  │            │  │            │  │          │  │
│  │ • Listagem │  │ • Perfil   │  │ • Feed     │  │ • Guias  │  │
│  │ • Detalhe  │  │ • Projetos │  │ • Like     │  │ • Progress│  │
│  │ • Editor   │  │ • Stats    │  │ • Comment  │  │ • IA     │  │
│  │ • Submissão│  │ • Export   │  │ • Follow   │  │          │  │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘  │
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐  │
│  │    IA      │  │   VAGAS    │  │ COMUNIDADE │  │  ADMIN   │  │
│  │            │  │            │  │            │  │          │  │
│  │ • Solver   │  │ • Busca    │  │ • Lista    │  │ • Users  │  │
│  │ • Tutor    │  │ • Detalhe  │  │ • Chat     │  │ • Stats  │  │
│  │ • Generator│  │ • Match    │  │ • Eventos  │  │ • Content│  │
│  │ • Co-writer│  │ • Candidato│  │ • Mentoria │  │          │  │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Módulo de Desafios

### 1.1 Listagem de Desafios

**Endpoint:** `GET /api/challenges`

**Filtros:**
- Por stack: Frontend, Backend, Mobile, DevOps, IoT, Data
- Por nível: Iniciante, Júnior, Pleno, Sênior, Especialista
- Por tecnologia: React, Node, Python, Java, etc.
- Por status: Não iniciado, Em progresso, Completo
- Ordenação: Mais recente, Popular, Aleatório

**Card do Desafio:**
```
┌─────────────────────────────────────┐
│ 🎯 Dashboard Analytics             │
│ ─────────────────────────────────── │
│ Stack: Frontend • React            │
│ Nível: Júnior ⭐⭐⭐                │
│                                     │
│ [████░░░░] 45% • 234 completaram   │
│                                     │
│ +120 XP • Badge: React Components  │
└─────────────────────────────────────┘
```

**Response Schema:**
```json
{
  "challenges": [
    {
      "id": "uuid",
      "title": "Dashboard Analytics",
      "slug": "dashboard-analytics",
      "stack": "frontend",
      "technologies": ["react", "typescript", "recharts"],
      "level": "junior",
      "difficulty": 3,
      "xp": 120,
      "estimated_time": 120,
      "completed_count": 234,
      "user_progress": {
        "status": "in_progress",
        "percentage": 45,
        "last_attempt": "2026-01-10T10:30:00Z"
      },
      "badges": ["react-components"]
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 500
  }
}
```

### 1.2 Detalhe do Desafio

**Endpoint:** `GET /api/challenges/{slug}`

**Seções:**
1. **Header**
   - Título e nível
   - Stack e tecnologias
   - XP e badges
   - Estatísticas (completaram, taxa de sucesso)

2. **Descrição**
   - Contexto do problema
   - Requisitos funcionais
   - Critérios de aceitação
   - Mockups/designs (se frontend)

3. **Dicas Progressivas**
   - Dica 1: Livre
   - Dica 2: -10 XP
   - Dica 3: -20 XP
   - Solução completa: -50% XP

4. **Recursos**
   - Documentação relevante (RAG)
   - Desafios relacionados
   - Discussões da comunidade

5. **Submissões Recentes**
   - Top 3 submissões da comunidade
   - Votos e comentários

### 1.3 Editor de Código

**Endpoint:** `GET /api/challenges/{slug}/editor`

**Features:**
- Editor Monaco (VS Code) com syntax highlighting
- Multi-linguagem (JavaScript, TypeScript, Python, Java, Go, etc.)
- Autocomplete básico
- Formatação automática (Prettier/Black)
- Tema claro/escuro
- Split view (código + preview/terminal)

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard Analytics                      [▶ Run] [📤 Submit]     │
├──────────────────────┬──────────────────────────────────────────┤
│                      │                                          │
│  📁 src/             │         📱 Preview                       │
│  📄 App.tsx          │  ┌────────────────────────────────────┐ │
│  📄 components/      │  │                                    │ │
│    └─ Chart.tsx      │  │        [Dashboard Preview]         │ │
│  📄 styles.css       │  │                                    │ │
│                      │  └────────────────────────────────────┘ │
│  [Monaco Editor]     │                                          │
│                      │         📊 Console                        │
│                      │  > npm test                             │
│                      │  ✓ All tests passed!                    │
├──────────────────────┴──────────────────────────────────────────┤
│ 💬 Tutor IA    📚 Resources    💡 Hints    👥 Discuss          │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Submissão de Código

**Endpoint:** `POST /api/challenges/{id}/submit`

**Request:**
```json
{
  "code": "string",
  "language": "typescript",
  "files": [
    {
      "path": "src/App.tsx",
      "content": "string"
    }
  ]
}
```

**Flow de Submissão:**
```
1. Usuário clica "Submit"
   ↓
2. Código é enviado para Code Executor
   ↓
3. Testes automatizados rodam em sandbox
   ↓
4. Se testes passam → Sucesso
   Se testes falham → Smart Solver analisa
   ↓
5. Feedback é retornado via WebSocket
```

**Response Schema:**
```json
{
  "submission_id": "uuid",
  "status": "passed | failed | partial",
  "tests": {
    "total": 5,
    "passed": 3,
    "failed": 2,
    "details": [
      {
        "name": "renders correctly",
        "status": "passed"
      },
      {
        "name": "displays chart data",
        "status": "failed",
        "error": "Expected 3, got 2",
        "line": 15
      }
    ]
  },
  "xp_gained": 120,
  "badges_earned": ["react-components"],
  "ai_feedback": {
    "summary": "Você quase conseguiu! O gráfico não está renderizando todos os dados.",
    "issues": [
      {
        "type": "bug",
        "location": "Chart.tsx:15",
        "description": "O loop não está iterando sobre todos os itens",
        "suggestion": "Use .map() em vez de .filter()"
      }
    ],
    "learning_points": ["array-methods", "react-rendering"],
    "next_challenges": ["challenge-2", "challenge-3"]
  }
}
```

### 1.5 Sandbox de Execução

**Endpoint:** `POST /api/code/execute`

**Features:**
- Execução isolada por container
- Timeout configurável (padrão: 30s)
- Limite de memória (padrão: 512MB)
- Captura de stdout/stderr
- Histórico de execuções

**Suporte Linguagens (MVP):**
| Linguagem | Executor | Versão |
|-----------|----------|--------|
| JavaScript | Node.js | 20 LTS |
| TypeScript | Node.js + ts-node | 5.3 |
| Python | CPython | 3.12 |
| Java | OpenJDK | 21 |
| Go | go run | 1.22 |

**Request:**
```json
{
  "code": "print('Hello, World!')",
  "language": "python",
  "timeout": 10
}
```

**Response:**
```json
{
  "run_id": "uuid",
  "status": "success | timeout | error",
  "output": "Hello, World!",
  "error": null,
  "execution_time": 0.123,
  "memory_used": "12MB"
}
```

---

## Módulo de IA Multi-Agentes

### 2.1 Smart Solver - Feedback Inteligente

**Endpoint:** `WS /api/ai/solve`

**Flow (Dual-Loop):**

```
┌─────────────────────────────────────────────────────────────┐
│                    CÓDIGO SUBMETIDO                         │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   LOOP DE ANÁLISE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌─────────────────┐          │
│  │ InvestigateAgent│────────▶│    NoteAgent    │          │
│  │                 │         │                 │          │
│  │ • Analisa código│         │ • Cria notas    │          │
│  │ • Identifica    │         │ • Salva gaps    │          │
│  │   padrões erro │         │ • Sugere estudo │          │
│  └─────────────────┘         └─────────────────┘          │
│                                                             │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    LOOP DE RESOLUÇÃO                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐      │
│  │Manager │─▶│  Solve   │─▶│ Check  │─▶│Response  │      │
│  │ Agent  │  │  Agent   │  │ Agent  │  │  Agent   │      │
│  │        │  │          │  │        │  │          │      │
│  │• Plano │  │• Gera    │  │• Valida│  │• Formata│      │
│  │  de    │  │  solução │  │  testes│  │  feedback│      │
│  │  ação  │  │• Referência│ │       │  │• Citamos│      │
│  └────────┘  └──────────┘  └────────┘  └──────────┘      │
│                                                             │
└────────────────────────┬────────────────────────────────────┘
                         ↓
                   FEEDBACK AO USUÁRIO
```

**Eventos WebSocket:**
```javascript
// Cliente conecta
ws = new WebSocket('wss://api.compila.dev/ai/solve')

// Eventos recebidos
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)

  switch(data.type) {
    case 'agent_start':
      // Mostra "Investigando seu código..."
      showAgentStatus(data.agent, data.status)

    case 'progress':
      // Atualiza barra de progresso
      updateProgress(data.percentage, data.message)

    case 'finding':
      // Mostra descoberta em tempo real
      showFinding({
        icon: '🔍',
        title: 'Possível erro encontrado',
        description: 'Loop não está iterando corretamente',
        location: 'Chart.tsx:15'
      })

    case 'complete':
      // Feedback completo recebido
      displayFeedback(data.feedback)
  }
}
```

**Feedback Schema:**
```json
{
  "status": "partial",
  "score": 60,
  "feedback": {
    "summary": "Você implementou corretamente a estrutura do componente, mas há um erro na lógica de renderização dos dados.",
    "strengths": [
      {
        "code_quality": "Bom uso de TypeScript com tipos explícitos",
        "pattern": "Componente bem estruturado em arquivos separados"
      }
    ],
    "issues": [
      {
        "id": "issue-1",
        "severity": "error",
        "title": "Loop não itera todos os itens",
        "location": {
          "file": "src/components/Chart.tsx",
          "line": 15,
          "code_snippet": "data.filter(item => item.value > 0).map(...)"
        },
        "explanation": "O filtro está removendo itens com valor zero, mas o requisito pede para mostrar todos os dados.",
        "fix_suggestion": {
          "code": "data.map(item => ({...}))",
          "explanation": "Use .map() diretamente para iterar sobre todos os itens"
        },
        "learning_concept": {
          "name": "Array Methods",
          "description": "filter() vs map() - quando usar cada um",
          "resources": [
            {
              "type": "documentation",
              "url": "/learn/array-methods",
              "title": "Guia completo de Array Methods"
            },
            {
              "type": "challenge",
              "challenge_id": "array-methods-basics",
              "title": "Pratique: Array Methods Básicos"
            }
          ]
        }
      },
      {
        "id": "issue-2",
        "severity": "warning",
        "title": "Falta tratamento de edge case",
        "location": {"file": "src/components/Chart.tsx", "line": 8},
        "explanation": "Se data for undefined ou null, ocorrerá erro.",
        "fix_suggestion": {
          "code": "const chartData = data || []",
          "explanation": "Adicione fallback para array vazio"
        }
      }
    ],
    "next_steps": {
      "recommended_action": "Corrija o loop e tente novamente",
      "estimated_time_to_fix": "5 minutos",
      "related_challenges": [
        {"id": "arr-methods-1", "title": "Array Methods Básicos", "xp": 50},
        {"id": "edge-cases-1", "title": "Tratamento de Edge Cases", "xp": 40}
      ]
    }
  },
  "xp_gained": 48, // 60% de 120 (por tentativa parcial)
  "streak maintained": true
}
```

### 2.2 Tutor IA 24/7

**Endpoint:** `WS /api/ai/chat`

**Features:**
- Chat conversacional com contexto
- Memória da sessão (persistida)
- Conhecimento do desafio atual
- Acesso à base RAG
- Limite de mensagens por plano

**Request:**
```json
{
  "message": "Como faço para iterar sobre um array em React?",
  "context": {
    "challenge_id": "dashboard-analytics",
    "current_code": "...",
    "conversation_history": [...]
  }
}
```

**Response:**
```json
{
  "message": "Para iterar sobre um array em React, você pode usar o método `.map()`. ",
  "code_example": {
    "language": "tsx",
    "code": "const items = data.map((item, index) => (\n  <div key={index}>{item.name}</div>\n));"
  },
  "resources": [
    {
      "title": "Documentação React: Lists and Keys",
      "url": "https://react.dev/learn/rendering-lists"
    }
  ],
  "follow_up_questions": [
    "Posso usar forEach em vez de map?",
    "Por que preciso de uma key?"
  ],
  "tokens_used": 245,
  "messages_remaining": 45 // para usuários FREE
}
```

### 2.3 Question Generator - Factory de Desafios

**Endpoint:** `POST /api/ai/generate-challenge` (Admin)

**Request:**
```json
{
  "stack": "frontend",
  "technologies": ["react", "typescript"],
  "level": "junior",
  "topic": "useState e useEffect",
  "count": 5,
  "mode": "custom" // ou "mimic" para variar desafio existente
}
```

**Response:**
```json
{
  "challenges": [
    {
      "title": "Todo List com LocalStorage",
      "description": "Crie um aplicativo de todo list que persiste os dados no localStorage...",
      "requirements": [
        "Adicionar novas tarefas",
        "Marcar tarefas como concluídas",
        "Persistir no localStorage"
      ],
      "starter_code": {
        "files": [
          {
            "path": "App.tsx",
            "content": "// Seu código aqui"
          }
        ]
      },
      "tests": [
        {
          "name": "adds new todo",
          "code": "expect(addTodo('Test')).toHaveLength(1)"
        }
      ],
      "solution": {
        "files": [...],
        "explanation": "..."
      },
      "hints": [
        "Use useState para gerenciar a lista",
        "Use useEffect para persistir no localStorage"
      ],
      "estimated_time": 45,
      "xp": 80,
      "tags": ["react", "hooks", "local-storage"]
    }
  ],
  "validation": {
    "average_clarity": 4.5, // 1-5
    "average_difficulty_match": 0.9, // 0-1
    "passed_validation": true
  }
}
```

### 2.4 Guide Module - Trilhas Personalizadas

**Endpoint:** `POST /api/ai/generate-path`

**Request:**
```json
{
  "goal": "Quero me tornar Backend Developer em Java",
  "current_level": "iniciante",
  "time_available": "10h/semana",
  "learning_style": "hands-on",
  "user_history": {
    "completed_challenges": ["id1", "id2"],
    "skills": ["python-basic", "git-basic"]
  }
}
```

**Response:**
```json
{
  "path_id": "uuid",
  "title": "Trilha: Backend Developer em Java",
  "description": "Uma trilha personalizada para você se tornar um Backend Developer com foco em Java e Spring Boot.",
  "estimated_duration": "12 semanas",
  "modules": [
    {
      "id": "module-1",
      "title": "Fundamentos de Java",
      "description": "Aprenda os conceitos básicos da linguagem Java.",
      "week": 1,
      "challenges": [
        {"id": "java-hello-world", "order": 1, "required": true},
        {"id": "java-variables", "order": 2, "required": true},
        {"id": "java-loops", "order": 3, "required": true}
      ],
      "resources": [
        {"type": "article", "title": "Introdução ao Java", "url": "..."}
      ],
      "quiz": [
        {
          "question": "Qual é a palavra-chave para declarar uma classe?",
          "options": ["class", "Class", "className", "struct"],
          "correct": 0
        }
      ]
    },
    {
      "id": "module-2",
      "title": "Orientação a Objetos",
      "week": 2,
      "challenges": [...]
    },
    {
      "id": "module-3",
      "title": "Spring Boot Basics",
      "week": 3-4,
      "challenges": [...]
    }
  ],
  "milestones": [
    {
      "week": 4,
      "title": "Primeira API REST",
      "badge": "spring-boot-beginner",
      "challenge": "build-rest-api"
    }
  ],
  "adaptive": true,
  "adjusts_based_on": ["performance", "time_spent", "feedback"]
}
```

### 2.5 Co-Writer - Assistente de Portfólio

**Endpoint:** `POST /api/ai/co-writer`

**Request:**
```json
{
  "action": "expand", // "rewrite", "shorten", "expand", "grammar"
  "content": "Criei um todo app com React",
  "context": {
    "project_name": "Todo App",
    "technologies": ["react", "typescript", "tailwind"],
    "features": ["add", "remove", "edit", "filter"]
  }
}
```

**Response:**
```json
{
  "improved_content": "Desenvolvi um aplicativo de lista de tarefas completo utilizando React e TypeScript. O projeto implementa funcionalidades essenciais de CRUD, incluindo criação, edição, remoção e filtragem de tarefas, com uma interface responsiva construída com TailwindCSS.",
  "changes": [
    {
      "type": "expansion",
      "description": "Adicionou detalhes sobre funcionalidades e tecnologias"
    },
    {
      "type": "vocabulary",
      "description": "Usou termos mais profissionais (CRUD, completo)"
    }
  ],
  "suggestions": [
    "Considere adicionar métricas (ex: 'reduziu tempo de organização em 40%')",
    "Mencione o link do demo ou repositório"
  ]
}
```

### 2.6 RAG - Base de Conhecimento

**Endpoint:** `POST /api/ai/search`

**Request:**
```json
{
  "query": "Como fazer autenticação JWT em Node.js?",
  "filters": {
    "stack": ["backend"],
    "level": ["junior", "pleno"]
  }
}
```

**Response:**
```json
{
  "results": [
    {
      "type": "documentation",
      "title": "Implementando JWT Authentication",
      "source": "compila.dev/knowledge",
      "content": "Para implementar JWT em Node.js...",
      "relevance": 0.95,
      "metadata": {
        "stack": "backend",
        "technologies": ["nodejs", "express", "jsonwebtoken"],
        "level": "junior",
        "last_updated": "2026-01-05"
      }
    },
    {
      "type": "challenge",
      "title": "API REST com JWT",
      "challenge_id": "jwt-auth-api",
      "relevance": 0.87
    }
  ],
  "answer": "Baseado na documentação, aqui está um resumo de como implementar JWT...",
  "sources_cited": ["doc-1", "challenge-2"]
}
```

---

## Módulo de Portfólio

### 3.1 Perfil Público

**Endpoint:** `GET /u/{username}`

**URL pública:** `compila.dev/@username`

**Seções:**
1. **Header**
   - Nome e avatar
   - Bio
   - Localização
   - Links sociais (GitHub, LinkedIn)

2. **Stats**
   - XP total
   - Nível
   - Desafios completados
   - Ranking
   - Badges

3. **Stacks**
   - Gráfico de radar com skills
   - Projetos por stack

4. **Projetos**
   - Cards de projetos
   - Destaques

5. **Certificados**
   - Certificações verificadas
   - Emissão e validade

6. **Atividade**
   - Timeline de submissões
   - Streak atual

### 3.2 Gerenciador de Projetos

**Endpoint:** `GET/POST /api/portfolio/projects`

**Campos:**
```json
{
  "id": "uuid",
  "title": "Todo App com React",
  "slug": "todo-app-react",
  "description": "Aplicativo de lista de tarefas...",
  "long_description": "markdown",
  "technologies": ["react", "typescript", "tailwind"],
  "stack": "frontend",
  "thumbnail": "url",
  "images": ["url1", "url2"],
  "demo_url": "https://todo-app.vercel.app",
  "repo_url": "https://github.com/user/todo-app",
  "challenge_id": "todo-app-challenge", // se originado de desafio
  "featured": true,
  "order": 1,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-10T00:00:00Z",
  "views": 234,
  "likes": 45
}
```

**Features:**
- Adicionar projeto manualmente
- Importar de desafio completado
- Importar de GitHub (auto-detect)
- Reordenar projetos
- Marcar como destaque

### 3.3 Exportação

**Endpoint:** `POST /api/portfolio/export`

**Formatos:**
- PDF (currículo)
- Markdown
- JSON (API)

**PDF Template:**
```
┌────────────────────────────────────────────┐
│  JOÃO SILVA                                │
│  Backend Developer                         │
│  São Paulo, SP • joao@email.com            │
│  compila.dev/@joaosilva • github.com/joao │
├────────────────────────────────────────────┤
│  SOBRE                                    │
│  Desenvolvedor Backend com 4 anos de...    │
├────────────────────────────────────────────┤
│  SKILLS                                   │
│  • Java (Spring Boot)                     │
│  • Python (Django, FastAPI)               │
│  • PostgreSQL, MongoDB                    │
│  • Docker, Kubernetes                     │
│  • AWS, CI/CD                             │
├────────────────────────────────────────────┤
│  PROJETOS                                 │
│  1. API REST de E-commerce                │
│     Java, Spring Boot, PostgreSQL         │
│     - 5.000 requisições/dia               │
│     - compila.dev/p/api-ecommerce         │
├────────────────────────────────────────────┤
│  CERTIFICAÇÕES                            │
│  • Spring Boot Professional - compila.dev │
│    Emitido: Jan/2026 • Validar: [link]   │
│  • Java SE 11 Developer - Oracle          │
└────────────────────────────────────────────┘
```

---

## Módulo Social

### 4.1 Feed

**Endpoint:** `GET /api/feed`

**Tipos de Posts:**
- Submissão aprovada
- Novo projeto no portfólio
- Nível alcançado
- Badge conquistada
- Post de comunidade

**Schema:**
```json
{
  "posts": [
    {
      "id": "uuid",
      "type": "submission",
      "user": {
        "username": "joaosilva",
        "avatar": "url",
        "level": 12
      },
      "challenge": {
        "title": "Dashboard Analytics",
        "thumbnail": "url"
      },
      "content": {
        "summary": "Finalizei o desafio de Dashboard! Aprendi muito sobre gráficos.",
        "images": ["url"],
        "code_snippet": "function Chart() {...}"
      },
      "metrics": {
        "likes": 23,
        "comments": 5,
        "views": 145
      },
      "timestamp": "2026-01-10T14:30:00Z"
    }
  ]
}
```

### 4.2 Comunidades

**Endpoint:** `GET /api/communities`

**Features:**
- Feed da comunidade
- Membros
- Desafios em destaque
- Chat em tempo real
- Eventos e mentorias

**Comunidades Iniciais:**
- React Brasil
- Python Brasil
- Node.js BR
- Java Developers BR
- Flutter Brasil
- IoT BR
- DevOps Brasil

### 4.3 Batalhas ao Vivo

**Endpoint:** `WS /api/battles/{id}`

**Formato:**
- 2-4 competidores
- Desafio surpresa
- 60 minutos
- Chat ao vivo
- Streaming opcional

**Fluxo:**
```
1. Sala de espera (5 min)
2. Anúncio do desafio
3. Codificação (60 min)
4. Submissão e avaliação
5. Votação da audiência
6. Anúncio do vencedor
```

---

## Módulo de Trilhas

### 5.1 Trilhas Predefinidas

**Endpoint:** `GET /api/paths`

**Trilhas Iniciais:**
1. **Frontend Developer** (12 semanas)
2. **Backend Developer** (12 semanas)
3. **Fullstack Developer** (24 semanas)
4. **Mobile Developer** (10 semanas)
5. **DevOps Engineer** (10 semanas)
6. **Data Analyst** (8 semanas)

### 5.2 Trilha Personalizada (IA)

**Ver seção 2.4 Guide Module**

### 5.3 Progresso da Trilha

**Endpoint:** `GET /api/paths/{id}/progress`

**Schema:**
```json
{
  "path_id": "uuid",
  "title": "Frontend Developer",
  "progress": {
    "percentage": 35,
    "modules_completed": 4,
    "modules_total": 12,
    "challenges_completed": 18,
    "xp_gained": 1250
  },
  "current_module": {
    "id": "module-5",
    "title": "React Hooks",
    "progress": 60,
    "current_challenge": {
      "id": "useeffect-basics",
      "title": "useEffect em Ação"
    }
  },
  "next_up": {
    "module": "module-6",
    "title": "State Management"
  },
  "estimated_completion": "2026-04-15",
  "streak": 7
}
```

---

## Módulo de Vagas

### 6.1 Busca de Vagas

**Endpoint:** `GET /api/jobs`

**Filtros:**
- Stack (Frontend, Backend, etc.)
- Nível (Júnior, Pleno, Sênior)
- Tipo (CLT, PJ, Remote, Híbrido)
- Salário
- Localização
- Empresa

**Schema:**
```json
{
  "jobs": [
    {
      "id": "uuid",
      "title": "Desenvolvedor Frontend Pleno",
      "company": {
        "name": "TechCorp",
        "logo": "url",
        "verified": true
      },
      "location": "São Paulo, SP - Híbrido",
      "type": "CLT",
      "salary": {
        "min": 8000,
        "max": 12000,
        "currency": "BRL"
      },
      "requirements": {
        "required": ["React", "TypeScript", "HTML/CSS"],
        "preferred": ["Next.js", "TailwindCSS"]
      },
      "skills_match": {
        "score": 85,
        "matched": ["React", "TypeScript"],
        "missing": ["TailwindCSS"]
      },
      "posted_at": "2026-01-08T00:00:00Z",
      "easy_apply": true
    }
  ]
}
```

### 6.2 Matching Inteligente

**Endpoint:** `GET /api/jobs/match`

**Algoritmo:**
- Compara skills do usuário com requisitos
- Considera nível de proficiência
- Analisa projetos do portfólio
- Leva em conta preferências

**Response:**
```json
{
  "matches": [
    {
      "job_id": "uuid",
      "match_score": 92,
      "match_reasons": [
        "Você tem React avançado ( exigência)",
        "Completou 5 desafios de React",
        "Portfólio tem 2 projetos React"
      ],
      "gap_analysis": {
        "missing": ["Docker"],
        "suggestion": "Complete o desafio 'Docker Basics' para melhorar seu match"
      }
    }
  ]
}
```

### 6.3 Candidatura

**Endpoint:** `POST /api/jobs/{id}/apply`

**Opções:**
- Easy Apply (perfil compila.dev)
- Upload de currículo
- Respostas personalizadas

---

## Módulo Admin

### 7.1 Dashboard

**Endpoint:** `GET /api/admin/dashboard`

**Métricas:**
- Usuários ativos
- Assinaturas
- Receita MRR
- Conversão
- Churn
- NPS

**Gráficos:**
- Crescimento de usuários
- Receita mensal
- Engajamento
- Uso de IA

### 7.2 Gestão de Desafios

**Endpoint:** `GET/POST/PUT/DELETE /api/admin/challenges`

**Features:**
- Criar/editar desafios
- Aprovar desafios gerados por IA
- Estatísticas de conclusão
- Feedback dos usuários

### 7.3 Gestão de Usuários

**Endpoint:** `GET /api/admin/users`

**Ações:**
- Buscar usuário
- Ver perfil completo
- Gerenciar assinatura
- Histórico de atividade
- Ban/Desban

### 7.4 Gestão de Conteúdo IA

**Endpoint:** `/api/admin/ai`

**Features:**
- Configurar prompts
- Ajustar parâmetros de agentes
- Monitorar uso de tokens
- Analisar custos
- Revisar feedbacks sinalizados

---

## Gamificação

### 8.1 XP e Níveis

**Cálculo de XP:**
- Completar desafio: XP base do desafio
- Bônus primeira tentativa: +20%
- Bônus streak: +10%
- Penalidade por dicas: variável

**Tabela de Níveis:**
| Nível | XP Necessário | Título |
|-------|---------------|--------|
| 1 | 0 | Iniciante |
| 5 | 500 | Aprendiz |
| 10 | 2.000 | Estagiário |
| 15 | 5.000 | Júnior |
| 20 | 12.000 | Pleno |
| 25 | 25.000 | Sênior |
| 30 | 50.000 | Especialista |
| 35 | 100.000 | Mestre |
| 40 | 200.000 | Lenda |

### 8.2 Badges

**Categorias:**
- **Por stack:** React Developer, Pythonista, Java Master
- **Por conquista:** First Submission, Perfect Score, Streak Master
- **Por comunidade:** Helpful, Mentor, Influencer
- **Especiais:** Early Adopter, Bug Hunter, Challenge Creator

**Schema:**
```json
{
  "id": "uuid",
  "name": "React Developer",
  "description": "Completou 10 desafios de React",
  "icon": "url",
  "rarity": "rare", // common, rare, epic, legendary
  "earned_at": "2026-01-10T00:00:00Z",
  "progress": {
    "current": 10,
    "required": 10
  }
}
```

### 8.3 Leaderboards

**Tipos:**
- Global
- Por stack
- Semanal
- Mensal

**Endpoint:** `GET /api/leaderboards/{type}`

### 8.4 Streaks

**Regras:**
- Conta dias consecutivos com atividade
- Atividade: submissão ou comentário
- Perde streak se ficar 2 dias sem atividade
- Streaks: 7, 30, 100, 365 dias

---

## Integrações

### 9.1 Autenticação

**Providers:**
- Google OAuth
- GitHub OAuth
- Email/Senha

### 9.2 GitHub

**Features:**
- Login
- Importar repositórios como projetos
- Mostrar commits recentes
- Verificar contribuições

### 9.3 LinkedIn

**Features:**
- Login
- Exportar certificados
- Compartilhar conquistas

### 9.4 Webhooks

**Eventos:**
- challenge.completed
- level.up
- badge.earned
- subscription.active
- subscription.cancelled

---

## Roadmap de Features

### MVP (Mês 1-3)
- ✅ Autenticação
- ✅ Desafios (40)
- ✅ Editor de código
- ✅ Submissão e testes
- ✅ Smart Solver básico
- ✅ Portfólio básico

### V1.0 (Mês 4-6)
- ✅ Feed social
- ✅ Comunidades
- ✅ Tutor IA
- ✅ Trilhas fixas
- ✅ Badges e gamificação completa

### V2.0 (Mês 7-9)
- ✅ Batalhas ao vivo
- ✅ Question Generator
- ✅ Guide Module completo
- ✅ Marketplace de vagas

### V3.0 (Mês 10+)
- ✅ Mobile app
- ✅ Co-writer
- ✅ Research Module
- ✅ Certificações
- ✅ API pública

---

**Última atualização:** Janeiro 2026
**Versão:** 1.0
