import { db } from '@/lib/db';
import { videoCaptionProjects } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import {
  CaptionCue,
  CaptionLanguage,
  CaptionPreset,
  CaptionProjectStats,
  CaptionSafeZone,
  CaptionStyleConfig,
  VideoCaptionProject,
} from './types';
import {
  formatTimestampSrt,
  formatTimestampVtt,
  validateAndNormalizeCues,
  exportToSrt,
  exportToVtt,
  segmentTranscriptToCues,
  getActiveCueAtTime,
  getCaptionPresetConfig,
  getSafeZoneAnchorClass,
} from './captions-utils';

export {
  formatTimestampSrt,
  formatTimestampVtt,
  validateAndNormalizeCues,
  exportToSrt,
  exportToVtt,
  segmentTranscriptToCues,
  getActiveCueAtTime,
  getCaptionPresetConfig,
  getSafeZoneAnchorClass,
};

// Fallback in-memory por organização para desenvolvimento e sandbox sem banco
const memoryCaptionProjects = new Map<string, VideoCaptionProject[]>();

function createDefaultDemoProjects(organizationId: string): VideoCaptionProject[] {
  const defaultTranscript =
    'Mais de 80% dos vídeos no Reels e TikTok são assistidos sem som! Use legendas dinâmicas com IA no HupFlow para triplicar sua retenção nos primeiros 3 segundos e vender muito mais todos os dias.';
  const cues = segmentTranscriptToCues(defaultTranscript, {
    maxWordsPerCue: 4,
    totalDurationMs: 12000,
    autoEmoji: true,
  });

  const presetCfg = getCaptionPresetConfig('hormozi_bold');

  return [
    {
      id: 'cap_demo_1',
      organizationId,
      title: 'Reels: Como Triplicar a Retenção nos Primeiros 3s',
      videoUrl: null,
      language: 'pt-BR',
      durationMs: 12000,
      preset: 'hormozi_bold',
      safeZonePosition: 'bottom_safe',
      styleConfig: presetCfg.style,
      cues,
      rawTranscript: defaultTranscript,
      status: 'ready',
      createdAt: Date.now() - 3600_000 * 4,
      updatedAt: Date.now() - 3600_000,
    },
  ];
}

function computeStats(projects: VideoCaptionProject[]): CaptionProjectStats {
  const totalProjects = projects.length;
  const totalCues = projects.reduce((acc, p) => acc + (p.cues?.length || 0), 0);
  const totalDurationSec = Math.round(
    projects.reduce((acc, p) => acc + (p.durationMs || 0), 0) / 1000
  );
  return { totalProjects, totalCues, totalDurationSec };
}

export async function listCaptionProjects(organizationId: string): Promise<{
  projects: VideoCaptionProject[];
  stats: CaptionProjectStats;
}> {
  try {
    const rows = await db
      .select()
      .from(videoCaptionProjects)
      .where(eq(videoCaptionProjects.organizationId, organizationId))
      .orderBy(desc(videoCaptionProjects.updatedAt));

    if (rows.length > 0) {
      const projects: VideoCaptionProject[] = rows.map((r) => {
        const preset = (r.preset as CaptionPreset) || 'hormozi_bold';
        const defaultStyle = getCaptionPresetConfig(preset).style;
        return {
          id: r.id,
          organizationId: r.organizationId,
          title: r.title,
          videoUrl: r.videoUrl,
          language: (r.language as CaptionLanguage) || 'pt-BR',
          durationMs: r.durationMs || 12000,
          preset,
          safeZonePosition: (r.safeZonePosition as CaptionSafeZone) || 'bottom_safe',
          styleConfig: (r.styleConfig as CaptionStyleConfig) || defaultStyle,
          cues: Array.isArray(r.cues) ? (r.cues as CaptionCue[]) : [],
          rawTranscript: r.rawTranscript,
          status: (r.status as 'draft' | 'ready' | 'exported') || 'ready',
          createdAt: r.createdAt ? new Date(r.createdAt).getTime() : Date.now(),
          updatedAt: r.updatedAt ? new Date(r.updatedAt).getTime() : Date.now(),
        };
      });

      return { projects, stats: computeStats(projects) };
    }
  } catch (err) {
    console.warn('[CaptionsService] Fallback local ativado (listCaptionProjects):', err);
  }

  let list = memoryCaptionProjects.get(organizationId);
  if (!list || list.length === 0) {
    list = createDefaultDemoProjects(organizationId);
    memoryCaptionProjects.set(organizationId, list);
  }

  return { projects: list, stats: computeStats(list) };
}

