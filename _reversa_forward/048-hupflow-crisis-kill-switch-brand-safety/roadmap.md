# Roadmap de Implementação — Feature 048: Kill Switch & Brand Safety

- **Fase 1 (Modelos e Lógica Pura)**:
  - Definir tipos de dados em `src/lib/brandsafety/types.ts`.
  - Implementar regras de auditoria, filtros de palavras proibidas e prevenção de avalanche em `src/lib/brandsafety/brandsafety.test.ts`.
- **Fase 2 (Schema Drizzle & Persistência)**:
  - Adicionar tabelas `brandSafetySettings` e `crisisIncidentLogs` em `src/lib/db/schema.ts`.
  - Criar `src/lib/brandsafety/service.ts` com garantia de fallback em memória.
- **Fase 3 (Rotas de API com RBAC)**:
  - Criar `/api/brand-safety` (GET) e `/api/brand-safety/kill-switch` (POST).
- **Fase 4 (UI & Dashboard)**:
  - Criar componente `CrisisStatusBanner.tsx` e `CrisisIncidentCard.tsx`.
  - Construir página `/settings/kill-switch`.
  - Adicionar link na barra lateral do dashboard.
- **Fase 5 (Testes & Sincronização)**:
  - Executar suíte de testes `tsx` e compilação `tsc --noEmit`.
  - Registrar adendo SDD e atualizar handoff.
