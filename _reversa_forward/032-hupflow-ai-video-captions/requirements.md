# Requisitos: AI Video Captions & Animated Subtitles Studio

> Identificador: `032-hupflow-ai-video-captions`  
> Data: `2026-10-17`  
> Autor: Antigravity (Reversa Autonomous Pipeline)  
> Status: Aprovado  

---

## 1. Contexto & Proposta de Valor
Mais de 80% dos vídeos curtos verticais (Instagram Reels, TikTok, YouTube Shorts e LinkedIn Video) são assistidos inicialmente sem som ou requerem retenção visual dinâmica nos primeiros 3 segundos ("hook"). Criadores e agências gastam horas transcrevendo áudio, ajustando timestamps ou pagando ferramentas externas caras para gerar legendas dinâmicas (estilo *Hormozi*, *Karaoke Highlight*, *Minimal Box*, *Neon Pop*).

O **HupFlow AI Video Captions & Subtitles Studio** fornece um subsistema 100% Clean-Room para:
1. **Transcrição e Segmentação Temporal Inteligente**: Geração automática ou a partir de roteiro/transcrição em blocos curtos de alto impacto (2 a 5 palavras por segmento) sincronizados por milissegundos (`startMs`, `endMs`), com suporte a marcação de palavras-chave (`highlightedWord`) e emojis automáticos contextualizados.
2. **Exportação Universal Padrão da Indústria (SRT e WebVTT)**: Geradores determinísticos compatíveis com a especificação SubRip (`.srt`, formato `HH:MM:SS,mmm`) e WebVTT (`.vtt`, formato `HH:MM:SS.mmm`), permitindo upload nativo em qualquer plataforma ou player HTML5.
3. **Estilos Visuais de Legendas Queimadas (Animated Burn-in Presets)**: 5 presets canônicos de legendas animadas para vídeos 9:16:
   - `hormozi_bold`: Caixa alta, fonte pesada, palavra-chave destacada em amarelo/verde vibrante com sombra dura.
   - `karaoke_glow`: Preenchimento progressivo palavra por palavra com brilho neon violeta/ciano.
   - `minimal_pill`: Pílula translúcida com `backdrop-blur`, tipografia editorial limpa para vídeos corporativos/LinkedIn.
   - `neon_cyber`: Texto branco com contorno/glow magenta e ciano para cortes de podcast e tecnologia.
   - `editorial_serif`: Estilo cinematográfico elegante na base inferior com fundo fumê suave.
4. **Simulador de Vídeo Vertical 9:16 em Tempo Real (`VideoCaptionPreview.tsx`)**: Player interativo com scrubber de timeline (0s até a duração total), play/pause em loop e renderização ao vivo das legendas animadas na posição vertical configurada (`top`, `center`, `bottom` com proteção de Safe Zone para botões do Reels/TikTok).
5. **Painel Gerencial `/settings/captions`**: Gerenciamento de projetos de legendas do workspace, editor de cues/segmentos linha a linha com ajuste fino de tempo, gerador IA a partir de roteiro ou vídeo e download direto de `.srt` e `.vtt`.

---

## 2. Requisitos Funcionais (RF)
- **RF-001**: O sistema deve armazenar projetos de legendas (`video_caption_projects`) vinculados ao `organization_id`, contendo título, URL ou referência de mídia opcional, idioma (`pt-BR`, `en-US`, `es-ES`), duração em milissegundos, estilo visual (`preset`), posição vertical (`safeZonePosition`: `top`, `center`, `bottom`), configurações de fonte/cor e lista de segmentos (`cues`).
- **RF-002**: O motor de segmentação (`segmentTranscriptToCues`) deve ser capaz de transformar um texto bruto ou roteiro de vídeo em segmentos sincronizados (`CaptionCue`), respeitando o limite máximo de palavras por bloco (ex: 3 a 5 palavras), calculando `startMs` e `endMs` proporcionalmente à taxa de fala (WPM) ou duração informada, e identificando a palavra de maior impacto para destaque (`highlightWord`) e emoji sugerido.
- **RF-003**: O motor de exportação deve converter qualquer lista de `CaptionCue[]` para os formatos:
  - **SubRip (`.srt`)**: Numeração sequencial `1..N`, timestamps no padrão `HH:MM:SS,mmm --> HH:MM:SS,mmm`.
  - **WebVTT (`.vtt`)**: Cabeçalho `WEBVTT`, timestamps no padrão `HH:MM:SS.mmm --> HH:MM:SS.mmm`.
- **RF-004**: O sistema deve validar e sanitizar os tempos dos segmentos (`validateAndNormalizeCues`), garantindo que `startMs >= 0`, `endMs > startMs`, sem sobreposições inválidas, ordenados cronologicamente.
- **RF-005**: As rotas REST `/api/captions` (`GET`, `POST`, `DELETE`) e `/api/captions/export` (`POST`) devem operar com controle de acesso RBAC (`viewer` para leitura/exportação, `member` para criação/edição/exclusão).
- **RF-006**: A interface `/settings/captions` deve apresentar o editor de segmentos sincronizado ao vivo com o componente `VideoCaptionPreview.tsx`, permitindo testar a reprodução temporal, trocar presets em 1 clique, ajustar a Safe Zone vertical e baixar arquivos `.srt` e `.vtt`.

---

## 3. Requisitos Não-Funcionais (RNF)
- **RNF-001 (Clean-Room & Zero AGPL)**: Algoritmos de formatação temporal SRT/VTT, tokenização de legendas e renderização CSS/Canvas 100% autorais em TypeScript, sem bibliotecas restritivas.
- **RNF-002 (Isolamento Multi-Tenant)**: Todos os projetos de legendas são isolados estritamente por `organization_id`.
- **RNF-003 (Precisão Temporal)**: Conversão exata de milissegundos para `HH:MM:SS,mmm` (SRT) e `HH:MM:SS.mmm` (VTT) com zero deriva de arredondamento.
- **RNF-004 (Tipagem Estrita)**: Conformidade 100% validada via `npx tsc --noEmit`.
