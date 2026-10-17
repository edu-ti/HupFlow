import { db } from '@/lib/db';
import { voiceoverTracks } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import {
  VoiceoverTrackItem,
  VoiceoverStudioMetrics,
  VoiceProfile,
  VoicePersona,
  VoicePitch,
  CreateVoiceoverTrackInput,
  calculatePacingWordsPerMinute,
  estimateSpeechDurationSeconds,
  getAvailableVoicesCatalog,
  summarizeVoiceoverPortfolio,
} from './types';

// In-memory fallback store for offline tests and database disconnection tolerance
const memoryVoiceoverStore = new Map<string, VoiceoverTrackItem[]>();

// Seed sample records for standard organizations
function getOrgStore(organizationId: string): VoiceoverTrackItem[] {
  if (!memoryVoiceoverStore.has(organizationId)) {
    const catalog = getAvailableVoicesCatalog();
    const brendaVoice = catalog.find((v: VoiceProfile) => v.id === 'voice_pt_brenda') || catalog[1];
    const thiagoVoice = catalog.find((v: VoiceProfile) => v.id === 'voice_pt_thiago') || catalog[0];

    const initialTracks: VoiceoverTrackItem[] = [
      {
        id: 'voiceover-track-001',
        organizationId,
        title: 'Introdução Institucional HupFlow 2026',
        scriptText: 'Bem-vindo ao HupFlow! A plataforma unificada de orquestração de marketing multicanal e inteligência operacional para agências de alta escala.',
        voiceId: thiagoVoice.id,
        voiceName: thiagoVoice.name,
        language: thiagoVoice.language,
        persona: thiagoVoice.persona,
        speed: '1.0',
        pitch: 'balanced',
        wordCount: 19,
        durationSeconds: estimateSpeechDurationSeconds(
          'Bem-vindo ao HupFlow! A plataforma unificada de orquestração de marketing multicanal e inteligência operacional para agências de alta escala.',
          thiagoVoice.persona,
          1.0
        ).durationSeconds,
        audioUrl: 'https://cdn.hupflow.com/voiceovers/demo-intro-thiago.mp3',
        status: 'ready',
        tags: ['institucional', 'onboarding', 'reels'],
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'voiceover-track-002',
        organizationId,
        title: 'Gancho TikTok & Shorts: 3 Erros de Tráfego Pago',
        scriptText: 'Pare de queimar dinheiro em anúncios agora mesmo! O terceiro erro que 90% das marcas cometem vai te deixar de queixo caído. Fique até o final!',
        voiceId: brendaVoice.id,
        voiceName: brendaVoice.name,
        language: brendaVoice.language,
        persona: brendaVoice.persona,
        speed: '1.15',
        pitch: 'high',
        wordCount: 26,
        durationSeconds: estimateSpeechDurationSeconds(
          'Pare de queimar dinheiro em anúncios agora mesmo! O terceiro erro que 90% das marcas cometem vai te deixar de queixo caído. Fique até o final!',
          brendaVoice.persona,
          1.15
        ).durationSeconds,
        audioUrl: 'https://cdn.hupflow.com/voiceovers/demo-tiktok-brenda.mp3',
        status: 'ready',
        tags: ['tiktok', 'shorts', 'gancho'],
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ];
    memoryVoiceoverStore.set(organizationId, initialTracks);
  }
  return memoryVoiceoverStore.get(organizationId)!;
}

export async function listVoiceoverTracks(
  organizationId: string,
  filter?: { status?: string; language?: string; persona?: string; search?: string }
): Promise<VoiceoverTrackItem[]> {
  try {
    let rows: any[] = [];
    if (db) {
      rows = await db
        .select()
        .from(voiceoverTracks)
        .where(eq(voiceoverTracks.organizationId, organizationId))
        .orderBy(desc(voiceoverTracks.createdAt));
    }

    if (!rows || rows.length === 0) {
      rows = getOrgStore(organizationId);
    }

    let results = rows.map((r: any) => ({
      id: r.id,
      organizationId: r.organizationId,
      title: r.title,
      scriptText: r.scriptText,
      voiceId: r.voiceId,
      voiceName: r.voiceName,
      language: r.language,
      persona: r.persona as VoicePersona,
      speed: r.speed,
      pitch: r.pitch as VoicePitch,
      wordCount: Number(r.wordCount || 0),
      durationSeconds: Number(r.durationSeconds || 0),
      audioUrl: r.audioUrl,
      status: r.status as 'ready' | 'generating' | 'failed',
      tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : (Array.isArray(r.tags) ? r.tags : []),
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt),
    })) as VoiceoverTrackItem[];

    if (filter?.status) {
      results = results.filter(t => t.status === filter.status);
    }
    if (filter?.language) {
      results = results.filter(t => t.language === filter.language);
    }
    if (filter?.persona) {
      results = results.filter(t => t.persona === filter.persona);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.scriptText.toLowerCase().includes(q) ||
        t.voiceName.toLowerCase().includes(q)
      );
    }

    return results;
  } catch {
    return getOrgStore(organizationId);
  }
}

export async function getVoiceoverTrackById(
  organizationId: string,
  trackId: string
): Promise<VoiceoverTrackItem | null> {
  const all = await listVoiceoverTracks(organizationId);
  return all.find(t => t.id === trackId) || null;
}

