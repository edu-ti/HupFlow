# Roadmap de Implementação — Feature 050: Produção & Docker

- **Fase 1 (Arquivos de Infraestrutura Docker)**:
  - Criar `hupflow/Dockerfile` (Multi-stage build).
  - Criar `hupflow/docker-compose.yml` (App, PostgreSQL 16, Redis 7, MinIO).
  - Criar `hupflow/.dockerignore` e `hupflow/.env.example`.
- **Fase 2 (Modelos de Saúde & Diagnóstico)**:
  - Definir tipos em `src/lib/system/types.ts`.
  - Implementar lógica pura de diagnóstico e métricas em `src/lib/system/system.test.ts`.
- **Fase 3 (Rotas de API de Healthcheck)**:
  - Criar `/api/health` e `/api/system/status`.
- **Fase 4 (UI & Dashboard de System Health)**:
  - Criar componente `SystemHealthCard.tsx`.
  - Construir página `/settings/system-health`.
  - Adicionar link na barra lateral do layout do dashboard (ícone `Server` ou `Activity` com badge `50/50`).
- **Fase 5 (Testes, Validação Final dos 50 Módulos & Sincronização)**:
  - Executar suíte de testes `tsx` e compilação `tsc --noEmit`.
  - Registrar adendo SDD final e consolidar o `SESSION_HANDOFF.md` com o marco das 50 features concluídas.
