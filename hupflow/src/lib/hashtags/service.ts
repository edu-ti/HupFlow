import crypto from 'node:crypto';
import { z } from 'zod';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { db } from '@/lib/db';
import { hashtagSets } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import {
  HashtagRecommendation,
  NetworkGuidance,
  SocialNetwork,
  HashtagTier,
  RecommendHashtagsInput,
  HashtagRecommendationResult,
  HashtagSet,
  CreateHashtagSetInput,
} from './types';

/**
 * Diretrizes recomendadas por rede social para máxima indexação e engajamento.
 */
export const NETWORK_GUIDELINES: Record<SocialNetwork, NetworkGuidance> = {
  linkedin: {
    network: 'linkedin',
    recommendedCount: 5,
    maxAllowed: 8,
    tip: 'No LinkedIn, 3 a 5 hashtags corporativas e focadas no setor geram a melhor indexação nos canais temáticos.',
  },
  x: {
    network: 'x',
    recommendedCount: 2,
    maxAllowed: 3,
    tip: 'No X (Twitter), use apenas 1 ou 2 hashtags curtas para economizar caracteres e evitar sinalização de spam.',
  },
  instagram: {
    network: 'instagram',
    recommendedCount: 5,
    maxAllowed: 30,
    tip: 'No Instagram, combine tags amplas, de nicho e comunidade (3 a 5 no total) para indexar na aba Explorar.',
  },
  threads: {
    network: 'threads',
    recommendedCount: 1,
    maxAllowed: 3,
    tip: 'No Threads, 1 tag contextual relevante cria um tópico clicável de alta visibilidade.',
  },
};

/**
 * Higieniza e formata uma palavra para padrão válido de hashtag (PascalCase sem pontuação).
 */
