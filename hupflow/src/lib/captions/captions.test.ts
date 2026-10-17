import assert from 'node:assert';
import {
  CaptionCue,
  CaptionPreset,
  CaptionSafeZone,
  CaptionStyleConfig,
  SegmentTranscriptOptions,
} from './types';

function pad2(n: number): string {
  return String(Math.floor(n)).padStart(2, '0');
}

function pad3(n: number): string {
  return String(Math.floor(n)).padStart(3, '0');
}

/**
 * Converte milissegundos para formato SubRip (.srt): HH:MM:SS,mmm
 */
export function formatTimestampSrt(ms: number): string {
  const safeMs = Math.max(0, Math.round(ms));
  const hours = Math.floor(safeMs / 3_600_000);
  const minutes = Math.floor((safeMs % 3_600_000) / 60_000);
  const seconds = Math.floor((safeMs % 60_000) / 1_000);
  const millis = safeMs % 1_000;
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)},${pad3(millis)}`;
}

/**
 * Converte milissegundos para formato WebVTT (.vtt): HH:MM:SS.mmm
 */
export function formatTimestampVtt(ms: number): string {
  const safeMs = Math.max(0, Math.round(ms));
  const hours = Math.floor(safeMs / 3_600_000);
  const minutes = Math.floor((safeMs % 3_600_000) / 60_000);
  const seconds = Math.floor((safeMs % 60_000) / 1_000);
  const millis = safeMs % 1_000;
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}.${pad3(millis)}`;
}

/**
 * Normaliza, ordena e evita timestamps negativos ou invertidos
 */
export function validateAndNormalizeCues(cues: CaptionCue[]): CaptionCue[] {
  const sorted = [...cues]
    .filter((c) => c && typeof c.text === 'string' && c.text.trim().length > 0)
    .sort((a, b) => a.startMs - b.startMs);

  let cursorMs = 0;
  return sorted.map((cue, idx) => {
    const startMs = Math.max(cursorMs, Math.max(0, Math.round(cue.startMs)));
    const minDuration = 400; // mínimo 400ms por bloco legível
    const endMs = Math.max(startMs + minDuration, Math.round(cue.endMs));
    cursorMs = endMs;

    return {
      ...cue,
      id: cue.id || `cue_${idx + 1}`,
      index: idx + 1,
      startMs,
      endMs,
      text: cue.text.trim(),
    };
  });
}

/**
 * Exporta lista de CaptionCue para formato SubRip (.srt)
 */
export function exportToSrt(cues: CaptionCue[]): string {
  const normalized = validateAndNormalizeCues(cues);
  if (normalized.length === 0) return '';

  return (
    normalized
      .map((cue, i) => {
        const start = formatTimestampSrt(cue.startMs);
        const end = formatTimestampSrt(cue.endMs);
        const lineText = cue.emoji ? `${cue.text} ${cue.emoji}` : cue.text;
        return `${i + 1}\n${start} --> ${end}\n${lineText}`;
      })
      .join('\n\n') + '\n'
  );
}

/**
 * Exporta lista de CaptionCue para formato W3C WebVTT (.vtt)
 */
export function exportToVtt(cues: CaptionCue[]): string {
  const normalized = validateAndNormalizeCues(cues);
  if (normalized.length === 0) return 'WEBVTT\n\n';

  const body = normalized
    .map((cue, i) => {
      const start = formatTimestampVtt(cue.startMs);
      const end = formatTimestampVtt(cue.endMs);
      const lineText = cue.emoji ? `${cue.text} ${cue.emoji}` : cue.text;
      return `${i + 1}\n${start} --> ${end}\n${lineText}`;
    })
    .join('\n\n');

  return `WEBVTT\n\n${body}\n`;
}

