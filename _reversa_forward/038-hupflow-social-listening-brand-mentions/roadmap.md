# Roadmap: 038-hupflow-social-listening-brand-mentions

1. **Fase 1 — Contratos & Schema Drizzle**:
   - Criar `hupflow/src/lib/listening/types.ts` com contratos de sinal de Social Listening, análise de sentimento/urgência, playbook estratégico e sumário de saúde da marca.
   - Adicionar tabela `socialListeningMentions` em `hupflow/src/lib/db/schema.ts`.
2. **Fase 2 — Motor de Sentimento, Urgência de RP & Playbook IA (TDD)**:
   - Criar `hupflow/src/lib/listening/listening.test.ts` com funções determinísticas (`analyzeMentionSignal`, `generateStrategicResponsePlaybook`, `evaluateBrandHealthAndCrisisRadar`) e 5 suítes de testes unitários.
3. **Fase 3 — Camada de Serviço Multi-Tenant**:
   - Criar `hupflow/src/lib/listening/service.ts` com persistência Drizzle + fallback em memória pré-populado com 4 sinais estratégicos.
4. **Fase 4 — Rotas de API REST & RBAC**:
   - Criar `hupflow/src/app/api/listening/route.ts` (`GET`, `POST`) e `hupflow/src/app/api/listening/action/route.ts` (`POST`).
5. **Fase 5 — Componentes Visuais & Navegação**:
   - Criar `hupflow/src/components/listening/ListeningMentionCard.tsx`, página `hupflow/src/app/(dashboard)/settings/listening/page.tsx` e link na sidebar em `hupflow/src/app/(dashboard)/layout.tsx`.
6. **Fase 6 — Validação & SDD Sync**:
   - Rodar testes unitários (`npx tsx src/lib/listening/listening.test.ts`) e `npx tsc --noEmit`.
   - Atualizar artefatos Reversa e `_reversa_sdd/addenda/038-hupflow-social-listening-brand-mentions.md`.
