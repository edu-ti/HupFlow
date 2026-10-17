import assert from 'node:assert/strict';
import {
  AdvocacyCampaignImpact,
  AdvocacyCampaignItem,
  AdvocacyChannel,
  AdvocacyLeaderboardMember,
  AdvocacyPersonaVariation,
  AdvocacyProgramSummary,
  AmbassadorBadgeTier,
} from './types';

/**
 * Generates 3 authentic first-person variations tailored by employee role persona
 * so team members don't get penalized by social algorithms for duplicate copy-paste posts.
 */
export function generateAdvocacyPersonaVariations(input: {
  title: string;
  baseMessage: string;
  targetUrl: string;
}): AdvocacyPersonaVariation[] {
  const cleanMsg = input.baseMessage.trim().replace(/[.!?]+$/, '');
  const url = input.targetUrl.trim();

  return [
    {
      persona: 'executive_vision',
      label: 'Visão Executiva / Liderança',
      copyText: `Reflexão estratégica da semana sobre "${input.title}": ${cleanMsg}. Muito orgulho de ver como nosso time está elevando o padrão do mercado. Confira os detalhes: ${url}`,
    },
    {
      persona: 'technical_builder',
      label: 'Bastidores Técnicos / Produto',
      copyText: `Bastidores de engenharia e produto em "${input.title}": ${cleanMsg}. Construímos cada detalhe pensando em performance real e simplicidade. Veja na prática: ${url}`,
    },
    {
      persona: 'sales_advisor',
      label: 'Consultivo / Sucesso do Cliente',
      copyText: `Conversando com clientes nesta semana, ficou claro o impacto de "${input.title}": ${cleanMsg}. Se a sua operação busca esse nível de eficiência, vale a leitura: ${url}`,
    },
  ];
}

/**
 * Calculates organic reach, estimated clicks (3.2% organic CTR), and equivalent
 * Paid Media Ad Spend Saved in BRL (R$ 38 CPM + channel-specific CPC).
 */
export function calculateAdvocacyImpactMetrics(input: {
  sharesCount: number;
  avgReachPerShare: number;
  channel: AdvocacyChannel;
}): AdvocacyCampaignImpact {
  const shares = Math.max(0, input.sharesCount);
  const reachPerShare = Math.max(100, input.avgReachPerShare);

  const totalOrganicReach = shares * reachPerShare;
  const estimatedClicks = Math.round(totalOrganicReach * 0.032);

  const cpcBrl = input.channel === 'linkedin' ? 6.5 : 3.2;
  const cpmEquivalentBrl = (totalOrganicReach / 1000) * 38;
  const cpcEquivalentBrl = estimatedClicks * cpcBrl;

  const adSpendSavedBrl = Math.round(cpmEquivalentBrl + cpcEquivalentBrl);

  return {
    totalOrganicReach,
    estimatedClicks,
    adSpendSavedBrl,
  };
}

/**
 * Assigns gamification badge tier based on accumulated points.
 */
export function assignAmbassadorBadge(points: number): AmbassadorBadgeTier {
  if (points >= 1000) return 'Diamond Ambassador';
  if (points >= 500) return 'Gold Voice';
  return 'Rising Star';
}

/**
 * Aggregates program-wide KPIs across all Employee Advocacy campaigns and leaderboard members.
 */
export function summarizeAdvocacyProgram(
  campaigns: AdvocacyCampaignItem[],
  leaderboard: AdvocacyLeaderboardMember[]
): AdvocacyProgramSummary {
  const totalShares = campaigns.reduce((acc, c) => acc + c.sharesCount, 0);
  const totalOrganicReach = campaigns.reduce(
    (acc, c) => acc + c.impact.totalOrganicReach,
    0
  );
  const totalAdSpendSavedBrl = campaigns.reduce(
    (acc, c) => acc + c.impact.adSpendSavedBrl,
    0
  );

  return {
    totalCampaigns: campaigns.length,
    totalShares,
    totalOrganicReach,
    totalAdSpendSavedBrl,
    activeAmbassadors: leaderboard.length,
  };
}

// ============================================================================
// Self-contained TDD test suite when executed directly via `npx tsx`
// ============================================================================
if (typeof process !== 'undefined' && process.argv[1]?.includes('advocacy.test')) {
  console.log('Running Feature 040 Employee Advocacy Board unit tests...');

  // Test 1: generateAdvocacyPersonaVariations creates 3 distinct first-person copies
  const variations = generateAdvocacyPersonaVariations({
    title: 'Portais White-Label HupFlow',
    baseMessage: 'Aprovação externa em 1 clique sem login',
    targetUrl: 'https://hupflow.app/portais',
  });
  assert.equal(variations.length, 3);
  assert.equal(variations[0].persona, 'executive_vision');
  assert.equal(variations[1].persona, 'technical_builder');
  assert.equal(variations[2].persona, 'sales_advisor');
  assert.ok(variations[0].copyText.includes('https://hupflow.app/portais'));

  // Test 2: calculateAdvocacyImpactMetrics for LinkedIn B2B campaign
  const impact = calculateAdvocacyImpactMetrics({
    sharesCount: 10,
    avgReachPerShare: 2000, // 20,000 reach -> 640 clicks
    channel: 'linkedin', // CPM = 20 * 38 = 760; CPC = 640 * 6.5 = 4160 -> total = 4920
  });
  assert.equal(impact.totalOrganicReach, 20000);
  assert.equal(impact.estimatedClicks, 640);
  assert.equal(impact.adSpendSavedBrl, 4920);

  // Test 3: assignAmbassadorBadge tiers
  assert.equal(assignAmbassadorBadge(1250), 'Diamond Ambassador');
  assert.equal(assignAmbassadorBadge(620), 'Gold Voice');
  assert.equal(assignAmbassadorBadge(240), 'Rising Star');

  // Test 4: summarizeAdvocacyProgram
  const now = new Date().toISOString();
  const summary = summarizeAdvocacyProgram(
    [
      {
        id: 'adv_1',
        organizationId: 'org_1',
        title: 'Campanha 1',
        department: 'Produto',
        channel: 'linkedin',
        baseMessage: 'Msg',
        targetUrl: 'https://hupflow.app',
        pointsReward: 75,
        sharesCount: 10,
        avgReachPerShare: 2000,
        personaVariations: variations,
        impact,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ],
    [
      {
        id: 'emp_1',
        memberName: 'Helena Costa',
        roleTitle: 'Head de Produto',
        sharesCount: 10,
        points: 1100,
        organicReachGenerated: 20000,
        badge: 'Diamond Ambassador',
      },
    ]
  );
  assert.equal(summary.totalCampaigns, 1);
  assert.equal(summary.totalShares, 10);
  assert.equal(summary.totalOrganicReach, 20000);
  assert.equal(summary.totalAdSpendSavedBrl, 4920);
  assert.equal(summary.activeAmbassadors, 1);

  console.log('✅ All Feature 040 Employee Advocacy Board tests passed (100%)!');
}
