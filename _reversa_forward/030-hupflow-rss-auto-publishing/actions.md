# Actions: Feed RSS Integrator & Publicação com IA

> Identificador: `030-hupflow-rss-auto-publishing`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/030-hupflow-rss-auto-publishing/roadmap.md`  

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
| T001 | Definir contratos TypeScript para feeds, itens, status e síntese em types.ts | - | `[//]` | `hupflow/src/lib/rss/types.ts` | 🟢 | `[x]` |
| T002 | Adicionar tabelas rss_feeds e rss_feed_items no schema.ts do Drizzle ORM | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[x]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para parser XML RSS/Atom, deduplicação e síntese IA | T001 | - | `hupflow/src/lib/rss/rss.test.ts` | 🟢 | `[x]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar parser XML nativo, fetcher de feeds e serviço de síntese em service.ts | T001, T002 | - | `hupflow/src/lib/rss/service.ts` | 🟢 | `[x]` |
| T005 | Criar rotas REST /api/rss, /api/rss/sync e /api/rss/draft com RBAC | T001, T004 | - | `hupflow/src/app/api/rss/route.ts` & `hupflow/src/app/api/rss/sync/route.ts` & `draft/route.ts` | 🟢 | `[x]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar modal de cadastro e teste de feed AddFeedModal.tsx | T001 | `[//]` | `hupflow/src/components/rss/AddFeedModal.tsx` | 🟢 | `[x]` |
| T007 | Criar tela /settings/rss para gerenciamento de feeds e artigos detectados | T005, T006 | - | `hupflow/src/app/(dashboard)/settings/rss/page.tsx` | 🟢 | `[x]` |
| T008 | Adicionar atalho "Feeds RSS" no menu lateral do dashboard em layout.tsx | T007 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[x]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Bateria de testes com tsx, validação estática tsc --noEmit e governança SDD | T003, T005, T007, T008 | - | `hupflow/` | 🟢 | `[x]` |

---

## Notas de execução

*(Será preenchido durante a execução pelo `/reversa-coding`)*

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