const KEYWORD_EMOJI_MAP: Array<{ pattern: RegExp; emoji: string }> = [
  { pattern: /\b(ia|intelig[êe]ncia|artificial|ai|rob[ôo]|autom[aá]tico)\b/i, emoji: '🤖' },
  { pattern: /\b(dinheiro|lucro|vendas|faturamento|receita|caro|barato|r\$|\d+%)\b/i, emoji: '💰' },
  { pattern: /\b(crescimento|escalar|triplicar|dobrar|explodir|alta|foguete|r[áa]pido)\b/i, emoji: '🚀' },
  { pattern: /\b(segredo|aten[çc][ãa]o|cuidado|erro|nunca|pare|importante)\b/i, emoji: '🔥' },
  { pattern: /\b(tempo|horas|segundos|minutos|agenda|produtividade)\b/i, emoji: '⚡' },
  { pattern: /\b(v[íi]deo|reels|tiktok|shorts|carrossel|post|conte[úu]do)\b/i, emoji: '🎬' },
  { pattern: /\b(ideia|dica|estrat[ée]gia|passo|guia|aprenda)\b/i, emoji: '💡' },
];

function detectBestHighlightWord(words: string[]): string | null {
  if (words.length === 0) return null;
  // Prioriza palavras com números/porcentagens ou a palavra mais longa (>3 chars) sem pontuação
  const cleaned = words.map((w) => ({
    raw: w,
    clean: w.replace(/[.,!?;:"'()[\]]/g, ''),
  }));

  const numeric = cleaned.find((w) => /\d/.test(w.clean));
  if (numeric && numeric.clean.length > 0) return numeric.clean;

  const sortedByLength = [...cleaned]
    .filter((w) => w.clean.length >= 4)
    .sort((a, b) => b.clean.length - a.clean.length);

  return sortedByLength.length > 0 ? sortedByLength[0].clean : cleaned[cleaned.length - 1].clean;
}

function suggestContextualEmoji(chunkText: string): string | null {
  for (const rule of KEYWORD_EMOJI_MAP) {
    if (rule.pattern.test(chunkText)) {
      return rule.emoji;
    }
  }
  return null;
}

/**
 * Segmenta uma transcrição ou roteiro bruto em micro-segmentos (CaptionCue[])
 * ideais para retenção em Reels/TikTok/Shorts
 */
export function segmentTranscriptToCues(
  transcript: string,
  options: SegmentTranscriptOptions = {}
): CaptionCue[] {
  const maxWordsPerCue = Math.max(2, Math.min(8, options.maxWordsPerCue ?? 4));
  const autoEmoji = options.autoEmoji ?? true;

  const tokens = transcript
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  if (tokens.length === 0) return [];

  const chunks: string[][] = [];
  let currentChunk: string[] = [];

  for (const token of tokens) {
    currentChunk.push(token);
    const endsWithPunctuation = /[.!?;:]$/.test(token);
    if (currentChunk.length >= maxWordsPerCue || (endsWithPunctuation && currentChunk.length >= 2)) {
      chunks.push(currentChunk);
      currentChunk = [];
    }
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  // Calcula duração total baseada em WPM (padrão 150 WPM -> 400ms por palavra) ou totalDurationMs
  const wordsPerMinute = options.wordsPerMinute ?? 150;
  const msPerWord = 60_000 / wordsPerMinute;
  const computedTotalMs =
    options.totalDurationMs && options.totalDurationMs > 1000
      ? options.totalDurationMs
      : Math.max(2000, Math.round(tokens.length * msPerWord));

  const totalWords = tokens.length;
  let elapsedMs = 0;

  return chunks.map((chunkWords, idx) => {
    const isLast = idx === chunks.length - 1;
    const weight = chunkWords.length / totalWords;
    const rawDuration = Math.max(600, Math.round(computedTotalMs * weight));
    const startMs = elapsedMs;
    const endMs = isLast
      ? Math.max(startMs + 600, computedTotalMs)
      : startMs + rawDuration;
    elapsedMs = endMs;

    const text = chunkWords.join(' ');
    const highlightWord = detectBestHighlightWord(chunkWords);
    const emoji = autoEmoji ? suggestContextualEmoji(text) : null;

    return {
      id: `cue_${idx + 1}`,
      index: idx + 1,
      startMs,
      endMs,
      text,
      highlightWord,
      emoji,
    };
  });
}

/**
 * Retorna o segmento de legenda ativo no instante currentTimeMs
 */
export function getActiveCueAtTime(cues: CaptionCue[], currentTimeMs: number): CaptionCue | null {
  if (!cues || cues.length === 0) return null;
  return (
    cues.find((c) => currentTimeMs >= c.startMs && currentTimeMs <= c.endMs) || null
  );
}

/**
 * Retorna a configuração visual canônica para cada preset de legenda queimada
 */
export function getCaptionPresetConfig(preset: CaptionPreset): {
  label: string;
  description: string;
  style: CaptionStyleConfig;
  containerClass: string;
  textClass: string;
  highlightClass: string;
} {
  switch (preset) {
    case 'karaoke_glow':
      return {
        label: 'Karaoke Glow',
        description: 'Brilho neon ciano e violeta para cortes dinâmicos',
        style: {
          fontSizePx: 22,
          primaryColor: '#FFFFFF',
          highlightColor: '#22D3EE',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          uppercase: true,
          autoEmoji: true,
          showShadow: true,
        },
        containerClass:
          'bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 px-4 py-2 rounded-2xl shadow-lg shadow-cyan-500/20',
        textClass: 'font-extrabold tracking-wide text-white uppercase drop-shadow',
        highlightClass: 'text-cyan-300 underline decoration-cyan-400 decoration-2 underline-offset-4',
      };
    case 'minimal_pill':
      return {
        label: 'Minimal Pill',
        description: 'Pílula translúcida corporativa ideal para LinkedIn e B2B',
        style: {
          fontSizePx: 18,
          primaryColor: '#F8FAFC',
          highlightColor: '#818CF8',
          backgroundColor: 'rgba(9, 9, 11, 0.85)',
          uppercase: false,
          autoEmoji: false,
          showShadow: false,
        },
        containerClass:
          'bg-zinc-950/85 backdrop-blur-md border border-zinc-700/60 px-4 py-2 rounded-full shadow-md',
        textClass: 'font-semibold text-zinc-100 tracking-normal',
        highlightClass: 'text-indigo-400 font-bold',
      };
    case 'neon_cyber':
      return {
        label: 'Neon Cyber',
        description: 'Contraste magenta e amarelo elétrico para podcasts e tech',
        style: {
          fontSizePx: 22,
          primaryColor: '#FFFFFF',
          highlightColor: '#F43F5E',
          backgroundColor: 'rgba(24, 24, 27, 0.65)',
          uppercase: true,
          autoEmoji: true,
          showShadow: true,
        },
        containerClass:
          'bg-zinc-900/75 border border-rose-500/40 px-3.5 py-1.5 rounded-xl shadow-lg shadow-rose-500/20',
        textClass: 'font-black tracking-wider text-white uppercase',
        highlightClass: 'bg-rose-500 text-white px-1.5 py-0.5 rounded-md shadow-sm',
      };
    case 'editorial_serif':
      return {
        label: 'Editorial Cinema',
        description: 'Estilo clássico de cinema com caixa de contraste suave',
        style: {
          fontSizePx: 18,
          primaryColor: '#FEFCE8',
          highlightColor: '#FDE047',
          backgroundColor: 'rgba(0, 0, 0, 0.70)',
          uppercase: false,
          autoEmoji: false,
          showShadow: true,
        },
        containerClass: 'bg-black/75 px-4 py-1.5 rounded-lg border border-amber-200/20',
        textClass: 'font-serif italic text-amber-50 tracking-wide',
        highlightClass: 'text-amber-300 font-bold not-italic',
      };
    case 'hormozi_bold':
    default:
      return {
        label: 'Hormozi Impact',
        description: 'Caixa alta pesada com destaque amarelo/verde de alta retenção',
        style: {
          fontSizePx: 24,
          primaryColor: '#FFFFFF',
          highlightColor: '#FACC15',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          uppercase: true,
          autoEmoji: true,
          showShadow: true,
        },
        containerClass: 'bg-black/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-yellow-400/30 shadow-xl',
        textClass: 'font-black tracking-tight text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]',
        highlightClass: 'text-yellow-400 bg-yellow-400/15 px-1.5 py-0.5 rounded',
      };
  }
}

export function getSafeZoneAnchorClass(safeZone: CaptionSafeZone): string {
  switch (safeZone) {
    case 'top_safe':
      return 'top-[16%]';
    case 'center':
      return 'top-1/2 -translate-y-1/2';
    case 'bottom_safe':
    default:
      return 'bottom-[22%]';
  }
}

// Bateria de Testes Unitários
async function runTests() {
  console.log('[TEST] Iniciando bateria de testes do AI Video Captions & Subtitles Studio...');

  // 1. Formatação de Timestamps SRT e WebVTT
  assert.strictEqual(formatTimestampSrt(0), '00:00:00,000');
  assert.strictEqual(formatTimestampSrt(1250), '00:00:01,250');
  assert.strictEqual(formatTimestampSrt(65432), '00:01:05,432');
  assert.strictEqual(formatTimestampSrt(3661005), '01:01:01,005');

  assert.strictEqual(formatTimestampVtt(0), '00:00:00.000');
  assert.strictEqual(formatTimestampVtt(1250), '00:00:01.250');
  assert.strictEqual(formatTimestampVtt(65432), '00:01:05.432');
  console.log('✅ Formatação de timestamps SRT (vírgula) e WebVTT (ponto) aprovada.');

  // 2. Segmentação inteligente de transcrição
  const rawText =
    'Mais de 80% dos vídeos no Reels são assistidos sem som. Use legendas dinâmicas com IA para triplicar sua retenção hoje!';
  const cues = segmentTranscriptToCues(rawText, {
    maxWordsPerCue: 4,
    totalDurationMs: 10000,
    autoEmoji: true,
  });

  assert.ok(cues.length >= 4, 'Deve gerar múltiplos micro-segmentos');
  assert.strictEqual(cues[0].startMs, 0, 'Primeiro cue deve começar em 0ms');
  assert.strictEqual(cues[cues.length - 1].endMs, 10000, 'Último cue deve fechar em 10000ms');
  assert.strictEqual(cues[0].highlightWord, '80%', 'Deve destacar números/porcentagens no primeiro bloco');
  console.log('✅ Segmentação de transcrição em micro-cues e detecção de palavra-chave aprovadas.');

  // 3. Exportação SRT e VTT
  const srtOutput = exportToSrt(cues);
  assert.ok(srtOutput.startsWith('1\n00:00:00,000 --> '), 'SRT deve começar no índice 1');
  assert.ok(srtOutput.includes('80%'), 'SRT deve conter o texto do cue');

  const vttOutput = exportToVtt(cues);
  assert.ok(vttOutput.startsWith('WEBVTT\n\n1\n00:00:00.000 --> '), 'VTT deve conter cabeçalho WEBVTT');
  console.log('✅ Exportadores SubRip (.srt) e WebVTT (.vtt) aprovados.');

  // 4. Normalização de cues desordenados ou sobrepostos
  const dirtyCues: CaptionCue[] = [
    { id: 'c2', index: 2, startMs: 1500, endMs: 3000, text: 'Segundo bloco' },
    { id: 'c1', index: 1, startMs: -200, endMs: 2000, text: 'Primeiro bloco' },
  ];
  const normalized = validateAndNormalizeCues(dirtyCues);
  assert.strictEqual(normalized[0].text, 'Primeiro bloco');
  assert.strictEqual(normalized[0].startMs, 0);
  assert.ok(normalized[1].startMs >= normalized[0].endMs, 'Não deve permitir sobreposição temporal');
  console.log('✅ Normalização e proteção anti-sobreposição temporal aprovadas.');

  // 5. Resolução de cue ativo e Presets Visuais
  const active = getActiveCueAtTime(normalized, 500);
  assert.ok(active !== null && active.text === 'Primeiro bloco');
  const presetCfg = getCaptionPresetConfig('hormozi_bold');
  assert.strictEqual(presetCfg.style.uppercase, true);
  assert.strictEqual(getSafeZoneAnchorClass('bottom_safe'), 'bottom-[22%]');
  console.log('✅ Resolução temporal no player e configuração de presets aprovadas.');

  console.log('🎉 Todos os testes unitários do AI Video Captions Studio passaram com 100% de sucesso!');
}

if (require.main === module) {
  runTests().catch((err) => {
    console.error('❌ Falha nos testes de Captions:', err);
    process.exit(1);
  });
}
