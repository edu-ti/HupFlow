import {
  VoicePersona,
  VoiceProfile,
  VoiceoverTrackItem,
  VoiceoverStudioMetrics,
} from './types';

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

// -------------------------------------------------------------------
// Test Execution Suite
// -------------------------------------------------------------------
function runVoiceoverUnitTests() {
  console.log('--- Running Feature 047 AI Voiceover & Narration Studio Unit Tests ---');

  // 1. Words Per Minute Pacing
  if (calculatePacingWordsPerMinute('enthusiastic_creator') !== 175) {
    throw new Error('Enthusiastic creator should have 175 WPM');
  }
  if (calculatePacingWordsPerMinute('calm_storyteller') !== 125) {
    throw new Error('Calm storyteller should have 125 WPM');
  }

  // 2. Timing calculation
  // 140 words at 140 WPM at 1.0x -> exactly 60 seconds
  const sampleScript = Array(140).fill('palavra').join(' ');
  const timing = estimateSpeechDurationSeconds(sampleScript, 'narrator_documentary', 1.0);
  if (timing.wordCount !== 140) throw new Error(`Expected 140 words, got ${timing.wordCount}`);
  if (timing.durationSeconds !== 60) throw new Error(`Expected 60s, got ${timing.durationSeconds}s`);

  // At 1.25x speed, 140 words should take ~48 seconds
  const timingFast = estimateSpeechDurationSeconds(sampleScript, 'narrator_documentary', 1.25);
  if (timingFast.durationSeconds !== 48) {
    throw new Error(`Expected 48s at 1.25x speed, got ${timingFast.durationSeconds}s`);
  }

  // 3. Voices Catalog
  const catalog = getAvailableVoicesCatalog();
  if (catalog.length < 5) throw new Error('Catalog must contain at least 5 voices');
  const ptVoices = catalog.filter(v => v.language === 'pt-BR');
  if (ptVoices.length < 4) throw new Error('Expected at least 4 Portuguese voices');

  // 4. Portfolio Summary
  const now = new Date().toISOString();
  const mockTrack: VoiceoverTrackItem = {
    id: 'track-01',
    organizationId: 'org-test',
    title: 'Gancho Reels Black Friday',
    scriptText: 'Pare tudo o que você está fazendo. Veja este segredo.',
    voiceId: 'voice_pt_brenda',
    voiceName: 'Brenda Silveira',
    language: 'pt-BR',
    persona: 'enthusiastic_creator',
    speed: '1.25',
    pitch: 'balanced',
    durationSeconds: 12,
    wordCount: 11,
    audioUrl: 'https://cdn.hupflow.com/a/track01.mp3',
    status: 'ready',
    tags: ['reels', 'blackfriday'],
    createdAt: now,
    updatedAt: now,
  };

  const summary = summarizeVoiceoverPortfolio([mockTrack, { ...mockTrack, id: 'track-02', durationSeconds: 48, wordCount: 95 }]);
  if (summary.totalTracks !== 2) throw new Error('Expected 2 tracks');
  if (summary.totalWordsSynthesized !== 106) throw new Error(`Expected 106 words, got ${summary.totalWordsSynthesized}`);
  if (summary.totalDurationMinutes !== 1.0) throw new Error(`Expected 1.0 min, got ${summary.totalDurationMinutes}`);
  if (summary.mostUsedPersona !== 'enthusiastic_creator') throw new Error('Most used persona mismatch');

  console.log('✅ All Feature 047 AI Voiceover & Narration Studio unit tests passed successfully!');
}

runVoiceoverUnitTests();
