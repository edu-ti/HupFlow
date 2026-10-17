import crypto from 'node:crypto';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { competitorProfiles } from '@/lib/db/schema';
import {
  CompetitorChannel,
  CompetitorContentFormat,
  CompetitorProfile,
  CompetitorRadarOverview,
  CreateCompetitorInput,
  WorkspaceBenchmarkBaseline,
} from './types';
import {
  calculateCompetitiveThreatScore,
  calculateShareOfVoiceDistribution,
  calculateWeeklyEngagedReach,
  compareAgainstWorkspaceBaseline,
  detectContentGaps,
} from './competitors.test';

const memoryStore = new Map<string, CompetitorProfile[]>();

function getDefaultBaseline(): WorkspaceBenchmarkBaseline {
  return {
    name: 'Sua Marca (HupFlow Workspace)',
    handle: '@hupflow_oficial',
    followersCount: 44800,
    engagementRatePct: 4.9,
    postsPerWeek: 6,
    growth30dPct: 8.6,
    coveredTopics: [
      'Automação Social Multi-Canal',
      'Design de Carrosséis IA',
      'Aprovação White-Label para Agências',
    ],
    weeklyEngagedReach: 0,
    shareOfVoicePct: 0,
  };
}

function seedOrgCompetitors(organizationId: string): CompetitorProfile[] {
  const existing = memoryStore.get(organizationId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const now = new Date().toISOString();
  const rawSeeds: Array<
    Omit<
      CompetitorProfile,
      'threatScore' | 'threatLevel' | 'weeklyEngagedReach' | 'shareOfVoicePct'
    >
  > = [
    {
      id: 'comp_seed_pulse',
      organizationId,
      name: 'PulseSocial AI Studio',
      handle: '@pulsesocial.ai',
      channel: 'instagram',
      niche: 'SaaS & Marketing Digital',
      followersCount: 68500,
      engagementRatePct: 5.4,
      postsPerWeek: 7,
      growth30dPct: 11.8,
      topFormat: 'reel_video',
      topTopics: [
        'Ganchos Virais para Reels em 3s',
        'Retenção Visual com Legendas Dinâmicas',
        'Automação Social Multi-Canal',
      ],
      lastSyncedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'comp_seed_metrica',
      organizationId,
      name: 'MetricaLab B2B',
      handle: '@metricalab.b2b',
      channel: 'linkedin',
      niche: 'Growth & B2B Social',
      followersCount: 51200,
      engagementRatePct: 4.6,
      postsPerWeek: 5,
      growth30dPct: 7.9,
      topFormat: 'carousel',
      topTopics: [
        'Social Selling no LinkedIn',
        'Playbook de Ghostwriting para Fundadores',
        'Métricas de Receita Orgânica',
      ],
      lastSyncedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'comp_seed_creatorflow',
      organizationId,
      name: 'CreatorFlow Hub',
      handle: '@creatorflow.hub',
      channel: 'tiktok',
      niche: 'Creator Economy',
      followersCount: 39400,
      engagementRatePct: 4.1,
      postsPerWeek: 6,
      growth30dPct: 6.4,
      topFormat: 'reel_video',
      topTopics: [
        'Bastidores de Monetização Creator',
        'Reciclagem de Conteúdo Evergreen',
      ],
      lastSyncedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const enriched: CompetitorProfile[] = rawSeeds.map((seed) => {
    const { threatScore, threatLevel } = calculateCompetitiveThreatScore(seed);
    const weeklyEngagedReach = calculateWeeklyEngagedReach(seed);
    return {
      ...seed,
      threatScore,
      threatLevel,
      weeklyEngagedReach,
      shareOfVoicePct: 0,
    };
  });

  memoryStore.set(organizationId, enriched);
  return enriched;
}

export async function getCompetitorRadarOverview(
  organizationId: string,
  channelFilter?: CompetitorChannel
): Promise<CompetitorRadarOverview> {
  let competitors: CompetitorProfile[] = [];

  try {
    const rows = await db
      .select()
      .from(competitorProfiles)
      .where(eq(competitorProfiles.organizationId, organizationId))
      .orderBy(desc(competitorProfiles.threatScore));

    if (rows.length > 0) {
      competitors = rows.map((r) => {
        const engagementRatePct = Number((r.engagementRateBps / 100).toFixed(2));
        const growth30dPct = Number((r.growth30dBps / 100).toFixed(2));
        const { threatScore, threatLevel } = calculateCompetitiveThreatScore({
          engagementRatePct,
          postsPerWeek: r.postsPerWeek,
          growth30dPct,
        });
        return {
          id: r.id,
          organizationId: r.organizationId,
          name: r.name,
          handle: r.handle,
          channel: (r.channel as CompetitorChannel) || 'instagram',
          niche: r.niche,
          followersCount: r.followersCount,
          engagementRatePct,
          postsPerWeek: r.postsPerWeek,
          growth30dPct,
          topFormat: (r.topFormat as CompetitorContentFormat) || 'carousel',
          topTopics: Array.isArray(r.topTopics) ? (r.topTopics as string[]) : [],
          threatScore,
          threatLevel,
          weeklyEngagedReach: calculateWeeklyEngagedReach({
            followersCount: r.followersCount,
            engagementRatePct,
            postsPerWeek: r.postsPerWeek,
          }),
          shareOfVoicePct: 0,
          lastSyncedAt: r.lastSyncedAt.toISOString(),
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        };
      });
    } else {
      competitors = seedOrgCompetitors(organizationId);
    }
  } catch {
    competitors = seedOrgCompetitors(organizationId);
  }

  const filtered = channelFilter
    ? competitors.filter((c) => c.channel === channelFilter)
    : competitors;

  const baseline = getDefaultBaseline();
  const { baselineWithSov, competitorsWithSov } = calculateShareOfVoiceDistribution(
    baseline,
    filtered
  );

  const comparison = compareAgainstWorkspaceBaseline(baselineWithSov, competitorsWithSov);
  const contentGaps = detectContentGaps(baselineWithSov, competitorsWithSov);

  return {
    workspaceBaseline: baselineWithSov,
    competitors: competitorsWithSov,
    comparison,
    contentGaps,
  };
}

export async function createCompetitorProfile(
  organizationId: string,
  input: CreateCompetitorInput
): Promise<CompetitorProfile> {
  const id = `comp_${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date();
  const cleanHandle = input.handle.startsWith('@')
    ? input.handle.trim()
    : `@${input.handle.trim()}`;

  const engagementRatePct = Number(Math.max(0.1, input.engagementRatePct).toFixed(2));
  const growth30dPct = Number(input.growth30dPct.toFixed(2));
  const postsPerWeek = Math.max(1, Math.round(input.postsPerWeek));
  const followersCount = Math.max(100, Math.round(input.followersCount));
  const topFormat: CompetitorContentFormat = input.topFormat || 'carousel';
  const topTopics =
    input.topTopics && input.topTopics.length > 0
      ? input.topTopics
      : ['Estratégia de Conteúdo', 'Crescimento Orgânico'];

  const { threatScore, threatLevel } = calculateCompetitiveThreatScore({
    engagementRatePct,
    postsPerWeek,
    growth30dPct,
  });

  const profile: CompetitorProfile = {
    id,
    organizationId,
    name: input.name.trim(),
    handle: cleanHandle,
    channel: input.channel || 'instagram',
    niche: input.niche?.trim() || 'SaaS & Marketing Digital',
    followersCount,
    engagementRatePct,
    postsPerWeek,
    growth30dPct,
    topFormat,
    topTopics,
    threatScore,
    threatLevel,
    weeklyEngagedReach: calculateWeeklyEngagedReach({
      followersCount,
      engagementRatePct,
      postsPerWeek,
    }),
    shareOfVoicePct: 0,
    lastSyncedAt: now.toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  try {
    await db.insert(competitorProfiles).values({
      id: profile.id,
      organizationId,
      name: profile.name,
      handle: profile.handle,
      channel: profile.channel,
      niche: profile.niche,
      followersCount: profile.followersCount,
      engagementRateBps: Math.round(profile.engagementRatePct * 100),
      postsPerWeek: profile.postsPerWeek,
      growth30dBps: Math.round(profile.growth30dPct * 100),
      topFormat: profile.topFormat,
      topTopics: profile.topTopics,
      threatScore: profile.threatScore,
      lastSyncedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  } catch {
    // Fallback to memory store
  }

  const list = seedOrgCompetitors(organizationId);
  memoryStore.set(organizationId, [profile, ...list]);
  return profile;
}

export async function syncOrDeleteCompetitor(
  organizationId: string,
  competitorId: string,
  action: 'sync' | 'delete'
): Promise<{ deleted?: boolean; updated?: CompetitorProfile }> {
  const list = seedOrgCompetitors(organizationId);

  if (action === 'delete') {
    try {
      await db
        .delete(competitorProfiles)
        .where(
          and(
            eq(competitorProfiles.id, competitorId),
            eq(competitorProfiles.organizationId, organizationId)
          )
        );
    } catch {
      // Fallback to memory store
    }
    memoryStore.set(
      organizationId,
      list.filter((c) => c.id !== competitorId)
    );
    return { deleted: true };
  }

  const target = list.find((c) => c.id === competitorId);
  if (!target) {
    throw new Error('Perfil de concorrente não encontrado neste workspace.');
  }

  // Simulate fresh metric snapshot update (+1.5% followers, +0.2% engagement rate)
  const updatedFollowers = Math.round(target.followersCount * 1.015);
  const updatedEngagement = Number((target.engagementRatePct + 0.2).toFixed(2));
  const updatedGrowth = Number((target.growth30dPct + 0.4).toFixed(2));
  const { threatScore, threatLevel } = calculateCompetitiveThreatScore({
    engagementRatePct: updatedEngagement,
    postsPerWeek: target.postsPerWeek,
    growth30dPct: updatedGrowth,
  });

  const now = new Date();
  const updated: CompetitorProfile = {
    ...target,
    followersCount: updatedFollowers,
    engagementRatePct: updatedEngagement,
    growth30dPct: updatedGrowth,
    threatScore,
    threatLevel,
    weeklyEngagedReach: calculateWeeklyEngagedReach({
      followersCount: updatedFollowers,
      engagementRatePct: updatedEngagement,
      postsPerWeek: target.postsPerWeek,
    }),
    lastSyncedAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  try {
    await db
      .update(competitorProfiles)
      .set({
        followersCount: updated.followersCount,
        engagementRateBps: Math.round(updated.engagementRatePct * 100),
        growth30dBps: Math.round(updated.growth30dPct * 100),
        threatScore: updated.threatScore,
        lastSyncedAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(competitorProfiles.id, competitorId),
          eq(competitorProfiles.organizationId, organizationId)
        )
      );
  } catch {
    // Fallback to memory store
  }

  memoryStore.set(
    organizationId,
    list.map((c) => (c.id === competitorId ? updated : c))
  );

  return { updated };
}
