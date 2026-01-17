# Revisao de uso do DeepTutor no ai-service

## Contexto
O `ai-service/` foi copiado do `DeepTutor/src` e mantem a maior parte da estrutura original. O backend do compila.dev integra apenas os endpoints `/api/v1/compila/*` (avaliacao/analyze de codigo).

## Como estamos usando hoje
- O backend chama `POST /api/v1/compila/evaluate` e `POST /api/v1/compila/analyze` (ver `backend/src/main/java/dev/compila/ai/AiEvaluationService.java`).
- O restante das rotas (solve, research, question, guide, etc) permanece exposto no `ai-service/api/main.py`, mas nao ha chamadas no compila.dev atual.

## Gaps tecnicos detectados
1) **Imports quebrados**: o codigo ainda importa `src.*`, mas nao existe `ai-service/src/`.
2) **Config ausente**: modulos esperam `config/*.yaml` em `PROJECT_ROOT`, mas nao ha `config/` no repo do compila.dev.
3) **Referencias a DeepTutor.env**: varios modulos leem `DeepTutor.env` (ex.: `ai-service/services/tts/config.py`, `ai-service/tools/rag_tool.py`).
4) **Branding e paths antigos**: logs e docs ainda usam `DeepTutor`, `ai_tutor` e paths como `DeepTutor/data/user/...` (ex.: `ai-service/api/main.py`, `ai-service/logging/logger.py`).
5) **Routers nao utilizados**: rotas `solve`, `research`, `question`, `guide` etc continuam publicas sem uso direto no produto atual.

## Riscos
- `ai-service` pode nao iniciar corretamente por falta de `src` e de `config` real.
- Configuracoes e paths antigos geram confusao operacional (DeepTutor vs compila.dev).
- Superficie de API maior que o necessario para o MVP.

## Recomendacoes imediatas
1) **Resolver estrutura `src`**: criar `ai-service/src` e mover o codigo para dentro dela, ou ajustar imports para caminhos relativos.
2) **Reintroduzir configuracoes minimas**: adicionar `config/main.yaml` + configs usados (solve/question) ou substituir por `settings.py`.
3) **Padronizar env**: trocar referencias de `DeepTutor.env` por `.env` do compila.dev.
4) **Limitar rotas expostas**: manter apenas `/api/v1/compila/*` no MVP.
5) **Atualizar branding**: substituir textos/logs/documentacao para `compila.dev`.

## Arquivos chave para ajuste
- `ai-service/api/main.py`
- `ai-service/services/config/loader.py`
- `ai-service/services/tts/config.py`
- `ai-service/tools/rag_tool.py`
- `ai-service/logging/logger.py`
