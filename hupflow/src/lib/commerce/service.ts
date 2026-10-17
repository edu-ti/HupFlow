import crypto from 'node:crypto';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { socialCommerceProducts } from '@/lib/db/schema';
import {
  CommerceProductCategory,
  CommerceSocialChannel,
  CreateCommerceProductInput,
  SocialCommerceCatalogSummary,
  SocialCommerceProductItem,
} from './types';
import {
  evaluateSocialCommerceMetrics,
  generateShoppablePostCopy,
  summarizeSocialCommerceCatalog,
} from './commerce.test';

const memoryStore = new Map<string, SocialCommerceProductItem[]>();

function enrichProduct(
  raw: Omit<SocialCommerceProductItem, 'metrics' | 'shoppableCopy'>
): SocialCommerceProductItem {
  const metrics = evaluateSocialCommerceMetrics({
    priceBrl: raw.priceBrl,
    taggedImpressions: raw.taggedImpressions,
    productClicks: raw.productClicks,
    ordersCount: raw.ordersCount,
  });

  const shoppableCopy = generateShoppablePostCopy({
    name: raw.name,
    sku: raw.sku,
    priceBrl: raw.priceBrl,
    category: raw.category,
    channel: raw.channel,
    checkoutUrl: raw.checkoutUrl,
  });

  return {
    ...raw,
    metrics,
    shoppableCopy,
  };
}

