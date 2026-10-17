import crypto from 'node:crypto';
import { db } from '@/lib/db';
import { shortLinks, shortLinkClicks } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import {
  ShortLink,
  CreateShortLinkInput,
  UtmParams,
  ShortLinkVariant,
  SocialNetwork,
} from './types';

const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Gera um slug alfanumérico curto e criptograficamente aleatório em Base62.
 */
export function generateShortSlug(length: number = 6): string {
  const bytes = crypto.randomBytes(length);
  let slug = '';
  for (let i = 0; i < length; i++) {
    slug += BASE62_ALPHABET[bytes[i] % BASE62_ALPHABET.length];
  }
  return slug;
}

/**
 * Normaliza e higieniza um slug personalizado.
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9-_]/g, '-') // substitui caracteres inválidos por hífen
    .replace(/-+/g, '-') // remove múltiplos hífens
    .replace(/^-|-$/g, ''); // remove hífens nas bordas
}

/**
 * Constrói uma URL final com parâmetros UTM injetados com segurança.
 */
export function buildUtmUrl(destinationUrl: string, params: UtmParams): string {
  let urlStr = destinationUrl.trim();
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = `https://${urlStr}`;
  }

  const url = new URL(urlStr);

  if (params.utmSource) url.searchParams.set('utm_source', params.utmSource.trim());
  if (params.utmMedium) url.searchParams.set('utm_medium', params.utmMedium.trim());
  if (params.utmCampaign) url.searchParams.set('utm_campaign', params.utmCampaign.trim());
  if (params.utmContent) url.searchParams.set('utm_content', params.utmContent.trim());
  if (params.utmTerm) url.searchParams.set('utm_term', params.utmTerm.trim());

  return url.toString();
}

/**
 * Gera variantes com tags UTM específicas para os canais suportados.
 */
export function generateChannelVariants(
  destinationUrl: string,
  baseParams: UtmParams
): ShortLinkVariant[] {
  const channels: { network: SocialNetwork; label: string; utmSource: string }[] = [
    { network: 'instagram', label: 'Instagram (Bio & Stories)', utmSource: 'instagram' },
    { network: 'threads', label: 'Threads', utmSource: 'threads' },
    { network: 'linkedin', label: 'LinkedIn', utmSource: 'linkedin' },
    { network: 'x', label: 'X (Twitter)', utmSource: 'x' },
  ];

  return channels.map((ch) => ({
    network: ch.network,
    label: ch.label,
    utmSource: ch.utmSource,
    url: buildUtmUrl(destinationUrl, {
      ...baseParams,
      utmSource: ch.utmSource,
      utmMedium: baseParams.utmMedium || 'social',
    }),
  }));
}

/**
 * Cria e persiste um novo link encurtado com tags UTM.
 */
