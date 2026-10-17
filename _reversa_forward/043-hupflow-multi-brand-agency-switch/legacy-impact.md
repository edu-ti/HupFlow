# Impacto no Legado — Feature 043: Seletor Rápido & Workspace Switcher de Agência Multi-Marca

## Avaliação de Risco e Convivência

1. **Código Legado**:
   - Zero impacto. O sistema legado Typebot/Evolution API não possui conceito de orquestração multi-marca ou alternância instantânea com Command Palette.
   - Todo o código foi implementado de forma 100% isolada e Clean-Room dentro de `hupflow/src/lib/agency/`, `hupflow/src/components/agency/` e `hupflow/src/app/api/agency/`.

2. **Banco de Dados**:
   - Apenas uma nova tabela (`agency_brand_profiles`) foi declarada no Drizzle ORM (`hupflow/src/lib/db/schema.ts`).
   - Nenhuma tabela preexistente foi alterada estruturalmente. Todas as queries respeitam a chave estrangeira de `organizations.id` com `onDelete: 'cascade'`.

3. **Performance e Memória**:
   - A busca difusa e ordenação prioritária por favoritos são executadas em memória, garantindo tempos de resposta sub-milissegundo para digitação na Command Palette (`Cmd+K`).
