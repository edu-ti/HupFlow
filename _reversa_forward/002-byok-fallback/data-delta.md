# Delta de Modelo de Dados: Fallback BYOK

> Feature: `002-byok-fallback`  
> Data: `2026-10-14`  

## 1. Alterações de Banco de Dados

- **Prisma Schema**: Nenhuma alteração necessária.
- **Tabelas / Migrações**: Nenhuma.

## 2. Alterações de Estado e Contexto

- **KeysContext**: Utiliza o valor existente de `apiKey` provido por `KeysProvider`.
- Nenhuma nova estrutura de dados criada no servidor; lógica puramente no cliente.