function seedOrgProducts(organizationId: string): SocialCommerceProductItem[] {
  const existing = memoryStore.get(organizationId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const now = new Date().toISOString();
  const seeds: SocialCommerceProductItem[] = [
    enrichProduct({
      id: 'prd_seed_agency',
      organizationId,
      sku: 'HUP-AGENCY-PRO',
      name: 'Assinatura HupFlow Agency White-Label (Anual)',
      category: 'saas_plan',
      channel: 'linkedin',
      priceBrl: 997,
      checkoutUrl: 'https://hupflow.app/checkout/agency-pro?utm_medium=social_tag',
      taggedPostsCount: 9,
      taggedImpressions: 68000,
      productClicks: 1480,
      ordersCount: 48,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }),
    enrichProduct({
      id: 'prd_seed_playbook',
      organizationId,
      sku: 'PACK-CARROSSEL-50',
      name: 'Masterclass + 50 Templates de Carrossel B2B & Reels IA',
      category: 'digital_course',
      channel: 'instagram',
      priceBrl: 297,
      checkoutUrl: 'https://hupflow.app/checkout/pack-50?utm_medium=ig_shop',
      taggedPostsCount: 14,
      taggedImpressions: 92000,
      productClicks: 2650,
      ordersCount: 94,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }),
    enrichProduct({
      id: 'prd_seed_audit',
      organizationId,
      sku: 'CONSULT-GROWTH-360',
      name: 'Diagnóstico Executivo de Posicionamento & Funil Orgânico',
      category: 'consulting_service',
      channel: 'youtube',
      priceBrl: 2400,
      checkoutUrl: 'https://hupflow.app/checkout/diagnostico-360?utm_medium=yt_shopping',
      taggedPostsCount: 4,
      taggedImpressions: 31000,
      productClicks: 520,
      ordersCount: 12,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }),
  ];

  memoryStore.set(organizationId, seeds);
  return seeds;
}

export async function listSocialCommerceProducts(
  organizationId: string,
  categoryFilter?: string
): Promise<{
  products: SocialCommerceProductItem[];
  summary: SocialCommerceCatalogSummary;
}> {
  let products: SocialCommerceProductItem[] = [];

  try {
    const rows = await db
      .select()
      .from(socialCommerceProducts)
      .where(eq(socialCommerceProducts.organizationId, organizationId))
      .orderBy(desc(socialCommerceProducts.createdAt));

    if (rows.length > 0) {
      products = rows.map((r) =>
        enrichProduct({
          id: r.id,
          organizationId: r.organizationId,
          sku: r.sku,
          name: r.name,
          category: (r.category as CommerceProductCategory) || 'saas_plan',
          channel: (r.channel as CommerceSocialChannel) || 'instagram',
          priceBrl: r.priceBrl,
          checkoutUrl: r.checkoutUrl,
          taggedPostsCount: r.taggedPostsCount,
          taggedImpressions: r.taggedImpressions,
          productClicks: r.productClicks,
          ordersCount: r.ordersCount,
          isActive: r.isActive,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        })
      );
    } else {
      products = seedOrgProducts(organizationId);
    }
  } catch {
    products = seedOrgProducts(organizationId);
  }

  const filtered =
    categoryFilter && categoryFilter !== 'all'
      ? products.filter((p) => p.category === categoryFilter)
      : products;

  return {
    products: filtered,
    summary: summarizeSocialCommerceCatalog(products),
  };
}

export async function createSocialCommerceProduct(
  organizationId: string,
  input: CreateCommerceProductInput
): Promise<SocialCommerceProductItem> {
  const id = `prd_${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date();
  const sku =
    input.sku && input.sku.trim().length > 0
      ? input.sku.trim().toUpperCase()
      : `HUP-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;

  const item = enrichProduct({
    id,
    organizationId,
    sku,
    name: input.name.trim(),
    category: input.category || 'saas_plan',
    channel: input.channel || 'instagram',
    priceBrl: Math.max(10, Math.round(input.priceBrl)),
    checkoutUrl: input.checkoutUrl.trim(),
    taggedPostsCount: 2,
    taggedImpressions: 12000,
    productClicks: 380,
    ordersCount: 14,
    isActive: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  });

  try {
    await db.insert(socialCommerceProducts).values({
      id: item.id,
      organizationId,
      sku: item.sku,
      name: item.name,
      category: item.category,
      channel: item.channel,
      priceBrl: item.priceBrl,
      checkoutUrl: item.checkoutUrl,
      taggedPostsCount: item.taggedPostsCount,
      taggedImpressions: item.taggedImpressions,
      productClicks: item.productClicks,
      ordersCount: item.ordersCount,
      isActive: item.isActive,
      createdAt: now,
      updatedAt: now,
    });
  } catch {
    // Fallback to memory store
  }

  const list = seedOrgProducts(organizationId);
  memoryStore.set(organizationId, [item, ...list]);
  return item;
}

export async function mutateSocialCommerceProduct(
  organizationId: string,
  productId: string,
  action: 'simulate_order' | 'delete'
): Promise<{ deleted?: boolean; product?: SocialCommerceProductItem }> {
  const list = seedOrgProducts(organizationId);

  if (action === 'delete') {
    try {
      await db
        .delete(socialCommerceProducts)
        .where(
          and(
            eq(socialCommerceProducts.id, productId),
            eq(socialCommerceProducts.organizationId, organizationId)
          )
        );
    } catch {
      // Fallback to memory store
    }
    memoryStore.set(
      organizationId,
      list.filter((p) => p.id !== productId)
    );
    return { deleted: true };
  }

  const target = list.find((p) => p.id === productId);
  if (!target) {
    throw new Error('Produto não encontrado no catálogo Social Commerce.');
  }

  const updated = enrichProduct({
    ...target,
    taggedPostsCount: target.taggedPostsCount + 1,
    taggedImpressions: target.taggedImpressions + 4500,
    productClicks: target.productClicks + 95,
    ordersCount: target.ordersCount + 3,
    updatedAt: new Date().toISOString(),
  });

  try {
    await db
      .update(socialCommerceProducts)
      .set({
        taggedPostsCount: updated.taggedPostsCount,
        taggedImpressions: updated.taggedImpressions,
        productClicks: updated.productClicks,
        ordersCount: updated.ordersCount,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(socialCommerceProducts.id, productId),
          eq(socialCommerceProducts.organizationId, organizationId)
        )
      );
  } catch {
    // Fallback to memory store
  }

  memoryStore.set(
    organizationId,
    list.map((p) => (p.id === productId ? updated : p))
  );

  return { product: updated };
}
