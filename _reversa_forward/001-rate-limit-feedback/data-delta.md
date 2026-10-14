# Delta de Modelo de Dados: Gestão de Rate Limit

> Feature: `001-rate-limit-feedback`  
> Data: `2026-10-14`  

## 1. Alterações no Banco de Dados

- **Prisma Schema**: Nenhuma alteração necessária.
- **Tabelas Afetadas**: Nenhuma.
- **Migrações**: Nenhuma migração de banco exigida.

## 2. Alterações de Estruturas em Memória e Transporte

### Novo Tipo: `GenerateCarouselResult`
Localização: `carousel-generator-main/src/app/actions.tsx`
- Tipo união discriminada para o retorno assíncrono da Server Action.
- Preserva a tipagem do schema `UnstyledDocument` para o caso de sucesso.
- Estrutura de falha carrega `reason`, `message` e opcionais `reset` e `remaining`.
