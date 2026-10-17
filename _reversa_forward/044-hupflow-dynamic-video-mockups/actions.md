# Plano de Ação — Feature 044: Gerador de Mockups Dinâmicos de Vídeo & Dispositivos

## Checklist de Tarefas Clean-Room

- [x] **T001**: Criar modelo de tipos em `hupflow/src/lib/mockups/types.ts` (`DeviceType`, `DeviceOrientation`, `MockupTheme`, `DeviceMockupItem`, `CreateMockupInput`, `MockupSummaryMetrics`).
- [x] **T002**: Adicionar tabela `device_mockups` no schema Drizzle em `hupflow/src/lib/db/schema.ts`.
- [x] **T003**: Implementar gerador de geometria de molduras e viewports vetoriais (`generateDeviceSvgFrame`, `calculateDeviceViewports`, `summarizeMockupsPortfolio`) com testes unitários em `hupflow/src/lib/mockups/mockups.test.ts`.
- [x] **T004**: Criar camada de serviço multi-tenant em `hupflow/src/lib/mockups/service.ts` com suporte Drizzle e fallback em memória pré-populado com presets para iPhone 16 Pro, iPad Pro e MacBook.
- [x] **T005**: Desenvolver rotas de API `/api/mockups` (GET, POST, PATCH, DELETE) e `/api/mockups/export` com validação de RBAC (`requireOrgRole`).
- [x] **T006**: Construir componente interativo `hupflow/src/components/mockups/DeviceMockupPreview.tsx` com moldura vetorial precisa, Dynamic Island, suporte a vídeo/imagem e perspectiva 3D.
- [x] **T007**: Criar página do dashboard `/settings/mockups` em `hupflow/src/app/(dashboard)/settings/mockups/page.tsx` para estúdio de criativos e galeria de mockups.
- [x] **T008**: Integrar link de navegação na barra lateral em `hupflow/src/app/(dashboard)/layout.tsx` (ícone `Smartphone` com badge `3D`).
- [x] **T009**: Executar bateria de testes com `tsx` e typecheck estático rigoroso `tsc --noEmit`.
- [x] **T010**: Registrar sincronização no SDD (`_reversa_sdd/addenda/044-hupflow-dynamic-video-mockups.md`), atualizar `.reversa/state.json`, `active-requirements.json` e `SESSION_HANDOFF.md`.
