# Plano de Ação — Feature 046: Conectores Oficiais & Agendador Nativo para TikTok & YouTube Shorts

## Checklist de Tarefas Clean-Room

- [x] **T001**: Definir modelos de dados em `hupflow/src/lib/vertical/types.ts` (`VerticalChannelType`, `VerticalPrivacyLevel`, `VerticalVideoPost`, `CreateVerticalPostInput`, `VerticalPublishSummary`).
- [x] **T002**: Adicionar tabela `vertical_video_posts` no schema Drizzle em `hupflow/src/lib/db/schema.ts`.
- [x] **T003**: Implementar motor de validação de mídia 9:16 (`validateVerticalMediaRequirements`), formatadores de payload de APIs oficiais e métricas da esteira com testes unitários em `hupflow/src/lib/vertical/vertical.test.ts`.
- [x] **T004**: Criar camada de serviço multi-tenant em `hupflow/src/lib/vertical/service.ts` com suporte Drizzle e fallback em memória pré-populado com vídeos de demonstração.
- [x] **T005**: Desenvolver rotas de API `/api/vertical` (GET, POST, PATCH, DELETE) e `/api/vertical/validate` com validação de RBAC (`requireOrgRole`).
- [x] **T006**: Construir componente interativo `hupflow/src/components/vertical/VerticalVideoPostCard.tsx` com miniatura 9:16, status de compliance e pré-visualização.
- [x] **T007**: Criar página do dashboard `/settings/vertical` em `hupflow/src/app/(dashboard)/settings/vertical/page.tsx` para agendamento de vídeos e estatísticas de alcance.
- [x] **T008**: Integrar link de navegação na barra lateral em `hupflow/src/app/(dashboard)/layout.tsx` (ícone `Clapperboard` com badge `Shorts`).
- [x] **T009**: Executar bateria de testes com `tsx` e typecheck estático rigoroso `tsc --noEmit`.
- [x] **T010**: Registrar sincronização no SDD (`_reversa_sdd/addenda/046-hupflow-tiktok-youtube-shorts-connectors.md`), atualizar `.reversa/state.json`, `active-requirements.json` e `SESSION_HANDOFF.md`.
