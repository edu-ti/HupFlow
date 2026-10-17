import crypto from 'node:crypto';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contentRepurposingKits } from '@/lib/db/schema';
import {
  ContentRepurposingKit,
  CreateRepurposingKitInput,
  RepurposingKitStatus,
  RepurposingSummaryMetrics,
  CarouselSlideItem,
  XThreadTweet,
  VerticalReelScript,
  ExecutiveNewsletter,
} from './types';
import {
  decomposeLongFormContent,
  generateCarouselSlides,
  generateXThread,
  generateVerticalReelScript,
  generateExecutiveNewsletter,
  summarizeRepurposingPortfolio,
} from './repurpose.test';

const memoryStore = new Map<string, ContentRepurposingKit[]>();

function seedOrgKits(organizationId: string): ContentRepurposingKit[] {
  const existing = memoryStore.get(organizationId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const now = new Date().toISOString();

  const raw1 = `
    A inteligência artificial não substitui a estratégia de marketing, ela multiplica a velocidade de quem já tem um posicionamento claro.
    O principal erro dos criadores é delegar o pensamento crítico para o modelo, resultando em conteúdos genéricos sem diferenciação.
    Para vencer na era algorítmica, use a IA como braço executor de síntese e adaptação de formato, mantendo a tese autoral e os dados reais sob seu controle.
    Estruture um canal de distribuição sistemático em que cada hora investida em conteúdo profundo alimente múltiplos pontos de contato ao longo da semana.
  `;

  const kit1: ContentRepurposingKit = {
    id: 'rep_seed_ia_strategy',
    organizationId,
    title: 'Como Escalar Conteúdo B2B com IA Mantendo a Voz Autoral',
    sourceType: 'youtube_transcript',
    sourceUrl: 'https://youtube.com/watch?v=hupflow-demo-01',
    sourceWordCount: decomposeLongFormContent(raw1).wordCount,
    tone: 'authoritative',
    status: 'approved',
    carouselSlides: generateCarouselSlides('Como Escalar Conteúdo B2B com IA', raw1, 'authoritative'),
    xThread: generateXThread('Como Escalar Conteúdo B2B com IA', raw1, 'provocative_growth'),
    reelScript: generateVerticalReelScript('Escalar Conteúdo B2B com IA', raw1, 'authoritative'),
    newsletter: generateExecutiveNewsletter('Escalar Conteúdo B2B com IA', raw1, 'authoritative'),
    tags: ['ia', 'b2b', 'posicionamento', 'growth'],
    estimatedTimeSavedMinutes: 240,
    createdAt: now,
    updatedAt: now,
  };

  const raw2 = `
    Funis de vendas orientados a retenção geram 3 vezes mais LTV do que campanhas de aquisição agressivas e sem nutrição.
    Quando sua taxa de churn supera 4% ao mês, colocar mais leads no topo do funil é como encher um balde furado com mangueira de alta pressão.
    A solução estrutural é criar marcos de ativação rápidos e circuitos de onboarding que comprovem o valor do produto nos primeiros 7 dias.
    Acompanhe métricas de retenção por coorte e celebre as pequenas vitórias do cliente antes de tentar qualquer oferta de expansão ou upsell.
  `;

  const kit2: ContentRepurposingKit = {
    id: 'rep_seed_saas_retention',
    organizationId,
    title: 'A Matemática Secreta do Churn: Por que Retenção Supera Aquisição',
    sourceType: 'podcast_audio',
    sourceUrl: 'https://spotify.com/episode/hupflow-retention-playbook',
    sourceWordCount: decomposeLongFormContent(raw2).wordCount,
    tone: 'provocative_growth',
    status: 'draft',
    carouselSlides: generateCarouselSlides('A Matemática Secreta do Churn', raw2, 'provocative_growth'),
    xThread: generateXThread('A Matemática Secreta do Churn', raw2, 'provocative_growth'),
    reelScript: generateVerticalReelScript('A Matemática Secreta do Churn', raw2, 'provocative_growth'),
    newsletter: generateExecutiveNewsletter('A Matemática Secreta do Churn', raw2, 'provocative_growth'),
    tags: ['saas', 'churn', 'retencao', 'ltv'],
    estimatedTimeSavedMinutes: 210,
    createdAt: now,
    updatedAt: now,
  };

  const seeds = [kit1, kit2];
  memoryStore.set(organizationId, seeds);
  return seeds;
}

export async function getContentRepurposingKits(
  organizationId: string
): Promise<ContentRepurposingKit[]> {
  try {
    const rows = await db
      .select()
      .from(contentRepurposingKits)
      .where(eq(contentRepurposingKits.organizationId, organizationId))
      .orderBy(desc(contentRepurposingKits.createdAt));

    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        organizationId: r.organizationId,
        title: r.title,
        sourceType: r.sourceType as any,
        sourceUrl: r.sourceUrl || undefined,
        sourceWordCount: r.sourceWordCount,
        tone: r.tone as any,
        status: r.status as any,
        carouselSlides: r.carouselSlides as CarouselSlideItem[],
        xThread: r.xThread as XThreadTweet[],
        reelScript: r.reelScript as VerticalReelScript,
        newsletter: r.newsletter as ExecutiveNewsletter,
        tags: (r.tags as string[]) || [],
        estimatedTimeSavedMinutes: r.estimatedTimeSavedMinutes,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (error) {
    // Database connection or table unavailable; fallback to memory store
  }

  return seedOrgKits(organizationId);
}

export async function getContentRepurposingKitById(
  organizationId: string,
  id: string
): Promise<ContentRepurposingKit | null> {
  try {
    const rows = await db
      .select()
      .from(contentRepurposingKits)
      .where(
        and(
          eq(contentRepurposingKits.organizationId, organizationId),
          eq(contentRepurposingKits.id, id)
        )
      )
      .limit(1);

    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        organizationId: r.organizationId,
        title: r.title,
        sourceType: r.sourceType as any,
        sourceUrl: r.sourceUrl || undefined,
        sourceWordCount: r.sourceWordCount,
        tone: r.tone as any,
        status: r.status as any,
        carouselSlides: r.carouselSlides as CarouselSlideItem[],
        xThread: r.xThread as XThreadTweet[],
        reelScript: r.reelScript as VerticalReelScript,
        newsletter: r.newsletter as ExecutiveNewsletter,
        tags: (r.tags as string[]) || [],
        estimatedTimeSavedMinutes: r.estimatedTimeSavedMinutes,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      };
    }
  } catch (error) {
    // Database fallback
  }

  const memory = seedOrgKits(organizationId);
  return memory.find(k => k.id === id) || null;
}

