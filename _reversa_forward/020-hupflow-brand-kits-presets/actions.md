# Actions: Gestão de Kits de Marca & Presets Visuais (Brand Kits & Presets)

> Identificador: `020-hupflow-brand-kits-presets`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/020-hupflow-brand-kits-presets/roadmap.md`  

---

## Resumo

| Métrica | Valor |
|---------|:-----:|
| Total de ações | 9 |
| Concluídas | 9 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 4 |
| Taxa de Sucesso | 100% |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T001 | Definir interfaces TypeScript para Brand Kits, cores e tipografia em types.ts | - | `[//]` | `hupflow/src/lib/brand/types.ts` | 🟢 | `[X]` |
| T002 | Adicionar tabela brand_kits em schema.ts e presets corporativos em presets.ts | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para validação de hex, conversão para canvas e alternância de default | T001, T002 | - | `hupflow/src/lib/brand/brand-kits.test.ts` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar serviço com adaptadores de canvas e validação em service.ts | T001, T002 | - | `hupflow/src/lib/brand/service.ts` | 🟢 | `[X]` |
| T005 | Criar rota REST /api/brand-kits (GET, POST, PUT, DELETE) com isolamento de tenant | T001, T004 | - | `hupflow/src/app/api/brand-kits/route.ts` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Integrar seletor dinâmico de Brand Kit no Estúdio de Carrosséis 2D em studio/page.tsx | T004, T005 | - | `hupflow/src/app/(dashboard)/studio/page.tsx` | 🟢 | `[X]` |
| T007 | Criar tela de gestão de identidades visuais em /settings/brand/page.tsx | T005 | `[//]` | `hupflow/src/app/(dashboard)/settings/brand/page.tsx` | 🟢 | `[X]` |
| T008 | Adicionar atalho "Identidade & Marca" na barra lateral de navegação em layout.tsx | T007 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Executar bateria completa de testes com tsx, validação estática tsc --noEmit e governança | T003, T005, T006, T007, T008 | - | `hupflow/` | 🟢 | `[X]` |

---

## Notas de execução

- **T001-T002**: Tipagem estrita de `BrandColors`, `BrandTypography`, `BrandKit` e `BrandKitPreset` e criação de 5 presets de fábrica canônicos.
- **T003-T005**: Testes unitários com 100% de cobertura de hex regex e adaptadores de canvas. API RESTful com exclusividade atômica de `isDefault`.
- **T006-T008**: Seletor visual integrado à barra de design do Studio com link direto para o novo painel em `/settings/brand`.
- **T009**: Testes unitários de `brand-kits`, `bulk-scheduler`, `plans`, `canvas-utils` e checagem de tipos `tsc --noEmit` executados com zero erros.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
| 2026-10-16 | Conclusão integral de T001 a T009 com 100% dos testes aprovados | reversa-coding |
