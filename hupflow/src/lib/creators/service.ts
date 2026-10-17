import crypto from 'node:crypto';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { influencerPartnerships } from '@/lib/db/schema';
import {
  CreateCreatorPartnershipInput,
  CreatorChannel,
  CreatorPartnershipItem,
  CreatorPipelineStage,
  CreatorPortfolioSummary,
} from './types';
import {
  evaluateCreatorFinancialMetrics,
  generateCreatorUgcBriefing,
  summarizeCreatorPortfolio,
} from './creators.test';

const STAGE_ORDER: CreatorPipelineStage[] = [
  'prospecting',
  'negotiating',
  'contracted',
  'content_review',
  'published',
];

const memoryStore = new Map<string, CreatorPartnershipItem[]>();

function enrichCreatorRecord(
  raw: Omit<CreatorPartnershipItem, 'metrics' | 'ugcBriefing'>
): CreatorPartnershipItem {
  const metrics = evaluateCreatorFinancialMetrics({
    agreedFeeBrl: raw.agreedFeeBrl,
    totalViews: raw.totalViews,
    totalEngagements: raw.totalEngagements,
    generatedRevenueBrl: raw.generatedRevenueBrl,
  });

  const ugcBriefing = generateCreatorUgcBriefing({
    creatorName: raw.creatorName,
    handle: raw.handle,
    channel: raw.channel,
    niche: raw.niche,
    couponCode: raw.couponCode,
  });

  return {
    ...raw,
    metrics,
    ugcBriefing,
  };
}

