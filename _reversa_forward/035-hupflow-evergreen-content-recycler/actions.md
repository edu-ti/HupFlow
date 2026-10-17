# Actions: Evergreen Content Recycler & Smart Auto-Requeue

> Identificador: `035-hupflow-evergreen-content-recycler`  
> Data: `2026-10-17`  
> Roadmap: `_reversa_forward/035-hupflow-evergreen-content-recycler/roadmap.md`  

---

## Resumo

| Métrica | Valor |
|---------|:-----:|
| Total de ações | 10 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 5 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T001 | Definir tipos TypeScript para biblioteca Evergreen, variações de gancho e métricas | - | `[//]` | `hupflow/src/lib/evergreen/types.ts` | 🟢 | `[x]` |
| T002 | Adicionar tabela evergreen_items no schema Drizzle | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[x]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar motor de Evergreen Score, validador de cooldown, gerador de variações e testes unitários | T001 | - | `hupflow/src/lib/evergreen/evergreen.test.ts` | 🟢 | `[x]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar serviço Evergreen com CRUD Drizzle e motor de reciclagem round-robin | T001, T002, T003 | - | `hupflow/src/lib/evergreen/service.ts` | 🟢 | `[x]` |
| T005 | Criar rotas REST /api/evergreen e /api/evergreen/recycle com RBAC | T001, T004 | - | `hupflow/src/app/api/evergreen/...` | 🟢 | `[x]` |

---

## Fase 4, Interface

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar componente EvergreenVariationCard.tsx com visualizador round-robin e score | T001, T003 | `[//]` | `hupflow/src/components/evergreen/EvergreenVariationCard.tsx` | 🟢 | `[x]` |
| T007 | Criar página gerencial /settings/evergreen com simulador de perenidade e fila automática | T005, T006 | - | `hupflow/src/app/(dashboard)/settings/evergreen/page.tsx` | 🟢 | `[x]` |
| T008 | Adicionar atalho "Reciclagem Evergreen" na barra lateral do dashboard | T007 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[x]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Executar bateria de testes tsx e verificação estática tsc --noEmit | T003, T005, T007, T008 | - | `hupflow/` | 🟢 | `[x]` |
| T010 | Documentar legacy-impact.md, regression-watch.md, adendo SDD 035 e SESSION_HANDOFF.md | T009 | - | `_reversa_forward/035-hupflow-evergreen-content-recycler/` | 🟢 | `[x]` |
