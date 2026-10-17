import crypto from 'node:crypto';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { advocacyCampaigns } from '@/lib/db/schema';
import {
  AdvocacyCampaignItem,
  AdvocacyChannel,
  AdvocacyLeaderboardMember,
  AdvocacyPersonaVariation,
  AdvocacyProgramSummary,
  CreateAdvocacyCampaignInput,
} from './types';
import {
  assignAmbassadorBadge,
  calculateAdvocacyImpactMetrics,
  generateAdvocacyPersonaVariations,
  summarizeAdvocacyProgram,
} from './advocacy.test';

const campaignMemoryStore = new Map<string, AdvocacyCampaignItem[]>();
const leaderboardMemoryStore = new Map<string, AdvocacyLeaderboardMember[]>();

function enrichCampaign(
  raw: Omit<AdvocacyCampaignItem, 'impact'>
): AdvocacyCampaignItem {
  const impact = calculateAdvocacyImpactMetrics({
    sharesCount: raw.sharesCount,
    avgReachPerShare: raw.avgReachPerShare,
    channel: raw.channel,
  });

  return {
    ...raw,
    impact,
  };
}

function seedLeaderboard(organizationId: string): AdvocacyLeaderboardMember[] {
  const existing = leaderboardMemoryStore.get(organizationId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const members: AdvocacyLeaderboardMember[] = [
    {
      id: 'emp_helena',
      memberName: 'Helena Costa',
      roleTitle: 'Head de Produto & IA',
      sharesCount: 16,
      points: 1240,
      organicReachGenerated: 35200,
      badge: assignAmbassadorBadge(1240),
    },
    {
      id: 'emp_eduardo',
      memberName: 'Eduardo (Você)',
      roleTitle: 'Founder & Arquitetura',
      sharesCount: 12,
      points: 960,
      organicReachGenerated: 26400,
      badge: assignAmbassadorBadge(960),
    },
    {
      id: 'emp_bruno',
      memberName: 'Bruno Nogueira',
      roleTitle: 'Tech Lead Full-Stack',
      sharesCount: 9,
      points: 680,
      organicReachGenerated: 18900,
      badge: assignAmbassadorBadge(680),
    },
    {
      id: 'emp_clara',
      memberName: 'Clara Martins',
      roleTitle: 'Account Executive B2B',
      sharesCount: 6,
      points: 420,
      organicReachGenerated: 11400,
      badge: assignAmbassadorBadge(420),
    },
  ];

  leaderboardMemoryStore.set(organizationId, members);
  return members;
}

function seedOrgCampaigns(organizationId: string): AdvocacyCampaignItem[] {
  const existing = campaignMemoryStore.get(organizationId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const now = new Date().toISOString();
  const seeds: AdvocacyCampaignItem[] = [
    enrichCampaign({
      id: 'adv_seed_portals',
      organizationId,
      title: 'Lançamento: Portais White-Label & Aprovação em 1 Clique',
      department: 'Produto & Growth',
      channel: 'linkedin',
      baseMessage:
        'Liberamos os novos Portais White-Label no HupFlow Studio para agências aprovarem entregáveis sem fricção',
      targetUrl: 'https://hupflow.app/portais-whitelabel?utm_source=advocacy',
      pointsReward: 80,
      sharesCount: 15,
      avgReachPerShare: 2200,
      personaVariations: generateAdvocacyPersonaVariations({
        title: 'Lançamento: Portais White-Label & Aprovação em 1 Clique',
        baseMessage:
          'Liberamos os novos Portais White-Label no HupFlow Studio para agências aprovarem entregáveis sem fricção',
        targetUrl: 'https://hupflow.app/portais-whitelabel?utm_source=advocacy',
      }),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }),
    enrichCampaign({
      id: 'adv_seed_benchmark',
      organizationId,
      title: 'Estudo de Caso: Radar de Share of Voice & Testes A/B Z-Score',
      department: 'Inteligência de Mercado',
      channel: 'linkedin',
      baseMessage:
        'Como combinar análise de Content Gaps com testes A/B estatísticos para dobrar a retenção de carrosséis B2B',
      targetUrl: 'https://hupflow.app/radar-ab-testing?utm_source=advocacy',
      pointsReward: 70,
      sharesCount: 11,
      avgReachPerShare: 1950,
      personaVariations: generateAdvocacyPersonaVariations({
        title: 'Estudo de Caso: Radar de Share of Voice & Testes A/B Z-Score',
        baseMessage:
          'Como combinar análise de Content Gaps com testes A/B estatísticos para dobrar a retenção de carrosséis B2B',
        targetUrl: 'https://hupflow.app/radar-ab-testing?utm_source=advocacy',
      }),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }),
    enrichCampaign({
      id: 'adv_seed_hiring',
      organizationId,
      title: 'Cultura & Engenharia Clean-Room TypeScript no HupFlow',
      department: 'Pessoas & Engenharia',
      channel: 'x',
      baseMessage:
        'Nossa arquitetura 100% Clean-Room ultrapassou 40 módulos integrados com zero dependências legadas',
      targetUrl: 'https://hupflow.app/engenharia?utm_source=advocacy',
      pointsReward: 60,
      sharesCount: 9,
      avgReachPerShare: 1600,
      personaVariations: generateAdvocacyPersonaVariations({
        title: 'Cultura & Engenharia Clean-Room TypeScript no HupFlow',
        baseMessage:
          'Nossa arquitetura 100% Clean-Room ultrapassou 40 módulos integrados com zero dependências legadas',
        targetUrl: 'https://hupflow.app/engenharia?utm_source=advocacy',
      }),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }),
  ];

  campaignMemoryStore.set(organizationId, seeds);
  return seeds;
}

export async function getAdvocacyBoardOverview(
  organizationId: string,
  channelFilter?: string
): Promise<{
  campaigns: AdvocacyCampaignItem[];
  leaderboard: AdvocacyLeaderboardMember[];
  summary: AdvocacyProgramSummary;
}> {
  let campaigns: AdvocacyCampaignItem[] = [];

  try {
    const rows = await db
      .select()
      .from(advocacyCampaigns)
      .where(eq(advocacyCampaigns.organizationId, organizationId))
      .orderBy(desc(advocacyCampaigns.createdAt));

    if (rows.length > 0) {
      campaigns = rows.map((r) => {
        const variations = Array.isArray(r.personaVariations)
          ? (r.personaVariations as AdvocacyPersonaVariation[])
          : generateAdvocacyPersonaVariations({
              title: r.title,
              baseMessage: r.baseMessage,
              targetUrl: r.targetUrl,
            });

        return enrichCampaign({
          id: r.id,
          organizationId: r.organizationId,
          title: r.title,
          department: r.department,
          channel: (r.channel as AdvocacyChannel) || 'linkedin',
          baseMessage: r.baseMessage,
          targetUrl: r.targetUrl,
          pointsReward: r.pointsReward,
          sharesCount: r.sharesCount,
          avgReachPerShare: r.avgReachPerShare,
          personaVariations: variations,
          isActive: r.isActive,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        });
      });
    } else {
      campaigns = seedOrgCampaigns(organizationId);
    }
  } catch {
    campaigns = seedOrgCampaigns(organizationId);
  }

  const leaderboard = [...seedLeaderboard(organizationId)].sort(
    (a, b) => b.points - a.points
  );

  const filtered =
    channelFilter && channelFilter !== 'all'
      ? campaigns.filter((c) => c.channel === channelFilter)
      : campaigns;

  return {
    campaigns: filtered,
    leaderboard,
    summary: summarizeAdvocacyProgram(campaigns, leaderboard),
  };
}

export async function createAdvocacyCampaign(
  organizationId: string,
  input: CreateAdvocacyCampaignInput
): Promise<AdvocacyCampaignItem> {
  const id = `adv_${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date();

  const variations = generateAdvocacyPersonaVariations({
    title: input.title,
    baseMessage: input.baseMessage,
    targetUrl: input.targetUrl,
  });

  const campaign = enrichCampaign({
    id,
    organizationId,
    title: input.title.trim(),
    department: input.department?.trim() || 'Produto & Growth',
    channel: input.channel || 'linkedin',
    baseMessage: input.baseMessage.trim(),
    targetUrl: input.targetUrl.trim(),
    pointsReward: Math.max(10, Math.round(input.pointsReward || 75)),
    sharesCount: 1,
    avgReachPerShare: Math.max(200, Math.round(input.avgReachPerShare || 2000)),
    personaVariations: variations,
    isActive: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  });

  try {
    await db.insert(advocacyCampaigns).values({
      id: campaign.id,
      organizationId,
      title: campaign.title,
      department: campaign.department,
      channel: campaign.channel,
      baseMessage: campaign.baseMessage,
      targetUrl: campaign.targetUrl,
      pointsReward: campaign.pointsReward,
      sharesCount: campaign.sharesCount,
      avgReachPerShare: campaign.avgReachPerShare,
      personaVariations: campaign.personaVariations,
      isActive: campaign.isActive,
      createdAt: now,
      updatedAt: now,
    });
  } catch {
    // Fallback to memory store
  }

  const list = seedOrgCampaigns(organizationId);
  campaignMemoryStore.set(organizationId, [campaign, ...list]);
  return campaign;
}

export async function mutateAdvocacyCampaign(
  organizationId: string,
  campaignId: string,
  action: 'record_share' | 'delete'
): Promise<{
  deleted?: boolean;
  campaign?: AdvocacyCampaignItem;
  leaderboard?: AdvocacyLeaderboardMember[];
}> {
  const list = seedOrgCampaigns(organizationId);

  if (action === 'delete') {
    try {
      await db
        .delete(advocacyCampaigns)
        .where(
          and(
            eq(advocacyCampaigns.id, campaignId),
            eq(advocacyCampaigns.organizationId, organizationId)
          )
        );
    } catch {
      // Fallback to memory store
    }
    campaignMemoryStore.set(
      organizationId,
      list.filter((c) => c.id !== campaignId)
    );
    return { deleted: true };
  }

  const target = list.find((c) => c.id === campaignId);
  if (!target) {
    throw new Error('Campanha de Employee Advocacy não encontrada.');
  }

  const updated = enrichCampaign({
    ...target,
    sharesCount: target.sharesCount + 1,
    updatedAt: new Date().toISOString(),
  });

  try {
    await db
      .update(advocacyCampaigns)
      .set({
        sharesCount: updated.sharesCount,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(advocacyCampaigns.id, campaignId),
          eq(advocacyCampaigns.organizationId, organizationId)
        )
      );
  } catch {
    // Fallback to memory store
  }

  campaignMemoryStore.set(
    organizationId,
    list.map((c) => (c.id === campaignId ? updated : c))
  );

  // Reward points to Eduardo in the Leaderboard
  const board = seedLeaderboard(organizationId).map((member) => {
    if (member.id === 'emp_eduardo') {
      const nextPoints = member.points + target.pointsReward;
      return {
        ...member,
        sharesCount: member.sharesCount + 1,
        points: nextPoints,
        organicReachGenerated:
          member.organicReachGenerated + target.avgReachPerShare,
        badge: assignAmbassadorBadge(nextPoints),
      };
    }
    return member;
  });

  leaderboardMemoryStore.set(organizationId, board);

  return {
    campaign: updated,
    leaderboard: board.sort((a, b) => b.points - a.points),
  };
}
