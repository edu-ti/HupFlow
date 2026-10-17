# Roadmap — Feature 046: Conectores Oficiais & Agendador Nativo para TikTok & YouTube Shorts

1. **Fase 1: Tipos & Schema** (T001, T002)
   - Modelos TypeScript em `hupflow/src/lib/vertical/types.ts`.
   - Adição da tabela `vertical_video_posts` no Drizzle ORM.

2. **Fase 2: Motor de Validação de Mídia e Formatador de Payloads** (T003)
   - Funções puras em `hupflow/src/lib/vertical/vertical.test.ts` para validação de aspect ratio 9:16, limites de duração, formatação de payloads TikTok/YouTube e estatísticas da esteira.
   - Teste unitário com `tsx`.

3. **Fase 3: Camada de Serviço e Rotas de API** (T004, T005)
   - Serviço multi-tenant com fallback em memória pré-populado.
   - Rotas de API `/api/vertical` e `/api/vertical/validate`.

4. **Fase 4: Componente de Vídeo e Tela no Dashboard** (T006, T007, T008)
   - Componente `VerticalVideoPostCard.tsx` com miniatura 9:16 e badges de validação técnica.
   - Página `/settings/vertical` para gerenciamento e agendamento de vídeos verticais.
   - Inclusão no menu lateral com ícone `Clapperboard` ou `Film` e badge `9:16`.

5. **Fase 5: Verificação e Sincronização** (T009, T010)
   - Testes com `tsx` e typecheck estático `tsc --noEmit`.
   - Adendo SDD e handoff.
