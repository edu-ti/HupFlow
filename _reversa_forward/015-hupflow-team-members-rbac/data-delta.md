# Data Delta: Gestão de Membros, Convites & Papéis RBAC

> Identificador: `015-hupflow-team-members-rbac`  
> Data: `2026-10-16`  
> Âncora: `_reversa_sdd/erd-complete.md` + `hupflow/src/lib/db/schema.ts`  

---

## 1. Tabelas Existentes Envolvidas

### Tabela `members` (já presente em `schema.ts`)
```typescript
export const members = pgTable('members', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').notNull().default('member'), // owner | admin | member | viewer
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Tabela `invitations` (já presente em `schema.ts`)
```typescript
export const invitations = pgTable('invitations', {
  id: text('id').primaryKey(), // Usado como token de convite seguro
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('member'), // admin | member | viewer
  status: text('status').notNull().default('pending'), // pending | accepted | rejected | expired
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

## 2. Ajustes de Tipagem TypeScript

Em `hupflow/src/lib/auth/types.ts`:
- Expandir o tipo `OrgRole` para: `'owner' | 'admin' | 'member' | 'viewer'`.
- Adicionar tipos para membros (`OrganizationMemberSummary`), convites (`InvitationSummary`) e requisições de criação de convite (`CreateInvitationRequest`).

---

## 3. Índices Recomendados

Para otimização em alta concorrência:
- `idx_members_org_user`: `(organization_id, user_id)` (já garantido pela integridade de membros).
- `idx_invitations_org_status`: `(organization_id, status)` para listagem ágil de convites pendentes.
