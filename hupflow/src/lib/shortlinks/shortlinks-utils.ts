import { ShortLinkVariant, SocialNetwork, UtmParams } from './types';

export const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Normaliza e higieniza um slug personalizado.
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
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
