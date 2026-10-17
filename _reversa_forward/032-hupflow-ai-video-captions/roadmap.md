# Roadmap: AI Video Captions & Animated Subtitles Studio

> Identificador: `032-hupflow-ai-video-captions`  
> Data: `2026-10-17`  

---

## Fases de Execução

### Fase 1: Fundação de Dados e Contratos
- Criar tipos em `hupflow/src/lib/captions/types.ts` (`CaptionCue`, `CaptionPreset`, `CaptionSafeZone`, `CaptionStyleConfig`, `VideoCaptionProject`, `CaptionExportFormat`, `CaptionProjectStats`).
- Atualizar Drizzle ORM schema em `hupflow/src/lib/db/schema.ts` com a tabela `video_caption_projects`.

### Fase 2: Motor Temporal, Segmentação IA e Testes Unitários
- Criar `hupflow/src/lib/captions/captions.test.ts` implementando e validando:
  - `formatTimestampSrt(ms)` (`HH:MM:SS,mmm`) e `formatTimestampVtt(ms)` (`HH:MM:SS.mmm`).
  - `exportToSrt(cues)` e `exportToVtt(cues)` com conformidade estrita aos padrões SubRip e W3C WebVTT.
  - `segmentTranscriptToCues(transcript, options)`: tokenização inteligente em micro-segmentos (2 a 5 palavras), distribuição temporal proporcional, detecção automática de palavra de destaque (`highlightWord`) e sugestão de emoji semântico.
  - `validateAndNormalizeCues(cues)`: ordenação, correção de overlaps e clamp de timestamps negativos.
  - `getActiveCueAtTime(cues, currentTimeMs)`: resolução em O(N) do segmento ativo para o player 9:16.
  - `getCaptionPresetConfig(preset)`: paletas e estilos dos 5 presets canônicos (`hormozi_bold`, `karaoke_glow`, `minimal_pill`, `neon_cyber`, `editorial_serif`).

### Fase 3: Camada de Serviço e Rotas de API REST
- Implementar `hupflow/src/lib/captions/service.ts` com persistência Drizzle em `video_caption_projects` e fallback resiliente em memória (com projetos demo ricos).
- Criar rotas REST:
  - `GET / POST / DELETE` em `hupflow/src/app/api/captions/route.ts`.
  - `POST` em `hupflow/src/app/api/captions/export/route.ts`.

### Fase 4: Simulador 9:16 Ao Vivo e Estúdio de Legendas
- Criar `hupflow/src/components/captions/VideoCaptionPreview.tsx`:
  - Moldura de vídeo vertical 9:16 (Reels/TikTok/Shorts) com indicadores de Safe Zone (botões laterais e rodapé de rede social).
  - Player com loop temporal, barra de progresso arrastável (scrubber), botão Play/Pause e renderização animada ao vivo do `CaptionCue` ativo, aplicando destaque de palavra-chave (`highlightWord`), caixa alta e emoji dinâmico.
- Criar `hupflow/src/app/(dashboard)/settings/captions/page.tsx`:
  - Gerador IA de legendas a partir de roteiro/transcrição em 1 clique.
  - Seletor dos 5 presets de legendas queimadas e controles de Safe Zone (`top_safe`, `center`, `bottom_safe`) e estilo.
  - Editor de segmentos linha a linha (texto, palavra destacada, emoji, início/fim em segundos) com clique para saltar na timeline do player.
  - Botões de download imediato de `.SRT` e `.VTT` ou cópia para área de transferência.

### Fase 5: Navegação, Testes e Sincronização SDD
- Adicionar item `'Legendas & Vídeos'` com ícone `Subtitles` (ou `Clapperboard`) em `hupflow/src/app/(dashboard)/layout.tsx`.
- Executar `npx tsx src/lib/captions/captions.test.ts` e `npx tsc --noEmit`.
- Registrar `legacy-impact.md`, `regression-watch.md`, adendo `_reversa_sdd/addenda/032-hupflow-ai-video-captions.md` e atualizar `SESSION_HANDOFF.md`.
