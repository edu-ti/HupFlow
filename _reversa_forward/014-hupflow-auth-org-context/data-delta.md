# Data Delta: Autenticação & Contexto de Organização

> Feature: `014-hupflow-auth-org-context`  
> Data: `2026-10-16`  

---

## 1. Resumo do Modelo de Dados

As tabelas de autenticação e multi-tenancy já estão criadas e tipadas no schema Drizzle em `hupflow/src/lib/db/schema.ts`. Nenhuma migration estrutural é necessária.

### Tabelas Utilizadas:
1. **`users`**: `id`, `name`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt`.
2. **`sessions`**: `id`, `userId`, `token`, `expiresAt`, `ipAddress`, `userAgent`.
3. **`organizations`**: `id`, `name`, `slug`, `logo`, `createdAt`.
4. **`members`**: `id`, `organizationId`, `userId`, `role`, `createdAt`.

---

## 2. Tipagens TypeScript Adicionadas

Em `hupflow/src/lib/auth/types.ts`:

```typescript
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  activeOrganizationId?: string | null;
}

export interface AuthContext {
  user: AuthUser;
  session: AuthSession;
  organizationId: string;
  organizationRole: 'owner' | 'admin' | 'member';
  isDevFallback?: boolean;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  role: string;
  isActive: boolean;
}
```
