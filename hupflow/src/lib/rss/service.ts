import crypto from 'node:crypto';
import { db } from '@/lib/db';
import { rssFeeds, rssFeedItems } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import {
  RssFeed,
  RssFeedItem,
  ParsedFeedItem,
  ParsedFeedResult,
  CreateRssFeedInput,
  SynthesizeRssPostResult,
} from './types';

/**
 * Remove tags HTML e decodifica entidades comuns em resumos de texto.
 */
export function cleanSummaryText(rawText: string, maxLength: number = 300): string {
  if (!rawText) return '';

  let cleaned = rawText
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<style[^>]*>.*?<\/style>/gis, '')
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<[^>]+>/g, '') // Remove tags HTML
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Trunca mantendo palavra inteira
  const truncated = cleaned.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

/**
 * Parser nativo em TypeScript puro para feeds RSS 2.0 e Atom.
 */
export function parseFeedXml(xmlContent: string): ParsedFeedResult {
  if (!xmlContent || typeof xmlContent !== 'string') {
    throw new Error('Conteúdo do feed vazio ou inválido.');
  }

  const isAtom = /<feed\b[^>]*>/i.test(xmlContent) && /<entry\b/i.test(xmlContent);

  // Extrai título do canal/feed
  let channelTitle = 'Feed Sem Título';
  const titleMatch = xmlContent.match(/<title[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/title>/i);
  if (titleMatch) {
    channelTitle = cleanSummaryText(titleMatch[1] || titleMatch[2] || '');
  }

  const items: ParsedFeedItem[] = [];

  if (isAtom) {
    // Processamento Atom (<entry>)
    const entryRegex = /<entry\b[^>]*>(.*?)<\/entry>/gis;
    let match: RegExpExecArray | null;

    while ((match = entryRegex.exec(xmlContent)) !== null) {
      const entryXml = match[1];

      // Título
      const tMatch = entryXml.match(/<title[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/title>/is);
      const title = cleanSummaryText(tMatch ? tMatch[1] || tMatch[2] || '' : 'Artigo sem título');

      // Link
      const lMatch =
        entryXml.match(/<link[^>]+href=["']([^"']+)["']/i) ||
        entryXml.match(/<link[^>]*>(.*?)<\/link>/i);
      const link = lMatch ? (lMatch[1] || '').trim() : '';

      // ID / GUID
      const idMatch = entryXml.match(/<id[^>]*>(.*?)<\/id>/is);
      const guid = idMatch ? (idMatch[1] || '').trim() : link || crypto.randomUUID();

      // Data de Publicação / Atualização
      const dMatch =
        entryXml.match(/<published[^>]*>(.*?)<\/published>/is) ||
        entryXml.match(/<updated[^>]*>(.*?)<\/updated>/is);
      const pubDate = dMatch ? (dMatch[1] || '').trim() : null;

      // Resumo
      const sMatch =
        entryXml.match(/<summary[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/summary>/is) ||
        entryXml.match(/<content[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/content>/is);
      const summary = cleanSummaryText(sMatch ? sMatch[1] || sMatch[2] || '' : '');

      // Imagem
      let imageUrl: string | null = null;
      const imgMatch =
        entryXml.match(/<link[^>]+rel=["']enclosure["'][^>]+href=["']([^"']+)["']/i) ||
        entryXml.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) {
        imageUrl = imgMatch[1];
      }

      if (title && link) {
        items.push({
          guid,
          title,
          link,
          summary,
          imageUrl,
          pubDate,
        });
      }
    }
  } else {
    // Processamento RSS 2.0 (<item>)
    const itemRegex = /<item\b[^>]*>(.*?)<\/item>/gis;
    let match: RegExpExecArray | null;

    while ((match = itemRegex.exec(xmlContent)) !== null) {
      const itemXml = match[1];

      // Título
      const tMatch = itemXml.match(/<title[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/title>/is);
      const title = cleanSummaryText(tMatch ? tMatch[1] || tMatch[2] || '' : 'Artigo sem título');

      // Link
      const lMatch = itemXml.match(/<link[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/link>/is);
      const link = lMatch ? (lMatch[1] || lMatch[2] || '').trim() : '';

      // GUID
      const gMatch = itemXml.match(/<guid[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/guid>/is);
      const guid = gMatch ? (gMatch[1] || gMatch[2] || '').trim() : link || crypto.randomUUID();

      // Data de Publicação
      const dMatch = itemXml.match(/<pubDate[^>]*>(.*?)<\/pubDate>/is);
      const pubDate = dMatch ? (dMatch[1] || '').trim() : null;

      // Resumo / Descrição
      const dscMatch =
        itemXml.match(/<description[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/description>/is) ||
        itemXml.match(/<content:encoded[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/content:encoded>/is);
      const summary = cleanSummaryText(dscMatch ? dscMatch[1] || dscMatch[2] || '' : '');

      // Imagem de capa
      let imageUrl: string | null = null;
      const encMatch =
        itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i) ||
        itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i) ||
        itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i) ||
        itemXml.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (encMatch) {
        imageUrl = encMatch[1];
      }

      if (title && link) {
        items.push({
          guid,
          title,
          link,
          summary,
          imageUrl,
          pubDate,
        });
      }
    }
  }

  return {
    title: channelTitle,
    items,
  };
}

/**
 * Busca e analisa um feed a partir de sua URL.
 */
export async function fetchAndParseFeed(feedUrl: string): Promise<ParsedFeedResult> {
  const url = feedUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    throw new Error('A URL do feed deve iniciar com http:// ou https://');
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; HupFlow-RssBot/1.0; +https://hupflow.com)',
      Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
    },
    signal: AbortSignal.timeout(8000), // Timeout de 8 segundos
  });

  if (!response.ok) {
    throw new Error(`Falha ao carregar feed. Status HTTP: ${response.status}`);
  }

  const xmlText = await response.text();
  return parseFeedXml(xmlText);
}

/**
 * Síntese inteligente de artigo para formato de post em redes sociais.
 */
export function synthesizeRssPostContent(
  article: { title: string; link: string; summary?: string | null },
  network: string = 'linkedin',
  tone: string = 'educational'
): SynthesizeRssPostResult {
  const title = article.title.trim();
  const summary = article.summary?.trim() || '';
  const link = article.link.trim();

  const hashtags = ['Tecnologia', 'Inovacao', 'SaaS', 'MercadoDigital'];
  const hooks = [
    `Você viu esta novidade? "${title}"`,
    `Um dos temas mais comentados hoje: ${title}`,
    `Por que este artigo sobre "${title}" merece sua atenção agora:`,
  ];

  if (network === 'x') {
    // Limite rígido do X: 280 caracteres
    const maxTitleLen = 140;
    const cleanTitle = title.length > maxTitleLen ? title.slice(0, maxTitleLen) + '...' : title;
    const content = `📰 ${cleanTitle}\n\nConfira os detalhes no link abaixo:\n${link}\n\n#Inovacao #Tech`;
    return {
      content,
      hooks,
      hashtags: ['Inovacao', 'Tech'],
      targetNetwork: 'x',
    };
  }

  if (network === 'threads') {
    const content = `Acabei de ler este artigo sobre "${title}" e achei as reflexões fundamentais.\n\n${summary ? summary.slice(0, 180) + '...' : ''}\n\nO que vocês acham dessa abordagem?\n\nLink: ${link}`;
    return {
      content,
      hooks,
      hashtags: ['Tech', 'Negocios'],
      targetNetwork: 'threads',
    };
  }

  // LinkedIn (padrão)
  const content = `${hooks[0]}\n\nPrincipais pontos destacados:\n\n• ${summary || title}\n• Impacto direto para profissionais e empresas do setor.\n• Vale a leitura completa para aprofundar.\n\n🔗 Leia o artigo na íntegra: ${link}\n\nQual a sua visão sobre esse movimento?\n\n#${hashtags.join(' #')}`;

  return {
    content,
    hooks,
    hashtags,
    targetNetwork: 'linkedin',
  };
}

/**
 * Lista feeds do workspace acompanhados dos seus itens mais recentes.
 */
export async function listFeedsWithRecentItems(
  organizationId: string
): Promise<{ feeds: any[]; recentItems: RssFeedItem[] }> {
  const feeds = await db
    .select()
    .from(rssFeeds)
    .where(eq(rssFeeds.organizationId, organizationId))
    .orderBy(desc(rssFeeds.createdAt));

  const items = await db
    .select()
    .from(rssFeedItems)
    .where(eq(rssFeedItems.organizationId, organizationId))
    .orderBy(desc(rssFeedItems.createdAt))
    .limit(30);

  const formattedItems: RssFeedItem[] = items.map((r) => ({
    id: r.id,
    feedId: r.feedId,
    organizationId: r.organizationId,
    guid: r.guid,
    title: r.title,
    link: r.link,
    summary: r.summary,
    imageUrl: r.imageUrl,
    pubDate: r.pubDate ? r.pubDate.toISOString() : null,
    status: r.status as any,
    postId: r.postId,
    createdAt: r.createdAt.toISOString(),
  }));

  const formattedFeeds = feeds.map((f) => ({
    id: f.id,
    organizationId: f.organizationId,
    name: f.name,
    url: f.url,
    status: f.status,
    autoPublish: f.autoPublish,
    targetNetworks: f.targetNetworks || ['linkedin', 'x'],
    lastFetchedAt: f.lastFetchedAt ? f.lastFetchedAt.toISOString() : null,
    lastError: f.lastError,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }));

  return {
    feeds: formattedFeeds,
    recentItems: formattedItems,
  };
}

/**
 * Cria e testa a conexão de um novo feed RSS no workspace.
 */
export async function createRssFeed(
  organizationId: string,
  input: CreateRssFeedInput
): Promise<RssFeed> {
  const parsed = await fetchAndParseFeed(input.url);

  const id = `rss_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date();

  await db.insert(rssFeeds).values({
    id,
    organizationId,
    url: input.url.trim(),
    name: input.name.trim() || parsed.title,
    status: 'active',
    autoPublish: input.autoPublish ?? false,
    targetNetworks: input.targetNetworks || ['linkedin', 'x'],
    lastFetchedAt: now,
    lastError: null,
    createdAt: now,
    updatedAt: now,
  });

  // Salva os primeiros itens encontrados
  for (const item of parsed.items.slice(0, 10)) {
    try {
      const itemId = `rsi_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      const pubDate = item.pubDate ? new Date(item.pubDate) : now;

      await db.insert(rssFeedItems).values({
        id: itemId,
        feedId: id,
        organizationId,
        guid: item.guid,
        title: item.title,
        link: item.link,
        summary: item.summary,
        imageUrl: item.imageUrl,
        pubDate: isNaN(pubDate.getTime()) ? now : pubDate,
        status: 'pending',
        createdAt: now,
      });
    } catch {
      // Ignora duplicata individual
    }
  }

  return {
    id,
    organizationId,
    name: input.name.trim() || parsed.title,
    url: input.url.trim(),
    status: 'active',
    autoPublish: input.autoPublish ?? false,
    targetNetworks: input.targetNetworks || ['linkedin', 'x'],
    lastFetchedAt: now.toISOString(),
    lastError: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Sincroniza e busca novos itens de um feed específico.
 */
export async function syncRssFeed(organizationId: string, feedId: string): Promise<number> {
  const rows = await db
    .select()
    .from(rssFeeds)
    .where(and(eq(rssFeeds.id, feedId), eq(rssFeeds.organizationId, organizationId)))
    .limit(1);

  if (rows.length === 0) {
    throw new Error('Feed não encontrado.');
  }

  const feed = rows[0];
  const now = new Date();

  try {
    const parsed = await fetchAndParseFeed(feed.url);
    let newItemsCount = 0;

    for (const item of parsed.items) {
      // Verifica se já existe por guid
      const existing = await db
        .select()
        .from(rssFeedItems)
        .where(
          and(
            eq(rssFeedItems.feedId, feed.id),
            eq(rssFeedItems.guid, item.guid)
          )
        )
        .limit(1);

      if (existing.length === 0) {
        const itemId = `rsi_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
        const pubDate = item.pubDate ? new Date(item.pubDate) : now;

        await db.insert(rssFeedItems).values({
          id: itemId,
          feedId: feed.id,
          organizationId,
          guid: item.guid,
          title: item.title,
          link: item.link,
          summary: item.summary,
          imageUrl: item.imageUrl,
          pubDate: isNaN(pubDate.getTime()) ? now : pubDate,
          status: 'pending',
          createdAt: now,
        });

        newItemsCount++;
      }
    }

    await db
      .update(rssFeeds)
      .set({
        lastFetchedAt: now,
        lastError: null,
        status: 'active',
        updatedAt: now,
      })
      .where(eq(rssFeeds.id, feed.id));

    return newItemsCount;
  } catch (err: any) {
    console.error(`[RssSync] Erro ao sincronizar feed ${feed.id}:`, err);
    await db
      .update(rssFeeds)
      .set({
        lastError: err.message || 'Falha na requisição HTTP',
        status: 'error',
        updatedAt: now,
      })
      .where(eq(rssFeeds.id, feed.id));
    throw err;
  }
}

/**
 * Exclui um feed RSS e todos os seus itens associados.
 */
export async function deleteRssFeed(organizationId: string, feedId: string): Promise<boolean> {
  await db
    .delete(rssFeeds)
    .where(and(eq(rssFeeds.id, feedId), eq(rssFeeds.organizationId, organizationId)));

  return true;
}
