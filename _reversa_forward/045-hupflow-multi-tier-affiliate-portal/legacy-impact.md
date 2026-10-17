# Impacto no Legado — Feature 045: Portal de Afiliados & Parcerias com Comissionamento Recorrente

## Avaliação de Risco e Convivência

1. **Código Legado**:
   - Zero impacto. O sistema legado Typebot/Evolution API não possui nenhum conceito de rastreamento de afiliados, links de indicação ou comissionamento recorrente de SaaS.
   - Todo o código foi implementado de forma 100% isolada e Clean-Room dentro de `hupflow/src/lib/affiliates/`, `hupflow/src/components/affiliates/` e `hupflow/src/app/api/affiliates/`.

2. **Banco de Dados**:
   - Duas novas tabelas (`affiliate_partners` e `affiliate_referrals`) foram declaradas no Drizzle ORM (`hupflow/src/lib/db/schema.ts`).
   - Nenhuma tabela preexistente foi alterada estruturalmente. Todas as queries respeitam a chave estrangeira de `organizations.id` com `onDelete: 'cascade'`.

3. **Performance e Memória**:
   - A camada de serviço suporta fallback em memória `Map`, garantindo que testes e simulações financeiras ocorram sem gargalos ou dependências externas.