export async function createShortLink(
  organizationId: string,
  input: CreateShortLinkInput,
  createdById?: string
): Promise<ShortLink> {
  if (!input.destinationUrl || !input.destinationUrl.trim()) {
    throw new Error('A URL de destino é obrigatória.');
  }

  let finalSlug: string;

  if (input.customSlug && input.customSlug.trim()) {
    finalSlug = sanitizeSlug(input.customSlug);
    if (finalSlug.length < 3) {
      throw new Error('O slug personalizado deve ter pelo menos 3 caracteres.');
    }

    // Verifica disponibilidade
    const existing = await db
      .select()
      .from(shortLinks)
      .where(eq(shortLinks.slug, finalSlug))
      .limit(1);

    if (existing.length > 0) {
      throw new Error(`O slug "${finalSlug}" já está em uso. Escolha outro identificador.`);
    }
  } else {
    // Gera slug aleatório em loop seguro
    let attempts = 0;
    while (true) {
      finalSlug = generateShortSlug(6);
      const existing = await db
        .select()
        .from(shortLinks)
        .where(eq(shortLinks.slug, finalSlug))
        .limit(1);

      if (existing.length === 0) break;
      attempts++;
      if (attempts > 10) {
        throw new Error('Não foi possível gerar um slug único no momento.');
      }
    }
  }

  const id = `lnk_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date();

  await db.insert(shortLinks).values({
    id,
    organizationId,
    slug: finalSlug,
    destinationUrl: input.destinationUrl.trim(),
    title: input.title.trim() || input.destinationUrl.trim(),
    utmCampaign: input.utmCampaign?.trim() || null,
    utmMedium: input.utmMedium?.trim() || 'social',
    utmContent: input.utmContent?.trim() || null,
    utmTerm: input.utmTerm?.trim() || null,
    totalClicks: 0,
    createdById: createdById || null,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    organizationId,
    slug: finalSlug,
    destinationUrl: input.destinationUrl.trim(),
    title: input.title.trim() || input.destinationUrl.trim(),
    utmCampaign: input.utmCampaign?.trim() || null,
    utmMedium: input.utmMedium?.trim() || 'social',
    utmContent: input.utmContent?.trim() || null,
    utmTerm: input.utmTerm?.trim() || null,
    totalClicks: 0,
    lastClickedAt: null,
    createdById: createdById || null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Resolve o slug, incrementa a contagem de cliques e retorna a URL final enriquecida.
 */
export async function resolveAndTrackShortLink(
  slug: string,
  telemetry?: { referer?: string; userAgent?: string; ipAddress?: string; channelHint?: string }
): Promise<{ destinationUrl: string } | null> {
  const cleanSlug = slug.trim();

  const rows = await db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.slug, cleanSlug))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }

  const link = rows[0];
  const now = new Date();

  // Injeção de parâmetros UTM gravados
  const finalUrl = buildUtmUrl(link.destinationUrl, {
    utmSource: link.utmSource || undefined,
    utmMedium: link.utmMedium || undefined,
    utmCampaign: link.utmCampaign || undefined,
    utmContent: link.utmContent || undefined,
    utmTerm: link.utmTerm || undefined,
  });

  // Atualização assíncrona não-bloqueante
  try {
    await db
      .update(shortLinks)
      .set({
        totalClicks: link.totalClicks + 1,
        lastClickedAt: now,
        updatedAt: now,
      })
      .where(eq(shortLinks.id, link.id));

    const clickId = `clk_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    await db.insert(shortLinkClicks).values({
      id: clickId,
      shortLinkId: link.id,
      organizationId: link.organizationId,
      referer: telemetry?.referer || null,
      userAgent: telemetry?.userAgent || null,
      ipAddress: telemetry?.ipAddress || null,
      channelHint: telemetry?.channelHint || null,
      clickedAt: now,
    });
  } catch (err) {
    console.error('[ShortLinkService] Erro ao gravar telemetria de clique:', err);
  }

  return { destinationUrl: finalUrl };
}

/**
 * Lista links encurtados da organização.
 */
export async function listShortLinks(organizationId: string): Promise<ShortLink[]> {
  const rows = await db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.organizationId, organizationId))
    .orderBy(desc(shortLinks.createdAt));

  return rows.map((r) => ({
    id: r.id,
    organizationId: r.organizationId,
    slug: r.slug,
    destinationUrl: r.destinationUrl,
    title: r.title,
    utmSource: r.utmSource,
    utmMedium: r.utmMedium,
    utmCampaign: r.utmCampaign,
    utmContent: r.utmContent,
    utmTerm: r.utmTerm,
    totalClicks: r.totalClicks,
    lastClickedAt: r.lastClickedAt ? r.lastClickedAt.toISOString() : null,
    createdById: r.createdById,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

/**
 * Exclui um link encurtado do workspace.
 */
export async function deleteShortLink(
  organizationId: string,
  linkId: string
): Promise<boolean> {
  await db
    .delete(shortLinks)
    .where(and(eq(shortLinks.id, linkId), eq(shortLinks.organizationId, organizationId)));

  return true;
}
