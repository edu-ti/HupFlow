# Roadmap — Feature 043: Seletor Rápido & Workspace Switcher de Agência Multi-Marca

1. **Fase 1: Domínio e Tipagem** (T001, T002)
   - Criação de tipos TypeScript em `src/lib/agency/types.ts`.
   - Adição da tabela `agency_brand_profiles` no schema Drizzle.

2. **Fase 2: Motor de Busca Difusa e Estatísticas de Carteira** (T003)
   - Algoritmo determinístico de busca fuzzy por nome, tag e nicho.
   - Cálculo de métricas consolidadas da agência (canais totais, taxa de ocupação da fila).
   - Testes unitários com `npx tsx`.

3. **Fase 3: Camada de Serviço e Rotas de API** (T004, T005)
   - Serviço multi-tenant com fallback em memória `Map` pré-populado com clientes reais de demonstração.
   - Rotas de API `/api/agency/brands` e `/api/agency/switch`.

4. **Fase 4: Componente Command Palette e Telas** (T006, T007, T008)
   - Componente `AgencyBrandSwitcherModal.tsx` com atalho global `Cmd+K` / `Ctrl+K`.
   - Página `/settings/brands` para gerenciamento da carteira de marcas da agência.
   - Atualização do menu lateral e cabeçalho para integração fluida.

5. **Fase 5: Verificação e Sincronização** (T009, T010)
   - Execução de testes unitários e `tsc --noEmit`.
   - Sincronização SDD e artefatos Reversa.
