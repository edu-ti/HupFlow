# Actions: Dead-Letter Queue & Reprocessamento de Falhas

> Identificador: `025-hupflow-publishing-dead-letter-queue`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/025-hupflow-publishing-dead-letter-queue/roadmap.md`  

---

## Resumo

| Métrica | Valor |
|---------|:-----:|
| Total de ações | 9 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 4 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T001 | Definir interfaces TypeScript para DLQ, diagnósticos e contadores em types.ts | - | `[//]` | `hupflow/src/lib/dlq/types.ts` | 🟢 | `[x]` |
| T002 | Adicionar tabela publishing_dlq e índices no schema.ts | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[x]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para o analisador de erros e estratégias de retry | T001 | - | `hupflow/src/lib/dlq/dlq.test.ts` | 🟢 | `[x]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar serviço de diagnóstico, catalogação e reprocessamento em service.ts | T001, T002 | - | `hupflow/src/lib/dlq/service.ts` | 🟢 | `[x]` |
| T005 | Criar rotas REST /api/posts/dlq, /retry e /dismiss com RBAC | T001, T004 | - | `hupflow/src/app/api/posts/dlq/route.ts` | 🟢 | `[x]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar painel visual da Central de Falhas em /queue/failures/page.tsx | T005 | `[//]` | `hupflow/src/app/(dashboard)/queue/failures/page.tsx` | 🟢 | `[x]` |
| T007 | Adicionar atalho "Falhas & DLQ" no menu lateral do dashboard em layout.tsx | T006 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[x]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T008 | Bateria de testes com tsx e validação estática tsc --noEmit | T003, T005, T006, T007 | - | `hupflow/` | 🟢 | `[x]` |
| T009 | Geração de adendo SDD 025, relatórios de impacto e sincronização de governança | T008 | - | `_reversa_sdd/` | 🟢 | `[x]` |

---

## Notas de execução

- **T001**: Criado `hupflow/src/lib/dlq/types.ts` com tipagem para `DlqErrorCategory`, `DlqStatus`, `DlqDiagnosisResult`, `DlqIncident`, `DlqCounts` e inputs de mutação.
- **T002**: Tabela `publishing_dlq` adicionada ao Drizzle ORM em `hupflow/src/lib/db/schema.ts` com FKs para `posts`, `post_channels` e `organizations`.
- **T003**: Testes unitários implementados em `dlq.test.ts` cobrindo cenários reais de erros de Meta, LinkedIn, X/Twitter, timeouts transitórios e fallback desconhecido com 100% de sucesso.
- **T004**: Serviço da Dead-Letter Queue com diagnóstico heurístico `diagnosePublishingError`, catalogação atômica `recordDlqIncident`, listagem `listDlqIncidents`, retry seletivo `retryDlqIncident` e descarte em `hupflow/src/lib/dlq/service.ts`.
- **T005**: Rotas RESTful criadas em `hupflow/src/app/api/posts/dlq/route.ts` suportando listagem paginada com contadores, retry seletivo anti-duplicata e descarte por RBAC `member`.
- **T006**: Painel em `/queue/failures/page.tsx` com 4 KPI cards, tabs por status, visualizador de diagnóstico amigável, expansor de payload de erro da API e modal de edição corretiva pré-retry.
- **T007**: Item de navegação "Falhas & DLQ" integrado na barra lateral do dashboard em `hupflow/src/app/(dashboard)/layout.tsx`.
- **T008 & T009**: Compilação TypeScript com `npx tsc --noEmit` aprovada com 0 erros. Bateria de testes de regressão executada com 100% de sucesso. Adendo SDD 025, legacy-impact e regression-watch registrados.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
| 2026-10-16 | Conclusão integral de T001 a T009 com 100% de aprovação | reversa-coding |
