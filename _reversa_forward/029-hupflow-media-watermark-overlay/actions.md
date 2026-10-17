# Actions: Marca d'Água (Watermark Overlay) & Selos Corporativos

> Identificador: `029-hupflow-media-watermark-overlay`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/029-hupflow-media-watermark-overlay/roadmap.md`  

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
| T001 | Definir contratos TypeScript para posições, tipos, estilos e configurações em types.ts | - | `[//]` | `hupflow/src/lib/watermark/types.ts` | 🟢 | `[x]` |
| T002 | Adicionar tabela watermark_settings no schema.ts do Drizzle ORM | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[x]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para cálculo geométrico de posições, margens e opacidade | T001 | - | `hupflow/src/lib/watermark/watermark.test.ts` | 🟢 | `[x]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar o motor de cálculo geométrico e serviço com integração ao Brand Kit | T001, T002 | - | `hupflow/src/lib/watermark/service.ts` | 🟢 | `[x]` |
| T005 | Criar rota REST /api/watermark (GET, POST) com RBAC | T001, T004 | - | `hupflow/src/app/api/watermark/route.ts` | 🟢 | `[x]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar componente de preview em tempo real WatermarkPreviewCard.tsx | T001 | `[//]` | `hupflow/src/components/watermark/WatermarkPreviewCard.tsx` | 🟢 | `[x]` |
| T007 | Criar tela /settings/watermark para gestão e customização do selo de marca | T005, T006 | - | `hupflow/src/app/(dashboard)/settings/watermark/page.tsx` | 🟢 | `[x]` |
| T008 | Adicionar atalho "Marca d'Água" no menu lateral do dashboard em layout.tsx | T007 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[x]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Bateria de testes com tsx, validação estática tsc --noEmit e governança SDD | T003, T005, T007, T008 | - | `hupflow/` | 🟢 | `[x]` |

---

## Notas de execução

- **T001**: Contratos TypeScript estritos definidos com `WatermarkPosition`, `WatermarkType`, `WatermarkSettings`, `UpdateWatermarkSettingsInput`, `WatermarkCoordinates`.
- **T002**: Tabela `watermark_settings` no Drizzle ORM com restrição única por `organization_id` e cascade delete.
- **T003**: Testes unitários validando cálculo nos 5 quadrantes, clamping anti-transbordo e sanitização operacional (100% de sucesso via `npx tsx`).
- **T004**: Motor geométrico puro `calculateWatermarkCoordinates` e serviço integrado ao Brand Kit.
- **T005**: Rotas RESTful `/api/watermark` (GET, POST) com validação de papéis RBAC.
- **T006**: Componente `WatermarkPreviewCard` com simulação em tempo real para proporções 1:1 e 9:16.
- **T007**: Painel visual `/settings/watermark` com seletores interativos em grade 3x3, sliders de ajuste e toggle de automação.
- **T008**: Adicionado atalho "Marca d'Água" no menu lateral do dashboard em `layout.tsx` com ícone `Stamp`.
- **T009**: Compilação TypeScript com `tsc --noEmit` resultando em zero erros; adendo SDD e relatórios de conformidade finalizados.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
| 2026-10-16 | Conclusão e entrega de todas as 9 ações (T001-T009) | reversa-coding |
