# Plano de Execucao - compila.dev (v1)

> **Instrucao:** Sempre que uma tarefa avancar de status, atualize esta tabela com a nova situacao e registre a data no campo "Ultima atualizacao". Os status sugeridos sao `TODO`, `IN_PROGRESS`, `BLOCKED` e `DONE`.

## Legend
- `TODO`: ainda nao iniciado.
- `IN_PROGRESS`: em execucao.
- `BLOCKED`: impedida por dependencia externa.
- `DONE`: concluida e validada.

**IMPORTANTE:**
- Manter consistencia com os documentos de escopo em `docs_projeto/`.
- Priorizar MVP funcional antes de expansoes (mobile, batalhas, etc).
- Evitar mocks/placeholder em rotas core antes do release.
- Escopo de MVP ajustado: desafios + autenticacao + perfil + portfolio + feed basico.

**CONTEXTO DO PROJETO:**
Plataforma brasileira de desafios de programacao com IA, portfolio, feed social, gamificacao e marketplace de vagas. O foco imediato e entregar o fluxo de desafios com feedback e dados reais.

---

## 📊 STATUS GERAL DO PROJETO (Atualizado: 2025-11-29)

### ✅ Fases Concluidas

| Fase | Progresso | Status | Arquivos | Linhas de Codigo |
|------|-----------|--------|----------|------------------|
| **Base Frontend (Next.js)** | Parcial | ⚠️ EM ANDAMENTO | - | - |
| **Base Backend (Spring Boot)** | Parcial | ⚠️ EM ANDAMENTO | - | - |
| **AI Service (FastAPI)** | Parcial | ⚠️ EM ANDAMENTO | - | - |

---

## 📌 Plano de Execucao - Tarefas

| ID | Area | Tarefa | Dependencias | Status | Ultima atualizacao |
|----|------|--------|--------------|--------|--------------------|
| 01 | Backend | Implementar refresh token e ajustar fluxo de auth (JWT + refresh) | - | DONE | 2026-01-16 |
| 02 | Backend | Parsear `requirements` e `starterCode` no `ChallengeResponse` | 01 | DONE | 2026-01-16 |
| 03 | Backend | Persistir `testResults` e retornar no `SubmissionResponse` | 02 | DONE | 2026-01-16 |
| 04 | Backend | Implementar contadores de desafios concluido/tentado no perfil | 03 | DONE | 2026-01-16 |
| 05 | Backend | Criar modulo Portfolio (CRUD projetos + endpoints publicos) | 01 | DONE | 2026-01-16 |
| 06 | Backend | Criar modulo Vagas (CRUD, listagem, filtros, aplicar) | 01 | DONE | 2026-01-16 |
| 07 | Backend | Definir limites de execucao de codigo (tempo/memoria) | 02 | DONE | 2026-01-16 |
| 08 | AI Service | Substituir fallback mock de avaliacao por executor real | 07 | TODO | 2025-11-29 |
| 09 | AI Service | Implementar indexacao vetorial real (Qdrant/Pinecone) | - | TODO | 2025-11-29 |
| 10 | AI Service | Finalizar parser de PDF (sem placeholder) | 09 | TODO | 2025-11-29 |
| 11 | Frontend | Remover mocks de desafios e tratar erro com UI real | 02 | DONE | 2026-01-16 |
| 12 | Frontend | Implementar atualizacao de perfil e troca de senha | 01 | DONE | 2026-01-16 |
| 13 | Frontend | Integrar Portfolio com API real | 05 | DONE | 2026-01-16 |
| 14 | Frontend | Integrar Vagas com API real | 06 | DONE | 2026-01-16 |
| 15 | Frontend | Finalizar feed (share + ownership) | 01 | DONE | 2026-01-16 |
| 16 | Docs | Alinhar docs: corrigir referencias e estrutura divergente | - | TODO | 2025-11-29 |
| 17 | Infra | Adicionar compose minimo (Postgres + AI service) | - | TODO | 2025-11-29 |
| 18 | Produto | Vagas como fase 2 (pos-MVP) e remover mocks do caminho critico | 06 | TODO | 2025-11-29 |
| 19 | Produto | Mobile como fase futura (fora do MVP inicial) | - | TODO | 2025-11-29 |
| 20 | AI Service | Recriar pacote `src` para compatibilidade com imports do DeepTutor | - | DONE | 2026-01-16 |
| 21 | AI Service | Revisar e reduzir rotas expostas no `api/main.py` para MVP | 20 | DONE | 2026-01-16 |
| 22 | AI Service | Padronizar env/config (remover `DeepTutor.env`, usar `.env`) | 20 | DONE | 2026-01-16 |
| 23 | AI Service | Ajustar `PROJECT_ROOT` e paths para `ai-service/` | 20 | DONE | 2026-01-16 |
| 24 | Docs | Implementar documentacao com Docusaurus v3 | - | DONE | 2026-01-16 |

---

## Observacoes
- Prioridade maxima: fluxo de desafios completo (listagem, detalhe, editor, submissao, feedback real).
- Portfolio e Vagas sao pilares do produto, mas dependem de backend funcional.
- Mobile pode ser replanejado para fase posterior se bloquear o MVP.

---

## 🗓️ Plano por Sprints (2 semanas)

> **Assuncao:** MVP focado em desafios + auth + perfil + portfolio + feed basico. Vagas e mobile ficam pos-MVP.

### Sprint 1 - Fundacoes do fluxo de desafios
- Backend: 01, 02, 03, 04, 07
- Frontend: 11, 12
- Infra: 17 (minimo local para desenvolvimento)

### Sprint 2 - Portfolio e feed basico
- Backend: 05
- Frontend: 13, 15
- Docs: 16

### Sprint 3 - AI service (avaliacao real)
- AI Service: 08
- Revisar integracao end-to-end com submissao (dependente do 08)

### Sprint 4 - Pos-MVP (planejamento)
- Produto: 18, 19
- AI Service: 09, 10 (se necessario para features de RAG)

---

## Pendencias para definir
- Data alvo do MVP (para ajustar cadencia dos sprints).
- Fonte de verdade para `requirements` e `starterCode` (DB vs arquivos versionados).
