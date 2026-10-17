import crypto from 'node:crypto';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { socialListeningMentions } from '@/lib/db/schema';
import {
  BrandHealthRadarSummary,
  CreateListeningMentionInput,
  CrisisRiskLevel,
  ListeningCategory,
  ListeningChannel,
  ListeningMentionItem,
  ListeningMentionStatus,
  ListeningSentiment,
} from './types';
import {
  analyzeMentionSignal,
  evaluateBrandHealthAndCrisisRadar,
  generateStrategicResponsePlaybook,
} from './listening.test';

const memoryStore = new Map<string, ListeningMentionItem[]>();

function seedOrgMentions(organizationId: string): ListeningMentionItem[] {
  const existing = memoryStore.get(organizationId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const now = new Date().toISOString();
  const rawSeeds: Array<{
    id: string;
    keywordMatched: string;
    channel: ListeningChannel;
    category: ListeningCategory;
    authorName: string;
    authorHandle: string;
    authorFollowers: number;
    velocityPerHour: number;
    content: string;
    status: ListeningMentionStatus;
  }> = [
    {
      id: 'lst_seed_crisis',
      keywordMatched: 'API Meta Instabilidade',
      channel: 'x',
      category: 'crisis_risk',
      authorName: 'Lucas Cloud DevOps',
      authorHandle: '@lucas_cloud',
      authorFollowers: 42000,
      velocityPerHour: 88,
      content:
        'Alguém mais sofrendo com erro 500 e instabilidade na Graph API da Meta hoje? Vários agendadores perderam fila!',
      status: 'open',
    },
    {
      id: 'lst_seed_competitor',
      keywordMatched: 'Alternativa ao Postiz / Buffer',
      channel: 'reddit',
      category: 'competitor_complaint',
      authorName: 'Marina Growth B2B',
      authorHandle: '@marina_b2b',
      authorFollowers: 14800,
      velocityPerHour: 36,
      content:
        'Estou buscando uma alternativa limpa e rápida que tenha Estúdio de Carrosséis PDF para LinkedIn e portal white-label para aprovação de clientes.',
      status: 'open',
    },
    {
      id: 'lst_seed_advocate',
      keywordMatched: 'HupFlow Studio',
      channel: 'linkedin',
      category: 'brand_mention',
      authorName: 'Rafael Diretor Criativo',
      authorHandle: '@rafael_criativo',
      authorFollowers: 29500,
      velocityPerHour: 52,
      content:
        'Migramos nossa agência para o HupFlow Studio neste mês e o fluxo de aprovação externa + legendas SRT é simplesmente impecável. Recomendo demais!',
      status: 'open',
    },
    {
      id: 'lst_seed_trend',
      keywordMatched: 'Carrossel PDF LinkedIn 2026',
      channel: 'linkedin',
      category: 'industry_trend',
      authorName: 'Camila B2B Strategist',
      authorHandle: '@camila_b2b',
      authorFollowers: 63000,
      velocityPerHour: 74,
      content:
        'Dados novos mostram que documentos PDF nativos no LinkedIn com 7 a 9 slides continuam entregando 3.4x mais alcance orgânico que links externos.',
      status: 'engaged',
    },
  ];

  const enriched: ListeningMentionItem[] = rawSeeds.map((seed) => {
    const analysis = analyzeMentionSignal({
      content: seed.content,
      authorFollowers: seed.authorFollowers,
      velocityPerHour: seed.velocityPerHour,
      category: seed.category,
    });
    const playbook = generateStrategicResponsePlaybook({
      authorHandle: seed.authorHandle,
      keywordMatched: seed.keywordMatched,
      category: seed.category,
      sentiment: analysis.sentiment,
    });

    return {
      ...seed,
      organizationId,
      sentiment: analysis.sentiment,
      sentimentScore: analysis.sentimentScore,
      urgencyScore: analysis.urgencyScore,
      crisisLevel: analysis.crisisLevel,
      playbook,
      detectedAt: now,
      createdAt: now,
      updatedAt: now,
    };
  });

  memoryStore.set(organizationId, enriched);
  return enriched;
}

export async function listSocialListeningMentions(
  organizationId: string,
  categoryFilter?: string
): Promise<{
  mentions: ListeningMentionItem[];
  radar: BrandHealthRadarSummary;
}> {
  let mentions: ListeningMentionItem[] = [];

  try {
    const rows = await db
      .select()
      .from(socialListeningMentions)
      .where(eq(socialListeningMentions.organizationId, organizationId))
      .orderBy(desc(socialListeningMentions.urgencyScore));

    if (rows.length > 0) {
      mentions = rows.map((r) => {
        const category =
          (r.category as ListeningCategory) || 'brand_mention';
        const sentiment = (r.sentiment as ListeningSentiment) || 'neutral';
        return {
          id: r.id,
          organizationId: r.organizationId,
          keywordMatched: r.keywordMatched,
          channel: (r.channel as ListeningChannel) || 'x',
          category,
          authorName: r.authorName,
          authorHandle: r.authorHandle,
          authorFollowers: r.authorFollowers,
          content: r.content,
          sentiment,
          sentimentScore: r.sentimentScore,
          velocityPerHour: r.velocityPerHour,
          urgencyScore: r.urgencyScore,
          crisisLevel: (r.crisisLevel as CrisisRiskLevel) || 'normal',
          status: (r.status as ListeningMentionStatus) || 'open',
          playbook: generateStrategicResponsePlaybook({
            authorHandle: r.authorHandle,
            keywordMatched: r.keywordMatched,
            category,
            sentiment,
          }),
          detectedAt: r.detectedAt.toISOString(),
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        };
      });
    } else {
      mentions = seedOrgMentions(organizationId);
    }
  } catch {
    mentions = seedOrgMentions(organizationId);
  }

  const filtered =
    categoryFilter && categoryFilter !== 'all'
      ? mentions.filter((m) => m.category === categoryFilter)
      : mentions;

  return {
    mentions: filtered,
    radar: evaluateBrandHealthAndCrisisRadar(mentions),
  };
}

export async function createSocialListeningMention(
  organizationId: string,
  input: CreateListeningMentionInput
): Promise<ListeningMentionItem> {
  const id = `lst_${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date();
  const cleanHandle = input.authorHandle.startsWith('@')
    ? input.authorHandle.trim()
    : `@${input.authorHandle.trim()}`;

  const analysis = analyzeMentionSignal({
    content: input.content,
    authorFollowers: input.authorFollowers,
    velocityPerHour: input.velocityPerHour,
    category: input.category,
  });

  const playbook = generateStrategicResponsePlaybook({
    authorHandle: cleanHandle,
    keywordMatched: input.keywordMatched.trim(),
    category: analysis.inferredCategory,
    sentiment: analysis.sentiment,
  });

  const item: ListeningMentionItem = {
    id,
    organizationId,
    keywordMatched: input.keywordMatched.trim(),
    channel: input.channel || 'x',
    category: analysis.inferredCategory,
    authorName: input.authorName.trim(),
    authorHandle: cleanHandle,
    authorFollowers: Math.max(50, Math.round(input.authorFollowers)),
    content: input.content.trim(),
    sentiment: analysis.sentiment,
    sentimentScore: analysis.sentimentScore,
    velocityPerHour: Math.max(1, Math.round(input.velocityPerHour)),
    urgencyScore: analysis.urgencyScore,
    crisisLevel: analysis.crisisLevel,
    status: 'open',
    playbook,
    detectedAt: now.toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  try {
    await db.insert(socialListeningMentions).values({
      id: item.id,
      organizationId,
      keywordMatched: item.keywordMatched,
      channel: item.channel,
      category: item.category,
      authorName: item.authorName,
      authorHandle: item.authorHandle,
      authorFollowers: item.authorFollowers,
      content: item.content,
      sentiment: item.sentiment,
      sentimentScore: item.sentimentScore,
      velocityPerHour: item.velocityPerHour,
      urgencyScore: item.urgencyScore,
      crisisLevel: item.crisisLevel,
      status: item.status,
      detectedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  } catch {
    // Fallback to memory store
  }

  const list = seedOrgMentions(organizationId);
  memoryStore.set(organizationId, [item, ...list]);
  return item;
}

export async function mutateSocialListeningMention(
  organizationId: string,
  mentionId: string,
  action: 'engage' | 'resolve' | 'ignore' | 'delete'
): Promise<{ deleted?: boolean; mention?: ListeningMentionItem }> {
  const list = seedOrgMentions(organizationId);

  if (action === 'delete') {
    try {
      await db
        .delete(socialListeningMentions)
        .where(
          and(
            eq(socialListeningMentions.id, mentionId),
            eq(socialListeningMentions.organizationId, organizationId)
          )
        );
    } catch {
      // Fallback to memory store
    }
    memoryStore.set(
      organizationId,
      list.filter((m) => m.id !== mentionId)
    );
    return { deleted: true };
  }

  const target = list.find((m) => m.id === mentionId);
  if (!target) {
    throw new Error('Menção não encontrada neste workspace.');
  }

  const nextStatus: ListeningMentionStatus =
    action === 'engage'
      ? 'engaged'
      : action === 'resolve'
      ? 'resolved'
      : 'ignored';

  const updated: ListeningMentionItem = {
    ...target,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  try {
    await db
      .update(socialListeningMentions)
      .set({
        status: nextStatus,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(socialListeningMentions.id, mentionId),
          eq(socialListeningMentions.organizationId, organizationId)
        )
      );
  } catch {
    // Fallback to memory store
  }

  memoryStore.set(
    organizationId,
    list.map((m) => (m.id === mentionId ? updated : m))
  );

  return { mention: updated };
}
