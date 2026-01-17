---
title: Arquitetura
---

# Arquitetura

O compila.dev usa tres servicos principais:

- **Frontend (Next.js)**: interface web e fluxo do usuario.
- **Backend (Spring Boot)**: autenticacao, desafios, portfolio, social e vagas.
- **AI Service (FastAPI)**: avaliacao de codigo e feedback.

## Fluxo principal de desafios

1. Frontend chama `/challenges` para listagem e detalhe.
2. Usuario escreve codigo no editor.
3. Frontend envia para `/submissions`.
4. Backend chama o `ai-service` em `/api/v1/compila/evaluate`.
5. Resultado retorna com status, score, XP e test results.

## Integracoes

- Backend usa WebClient para o AI Service.
- AI Service exposto apenas com rotas `compila` no MVP.
- Persistencia em PostgreSQL (schema base em `V1__create_initial_schema.sql`).

## Diretrizes

- Backend e AI Service se comunicam via HTTP.
- Dados persistidos no PostgreSQL.
- Foco atual no MVP, sem mobile e sem batalhas ao vivo.