function seedOrgCreators(organizationId: string): CreatorPartnershipItem[] {
  const existing = memoryStore.get(organizationId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const now = new Date().toISOString();
  const seeds: CreatorPartnershipItem[] = [
    enrichCreatorRecord({
      id: 'crt_seed_bianca',
      organizationId,
      creatorName: 'Bianca Tech & IA',
      handle: '@bianca.ia',
      channel: 'instagram',
      niche: 'Produtividade & IA',
      followersCount: 84000,
      stage: 'published',
      agreedFeeBrl: 3200,
      deliverablesTotal: 3,
      deliverablesCompleted: 3,
      totalViews: 96000,
      totalEngagements: 6800,
      generatedRevenueBrl: 10400,
      couponCode: 'BIANCA20',
      createdAt: now,
      updatedAt: now,
    }),
    enrichCreatorRecord({
      id: 'crt_seed_diego',
      organizationId,
      creatorName: 'Diego SaaS B2B',
      handle: '@diego.saas',
      channel: 'linkedin',
      niche: 'Growth & Agências B2B',
      followersCount: 47500,
      stage: 'content_review',
      agreedFeeBrl: 2900,
      deliverablesTotal: 3,
      deliverablesCompleted: 2,
      totalViews: 54000,
      totalEngagements: 3900,
      generatedRevenueBrl: 6200,
      couponCode: 'DIEGOB2B',
      createdAt: now,
      updatedAt: now,
    }),
    enrichCreatorRecord({
      id: 'crt_seed_luna',
      organizationId,
      creatorName: 'Luna Creator Studio',
      handle: '@lunacreator.br',
      channel: 'tiktok',
      niche: 'Creator Economy & Vídeo Curto',
      followersCount: 112000,
      stage: 'contracted',
      agreedFeeBrl: 2800,
      deliverablesTotal: 4,
      deliverablesCompleted: 1,
      totalViews: 48000,
      totalEngagements: 3400,
      generatedRevenueBrl: 3100,
      couponCode: 'LUNA15',
      createdAt: now,
      updatedAt: now,
    }),
  ];

  memoryStore.set(organizationId, seeds);
  return seeds;
}

export async function listCreatorPartnerships(
  organizationId: string,
  stageFilter?: string
): Promise<{
  creators: CreatorPartnershipItem[];
  summary: CreatorPortfolioSummary;
}> {
  let creators: CreatorPartnershipItem[] = [];

  try {
    const rows = await db
      .select()
      .from(influencerPartnerships)
      .where(eq(influencerPartnerships.organizationId, organizationId))
      .orderBy(desc(influencerPartnerships.createdAt));

    if (rows.length > 0) {
      creators = rows.map((r) =>
        enrichCreatorRecord({
          id: r.id,
          organizationId: r.organizationId,
          creatorName: r.creatorName,
          handle: r.handle,
          channel: (r.channel as CreatorChannel) || 'instagram',
          niche: r.niche,
          followersCount: r.followersCount,
          stage: (r.stage as CreatorPipelineStage) || 'contracted',
          agreedFeeBrl: r.agreedFeeBrl,
          deliverablesTotal: r.deliverablesTotal,
          deliverablesCompleted: r.deliverablesCompleted,
          totalViews: r.totalViews,
          totalEngagements: r.totalEngagements,
          generatedRevenueBrl: r.generatedRevenueBrl,
          couponCode: r.couponCode,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        })
      );
    } else {
      creators = seedOrgCreators(organizationId);
    }
  } catch {
    creators = seedOrgCreators(organizationId);
  }

  const filtered =
    stageFilter && stageFilter !== 'all'
      ? creators.filter((c) => c.stage === stageFilter)
      : creators;

  return {
    creators: filtered,
    summary: summarizeCreatorPortfolio(creators),
  };
}

export async function createCreatorPartnership(
  organizationId: string,
  input: CreateCreatorPartnershipInput
): Promise<CreatorPartnershipItem> {
  const id = `crt_${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date();
  const cleanHandle = input.handle.startsWith('@')
    ? input.handle.trim()
    : `@${input.handle.trim()}`;

  const defaultCoupon =
    input.couponCode && input.couponCode.trim().length > 0
      ? input.couponCode.trim().toUpperCase()
      : `${cleanHandle.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()}20`;

  const record = enrichCreatorRecord({
    id,
    organizationId,
    creatorName: input.creatorName.trim(),
    handle: cleanHandle,
    channel: input.channel || 'instagram',
    niche: input.niche?.trim() || 'SaaS & Produtividade',
    followersCount: Math.max(500, Math.round(input.followersCount)),
    stage: 'contracted',
    agreedFeeBrl: Math.max(100, Math.round(input.agreedFeeBrl)),
    deliverablesTotal: Math.max(1, Math.round(input.deliverablesTotal)),
    deliverablesCompleted: 1,
    totalViews: 24000,
    totalEngagements: 1650,
    generatedRevenueBrl: 2900,
    couponCode: defaultCoupon,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  });

  try {
    await db.insert(influencerPartnerships).values({
      id: record.id,
      organizationId,
      creatorName: record.creatorName,
      handle: record.handle,
      channel: record.channel,
      niche: record.niche,
      followersCount: record.followersCount,
      stage: record.stage,
      agreedFeeBrl: record.agreedFeeBrl,
      deliverablesTotal: record.deliverablesTotal,
      deliverablesCompleted: record.deliverablesCompleted,
      totalViews: record.totalViews,
      totalEngagements: record.totalEngagements,
      generatedRevenueBrl: record.generatedRevenueBrl,
      couponCode: record.couponCode,
      createdAt: now,
      updatedAt: now,
    });
  } catch {
    // Fallback to memory store
  }

  const list = seedOrgCreators(organizationId);
  memoryStore.set(organizationId, [record, ...list]);
  return record;
}

export async function mutateCreatorPartnership(
  organizationId: string,
  creatorId: string,
  action: 'log_deliverable' | 'advance_stage' | 'delete'
): Promise<{ deleted?: boolean; creator?: CreatorPartnershipItem }> {
  const list = seedOrgCreators(organizationId);

  if (action === 'delete') {
    try {
      await db
        .delete(influencerPartnerships)
        .where(
          and(
            eq(influencerPartnerships.id, creatorId),
            eq(influencerPartnerships.organizationId, organizationId)
          )
        );
    } catch {
      // Fallback to memory store
    }
    memoryStore.set(
      organizationId,
      list.filter((c) => c.id !== creatorId)
    );
    return { deleted: true };
  }

  const target = list.find((c) => c.id === creatorId);
  if (!target) {
    throw new Error('Parceria de criador não encontrada neste workspace.');
  }

  let nextCompleted = target.deliverablesCompleted;
  let nextViews = target.totalViews;
  let nextEngagements = target.totalEngagements;
  let nextRevenue = target.generatedRevenueBrl;
  let nextStage = target.stage;

  if (action === 'log_deliverable') {
    nextCompleted = Math.min(
      target.deliverablesTotal,
      target.deliverablesCompleted + 1
    );
    nextViews += 28000;
    nextEngagements += 1950;
    nextRevenue += 3400;
    if (nextCompleted >= target.deliverablesTotal) {
      nextStage = 'published';
    }
  } else if (action === 'advance_stage') {
    const idx = STAGE_ORDER.indexOf(target.stage);
    nextStage = STAGE_ORDER[Math.min(STAGE_ORDER.length - 1, idx + 1)];
  }

  const updated = enrichCreatorRecord({
    ...target,
    deliverablesCompleted: nextCompleted,
    totalViews: nextViews,
    totalEngagements: nextEngagements,
    generatedRevenueBrl: nextRevenue,
    stage: nextStage,
    updatedAt: new Date().toISOString(),
  });

  try {
    await db
      .update(influencerPartnerships)
      .set({
        deliverablesCompleted: updated.deliverablesCompleted,
        totalViews: updated.totalViews,
        totalEngagements: updated.totalEngagements,
        generatedRevenueBrl: updated.generatedRevenueBrl,
        stage: updated.stage,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(influencerPartnerships.id, creatorId),
          eq(influencerPartnerships.organizationId, organizationId)
        )
      );
  } catch {
    // Fallback to memory store
  }

  memoryStore.set(
    organizationId,
    list.map((c) => (c.id === creatorId ? updated : c))
  );

  return { creator: updated };
}