export function sanitizeTag(rawTag: string): string {
  if (!rawTag) return '';
  const cleaned = rawTag
    .replace(/^#+/, '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-zA-Z0-9_\s-]/g, ''); // remove símbolos exceto espaços e separadores

  if (!cleaned) return '';

  // Se houver delimitadores explícitos (espaço, hífen ou underline)
  if (/[\s_-]/.test(cleaned)) {
    const words = cleaned.split(/[\s_-]+/).filter(Boolean);
    return words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
  }

  // Se for palavra única, preserva capitalização interna (ex: MarketingDigital, SaaS)
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Retorna as diretrizes de melhores práticas para uma rede social específica.
 */
export function getNetworkGuidance(network?: SocialNetwork): NetworkGuidance {
  if (!network || !NETWORK_GUIDELINES[network]) {
    return NETWORK_GUIDELINES.linkedin;
  }
  return NETWORK_GUIDELINES[network];
}

/**
 * Classifica a hashtag em um tier de alcance conforme sua especificidade e relevância.
 */
export function categorizeHashtagTier(tag: string, score: number): HashtagTier {
  if (score >= 85) return 'broad';
  if (score >= 70) return 'niche';
  return 'community';
}

export function getEstimatedReach(tier: HashtagTier): 'high' | 'medium' | 'targeted' {
  if (tier === 'broad') return 'high';
  if (tier === 'niche') return 'medium';
  return 'targeted';
}

/**
 * Dicionário canônico de nichos para fallback semântico de alta precisão.
 */
const CANONICAL_NICHE_DICT: Record<string, { tag: string; tier: HashtagTier; baseScore: number; keywords: string[] }[]> = {
  tech: [
    { tag: 'SaaS', tier: 'broad', baseScore: 95, keywords: ['saas', 'software', 'cloud', 'plataforma', 'mrr'] },
    { tag: 'Startups', tier: 'broad', baseScore: 92, keywords: ['startup', 'investimento', 'scaleup', 'venture'] },
    { tag: 'Tecnologia', tier: 'broad', baseScore: 90, keywords: ['tech', 'tecnologia', 'codigo', 'dev', 'ia', 'ai'] },
    { tag: 'InteligenciaArtificial', tier: 'niche', baseScore: 88, keywords: ['ia', 'ai', 'llm', 'automacao', 'gpt'] },
    { tag: 'MarketingB2B', tier: 'niche', baseScore: 84, keywords: ['b2b', 'vendas', 'prospeccao', 'lead'] },
    { tag: 'ProductManagement', tier: 'community', baseScore: 78, keywords: ['produto', 'roadmap', 'feature', 'ux'] },
  ],
  marketing: [
    { tag: 'MarketingDigital', tier: 'broad', baseScore: 96, keywords: ['marketing', 'conteudo', 'post', 'publicacao'] },
    { tag: 'CriadoresDeConteudo', tier: 'niche', baseScore: 87, keywords: ['criador', 'creator', 'influenciador', 'audiencia'] },
    { tag: 'GestaoDeMidias', tier: 'niche', baseScore: 82, keywords: ['midias', 'redes', 'socialmedia', 'engajamento'] },
    { tag: 'Copywriting', tier: 'niche', baseScore: 80, keywords: ['copy', 'texto', 'legenda', 'escrita'] },
    { tag: 'Branding', tier: 'community', baseScore: 75, keywords: ['marca', 'identidade', 'posicionamento'] },
  ],
  business: [
    { tag: 'Empreendedorismo', tier: 'broad', baseScore: 94, keywords: ['negocios', 'empresa', 'carreira', 'escala'] },
    { tag: 'Lideranca', tier: 'broad', baseScore: 89, keywords: ['equipe', 'time', 'gestao', 'lider'] },
    { tag: 'Produtividade', tier: 'niche', baseScore: 86, keywords: ['tempo', 'foco', 'habito', 'rotina', 'burnout'] },
    { tag: 'Vendas', tier: 'niche', baseScore: 83, keywords: ['venda', 'conversao', 'cliente', 'receita'] },
  ],
};

/**
 * Motor de IA para recomendação de hashtags estratégicas.
 */
export async function recommendHashtags(
  input: RecommendHashtagsInput
): Promise<HashtagRecommendationResult> {
  const guidance = getNetworkGuidance(input.network);
  const targetLimit = input.limit || 8;
  const contextText = `${input.topic || ''} ${input.text || ''}`.trim();

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && contextText.length > 5) {
    try {
      const openai = createOpenAI({ apiKey });
      const prompt = `Analise o texto e tema a seguir e sugira até ${targetLimit} hashtags estratégicas para a rede social ${guidance.network.toUpperCase()}.\nContexto: "${contextText}".\nEvite símbolos # nas tags. Classifique o tier em broad (grande alcance), niche (nicho específico) ou community (comunidade direcionada). Atribua um score de relevância de 50 a 100.`;

      const schema = z.object({
        tags: z.array(
          z.object({
            tag: z.string(),
            tier: z.enum(['broad', 'niche', 'community']),
            relevanceScore: z.number().min(50).max(100),
            category: z.string().default('general'),
          })
        ),
      });

      const { object } = await generateObject({
        model: openai('gpt-4o-mini'),
        schema,
        prompt,
      });

      const recommendations: HashtagRecommendation[] = object.tags.slice(0, targetLimit).map((item) => {
        const clean = sanitizeTag(item.tag);
        return {
          tag: clean,
          formattedTag: `#${clean}`,
          tier: item.tier,
          relevanceScore: item.relevanceScore,
          estimatedReach: getEstimatedReach(item.tier),
          category: item.category || 'Recomendado por IA',
        };
      });

      if (recommendations.length > 0) {
        return { recommendations, guidance };
      }
    } catch (err) {
      console.warn('[HashtagService] Erro ao consultar IA, utilizando fallback semântico heurístico:', err);
    }
  }

  // Fallback semântico heurístico de alta precisão
  const normalizedContext = contextText.toLowerCase();
  const scoredCandidates: { tag: string; tier: HashtagTier; score: number; category: string }[] = [];

  for (const [catName, list] of Object.entries(CANONICAL_NICHE_DICT)) {
    for (const item of list) {
      let score = item.baseScore;
      const matchFound = item.keywords.some((kw) => normalizedContext.includes(kw));

      if (matchFound) {
        score = Math.min(100, score + 5);
      } else {
        score = Math.max(55, score - 15);
      }

      scoredCandidates.push({
        tag: item.tag,
        tier: item.tier,
        score,
        category: catName,
      });
    }
  }

  // Ordena por score decrescente e seleciona os melhores
  scoredCandidates.sort((a, b) => b.score - a.score);

  const finalTags = scoredCandidates.slice(0, targetLimit).map((item) => {
    const clean = sanitizeTag(item.tag);
    return {
      tag: clean,
      formattedTag: `#${clean}`,
      tier: item.tier,
      relevanceScore: item.score,
      estimatedReach: getEstimatedReach(item.tier),
      category: item.category,
    };
  });

  return {
    recommendations: finalTags,
    guidance,
  };
}

/**
 * Lista todas as coleções de hashtags salvas da organização.
 */
export async function listHashtagSets(organizationId: string): Promise<HashtagSet[]> {
  const rows = await db
    .select()
    .from(hashtagSets)
    .where(eq(hashtagSets.organizationId, organizationId))
    .orderBy(desc(hashtagSets.usageCount), desc(hashtagSets.createdAt));

  return rows.map((r) => ({
    id: r.id,
    organizationId: r.organizationId,
    name: r.name,
    category: r.category,
    tags: r.tags || [],
    usageCount: r.usageCount,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

/**
 * Cria uma nova coleção de hashtags salvas para o workspace.
 */
export async function createHashtagSet(
  organizationId: string,
  input: CreateHashtagSetInput
): Promise<HashtagSet> {
  if (!input.name || !input.name.trim()) {
    throw new Error('O nome da coleção de hashtags é obrigatório.');
  }

  const cleanedTags = (input.tags || [])
    .map((t) => sanitizeTag(t))
    .filter(Boolean);

  if (cleanedTags.length === 0) {
    throw new Error('Informe ao menos uma hashtag válida para a coleção.');
  }

  const id = `hts_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date();

  await db.insert(hashtagSets).values({
    id,
    organizationId,
    name: input.name.trim(),
    category: input.category?.trim() || 'general',
    tags: cleanedTags,
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    organizationId,
    name: input.name.trim(),
    category: input.category?.trim() || 'general',
    tags: cleanedTags,
    usageCount: 0,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Remove uma coleção de hashtags da organização.
 */
export async function deleteHashtagSet(
  organizationId: string,
  setId: string
): Promise<boolean> {
  await db
    .delete(hashtagSets)
    .where(and(eq(hashtagSets.id, setId), eq(hashtagSets.organizationId, organizationId)));

  return true;
}

/**
 * Incrementa a contagem de uso de uma coleção quando injetada em um post.
 */
export async function incrementSetUsage(
  organizationId: string,
  setId: string
): Promise<void> {
  const row = await db
    .select()
    .from(hashtagSets)
    .where(and(eq(hashtagSets.id, setId), eq(hashtagSets.organizationId, organizationId)))
    .limit(1);

  if (row.length > 0) {
    await db
      .update(hashtagSets)
      .set({
        usageCount: row[0].usageCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(hashtagSets.id, setId));
  }
}
