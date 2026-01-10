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

### Backend
- **Java 21**
- **Spring Boot 3.2**
- **Spring Security** - Autenticação e autorização
- **JWT + OAuth2** - GitHub e Google
- **PostgreSQL** - Banco de dados
- **Docker** - Containerização

## 📋 Pré-requisitos

- Node.js 20+
- Java 21+
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
# API URL (padrão: http://localhost:8080/api/v1)
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# App URL (para OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Instale as dependências

```bash
# Com pnpm (recomendado)
pnpm install

# Ou com npm
npm install

# Ou com yarn
yarn install
```

### 4. Configure o banco de dados

```bash
# Suba os containers PostgreSQL
docker-compose up -d
```

### 5. Execute o backend

```bash
cd backend
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`

### 6. Execute o frontend

```bash
# Em modo desenvolvimento
pnpm dev

# Ou
npm run dev
```

Acesse `http://localhost:3000`

## 📁 Estrutura do Projeto

```
compila.dev/
├── app/                      # App Next.js (frontend)
│   ├── (marketing)/          # Páginas públicas (landing, etc)
│   ├── (auth)/               # Páginas de autenticação
│   ├── app/                  # Área logada da aplicação
│   │   ├── dashboard/        # Dashboard do usuário
│   │   ├── desafios/         # Lista e detalhes de desafios
│   │   ├── trilhas/          # Trilhas de aprendizado
│   │   ├── vagas/            # Vagas de emprego
│   │   ├── feed/             # Feed social
│   │   └── ranking/          # Ranking de usuários
│   └── layout.tsx            # Layout raiz
├── components/
│   ├── app/                  # Componentes da área logada
│   │   ├── layout/           # Sidebar, header
│   │   ├── editor/           # Monaco Editor
│   │   └── desafios/         # Cards de desafios
│   ├── providers/            # Context providers (Auth, Theme)
│   └── ui/                   # Componentes reutilizáveis (shadcn/ui)
├── lib/
│   ├── api/                  # Cliente API e endpoints
│   └── utils.ts              # Utilitários
├── backend/                  # Spring Boot
│   └── src/main/java/dev/compila/
└── public/                   # Arquivos estáticos
```

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

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

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
