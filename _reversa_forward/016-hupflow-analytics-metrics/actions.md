# Actions: Dashboard de Analytics & Métricas Sociais

> Identificador: `016-hupflow-analytics-metrics`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/016-hupflow-analytics-metrics/roadmap.md`  

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
| T001 | Definir tipagens TypeScript de métricas, séries temporais e KPIs em types.ts | - | `[//]` | `hupflow/src/lib/analytics/types.ts` | 🟢 | `[X]` |
| T002 | Adicionar tabela postAnalytics no esquema relacional Drizzle em schema.ts | - | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar suíte de testes unitários automatizados para calculadora e agregações | T001 | `[//]` | `hupflow/src/lib/analytics/calculator.test.ts` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar motor de cálculo de taxa de engajamento e gerador de séries em calculator.ts | T001 | - | `hupflow/src/lib/analytics/calculator.ts` | 🟢 | `[X]` |
| T005 | Implementar rota REST GET /api/analytics com filtros por período e canal | T001, T002, T004 | - | `hupflow/src/app/api/analytics/route.ts` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar componente de gráfico de área e linha em SVG puro AnalyticsAreaChart.tsx | T001 | `[//]` | `hupflow/src/components/analytics/AnalyticsAreaChart.tsx` | 🟢 | `[X]` |
| T007 | Criar tela /analytics no dashboard com KPI cards, gráficos e ranking de publicações | T005, T006 | - | `hupflow/src/app/(dashboard)/analytics/page.tsx` | 🟢 | `[X]` |
| T008 | Adicionar atalho "Métricas & Analytics" na barra lateral de navegação em layout.tsx | T007 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Executar suíte completa de testes com tsx e validação de compilação tsc --noEmit | T003, T005, T007, T008 | - | `hupflow/` | 🟢 | `[X]` |

---

## Notas de execução

- Todas as 9 ações atômicas da Feature 016 foram concluídas com sucesso.
- O modelo relacional `post_analytics` foi integrado ao Drizzle schema com integridade referencial.
- O motor de cálculo puro `calculator.ts` foi testado e validado cobrindo taxas de engajamento, conversão de base inteira e preenchimento de séries diárias.
- O endpoint `/api/analytics` foi implementado com filtros por período (`7d`, `30d`, `90d`) e por canal (`all`, `instagram`, `threads`, `linkedin`, `x`), protegido por RBAC.
- O componente `AnalyticsAreaChart.tsx` foi construído em SVG puro com gradientes vetoriais nativos e tooltips no hover, mantendo a diretriz Clean-Room sem dependências externas.
- A página `/analytics` foi entregue com 4 KPI cards, gráficos de área, barras de distribuição e ranking de melhores publicações.
- O atalho "Métricas & Analytics" foi inserido na barra lateral de navegação.
- Todos os testes unitários (`calculator.test.ts`, `rbac.test.ts`, `session.test.ts`, `validation.test.ts`) e o typecheck estático `tsc --noEmit` passaram com 100% de sucesso.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
