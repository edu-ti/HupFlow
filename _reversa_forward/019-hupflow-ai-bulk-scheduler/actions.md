# Actions: Agendamento & Campanhas em Lote com IA (AI Bulk Scheduler)

> Identificador: `019-hupflow-ai-bulk-scheduler`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/019-hupflow-ai-bulk-scheduler/roadmap.md`  

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
| T001 | Definir interfaces TypeScript para campanhas e slots em types.ts | - | `[//]` | `hupflow/src/lib/bulk-scheduler/types.ts` | 🟢 | `[X]` |
| T002 | Implementar algoritmo de projeção de slots temporais em slots.ts | - | `[//]` | `hupflow/src/lib/bulk-scheduler/slots.ts` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para cálculo de datas, slots e validação de cotas | T001, T002 | - | `hupflow/src/lib/bulk-scheduler/bulk-scheduler.test.ts` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar motor de geração de campanhas em lote com IA e fallback em generator.ts | T001, T002 | - | `hupflow/src/lib/bulk-scheduler/generator.ts` | 🟢 | `[X]` |
| T005 | Criar rota POST /api/ai/bulk-campaign com validação de cota checkResourceQuota | T001, T002, T004 | - | `hupflow/src/app/api/ai/bulk-campaign/route.ts` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar componente de modal BulkCampaignModal.tsx para configuração e preview | T001, T005 | `[//]` | `hupflow/src/components/campaign/BulkCampaignModal.tsx` | 🟢 | `[X]` |
| T007 | Integrar botão "Campanha com IA" e disparo de modal no topo do Dashboard | T006 | - | `hupflow/src/app/(dashboard)/dashboard/page.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T008 | Executar bateria de testes com tsx e validação estática tsc --noEmit em toda a base | T003, T005, T006, T007 | - | `hupflow/` | 🟢 | `[X]` |
| T009 | Sincronizar governança Reversa (adendo, legacy-impact, regression-watch, state) | T008 | - | `_reversa_sdd/addenda/019-hupflow-ai-bulk-scheduler.md` | 🟢 | `[X]` |

---

## Notas de execução

*(Será preenchido durante a execução pelo `/reversa-coding`)*

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
