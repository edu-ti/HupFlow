# Investigação Técnica: Segurança Multi-Tenant & Resolução de Sessão Better-Auth

> Feature: `014-hupflow-auth-org-context`  
> Data: `2026-10-16`  

---

## 1. O Problema: Vulnerabilidade BOLA (Broken Object Level Authorization)

Nas rotas implementadas inicialmente, o `organizationId` era recebido diretamente pelo corpo da requisição (`req.body`) ou por parâmetros de URL (`?organizationId=...`), com um fallback inseguro para `'org_default'`.
Isso constitui uma falha clássica de segurança (OWASP API Security Top 1 - BOLA):
- Um usuário da Organização A poderia disparar um `POST /api/media/presign` enviando `organizationId: "org_b"`, fazendo upload direto no bucket com o prefixo da Organização B.
- Um usuário malicioso poderia chamar `DELETE /api/media?id=med_xyz` e apagar mídias de qualquer tenant, pois o comando SQL não filtrava pelo `organizationId` da sessão do solicitante.
- Rotas caras de IA (`/api/ai/carousel` e `/api/ai/copywriter`) podiam ser invocadas sem autenticação, gerando consumo indevido de tokens de LLM.

---

## 2. A Solução Canônica: `getAuthContext(req)`

Em vez de confiar no cliente, criamos um resolvedor único no servidor:

```
[ Cliente HTTP ]
       │  (Cookie de Sessão / Bearer Token)
       ▼
[ Next.js Route Handler ]
       │
       ▼
[ getAuthContext(req) ]
       │── 1. Chama `auth.api.getSession({ headers })`
       │── 2. Se não autenticado e em produção: lança 401 Unauthorized
       │── 3. Se não autenticado e em modo desenvolvimento: resolve fallback controlado
       │── 4. Obtém o `organizationId` ativo validando a associação em `members`
       ▼
{ user, session, organizationId, organizationRole }
```

---

## 3. Isolamento Estrito em Queries Drizzle ORM

Toda query deve conter a verificação obrigatória de tenant:

```typescript
// Exemplo Seguro de Deleção:
await db.delete(media).where(
  and(
    eq(media.id, mediaId),
    eq(media.organizationId, authContext.organizationId) // Filtro estrito
  )
);
```

Se o `mediaId` existir mas pertencer a outra organização, a query afeta 0 linhas e a API retorna `404 Not Found` ou `403 Forbidden`, prevenindo completamente acessos cruzados.

---

## 4. Estratégia de Fallback para Desenvolvimento Local & Offline

Para garantir que desenvolvedores e suítes de testes automatizados não fiquem travados quando o PostgreSQL ou cookies de produção não estiverem presentes:
- Quando `process.env.NODE_ENV === 'development'` e não houver cookie de sessão válido:
  - `getAuthContext` emite um aviso no console e fornece um `AuthContext` padrão com `organizationId: 'org_default'`, `isDevFallback: true`.
- Em produção (`NODE_ENV === 'production'`), nenhuma requisição não autenticada passa pelo filtro.
