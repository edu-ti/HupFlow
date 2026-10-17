# Actions: AI Video Captions & Animated Subtitles Studio

> Identificador: `032-hupflow-ai-video-captions`  
> Data: `2026-10-17`  
> Roadmap: `_reversa_forward/032-hupflow-ai-video-captions/roadmap.md`  

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
| T001 | Definir tipos TypeScript para projetos de legendas, cues, presets e safe zones | - | `[//]` | `hupflow/src/lib/captions/types.ts` | 🟢 | `[x]` |
| T002 | Adicionar tabela video_caption_projects no schema Drizzle | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[x]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar motor temporal SRT/VTT, segmentador IA e bateria de testes unitários | T001 | - | `hupflow/src/lib/captions/captions.test.ts` | 🟢 | `[x]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar serviço de projetos de legendas com CRUD Drizzle e fallback em memória | T001, T002, T003 | - | `hupflow/src/lib/captions/service.ts` | 🟢 | `[x]` |
| T005 | Criar rotas REST /api/captions e /api/captions/export com RBAC | T001, T004 | - | `hupflow/src/app/api/captions/route.ts` & `export/route.ts` | 🟢 | `[x]` |

---

## Fase 4, Interface

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar simulador interativo 9:16 VideoCaptionPreview.tsx com timeline e safe zones | T001, T003 | `[//]` | `hupflow/src/components/captions/VideoCaptionPreview.tsx` | 🟢 | `[x]` |
| T007 | Criar página gerencial /settings/captions com editor de cues, presets e exportação SRT/VTT | T005, T006 | - | `hupflow/src/app/(dashboard)/settings/captions/page.tsx` | 🟢 | `[x]` |
| T008 | Adicionar atalho "Legendas & Vídeos" na barra lateral do dashboard | T007 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[x]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Executar bateria de testes tsx e verificação estática tsc --noEmit | T003, T005, T007, T008 | - | `hupflow/` | 🟢 | `[x]` |
| T010 | Documentar legacy-impact.md, regression-watch.md, adendo SDD 032 e SESSION_HANDOFF.md | T009 | - | `_reversa_forward/032-hupflow-ai-video-captions/` | 🟢 | `[x]` |
