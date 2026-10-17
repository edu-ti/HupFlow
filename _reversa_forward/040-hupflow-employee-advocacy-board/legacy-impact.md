# Legacy Impact: 040-hupflow-employee-advocacy-board

## Conformidade Clean-Room & Política `.reversa/reversa-config.json`
- **Política Ativa**: `allowLegacyEdits: true`, `allowedPaths: ["hupflow/**"]`.
- **Arquivos Modificados**:
  - `hupflow/src/lib/db/schema.ts` (adição da tabela `advocacyCampaigns`)
  - `hupflow/src/app/(dashboard)/layout.tsx` (adição do item de navegação `Employee Advocacy`)
- **Arquivos Criados**:
  - `hupflow/src/lib/advocacy/types.ts`
  - `hupflow/src/lib/advocacy/advocacy.test.ts`
  - `hupflow/src/lib/advocacy/service.ts`
  - `hupflow/src/app/api/advocacy/route.ts`
  - `hupflow/src/app/api/advocacy/share/route.ts`
  - `hupflow/src/components/advocacy/AdvocacyCampaignCard.tsx`
  - `hupflow/src/app/(dashboard)/settings/advocacy/page.tsx`
- **Impacto em Código Legado Externo**: Zero. Nenhum arquivo fora de `hupflow/**` e das pastas do Reversa foi tocado. Zero dependências AGPL ou bibliotecas proprietárias introduzidas.
