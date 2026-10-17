# Actions: White-Label Client Portals & External Approvals

> Identificador: `033-hupflow-white-label-client-portals`  
> Data: `2026-10-17`  
> Roadmap: `_reversa_forward/033-hupflow-white-label-client-portals/roadmap.md`  

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
| T001 | Definir tipos TypeScript para portais white-label, entregas, revisões e métricas | - | `[//]` | `hupflow/src/lib/portals/types.ts` | 🟢 | `[x]` |
| T002 | Adicionar tabela client_portals no schema Drizzle | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[x]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar motor de tokens mágicos, máquina de revisão externa e testes unitários | T001 | - | `hupflow/src/lib/portals/portals.test.ts` | 🟢 | `[x]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar serviço de portais com CRUD Drizzle, resolução pública e revisão | T001, T002, T003 | - | `hupflow/src/lib/portals/service.ts` | 🟢 | `[x]` |
| T005 | Criar rotas /api/portals, /api/portals/public/[token] e /api/portals/review | T001, T004 | - | `hupflow/src/app/api/portals/...` | 🟢 | `[x]` |

---

## Fase 4, Interface

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar componente simulador White-Label ClientPortalPreview.tsx | T001, T003 | `[//]` | `hupflow/src/components/portals/ClientPortalPreview.tsx` | 🟢 | `[x]` |
| T007 | Criar página gerencial /settings/portals e página pública /portal/[token] | T005, T006 | - | `hupflow/src/app/(dashboard)/settings/portals/page.tsx` & `portal/[token]/page.tsx` | 🟢 | `[x]` |
| T008 | Adicionar atalho "Portais de Clientes" na barra lateral do dashboard | T007 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[x]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Executar bateria de testes tsx e verificação estática tsc --noEmit | T003, T005, T007, T008 | - | `hupflow/` | 🟢 | `[x]` |
| T010 | Documentar legacy-impact.md, regression-watch.md, adendo SDD 033 e SESSION_HANDOFF.md | T009 | - | `_reversa_forward/033-hupflow-white-label-client-portals/` | 🟢 | `[x]` |
