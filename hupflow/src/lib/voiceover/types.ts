export type VoiceGender = 'male' | 'female' | 'neutral';

export type VoicePersona =
  | 'narrator_documentary'
  | 'enthusiastic_creator'
  | 'corporate_executive'
  | 'calm_storyteller'
  | 'podcast_host';

export type VoicePitch = 'deep' | 'balanced' | 'high';

export interface VoiceProfile {
  id: string;
  name: string;
  gender: VoiceGender;
  language: string;
  persona: VoicePersona;
  sampleAudioUrl: string;
  description: string;
}

export interface VoiceoverTrackItem {
  id: string;
  organizationId: string;
  title: string;
  scriptText: string;
  voiceId: string;
  voiceName: string;
  language: string;
  persona: VoicePersona;
  speed: string;
  pitch: VoicePitch;
  durationSeconds: number;
  wordCount: number;
  audioUrl: string;
  status: 'ready' | 'generating' | 'failed';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoiceoverTrackInput {
  title: string;
  scriptText: string;
  voiceId: string;
  language?: string;
  persona?: VoicePersona;
  speed?: string;
  pitch?: VoicePitch;
  tags?: string[];
}

export interface VoiceoverStudioMetrics {
  totalTracks: number;
  totalDurationMinutes: number;
  totalWordsSynthesized: number;
  mostUsedPersona: string;
}

// -------------------------------------------------------------------
// Pure Helper Functions & Catalogs
// -------------------------------------------------------------------

export function calculatePacingWordsPerMinute(persona: VoicePersona): number {
  switch (persona) {
    case 'enthusiastic_creator':
      return 175;
    case 'podcast_host':
      return 155;
    case 'corporate_executive':
      return 145;
    case 'calm_storyteller':
      return 125;
    case 'narrator_documentary':
    default:
      return 140;
  }
}

export function estimateSpeechDurationSeconds(
  scriptText: string,
  persona: VoicePersona = 'narrator_documentary',
  speedMultiplier: number = 1.0
): { wordCount: number; durationSeconds: number } {
  const words = scriptText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount === 0) {
    return { wordCount: 0, durationSeconds: 0 };
  }

  const baseWpm = calculatePacingWordsPerMinute(persona);
  const effectiveWpm = Math.max(60, baseWpm * (speedMultiplier || 1.0));
  const durationSeconds = Math.max(2, Math.round((wordCount / effectiveWpm) * 60));

  return {
    wordCount,
    durationSeconds,
  };
}

export function getAvailableVoicesCatalog(): VoiceProfile[] {
  return [
    {
      id: 'voice_pt_thiago',
      name: 'Thiago Martins',
      gender: 'male',
      language: 'pt-BR',
      persona: 'narrator_documentary',
      sampleAudioUrl: 'https://cdn.hupflow.com/samples/thiago_narrator.mp3',
      description: 'Voz grave, firme e de autoridade. Ideal para vídeos institucionais e estudos de caso.',
    },
    {
      id: 'voice_pt_brenda',
      name: 'Brenda Silveira',
      gender: 'female',
      language: 'pt-BR',
      persona: 'enthusiastic_creator',
      sampleAudioUrl: 'https://cdn.hupflow.com/samples/brenda_creator.mp3',
      description: 'Voz vibrante, acelerada e expressiva. Perfeita para Reels, TikToks e ganchos de retenção.',
    },
    {
      id: 'voice_pt_arthur',
      name: 'Arthur Fonseca',
      gender: 'male',
      language: 'pt-BR',
      persona: 'corporate_executive',
      sampleAudioUrl: 'https://cdn.hupflow.com/samples/arthur_executive.mp3',
      description: 'Dicção refinada e profissional. Excelente para pitchs de vendas B2B e relatórios.',
    },
    {
      id: 'voice_pt_sofia',
      name: 'Sofia Duarte',
      gender: 'female',
      language: 'pt-BR',
      persona: 'podcast_host',
      sampleAudioUrl: 'https://cdn.hupflow.com/samples/sofia_podcast.mp3',
      description: 'Tom acolhedor, dinâmico e amigável. Ótimo para newsletters faladas e dicas diárias.',
    },
    {
      id: 'voice_en_liam',
      name: 'Liam Vance',
      gender: 'male',
      language: 'en-US',
      persona: 'narrator_documentary',
      sampleAudioUrl: 'https://cdn.hupflow.com/samples/liam_global.mp3',
      description: 'Nativo americano, sotaque neutro para campanhas e anúncios internacionais.',
    },
  ];
}

export function summarizeVoiceoverPortfolio(
  tracks: VoiceoverTrackItem[]
): VoiceoverStudioMetrics {
  const totalTracks = tracks.length;
  const totalSeconds = tracks.reduce((acc, t) => acc + (t.durationSeconds || 0), 0);
  const totalWordsSynthesized = tracks.reduce((acc, t) => acc + (t.wordCount || 0), 0);

  const personaCounts: Record<string, number> = {};
  for (const t of tracks) {
    personaCounts[t.persona] = (personaCounts[t.persona] || 0) + 1;
  }

  let mostUsedPersona = 'narrator_documentary';
  let maxCount = 0;
  for (const [p, c] of Object.entries(personaCounts)) {
    if (c > maxCount) {
      maxCount = c;
      mostUsedPersona = p;
    }
  }

  return {
    totalTracks,
    totalDurationMinutes: Math.round((totalSeconds / 60) * 10) / 10,
    totalWordsSynthesized,
    mostUsedPersona,
  };
}
