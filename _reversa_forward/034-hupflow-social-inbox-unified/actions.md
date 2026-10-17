# Actions: Unified Social Inbox & AI Smart Replies

> Identificador: `034-hupflow-social-inbox-unified`  
> Data: `2026-10-17`  
> Roadmap: `_reversa_forward/034-hupflow-social-inbox-unified/roadmap.md`  

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
| T001 | Definir tipos TypeScript para mensagens do Social Inbox, intenções, sentimento e Smart Replies | - | `[//]` | `hupflow/src/lib/inbox/types.ts` | 🟢 | `[x]` |
| T002 | Adicionar tabela social_inbox_messages no schema Drizzle | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[x]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar classificador semântico de intenção, gerador de Smart Replies e testes unitários | T001 | - | `hupflow/src/lib/inbox/inbox.test.ts` | 🟢 | `[x]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar serviço do Social Inbox com CRUD Drizzle, filtros e resposta rápida | T001, T002, T003 | - | `hupflow/src/lib/inbox/service.ts` | 🟢 | `[x]` |
| T005 | Criar rotas REST /api/inbox e /api/inbox/reply com RBAC | T001, T004 | - | `hupflow/src/app/api/inbox/...` | 🟢 | `[x]` |

---

## Fase 4, Interface

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar componente de console de conversa e sugestões IA InboxThreadDetail.tsx | T001, T003 | `[//]` | `hupflow/src/components/inbox/InboxThreadDetail.tsx` | 🟢 | `[x]` |
| T007 | Criar página gerencial /inbox com filtros de intenção, canais e Inbox Zero | T005, T006 | - | `hupflow/src/app/(dashboard)/inbox/page.tsx` | 🟢 | `[x]` |
| T008 | Adicionar atalho "Social Inbox & IA" na barra lateral do dashboard | T007 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[x]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Executar bateria de testes tsx e verificação estática tsc --noEmit | T003, T005, T007, T008 | - | `hupflow/` | 🟢 | `[x]` |
| T010 | Documentar legacy-impact.md, regression-watch.md, adendo SDD 034 e SESSION_HANDOFF.md | T009 | - | `_reversa_forward/034-hupflow-social-inbox-unified/` | 🟢 | `[x]` |
