import assert from 'node:assert/strict';
import {
  CreatorChannel,
  CreatorFinancialMetrics,
  CreatorPartnershipItem,
  CreatorPerformanceTier,
  CreatorPortfolioSummary,
} from './types';

/**
 * Computes deterministic financial metrics for an influencer/UGC creator partnership:
 * - CPE (Cost Per Engagement in BRL)
 * - Effective CPM (Cost Per 1,000 Views in BRL)
 * - EMV (Earned Media Value in BRL: R$ 18 per 1k views + R$ 0.85 per engagement)
 * - Total Partnership ROI (%) combining direct attributed revenue + EMV against agreed fee
 */
export function evaluateCreatorFinancialMetrics(input: {
  agreedFeeBrl: number;
  totalViews: number;
  totalEngagements: number;
  generatedRevenueBrl: number;
}): CreatorFinancialMetrics {
  const fee = Math.max(1, input.agreedFeeBrl);
  const views = Math.max(0, input.totalViews);
  const engagements = Math.max(0, input.totalEngagements);
  const revenue = Math.max(0, input.generatedRevenueBrl);

  const cpeBrl =
    engagements > 0 ? Number((fee / engagements).toFixed(2)) : Number(fee.toFixed(2));
  const cpmBrl =
    views > 0 ? Number(((fee / views) * 1000).toFixed(2)) : Number(fee.toFixed(2));

  const emvBrl = Math.round((views / 1000) * 18 + engagements * 0.85);
  const totalValue = revenue + emvBrl;
  const roiPct = Number((((totalValue - fee) / fee) * 100).toFixed(1));

  let performanceTier: CreatorPerformanceTier = 'underperforming';
  if (roiPct >= 200) {
    performanceTier = 'elite_roi';
  } else if (roiPct >= 50) {
    performanceTier = 'profitable';
  } else if (roiPct >= 0) {
    performanceTier = 'break_even';
  }

  return {
    cpeBrl,
    cpmBrl,
    emvBrl,
    roiPct,
    performanceTier,
  };
}

/**
 * Generates a 3-act UGC Campaign Briefing tailored to the creator's handle, channel, and coupon code.
 */
export function generateCreatorUgcBriefing(input: {
  creatorName: string;
  handle: string;
  channel: CreatorChannel;
  niche: string;
  couponCode: string;
}): string {
  const formatLabel =
    input.channel === 'linkedin'
      ? 'Carrossel PDF Nativo + Post Opinativo'
      : input.channel === 'youtube'
      ? 'Integração Mid-Roll 60s + Shorts'
      : 'Reels / TikTok Vertical 9:16 com Legendas Dinâmicas';

  return `Briefing UGC ${input.handle} (${formatLabel} • Nicho: ${input.niche}): [Ato 1 — Gancho 0-3s] Mostre o gargalo real de gerenciar redes sociais manualmente. [Ato 2 — Demonstração] Apresente o HupFlow Studio resolvendo o fluxo em segundos. [Ato 3 — CTA] Convide a audiência para testar com o cupom exclusivo ${input.couponCode} no link da bio.`;
}

/**
 * Summarizes portfolio-wide ROI, CPE, and deliverables progress across all creators.
 */
export function summarizeCreatorPortfolio(
  creators: CreatorPartnershipItem[]
): CreatorPortfolioSummary {
  if (creators.length === 0) {
    return {
      totalCreators: 0,
      totalInvestedBrl: 0,
      totalValueGeneratedBrl: 0,
      portfolioRoiPct: 0,
      avgCpeBrl: 0,
      deliverablesProgressPct: 0,
    };
  }

  const totalInvestedBrl = creators.reduce((acc, c) => acc + c.agreedFeeBrl, 0);
  const totalValueGeneratedBrl = creators.reduce(
    (acc, c) => acc + c.generatedRevenueBrl + c.metrics.emvBrl,
    0
  );
  const totalEngagements = creators.reduce(
    (acc, c) => acc + c.totalEngagements,
    0
  );
  const totalDeliverables = creators.reduce(
    (acc, c) => acc + c.deliverablesTotal,
    0
  );
  const completedDeliverables = creators.reduce(
    (acc, c) => acc + c.deliverablesCompleted,
    0
  );

  const portfolioRoiPct =
    totalInvestedBrl > 0
      ? Number(
          (
            ((totalValueGeneratedBrl - totalInvestedBrl) / totalInvestedBrl) *
            100
          ).toFixed(1)
        )
      : 0;

  const avgCpeBrl =
    totalEngagements > 0
      ? Number((totalInvestedBrl / totalEngagements).toFixed(2))
      : 0;

  const deliverablesProgressPct =
    totalDeliverables > 0
      ? Number(((completedDeliverables / totalDeliverables) * 100).toFixed(1))
      : 0;

  return {
    totalCreators: creators.length,
    totalInvestedBrl,
    totalValueGeneratedBrl,
    portfolioRoiPct,
    avgCpeBrl,
    deliverablesProgressPct,
  };
}

