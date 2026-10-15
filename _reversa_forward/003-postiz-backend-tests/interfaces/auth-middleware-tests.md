# Contrato de Interface: Suíte de Testes do AuthMiddleware

> Feature: `003-postiz-backend-tests`  
> Localização: `postiz-app-main/apps/backend/src/services/auth/auth.middleware.spec.ts`  

## 1. Mapeamento de Testes Unitários

| Grupo de Teste | Caso de Teste | Entrada Simulada | Saída Esperada |
|----------------|---------------|------------------|----------------|
| **Bloqueio de Não Autenticados** | Sem cabeçalho ou cookie `auth` | `headers = {}`, `cookies = {}` | Lança `HttpForbiddenException` |
| **Integridade de Token** | Token JWT adulterado ou payload sem `id` | `verifyJWT` retorna `null` | Lança `HttpForbiddenException` |
| **Status da Conta** | Usuário inexistente no banco | `getUserById` retorna `null` | Lança `HttpForbiddenException` |
| **Status da Conta** | Usuário desativado | `user.activated = false` | Lança `HttpForbiddenException` |
| **Vínculo Multi-tenant** | Usuário desvinculado de todas as orgs | `getOrgsByUserId` retorna lista vazia | Lança `HttpForbiddenException` |
| **Isolamento de Tenant** | Seleção padrão de organização | Usuário com Org 1 e Org 2 | `req.org.id = 'org-1'`, `next()` chamado |
| **Isolamento de Tenant** | Seleção via `showorg` válido | `showorg = 'org-2'` | `req.org.id = 'org-2'`, `next()` chamado |
| **Proteção de Tenant** | Tentativa de `showorg` inválido (outra org) | `showorg = 'org-alheia'` | `req.org.id = 'org-1'`, `next()` chamado |
| **Impersonação Admin** | SuperAdmin com `impersonate` | `isSuperAdmin = true`, cookie `impersonate` | `req.user` e `req.org` da conta impersonada |