export async function upsertCaptionProject(
  organizationId: string,
  payload: {
    id?: string;
    title: string;
    videoUrl?: string | null;
    language?: CaptionLanguage;
    durationMs?: number;
    preset?: CaptionPreset;
    safeZonePosition?: CaptionSafeZone;
    styleConfig?: Partial<CaptionStyleConfig>;
    cues?: CaptionCue[];
    rawTranscript?: string | null;
    autoGenerateFromTranscript?: boolean;
    maxWordsPerCue?: number;
  }
): Promise<VideoCaptionProject> {
  const preset: CaptionPreset = payload.preset || 'hormozi_bold';
  const presetDefaults = getCaptionPresetConfig(preset).style;
  const styleConfig: CaptionStyleConfig = {
    ...presetDefaults,
    ...(payload.styleConfig || {}),
  };

  let cues: CaptionCue[] = [];
  if (payload.autoGenerateFromTranscript && payload.rawTranscript?.trim()) {
    cues = segmentTranscriptToCues(payload.rawTranscript, {
      maxWordsPerCue: payload.maxWordsPerCue ?? 4,
      totalDurationMs: payload.durationMs,
      autoEmoji: styleConfig.autoEmoji,
    });
  } else if (Array.isArray(payload.cues) && payload.cues.length > 0) {
    cues = validateAndNormalizeCues(payload.cues);
  } else if (payload.rawTranscript?.trim()) {
    cues = segmentTranscriptToCues(payload.rawTranscript, {
      maxWordsPerCue: payload.maxWordsPerCue ?? 4,
      totalDurationMs: payload.durationMs,
      autoEmoji: styleConfig.autoEmoji,
    });
  }

  const computedDurationMs =
    cues.length > 0
      ? Math.max(payload.durationMs || 0, cues[cues.length - 1].endMs)
      : payload.durationMs || 12000;

  const now = new Date();
  const projectId = payload.id || `cap_${Date.now()}`;
  const language: CaptionLanguage = payload.language || 'pt-BR';
  const safeZonePosition: CaptionSafeZone = payload.safeZonePosition || 'bottom_safe';

  const projectObj: VideoCaptionProject = {
    id: projectId,
    organizationId,
    title: payload.title.trim(),
    videoUrl: payload.videoUrl || null,
    language,
    durationMs: computedDurationMs,
    preset,
    safeZonePosition,
    styleConfig,
    cues,
    rawTranscript: payload.rawTranscript || null,
    status: 'ready',
    createdAt: now.getTime(),
    updatedAt: now.getTime(),
  };

  try {
    const existing = await db
      .select()
      .from(videoCaptionProjects)
      .where(
        and(
          eq(videoCaptionProjects.id, projectId),
          eq(videoCaptionProjects.organizationId, organizationId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(videoCaptionProjects)
        .set({
          title: projectObj.title,
          videoUrl: projectObj.videoUrl,
          language: projectObj.language,
          durationMs: projectObj.durationMs,
          preset: projectObj.preset,
          safeZonePosition: projectObj.safeZonePosition,
          styleConfig: projectObj.styleConfig,
          cues: projectObj.cues,
          rawTranscript: projectObj.rawTranscript,
          updatedAt: now,
        })
        .where(eq(videoCaptionProjects.id, projectId));
    } else {
      await db.insert(videoCaptionProjects).values({
        id: projectObj.id,
        organizationId,
        title: projectObj.title,
        videoUrl: projectObj.videoUrl,
        language: projectObj.language,
        durationMs: projectObj.durationMs,
        preset: projectObj.preset,
        safeZonePosition: projectObj.safeZonePosition,
        styleConfig: projectObj.styleConfig,
        cues: projectObj.cues,
        rawTranscript: projectObj.rawTranscript,
        status: 'ready',
        createdAt: now,
        updatedAt: now,
      });
    }
  } catch (err) {
    console.warn('[CaptionsService] Salvando projeto em memória (fallback DB):', err);
    const list = memoryCaptionProjects.get(organizationId) || createDefaultDemoProjects(organizationId);
    const idx = list.findIndex((item) => item.id === projectId);
    if (idx >= 0) {
      list[idx] = projectObj;
    } else {
      list.unshift(projectObj);
    }
    memoryCaptionProjects.set(organizationId, list);
  }

  return projectObj;
}

export async function deleteCaptionProject(
  organizationId: string,
  projectId: string
): Promise<boolean> {
  try {
    await db
      .delete(videoCaptionProjects)
      .where(
        and(
          eq(videoCaptionProjects.id, projectId),
          eq(videoCaptionProjects.organizationId, organizationId)
        )
      );
  } catch (err) {
    console.warn('[CaptionsService] Removendo da memória (fallback DB):', err);
  }

  const list = memoryCaptionProjects.get(organizationId);
  if (list) {
    memoryCaptionProjects.set(
      organizationId,
      list.filter((item) => item.id !== projectId)
    );
  }

  return true;
}