// ============================================================================
// Self-contained TDD test suite when executed directly via `npx tsx`
// ============================================================================
if (typeof process !== 'undefined' && process.argv[1]?.includes('creators.test')) {
  console.log('Running Feature 039 Influencer & Creator CRM unit tests...');

  // Test 1: evaluateCreatorFinancialMetrics for high-performing creator
  const eliteMetrics = evaluateCreatorFinancialMetrics({
    agreedFeeBrl: 3000,
    totalViews: 100000, // EMV views = 1800
    totalEngagements: 6000, // EMV eng = 5100 -> total EMV = 6900
    generatedRevenueBrl: 8100, // Total Value = 15000 -> ROI = (15000 - 3000)/3000 = 400%
  });
  assert.equal(eliteMetrics.cpeBrl, 0.5);
  assert.equal(eliteMetrics.cpmBrl, 30.0);
  assert.equal(eliteMetrics.emvBrl, 6900);
  assert.equal(eliteMetrics.roiPct, 400.0);
  assert.equal(eliteMetrics.performanceTier, 'elite_roi');

  // Test 2: Zero views/engagements safety (prospecting stage)
  const zeroMetrics = evaluateCreatorFinancialMetrics({
    agreedFeeBrl: 2000,
    totalViews: 0,
    totalEngagements: 0,
    generatedRevenueBrl: 0,
  });
  assert.equal(zeroMetrics.emvBrl, 0);
  assert.equal(zeroMetrics.roiPct, -100);
  assert.equal(zeroMetrics.performanceTier, 'underperforming');

  // Test 3: generateCreatorUgcBriefing includes couponCode and handle
  const briefing = generateCreatorUgcBriefing({
    creatorName: 'Bianca IA',
    handle: '@bianca.ia',
    channel: 'instagram',
    niche: 'Produtividade',
    couponCode: 'BIANCA20',
  });
  assert.ok(briefing.includes('@bianca.ia'));
  assert.ok(briefing.includes('BIANCA20'));

  // Test 4: summarizeCreatorPortfolio aggregates accurately
  const now = new Date().toISOString();
  const samplePortfolio: CreatorPartnershipItem[] = [
    {
      id: 'c1',
      organizationId: 'org_1',
      creatorName: 'Bianca IA',
      handle: '@bianca.ia',
      channel: 'instagram',
      niche: 'IA',
      followersCount: 80000,
      stage: 'published',
      agreedFeeBrl: 3000,
      deliverablesTotal: 3,
      deliverablesCompleted: 3,
      totalViews: 100000,
      totalEngagements: 6000,
      generatedRevenueBrl: 8100,
      couponCode: 'BIANCA20',
      metrics: eliteMetrics,
      ugcBriefing: briefing,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const summary = summarizeCreatorPortfolio(samplePortfolio);
  assert.equal(summary.totalCreators, 1);
  assert.equal(summary.totalInvestedBrl, 3000);
  assert.equal(summary.totalValueGeneratedBrl, 15000);
  assert.equal(summary.portfolioRoiPct, 400.0);
  assert.equal(summary.deliverablesProgressPct, 100.0);

  console.log('✅ All Feature 039 Influencer & Creator CRM tests passed (100%)!');
}
