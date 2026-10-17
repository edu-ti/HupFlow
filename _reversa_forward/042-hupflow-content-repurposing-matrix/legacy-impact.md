# Impacto no Legado — Feature 042: Matriz de Reaproveitamento Multi-Formato IA

## Avaliação de Risco e Convivência

1. **Código Legado**:
   - Zero impacto. O sistema legado Typebot/Evolution API não possui conceito de orquestração omnicanal ou repurposing multiformato nativo.
   - Todo o código foi implementado de forma 100% isolada e Clean-Room dentro do diretório `hupflow/src/lib/repurpose/` e `hupflow/src/app/api/repurpose/`.

2. **Banco de Dados**:
   - Apenas uma nova tabela (`contentRepurposingKits`) foi declarada no Drizzle ORM (`hupflow/src/lib/db/schema.ts`).
   - Nenhuma tabela preexistente foi alterada estruturalmente. Todas as queries respeitam a chave estrangeira de `organizations.id` com `onDelete: 'cascade'`.

3. **Performance e Memória**:
   - Fallback em memória ativado graciosamente caso a instância PostgreSQL não esteja conectada, permitindo inicialização ágil e modo de demonstração autônomo sem acoplamentos de infraestrutura.
