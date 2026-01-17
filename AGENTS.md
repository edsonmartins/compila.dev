# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds the Next.js App Router routes, including marketing pages and authenticated `/app` areas.
- `components/` contains reusable UI, layout, editor, and provider components.
- `lib/` centralizes API clients and shared utilities.
- `backend/` is the Spring Boot service (`backend/src/main/java/dev/compila`).
- `public/` serves static assets; `data/` and `docs_projeto/` store supporting content.

## Build, Test, and Development Commands
- `pnpm dev` (or `npm run dev`): start the Next.js dev server.
- `pnpm build`: create the production frontend build.
- `pnpm start`: run the production Next.js server after a build.
- `pnpm lint`: run ESLint with the Next.js config.
- `pnpm type-check`: run TypeScript in no-emit mode.
- `cd backend && ./mvnw spring-boot:run`: start the Spring Boot API.
- `cd backend && ./mvnw clean package`: build the backend JAR.
- `cd backend && ./mvnw test`: run backend tests.

## Coding Style & Naming Conventions
- TypeScript/React uses 2-space indentation and single quotes (see `components/providers/AuthProvider.tsx`).
- Component files and React components use `PascalCase` (e.g., `Header.tsx`).
- Route folders in `app/` use kebab or lowercase naming, matching URL paths.
- Tailwind CSS is the primary styling approach; keep class lists readable and grouped.

## Testing Guidelines
- Backend tests use `spring-boot-starter-test`, Spring Security test helpers, and Testcontainers.
- Place tests under `backend/src/test/java/...` mirroring the `main` package structure.
- Frontend automated tests are not configured in `package.json`; add a test runner if introducing UI tests.

## Commit & Pull Request Guidelines
- Recent history follows Conventional Commits, e.g., `feat: ...` and `fix: ...`; keep that pattern.
- PRs should describe the change, include testing notes (commands + results), and link issues when applicable.
- Include screenshots or short clips for UI/UX changes.

## Configuration Tips
- Frontend environment variables live in `.env.local` (e.g., `NEXT_PUBLIC_API_URL`).
