# Legacy Impact: Planos de Assinatura, Faturamento & Integração Stripe

> Identificador: `017-hupflow-stripe-billing-subscriptions`  
> Data: `2026-10-16`  
> Política de edição: `allowLegacyEdits: true` (liberado em `allowedPaths: ["hupflow/**"]`)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/01-auth-multitenancy.md`, `_reversa_sdd/postiz-backend-api/contracts.md`)  
> Nota: Feature greenfield em ambiente clean-room, sem legado pré-existente.  

---

## 1. Mapeamento de Arquivos e Impacto

| Arquivo afetado | Componente SDD | Tipo | Severidade | Justificativa |
|-----------------|----------------|:----:|:----------:|---------------|
| `hupflow/src/lib/billing/types.ts` | `sdd/01-auth-multitenancy` | `componente-novo` | LOW | Tipos TypeScript de planos (Starter, Pro, Agency), limites e cotas. |
| `hupflow/src/lib/db/schema.ts` | `sdd/01-auth-multitenancy` | `modificado` | HIGH | Adição da tabela `subscriptions` com integridade referencial ao workspace. |
| `hupflow/src/lib/billing/plans.ts` | `sdd/01-auth-multitenancy` | `componente-novo` | MEDIUM | Definições de limites dos planos e validador de cota `checkResourceQuota`. |
| `hupflow/src/lib/billing/plans.test.ts` | `sdd/01-auth-multitenancy` | `componente-novo` | LOW | Testes unitários para validação de cotas e limites. |
| `hupflow/src/lib/billing/stripe.ts` | `sdd/01-auth-multitenancy` | `componente-novo` | HIGH | Cliente REST nativo para Checkout Sessions, Customer Portal e validação HMAC de Webhooks. |
| `hupflow/src/app/api/billing/subscription/route.ts` | `sdd/01-auth-multitenancy` | `componente-novo` | HIGH | Endpoint REST GET para consulta de assinatura ativa e consolidação de consumo. |
| `hupflow/src/app/api/billing/checkout/route.ts` | `sdd/01-auth-multitenancy` | `componente-novo` | HIGH | Endpoint REST POST para criação de checkout Stripe com modo sandbox dev. |
| `hupflow/src/app/api/billing/portal/route.ts` | `sdd/01-auth-multitenancy` | `componente-novo` | HIGH | Endpoint REST POST para acesso ao Stripe Customer Portal. |
| `hupflow/src/app/api/billing/webhook/route.ts` | `sdd/01-auth-multitenancy` | `componente-novo` | HIGH | Webhook listener para eventos `checkout.session.completed`, `customer.subscription.*`, etc. |
| `hupflow/src/app/(dashboard)/settings/billing/page.tsx` | `sdd/01-auth-multitenancy` | `componente-novo` | HIGH | Tela de faturamento com medidores visuais de cota, status do plano e checkout. |
| `hupflow/src/app/(dashboard)/layout.tsx` | `sdd/01-auth-multitenancy` | `modificado` | LOW | Inclusão do atalho "Planos & Faturamento" na barra lateral de navegação. |

---

## 2. Diff Conceitual por Componente

- **`sdd/01-auth-multitenancy`**:
  - Camada de billing & subscrições vinculada diretamente à organização do workspace.
  - Controle de capacidade em tempo real (contas sociais, assentos de membros, posts agendados e armazenamento).
  - Isolamento multi-tenant garantido em todas as rotas de cobrança e webhooks.

---

## 3. Preservadas

*(Feature greenfield em clean-room, nenhum código legado modificado)*

---

## 4. Modificadas

- Esquema Drizzle (`schema.ts`) estendido com a tabela `subscriptions`.
- Barra lateral do dashboard atualizada com link para `/settings/billing`.
