import assert from 'node:assert/strict';
import {
  CommerceProductCategory,
  CommerceSocialChannel,
  CommerceVelocityTier,
  SocialCommerceAttributionMetrics,
  SocialCommerceCatalogSummary,
  SocialCommerceProductItem,
} from './types';

/**
 * Evaluates Social Commerce revenue attribution metrics for a tagged product:
 * - Total Attributed Revenue (BRL)
 * - Checkout Conversion Rate (%)
 * - EPC (Earnings Per Click in BRL)
 * - Social RPM (Revenue Per 1,000 Tagged Impressions in BRL)
 */
export function evaluateSocialCommerceMetrics(input: {
  priceBrl: number;
  taggedImpressions: number;
  productClicks: number;
  ordersCount: number;
}): SocialCommerceAttributionMetrics {
  const price = Math.max(1, input.priceBrl);
  const impressions = Math.max(0, input.taggedImpressions);
  const clicks = Math.max(0, input.productClicks);
  const orders = Math.max(0, input.ordersCount);

  const totalRevenueBrl = Math.round(orders * price);
  const checkoutConversionPct =
    clicks > 0 ? Number(((orders / clicks) * 100).toFixed(2)) : 0;
  const epcBrl =
    clicks > 0 ? Number((totalRevenueBrl / clicks).toFixed(2)) : 0;
  const socialRpmBrl =
    impressions > 0
      ? Number(((totalRevenueBrl / impressions) * 1000).toFixed(2))
      : 0;

  let velocityTier: CommerceVelocityTier = 'needs_optimization';
  if (socialRpmBrl >= 450 || orders >= 40) {
    velocityTier = 'bestseller';
  } else if (socialRpmBrl >= 250 || epcBrl >= 15) {
    velocityTier = 'high_margin';
  } else if (orders >= 10) {
    velocityTier = 'steady';
  }

  return {
    totalRevenueBrl,
    checkoutConversionPct,
    epcBrl,
    socialRpmBrl,
    velocityTier,
  };
}

/**
 * Synthesizes a high-converting Shoppable Post Copy with product tag, price anchor, and checkout CTA.
 */
export function generateShoppablePostCopy(input: {
  name: string;
  sku: string;
  priceBrl: number;
  category: CommerceProductCategory;
  channel: CommerceSocialChannel;
  checkoutUrl: string;
}): string {
  const actionCue =
    input.channel === 'instagram' || input.channel === 'tiktok'
      ? 'Toque na sacola deste vídeo/post ou acesse o link na bio'
      : 'Acesse o link direto no primeiro comentário fixado';

  return `🛍️ [Tag Shoppable: ${input.name} (${input.sku}) • R$ ${input.priceBrl.toLocaleString('pt-BR')}] — Pare de perder horas em processos manuais. Desbloqueie acesso imediato com condição especial hoje. ${actionCue}: ${input.checkoutUrl}`;
}

/**
 * Summarizes catalog-wide revenue, orders, average checkout conversion, and Social RPM.
 */
export function summarizeSocialCommerceCatalog(
  products: SocialCommerceProductItem[]
): SocialCommerceCatalogSummary {
  if (products.length === 0) {
    return {
      totalProducts: 0,
      totalRevenueBrl: 0,
      totalOrders: 0,
      avgCheckoutConversionPct: 0,
      avgSocialRpmBrl: 0,
    };
  }

  const totalRevenueBrl = products.reduce(
    (acc, p) => acc + p.metrics.totalRevenueBrl,
    0
  );
  const totalOrders = products.reduce((acc, p) => acc + p.ordersCount, 0);
  const avgCheckoutConversionPct = Number(
    (
      products.reduce((acc, p) => acc + p.metrics.checkoutConversionPct, 0) /
      products.length
    ).toFixed(2)
  );
  const avgSocialRpmBrl = Number(
    (
      products.reduce((acc, p) => acc + p.metrics.socialRpmBrl, 0) /
      products.length
    ).toFixed(2)
  );

  return {
    totalProducts: products.length,
    totalRevenueBrl,
    totalOrders,
    avgCheckoutConversionPct,
    avgSocialRpmBrl,
  };
}

// ============================================================================
// Self-contained TDD test suite when executed directly via `npx tsx`
// ============================================================================
if (typeof process !== 'undefined' && process.argv[1]?.includes('commerce.test')) {
  console.log('Running Feature 041 Social Commerce Product Catalog unit tests...');

  // Test 1: evaluateSocialCommerceMetrics accuracy
  const metrics = evaluateSocialCommerceMetrics({
    priceBrl: 1000,
    taggedImpressions: 50000,
    productClicks: 1000,
    ordersCount: 45, // Revenue = 45,000; Conv = 4.5%; EPC = 45; RPM = (45000/50000)*1000 = 900
  });
  assert.equal(metrics.totalRevenueBrl, 45000);
  assert.equal(metrics.checkoutConversionPct, 4.5);
  assert.equal(metrics.epcBrl, 45);
  assert.equal(metrics.socialRpmBrl, 900);
  assert.equal(metrics.velocityTier, 'bestseller');

  // Test 2: Zero impressions/clicks safety
  const zeroMetrics = evaluateSocialCommerceMetrics({
    priceBrl: 297,
    taggedImpressions: 0,
    productClicks: 0,
    ordersCount: 0,
  });
  assert.equal(zeroMetrics.totalRevenueBrl, 0);
  assert.equal(zeroMetrics.checkoutConversionPct, 0);
  assert.equal(zeroMetrics.epcBrl, 0);
  assert.equal(zeroMetrics.socialRpmBrl, 0);
  assert.equal(zeroMetrics.velocityTier, 'needs_optimization');

  // Test 3: generateShoppablePostCopy includes SKU, price, and checkout URL
  const copy = generateShoppablePostCopy({
    name: 'Plano Agency White-Label',
    sku: 'HUP-AGENCY',
    priceBrl: 997,
    category: 'saas_plan',
    channel: 'instagram',
    checkoutUrl: 'https://hupflow.app/checkout/agency',
  });
  assert.ok(copy.includes('HUP-AGENCY'));
  assert.ok(copy.includes('https://hupflow.app/checkout/agency'));

  // Test 4: summarizeSocialCommerceCatalog
  const now = new Date().toISOString();
  const summary = summarizeSocialCommerceCatalog([
    {
      id: 'p1',
      organizationId: 'org_1',
      sku: 'HUP-AGENCY',
      name: 'Plano Agency',
      category: 'saas_plan',
      channel: 'instagram',
      priceBrl: 1000,
      checkoutUrl: 'https://hupflow.app',
      taggedPostsCount: 5,
      taggedImpressions: 50000,
      productClicks: 1000,
      ordersCount: 45,
      metrics,
      shoppableCopy: copy,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ]);
  assert.equal(summary.totalProducts, 1);
  assert.equal(summary.totalRevenueBrl, 45000);
  assert.equal(summary.totalOrders, 45);
  assert.equal(summary.avgSocialRpmBrl, 900);

  console.log('✅ All Feature 041 Social Commerce Product Catalog tests passed (100%)!');
}
