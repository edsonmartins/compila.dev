---
title: Frontend
---

# Frontend

O frontend usa Next.js com App Router.

## Estrutura

- `app/`: rotas e layouts.
- `components/`: UI e componentes de dominio.
- `lib/api/`: clientes de API.

## Fluxos relevantes

- `app/app/desafios`: listagem e detalhe de desafios.
- `app/app/perfil`: edicao de perfil e seguranca.
- `app/app/portfolio/[username]`: portfolio publico.
- `app/app/feed`: feed social.
- `app/app/vagas`: marketplace de vagas.

## Integracoes ativas

- Desafios usam `lib/api` sem mocks.
- Portfolio busca projetos reais em `/portfolio/{username}`.
- Vagas usam `/jobs` com filtros basicos.
- Feed implementa share e ownership de comentarios.
