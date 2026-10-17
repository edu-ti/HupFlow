# Especificação de Interface: Autenticação & Contexto de Organização

> Feature: `014-hupflow-auth-org-context`  
> Contrato: Better-Auth Client & Session Resolver  
> Data: `2026-10-16`  
> Protocolo: HTTPS / REST & Cookies HttpOnly  

---

## 1. Visão Geral

Este contrato formaliza a interface de resolução de sessão segura no backend (`getAuthContext`) e os contratos de consumo de autenticação e seleção de organização no frontend.

---

## 2. Helper de Backend: `getAuthContext(req)`

### 2.1 Assinatura
```typescript
export async function getAuthContext(
  req: Request | Headers
): Promise<AuthContext | null>;
```

### 2.2 Estrutura do `AuthContext`
```typescript
export interface AuthContext {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    activeOrganizationId?: string | null;
  };
  organizationId: string;
  organizationRole: 'owner' | 'admin' | 'member';
  isDevFallback?: boolean;
}
```

### 2.3 Respostas e Fluxo de Erro
- Se a sessão for válida e o usuário pertencer à organização: retorna objeto `AuthContext`.
- Se a sessão for ausente ou inválida em ambiente de produção: retorna `null` (ou `requireAuthContext` retorna `NextResponse.json({ error: 'Não autenticado' }, { status: 401 })`).
- Se o usuário tentar acessar uma organização na qual não é membro: retorna HTTP `403 Forbidden` (`{ error: 'Acesso negado à organização especificada.' }`).

---

## 3. Rotas de Autenticação Better-Auth (`/api/auth/*`)

As rotas canônicas são providas nativamente pelo handler Better-Auth:
- `POST /api/auth/sign-in/email`: `{ email, password }` ➔ Define cookie de sessão `better-auth.session_token`.
- `POST /api/auth/sign-up/email`: `{ name, email, password }` ➔ Cria usuário, gera organização inicial e define sessão.
- `POST /api/auth/sign-out`: Invalida a sessão e limpa cookies.
- `GET /api/auth/organization/list`: Retorna as organizações das quais o usuário é membro.
- `POST /api/auth/organization/set-active`: `{ organizationId }` ➔ Atualiza a organização ativa da sessão.

---

## 4. Rotas Protegidas Atualizadas

Todas as rotas abaixo passam a invocar `requireAuthContext(req)`:
1. `POST /api/media/presign`: extrai `organizationId = authContext.organizationId`.
2. `POST /api/media/confirm`: persiste mídia associada a `authContext.organizationId`.
3. `GET /api/media`: filtra onde `media.organizationId === authContext.organizationId`.
4. `DELETE /api/media`: remove apenas se `and(eq(media.id, id), eq(media.organizationId, authContext.organizationId))`.
5. `POST /api/ai/carousel`: requer autenticação ativa.
6. `POST /api/ai/copywriter`: requer autenticação ativa.
