---
title: Visao geral
---

# Visao geral

O compila.dev e uma plataforma brasileira de desafios de programacao com foco em pratica real,
portfolio publico, gamificacao e feedback automatizado por IA.

## Objetivos do MVP

- Fluxo de desafios completo (listagem, detalhe, editor, submissao, feedback).
- Perfil e portfolio funcionais.
- Feed social basico (posts, comentarios, kudos, share).
- Integracao entre backend (Spring Boot) e ai-service (FastAPI).
- Marketplace de vagas em modo basico (listagem e detalhes).

## Principais modulos

- **Frontend**: Next.js (App Router) com Tailwind e componentes em `app/` e `components/`.
- **Backend**: Spring Boot 3.2 com APIs REST em `backend/src/main/java/dev/compila`.
- **AI Service**: FastAPI baseado no DeepTutor, adaptado em `ai-service/`.

## Estado atual (implementado)

- Auth com refresh token.
- Desafios com `requirements` e `starterCode` parseados.
- Submissoes persistem `testResults`.
- Perfil: atualizacao + troca de senha.
- Portfolio: endpoints + consumo no frontend.
- Vagas: endpoints + listagem no frontend.
- Feed: share e ownership concluido.

## Para usuarios

Comece pelo [Guia do usuario](/guia-usuario) e veja tambem [Portfolio](/portfolio) para preparar seus projetos.

## Como contribuir

Veja o guia em `AGENTS.md` e a pagina "Contribuindo" nesta documentacao.
