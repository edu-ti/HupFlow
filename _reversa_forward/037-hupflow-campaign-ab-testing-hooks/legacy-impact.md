# Legacy Impact: 037-hupflow-campaign-ab-testing-hooks

## Conformidade Clean-Room & Política `.reversa/reversa-config.json`
- **Política Ativa**: `allowLegacyEdits: true`, `allowedPaths: ["hupflow/**"]`.
- **Arquivos Modificados**:
  - `hupflow/src/lib/db/schema.ts` (adição da tabela `abTestExperiments`)
  - `hupflow/src/app/(dashboard)/layout.tsx` (adição do item de navegação `Testes A/B & Hooks`)
- **Arquivos Criados**:
  - `hupflow/src/lib/ab-testing/types.ts`
  - `hupflow/src/lib/ab-testing/ab-testing.test.ts`
  - `hupflow/src/lib/ab-testing/service.ts`
  - `hupflow/src/app/api/ab-tests/route.ts`
  - `hupflow/src/app/api/ab-tests/simulate/route.ts`
  - `hupflow/src/components/ab-testing/AbExperimentCard.tsx`
  - `hupflow/src/app/(dashboard)/settings/ab-testing/page.tsx`
- **Impacto em Código Legado Externo**: Zero. Nenhum arquivo fora de `hupflow/**` e das pastas do Reversa foi tocado. Zero dependências AGPL ou bibliotecas proprietárias introduzidas.
