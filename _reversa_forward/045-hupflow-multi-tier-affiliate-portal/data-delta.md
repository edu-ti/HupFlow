# Delta de Dados — Feature 045: Portal de Afiliados & Parcerias com Comissionamento Recorrente

## Novas Tabelas no Drizzle ORM

```typescript
export const affiliatePartners = pgTable('affiliate_partners', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  referralCode: text('referral_code').notNull(),
  tier: text('tier').default('bronze').notNull(),
  commissionPct: integer('commission_pct').default(20).notNull(),
  totalReferredCustomers: integer('total_referred_customers').default(0).notNull(),
  activeCustomersCount: integer('active_customers_count').default(0).notNull(),
  monthlyRecurringRevenueBrl: integer('monthly_recurring_revenue_brl').default(0).notNull(),
  totalEarningsBrl: integer('total_earnings_brl').default(0).notNull(),
  availableBalanceBrl: integer('available_balance_brl').default(0).notNull(),
  payoutMethod: text('payout_method').default('pix').notNull(),
  payoutKey: text('payout_key').notNull(),
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const affiliateReferrals = pgTable('affiliate_referrals', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  partnerId: text('partner_id')
    .references(() => affiliatePartners.id, { onDelete: 'cascade' })
    .notNull(),
  customerEmail: text('customer_email').notNull(),
  planName: text('plan_name').notNull(),
  planAmountBrl: integer('plan_amount_brl').notNull(),
  commissionAmountBrl: integer('commission_amount_brl').notNull(),
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```
