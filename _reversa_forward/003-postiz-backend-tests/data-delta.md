# Delta de Modelo de Dados: Testes Unitários de Autenticação

> Feature: `003-postiz-backend-tests`  
> Data: `2026-10-14`  

## 1. Alterações no Banco de Dados

- **Prisma Schema**: Nenhuma alteração.
- **Tabelas / Migrações**: Nenhuma migração.

## 2. Dados de Teste em Memória

Criação de fixtures de teste para:
- `mockUser`: usuário com campos `id`, `email`, `activated`, `isSuperAdmin`, `password`
- `mockOrg`: organização com campos `id`, `name`, `paymentId`, `users: [{ userId, disabled }]`
