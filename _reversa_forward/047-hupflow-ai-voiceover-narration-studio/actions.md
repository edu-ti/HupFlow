# Plano de Ação — Feature 047: Estúdio de Narração e Text-to-Speech (TTS) com Vozes Neurais

## Checklist de Tarefas Clean-Room

- [x] **T001**: Definir modelos de dados em `hupflow/src/lib/voiceover/types.ts` (`VoiceGender`, `VoicePersona`, `VoiceProfile`, `VoiceoverTrackItem`, `CreateVoiceoverTrackInput`, `VoiceoverStudioMetrics`).
- [x] **T002**: Adicionar tabela `voiceover_tracks` no schema Drizzle em `hupflow/src/lib/db/schema.ts`.
- [x] **T003**: Implementar motor de cálculo de cadência e duração (`estimateSpeechDurationSeconds`, `calculatePacingWordsPerMinute`, `generateNeuralVoicePreset`, `summarizeVoiceoverPortfolio`) com testes unitários em `hupflow/src/lib/voiceover/voiceover.test.ts`.
- [x] **T004**: Criar camada de serviço multi-tenant em `hupflow/src/lib/voiceover/service.ts` com suporte Drizzle e fallback em memória pré-populado com faixas de demonstração e vozes em português.
- [x] **T005**: Desenvolver rotas de API `/api/voiceover` (GET, POST, PATCH, DELETE) e `/api/voiceover/voices` com validação de RBAC (`requireOrgRole`).
- [x] **T006**: Construir componente interativo `hupflow/src/components/voiceover/VoiceoverTrackCard.tsx` com visualizador de waveform, player de áudio e download.
- [x] **T007**: Criar página do dashboard `/settings/voiceover` em `hupflow/src/app/(dashboard)/settings/voiceover/page.tsx` para síntese e catálogo de narrações.
- [x] **T008**: Integrar link de navegação na barra lateral em `hupflow/src/app/(dashboard)/layout.tsx` (ícone `Mic` com badge `TTS`).
- [x] **T009**: Executar bateria de testes com `tsx` e typecheck estático rigoroso `tsc --noEmit`.
- [x] **T010**: Registrar sincronização no SDD (`_reversa_sdd/addenda/047-hupflow-ai-voiceover-narration-studio.md`), atualizar `.reversa/state.json`, `active-requirements.json` e `SESSION_HANDOFF.md`.
