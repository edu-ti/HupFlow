# Legacy Impact: Dashboard de Analytics & Métricas Sociais

> Identificador: `016-hupflow-analytics-metrics`  
> Data: `2026-10-16`  
> Política de edição: `allowLegacyEdits: true` (liberado em `allowedPaths: ["hupflow/**"]`)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/05-scheduler-engine.md`, `_reversa_sdd/postiz-backend-api/contracts.md`)  
> Nota: Feature greenfield em ambiente clean-room, sem legado pré-existente.  

---

## 1. Mapeamento de Arquivos e Impacto

| Arquivo afetado | Componente SDD | Tipo | Severidade | Justificativa |
|-----------------|----------------|:----:|:----------:|---------------|
| `hupflow/src/lib/analytics/types.ts` | `sdd/05-scheduler-engine` | `componente-novo` | LOW | Tipos TypeScript de KPIs, séries temporais e respostas de analytics. |
| `hupflow/src/lib/db/schema.ts` | `sdd/05-scheduler-engine` | `modificado` | HIGH | Adição da tabela `post_analytics` com integridade referencial em cascata. |
| `hupflow/src/lib/analytics/calculator.ts` | `sdd/05-scheduler-engine` | `componente-novo` | MEDIUM | Motor de cálculos de engajamento, agregação de séries e fallback demonstrativo. |
| `hupflow/src/lib/analytics/calculator.test.ts` | `sdd/05-scheduler-engine` | `componente-novo` | LOW | Testes unitários cobrindo taxas de engajamento e preenchimento de datas. |
| `hupflow/src/app/api/analytics/route.ts` | `sdd/05-scheduler-engine` | `componente-novo` | HIGH | Endpoint REST GET blindado para consulta e agregação multi-canal. |
| `hupflow/src/components/analytics/AnalyticsAreaChart.tsx` | `sdd/05-scheduler-engine` | `componente-novo` | HIGH | Gráfico vetorial em SVG nativo com gradientes e tooltips interativos. |
| `hupflow/src/app/(dashboard)/analytics/page.tsx` | `sdd/05-scheduler-engine` | `componente-novo` | HIGH | Interface completa de métricas sociais em Dark Mode com filtros por período e canal. |
| `hupflow/src/app/(dashboard)/layout.tsx` | `sdd/05-scheduler-engine` | `modificado` | LOW | Inclusão do atalho "Métricas & Analytics" na barra lateral de navegação. |

---

## 2. Diff Conceitual por Componente

- **`sdd/05-scheduler-engine`**:
  - Camada de consolidação e telemetria pós-publicação ativada.
  - Métricas agregadas por canal sem dependências de pacotes externos pesados (Chart.js / Recharts).
  - Isolamento multi-tenant garantido em todas as agregações de performance social.

---

## 3. Preservadas

*(Feature greenfield em clean-room, nenhum código legado modificado)*

---

## 4. Modificadas

- Esquema Drizzle (`schema.ts`) estendido com a tabela `post_analytics`.
- Barra lateral do dashboard atualizada com link para `/analytics`.
