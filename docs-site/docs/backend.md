---
title: Backend
---

# Backend

O backend esta em `backend/` e exposto como APIs REST.

## Principais areas

- **Auth**: `/auth/*` com JWT + refresh token.
- **Desafios**: `/challenges/*` e `/submissions/*`.
- **Perfil**: `/users/me` e `/users/me/password`.
- **Portfolio**: `/portfolio/*`.
- **Feed social**: `/feed/*`.
- **Vagas**: `/jobs/*`.

## Estrutura de codigo

- Controllers em `backend/src/main/java/dev/compila/*`.
- DTOs em `*/dto`.
- Servicos por modulo.

## Observacoes

- A camada de execucao de codigo no backend esta em `execution/`.
- O backend chama o AI Service para avaliacao de codigo.
- Os endpoints publicos principais sao `/challenges/*`, `/portfolio/*` e `/jobs/*`.