export async function createContentRepurposingKit(
  organizationId: string,
  input: CreateRepurposingKitInput
): Promise<ContentRepurposingKit> {
  const tone = input.tone || 'authoritative';
  const decomposed = decomposeLongFormContent(input.rawText);

  const carouselSlides = generateCarouselSlides(input.title, input.rawText, tone);
  const xThread = generateXThread(input.title, input.rawText, tone);
  const reelScript = generateVerticalReelScript(input.title, input.rawText, tone);
  const newsletter = generateExecutiveNewsletter(input.title, input.rawText, tone);

  // Time saved estimation: ~240 min for preparing 4 formats from scratch
  const estimatedTimeSavedMinutes = Math.max(180, Math.round(decomposed.wordCount * 0.4) + 120);

  const id = `rep_${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const newKit: ContentRepurposingKit = {
    id,
    organizationId,
    title: input.title.trim(),
    sourceType: input.sourceType,
    sourceUrl: input.sourceUrl?.trim() || undefined,
    sourceWordCount: decomposed.wordCount,
    tone,
    status: 'draft',
    carouselSlides,
    xThread,
    reelScript,
    newsletter,
    tags: input.tags && input.tags.length > 0 ? input.tags : ['repurpose', 'ia'],
    estimatedTimeSavedMinutes,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.insert(contentRepurposingKits).values({
      id: newKit.id,
      organizationId: newKit.organizationId,
      title: newKit.title,
      sourceType: newKit.sourceType,
      sourceUrl: newKit.sourceUrl || null,
      sourceWordCount: newKit.sourceWordCount,
      tone: newKit.tone,
      status: newKit.status,
      carouselSlides: newKit.carouselSlides,
      xThread: newKit.xThread,
      reelScript: newKit.reelScript,
      newsletter: newKit.newsletter,
      tags: newKit.tags,
      estimatedTimeSavedMinutes: newKit.estimatedTimeSavedMinutes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    // Database fallback
  }

  const existing = seedOrgKits(organizationId);
  memoryStore.set(organizationId, [newKit, ...existing]);

  return newKit;
}

export async function updateRepurposingKitStatus(
  organizationId: string,
  id: string,
  status: RepurposingKitStatus
): Promise<ContentRepurposingKit | null> {
  const now = new Date().toISOString();

  try {
    await db
      .update(contentRepurposingKits)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(contentRepurposingKits.organizationId, organizationId),
          eq(contentRepurposingKits.id, id)
        )
      );
  } catch (error) {
    // Database fallback
  }

  const kits = seedOrgKits(organizationId);
  const target = kits.find(k => k.id === id);
  if (target) {
    target.status = status;
    target.updatedAt = now;
    return target;
  }
  return null;
}

export async function deleteContentRepurposingKit(
  organizationId: string,
  id: string
): Promise<boolean> {
  try {
    await db
      .delete(contentRepurposingKits)
      .where(
        and(
          eq(contentRepurposingKits.organizationId, organizationId),
          eq(contentRepurposingKits.id, id)
        )
      );
  } catch (error) {
    // Database fallback
  }

  const kits = seedOrgKits(organizationId);
  const filtered = kits.filter(k => k.id !== id);
  memoryStore.set(organizationId, filtered);
  return true;
}

export async function getRepurposingSummaryMetrics(
  organizationId: string
): Promise<RepurposingSummaryMetrics> {
  const kits = await getContentRepurposingKits(organizationId);
  return summarizeRepurposingPortfolio(kits);
}
