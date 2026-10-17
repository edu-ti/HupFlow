# Data Delta: Planos de Assinatura, Faturamento & Integração Stripe

> Identificador: `017-hupflow-stripe-billing-subscriptions`  
> Data: `2026-10-16`  
> Âncora: `_reversa_sdd/erd-complete.md` + `hupflow/src/lib/db/schema.ts`  

---

## 1. Nova Tabela no Drizzle ORM (`subscriptions`)

```typescript
export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripePriceId: text('stripe_price_id'),
  plan: text('plan').notNull().default('starter'), // starter | pro | agency
  status: text('status').notNull().default('active'), // active | trialing | past_due | canceled
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

---

## 2. Relações e Integridade

- `organizationId` é `unique()` e possui `onDelete: 'cascade'`: cada workspace possui exatamente uma assinatura associada e a exclusão da organização limpa o registro de assinatura.
- `stripeSubscriptionId` possui restrição de unicidade para evitar associações duplicadas a partir de webhooks.

---

## 3. Tipagens em `hupflow/src/lib/billing/types.ts`

- `PlanTier`: `'starter' | 'pro' | 'agency'`.
- `SubscriptionStatus`: `'active' | 'trialing' | 'past_due' | 'canceled'`.
- `PlanLimits`: `maxSocialAccounts`, `maxTeamMembers`, `maxPostsPerMonth`, `maxStorageBytes`, `hasAiCopywriter`, `hasVectorPdfExport`.
- `SubscriptionSummary`: Detalhes da assinatura, plano, status e datas de faturamento.
- `UsageSummary`: Contagens atuais de contas, membros, posts do mês e armazenamento em bytes.
