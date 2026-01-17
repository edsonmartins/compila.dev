# Compila.dev

> Compile conhecimento, execute sua carreira!

Plataforma de desafios de programação 100% em português com mais de 500 desafios reais em Frontend, Backend, Mobile, IoT e DevOps.

## 🚀 Tecnologias

### Frontend
- **Next.js 16** - React framework com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Framer Motion** - Animações
- **Monaco Editor** - Editor de código (VS Code)
- **Radix UI** - Componentes acessíveis
- **shadcn/ui** - Sistema de componentes
- **sonner** - Sistema de notificações/toast

### Backend
- **Java 21**
- **Spring Boot 3.2**
- **Spring Security** - Autenticação e autorização
- **JWT + OAuth2** - GitHub e Google
- **PostgreSQL** - Banco de dados
- **Docker** - Containerização

### AI Service
- **FastAPI** - API Python para agentes de IA
- **LangChain** - Framework para LLMs
- **OpenAI/Anthropic** - Modelos de linguagem
- **Python 3.10+** - Type hints com Protocol

## 📋 Pré-requisitos

- Node.js 20+
- Java 21+
- Python 3.10+
- Docker e Docker Compose
- pnpm (opcional, pode usar npm/yarn)

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/edsonmartins/compila.dev.git
cd compila.dev
```

### 2. Configure as variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto frontend:

```bash
# API URL (padrão: http://localhost:8080/api)
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# App URL (para OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Configure o CORS no backend (`application.properties` ou via variáveis de ambiente):

```bash
# CORS permitidas (separadas por vírgula)
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://compila.dev
```

### 3. Instale as dependências

```bash
# Frontend (recomendado)
pnpm install

# Backend Maven baixa dependências automaticamente
```

### 4. Configure o banco de dados

```bash
docker-compose up -d
```

### 5. Execute os serviços

```bash
# Backend (porta 8080)
cd backend
./mvnw spring-boot:run

# AI Service (porta 8000)
cd ai-service
uvicorn src.api.main:app --reload

# Frontend (porta 3000)
pnpm dev
```

## 📁 Estrutura do Projeto

```
compila.dev/
├── app/                      # App Next.js (frontend)
│   ├── (marketing)/          # Páginas públicas
│   ├── (auth)/               # Autenticação
│   ├── app/                  # Área logada
│   │   ├── dashboard/        # Dashboard do usuário
│   │   ├── desafios/         # Desafios
│   │   ├── trilhas/          # Trilhas de aprendizado
│   │   ├── vagas/            # Vagas de emprego
│   │   ├── feed/             # Feed social
│   │   ├── ranking/          # Ranking
│   │   └── admin/            # Painel administrativo
│   └── layout.tsx            # Layout com Toaster
├── components/
│   ├── app/                  # Componentes da área logada
│   ├── providers/            # Context providers
│   └── ui/                   # Componentes shadcn/ui
├── lib/
│   └── api/                  # Cliente API
├── backend/                  # Spring Boot
│   └── src/main/java/dev/compila/
│       ├── auth/              # Autenticação + exceções customizadas
│       ├── config/            # Configurações + GlobalExceptionHandler
│       ├── admin/             # Painel admin com paginação
│       ├── social/            # Feed social + DTOs tipados
│       └── submission/        # Submissões + DTOs tipados
├── ai-service/               # FastAPI - Agentes de IA
│   ├── agents/               # Agentes + Protocol type hints
│   ├── api/                  # Routers com CORS configurado
│   ├── logging/              # Logging estruturado
│   └── services/             # Serviços LLM, RAG, etc.
└── docs-site/                # Documentação
```

## 🔐 Segurança

Implementações recentes:
- ✅ CORS configurado com origens específicas (sem wildcard)
- ✅ Exceções customizadas com HTTP status codes apropriados
- ✅ Validação de senhas fortalecida (8+ caracteres, maiúscula, minúscula, número)
- ✅ Race conditions corrigidas com operações atômicas no banco
- ✅ GlobalExceptionHandler para respostas de erro consistentes

## 🔐 Autenticação

- Login com email/senha
- OAuth2 (GitHub, Google)
- JWT com refresh tokens
- Rotas protegidas com redirecionamento automático

## 🎮 Gamificação

- Sistema de XP (experiência)
- Níveis de progressão
- Streak diário
- Badges e conquistas
- Ranking global

## 📝 Desafios

Cada desafio contém:
- Enunciado detalhado em português
- Código inicial (starter code)
- Testes automatizados
- Feedback por IA
- XP recompensa

## 🧪 Desenvolvimento

### Executar testes

```bash
# Frontend
pnpm test

# Backend
cd backend
./mvnw test
```

### Build para produção

```bash
# Frontend
pnpm build

# Backend
cd backend
./mvnw clean package
```

## 🛡️ Type Safety

### Java
- DTOs tipados para substituir `Map<String, Object>`
- Exceções customizadas por domínio
- Records imutáveis para DTOs de resposta

### Python
- Protocol classes para type hints
- Type hints em todos os módulos
- Estrutura estrita de configuração

### TypeScript
- Strict mode habilitado
- Tipagem em todos os componentes
- Union types para valores de domínio

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças
4. Push (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Código de Conduta

- Respeite as convenções de código existentes
- Adicione testes para novas funcionalidades
- Use mensagens de commit claras (conventional commits)
- Siga as práticas de segurança estabelecidas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Edson Martins** - [@edsonmartins](https://github.com/edsonmartins)

## 🙏 Agradecimentos

- Comunidade brasileira de desenvolvedores
- Contribuidores de código aberto
- Todos os usuários da plataforma

---

Feito com 💜 para a comunidade dev brasileira 🇧🇷
