# Actions: Smart Link-in-Bio Multi-Link & Showcase

> Identificador: `031-hupflow-smart-link-in-bio`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/031-hupflow-smart-link-in-bio/roadmap.md`  

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
| T001 | Definir tipos TypeScript para perfis de bio, links, temas e eventos | - | `[//]` | `hupflow/src/lib/bio/types.ts` | 🟢 | `[x]` |
| T002 | Adicionar tabelas bio_profiles, bio_links e bio_clicks no schema Drizzle | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[x]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para validação de handles, temas, CTR e ordenação | T001 | - | `hupflow/src/lib/bio/bio.test.ts` | 🟢 | `[x]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar serviço com operações de CRUD, resolução pública e telemetria | T001, T002 | - | `hupflow/src/lib/bio/service.ts` | 🟢 | `[x]` |
| T005 | Criar rotas /api/bio, /api/bio/public/[handle] e /api/bio/click | T001, T004 | - | `hupflow/src/app/api/bio/route.ts` & rotas públicas | 🟢 | `[x]` |

---

## Fase 4, Interface

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar componente simulador mobile BioPhonePreview.tsx com preview ao vivo | T001 | `[//]` | `hupflow/src/components/bio/BioPhonePreview.tsx` | 🟢 | `[x]` |
| T007 | Criar tela gerencial /settings/bio com abas de links, temas, vitrine e métricas | T005, T006 | - | `hupflow/src/app/(dashboard)/settings/bio/page.tsx` | 🟢 | `[x]` |
| T008 | Criar página pública responsiva /bio/[handle] sem exigência de login | T004, T005 | - | `hupflow/src/app/bio/[handle]/page.tsx` | 🟢 | `[x]` |
| T009 | Adicionar atalho "Link na Bio" na navegação lateral em layout.tsx | T007 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[x]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T010 | Bateria de testes com tsx, validação estática tsc --noEmit e governança SDD | T003, T005, T007, T008, T009 | - | `hupflow/` | 🟢 | `[x]` |