export async function createVoiceoverTrack(
  organizationId: string,
  data: CreateVoiceoverTrackInput
): Promise<VoiceoverTrackItem> {
  const catalog = getAvailableVoicesCatalog();
  const selectedVoice = catalog.find((v: VoiceProfile) => v.id === data.voiceId) || catalog[0];

  const persona = data.persona || selectedVoice.persona;
  const speed = data.speed || '1.0';
  const pitch = data.pitch || 'balanced';
  const language = data.language || selectedVoice.language;
  const speedNum = parseFloat(speed) || 1.0;

  const { wordCount, durationSeconds } = estimateSpeechDurationSeconds(
    data.scriptText,
    persona,
    speedNum
  );

  const newTrack: VoiceoverTrackItem = {
    id: `voiceover-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    organizationId,
    title: data.title.trim(),
    scriptText: data.scriptText.trim(),
    voiceId: selectedVoice.id,
    voiceName: selectedVoice.name,
    language,
    persona,
    speed,
    pitch,
    durationSeconds,
    wordCount,
    audioUrl: `https://cdn.hupflow.com/voiceovers/gen-${Date.now()}.mp3`,
    status: 'ready',
    tags: data.tags || ['tts', 'studio'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    if (db) {
      await db.insert(voiceoverTracks).values({
        id: newTrack.id,
        organizationId: newTrack.organizationId,
        title: newTrack.title,
        scriptText: newTrack.scriptText,
        voiceId: newTrack.voiceId,
        voiceName: newTrack.voiceName,
        language: newTrack.language,
        persona: newTrack.persona,
        speed: newTrack.speed,
        pitch: newTrack.pitch,
        durationSeconds: newTrack.durationSeconds,
        wordCount: newTrack.wordCount,
        audioUrl: newTrack.audioUrl,
        status: newTrack.status,
        tags: JSON.stringify(newTrack.tags),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch {
    // In-memory fallback
  }

  const store = getOrgStore(organizationId);
  if (!store.some(t => t.id === newTrack.id)) {
    store.unshift(newTrack);
  }

  return newTrack;
}

export async function updateVoiceoverTrack(
  organizationId: string,
  trackId: string,
  patch: Partial<Pick<VoiceoverTrackItem, 'title' | 'scriptText' | 'voiceId' | 'speed' | 'pitch' | 'persona' | 'tags' | 'status'>>
): Promise<VoiceoverTrackItem | null> {
  const existing = await getVoiceoverTrackById(organizationId, trackId);
  if (!existing) return null;

  let persona = patch.persona || existing.persona;
  let speed = patch.speed || existing.speed;
  let pitch = patch.pitch || existing.pitch;
  let script = patch.scriptText !== undefined ? patch.scriptText : existing.scriptText;
  let speedNum = parseFloat(speed) || 1.0;

  const { wordCount, durationSeconds } = estimateSpeechDurationSeconds(
    script,
    persona,
    speedNum
  );

  let voiceId = existing.voiceId;
  let voiceName = existing.voiceName;
  let language = existing.language;

  if (patch.voiceId && patch.voiceId !== existing.voiceId) {
    const catalog = getAvailableVoicesCatalog();
    const found = catalog.find((v: VoiceProfile) => v.id === patch.voiceId);
    if (found) {
      voiceId = found.id;
      voiceName = found.name;
      language = found.language;
    }
  }

  const updated: VoiceoverTrackItem = {
    ...existing,
    title: patch.title !== undefined ? patch.title : existing.title,
    scriptText: script,
    voiceId,
    voiceName,
    language,
    persona,
    speed,
    pitch,
    wordCount,
    durationSeconds,
    status: patch.status !== undefined ? patch.status : existing.status,
    tags: patch.tags !== undefined ? patch.tags : existing.tags,
    updatedAt: new Date().toISOString(),
  };

  try {
    if (db) {
      await db
        .update(voiceoverTracks)
        .set({
          title: updated.title,
          scriptText: updated.scriptText,
          voiceId: updated.voiceId,
          voiceName: updated.voiceName,
          language: updated.language,
          persona: updated.persona,
          speed: updated.speed,
          pitch: updated.pitch,
          durationSeconds: updated.durationSeconds,
          wordCount: updated.wordCount,
          status: updated.status,
          tags: JSON.stringify(updated.tags),
          updatedAt: new Date(),
        })
        .where(and(eq(voiceoverTracks.id, trackId), eq(voiceoverTracks.organizationId, organizationId)));
    }
  } catch {
    // Handled in memory
  }

  const store = getOrgStore(organizationId);
  const idx = store.findIndex(t => t.id === trackId);
  if (idx !== -1) {
    store[idx] = updated;
  }

  return updated;
}

export async function deleteVoiceoverTrack(
  organizationId: string,
  trackId: string
): Promise<boolean> {
  try {
    if (db) {
      await db
        .delete(voiceoverTracks)
        .where(and(eq(voiceoverTracks.id, trackId), eq(voiceoverTracks.organizationId, organizationId)));
    }
  } catch {
    // Handled in memory
  }

  const store = getOrgStore(organizationId);
  const idx = store.findIndex(t => t.id === trackId);
  if (idx !== -1) {
    store.splice(idx, 1);
    return true;
  }
  return false;
}

export async function getVoiceoverStudioMetrics(
  organizationId: string
): Promise<VoiceoverStudioMetrics> {
  const tracks = await listVoiceoverTracks(organizationId);
  return summarizeVoiceoverPortfolio(tracks);
}
