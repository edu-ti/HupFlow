# Roadmap — Feature 047: Estúdio de Narração e Text-to-Speech (TTS) com Vozes Neurais

1. **Fase 1: Tipos & Schema** (T001, T002)
   - Modelos TypeScript em `hupflow/src/lib/voiceover/types.ts`.
   - Adição da tabela `voiceover_tracks` no Drizzle ORM.

2. **Fase 2: Motor de Cadência e Estimativa de Áudio** (T003)
   - Funções puras em `hupflow/src/lib/voiceover/voiceover.test.ts` para estimativa de duração em segundos, WPM de acordo com velocidade, catálogo de vozes e consolidador do estúdio.
   - Teste unitário com `tsx`.

3. **Fase 3: Camada de Serviço e Rotas de API** (T004, T005)
   - Serviço multi-tenant com fallback em memória pré-populado.
   - Rotas de API `/api/voiceover` e `/api/voiceover/voices`.

4. **Fase 4: Componente de Faixa e Tela no Dashboard** (T006, T007, T008)
   - Componente `VoiceoverTrackCard.tsx` com waveform, player de áudio e download.
   - Página `/settings/voiceover` com estúdio de gravação e biblioteca de faixas.
   - Inclusão no menu lateral com ícone `Mic` e badge `TTS`.

5. **Fase 5: Verificação e Sincronização** (T009, T010)
   - Testes com `tsx` e typecheck estático `tsc --noEmit`.
   - Adendo SDD e handoff.
