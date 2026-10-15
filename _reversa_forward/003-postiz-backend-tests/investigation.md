# Investigação Técnica: Estrutura do AuthMiddleware e Testes

> Feature: `003-postiz-backend-tests`  
> Data: `2026-10-14`  

## 1. Análise Detalhada do `AuthMiddleware`

O middleware possui as seguintes dependências injetadas:
- `OrganizationService`: `getOrgsByUserId(userId)`, `getUserOrg(impersonateId)`
- `UsersService`: `getUserById(userId)`
- `AuthService.verifyJWT(token)`: método estático

E as seguintes regras internas:
1. `!auth` ➔ Lança `HttpForbiddenException` (403)
2. `AuthService.verifyJWT(auth)` retorna null ou sem `id` ➔ Lança `HttpForbiddenException` (403)
3. `getUserById(id)` retorna null ➔ Lança `HttpForbiddenException` (403)
4. `!user.activated` ➔ Lança `HttpForbiddenException` (403)
5. `user.isSuperAdmin && impersonate`:
   - se `getUserOrg(impersonate)` existir ➔ atribui `req.user = impersonate.user`, `req.org = impersonate.organization`, chama `next()`
6. Fluxo comum:
   - remove `user.password`
   - busca organizações via `getOrgsByUserId(user.id)`
   - filtra organizações com `!f.users[0].disabled`
   - se vazio ➔ lança `HttpForbiddenException` (403)
   - se `showorg` coincidir com alguma das organizações permitidas ➔ seleciona ela
   - senão ➔ seleciona a primeira da lista (`organization[0]`)
   - define `req.org = setOrg` e `req.user = user`
   - chama `next()`

## 2. Padrão de Mocking em NestJS

Utilizaremos mocks diretos das dependências para permitir execução limpa e determinística:
```ts
const mockOrganizationService = {
  getOrgsByUserId: jest.fn(),
  getUserOrg: jest.fn(),
};

const mockUsersService = {
  getUserById: jest.fn(),
};
```
E spy em `AuthService.verifyJWT`.
