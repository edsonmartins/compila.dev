---
title: AI Service
---

# AI Service

O AI Service esta em `ai-service/` e exposto via FastAPI.

## Endpoints usados no MVP

- `POST /api/v1/compila/evaluate`: executa testes e retorna feedback.
- `POST /api/v1/compila/analyze`: analise de codigo sem testes.

## Observacoes

- O codigo veio do DeepTutor e foi adaptado.
- Usamos um shim em `ai-service/src/__init__.py` para manter imports `src.*`.
- As rotas nao usadas do DeepTutor foram removidas do `api/main.py`.
- Configuracoes sao carregadas de `.env`.
