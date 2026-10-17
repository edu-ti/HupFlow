import assert from 'node:assert/strict';
import {
  CompetitiveThreatLevel,
  CompetitorContentFormat,
  CompetitorProfile,
  ContentGapOpportunity,
  NicheBenchmarkComparison,
  WorkspaceBenchmarkBaseline,
} from './types';

/**
 * Calculates estimated weekly engaged reach for a social profile.
 * Formula: followersCount * (engagementRatePct / 100) * postsPerWeek
 */
export function calculateWeeklyEngagedReach(input: {
  followersCount: number;
  engagementRatePct: number;
  postsPerWeek: number;
}): number {
  const followers = Math.max(0, input.followersCount);
  const engRate = Math.max(0, input.engagementRatePct) / 100;
  const posts = Math.max(0, input.postsPerWeek);
  return Math.round(followers * engRate * posts);
}

/**
 * Calculates competitive threat score (0..100) and classification level
 * based on engagement rate, weekly cadence, and 30-day growth speed.
 */
export function calculateCompetitiveThreatScore(input: {
  engagementRatePct: number;
  postsPerWeek: number;
  growth30dPct: number;
}): { threatScore: number; threatLevel: CompetitiveThreatLevel } {
  const engagementComponent = Math.min(40, Math.max(0, input.engagementRatePct * 6.5));
  const cadenceComponent = Math.min(30, Math.max(0, input.postsPerWeek * 3.8));
  const growthComponent = Math.min(30, Math.max(0, input.growth30dPct * 2.5));

  const threatScore = Math.min(
    100,
    Math.max(10, Math.round(engagementComponent + cadenceComponent + growthComponent))
  );

  let threatLevel: CompetitiveThreatLevel = 'low';
  if (threatScore >= 80) {
    threatLevel = 'critical';
  } else if (threatScore >= 65) {
    threatLevel = 'high';
  } else if (threatScore >= 45) {
    threatLevel = 'moderate';
  }

  return { threatScore, threatLevel };
}

/**
 * Distributes Share of Voice (%) across the workspace baseline and tracked competitors
 * based on their weekly engaged reach.
 */
export function calculateShareOfVoiceDistribution(
  baseline: WorkspaceBenchmarkBaseline,
  competitors: CompetitorProfile[]
): {
  baselineWithSov: WorkspaceBenchmarkBaseline;
  competitorsWithSov: CompetitorProfile[];
} {
  const baselineReach = calculateWeeklyEngagedReach(baseline);
  const compWithReach = competitors.map((c) => ({
    ...c,
    weeklyEngagedReach: calculateWeeklyEngagedReach(c),
  }));

  const totalMarketReach =
    baselineReach + compWithReach.reduce((acc, c) => acc + c.weeklyEngagedReach, 0);

  if (totalMarketReach <= 0) {
    return {
      baselineWithSov: { ...baseline, weeklyEngagedReach: 0, shareOfVoicePct: 100 },
      competitorsWithSov: compWithReach.map((c) => ({ ...c, shareOfVoicePct: 0 })),
    };
  }

  const brandSov = Number(((baselineReach / totalMarketReach) * 100).toFixed(1));
  const competitorsWithSov = compWithReach.map((c) => ({
    ...c,
    shareOfVoicePct: Number(((c.weeklyEngagedReach / totalMarketReach) * 100).toFixed(1)),
  }));

  return {
    baselineWithSov: {
      ...baseline,
      weeklyEngagedReach: baselineReach,
      shareOfVoicePct: brandSov,
    },
    competitorsWithSov,
  };
}

/**
 * Compares the workspace baseline against the niche average of tracked competitors.
 */
export function compareAgainstWorkspaceBaseline(
  baseline: WorkspaceBenchmarkBaseline,
  competitors: CompetitorProfile[]
): NicheBenchmarkComparison {
  if (competitors.length === 0) {
    return {
      nicheAvgEngagementPct: baseline.engagementRatePct,
      nicheAvgPostsPerWeek: baseline.postsPerWeek,
      nicheAvgGrowth30dPct: baseline.growth30dPct,
      engagementDeltaPct: 0,
      cadenceDeltaPosts: 0,
      growthDeltaPct: 0,
      brandShareOfVoicePct: 100,
      winningFormatInNiche: 'carousel',
    };
  }

  const nicheAvgEngagementPct = Number(
    (
      competitors.reduce((acc, c) => acc + c.engagementRatePct, 0) / competitors.length
    ).toFixed(2)
  );
  const nicheAvgPostsPerWeek = Number(
    (competitors.reduce((acc, c) => acc + c.postsPerWeek, 0) / competitors.length).toFixed(1)
  );
  const nicheAvgGrowth30dPct = Number(
    (competitors.reduce((acc, c) => acc + c.growth30dPct, 0) / competitors.length).toFixed(2)
  );

  // Determine winning format by weighting format frequency by engagement rate
  const formatScores = new Map<CompetitorContentFormat, number>();
  for (const comp of competitors) {
    const current = formatScores.get(comp.topFormat) || 0;
    formatScores.set(comp.topFormat, current + comp.engagementRatePct);
  }

  let winningFormatInNiche: CompetitorContentFormat = 'carousel';
  let bestScore = -1;
  for (const [format, score] of formatScores.entries()) {
    if (score > bestScore) {
      bestScore = score;
      winningFormatInNiche = format;
    }
  }

  return {
    nicheAvgEngagementPct,
    nicheAvgPostsPerWeek,
    nicheAvgGrowth30dPct,
    engagementDeltaPct: Number((baseline.engagementRatePct - nicheAvgEngagementPct).toFixed(2)),
    cadenceDeltaPosts: Number((baseline.postsPerWeek - nicheAvgPostsPerWeek).toFixed(1)),
    growthDeltaPct: Number((baseline.growth30dPct - nicheAvgGrowth30dPct).toFixed(2)),
    brandShareOfVoicePct: baseline.shareOfVoicePct,
    winningFormatInNiche,
  };
}

/**
 * Detects untapped Content Gaps by comparing high-performing competitor topics
 * against the workspace's covered topics.
 */
export function detectContentGaps(
  baseline: WorkspaceBenchmarkBaseline,
  competitors: CompetitorProfile[]
): ContentGapOpportunity[] {
  const normalizedCovered = new Set(
    baseline.coveredTopics.map((t) => t.trim().toLowerCase())
  );

  const sortedCompetitors = [...competitors].sort(
    (a, b) => b.threatScore - a.threatScore || b.engagementRatePct - a.engagementRatePct
  );

  const opportunities: ContentGapOpportunity[] = [];
  const seenTopics = new Set<string>();

  for (const comp of sortedCompetitors) {
    for (const topic of comp.topTopics) {
      const normalized = topic.trim().toLowerCase();
      if (!normalized || normalizedCovered.has(normalized) || seenTopics.has(normalized)) {
        continue;
      }
      seenTopics.add(normalized);

      const opportunityScore = Math.min(
        99,
        Math.max(60, Math.round(comp.threatScore * 0.7 + comp.engagementRatePct * 5.5))
      );

      opportunities.push({
        id: `gap_${opportunities.length + 1}`,
        topic,
        competitorSource: comp.handle,
        recommendedFormat: comp.topFormat,
        opportunityScore,
        suggestedHook: `Por que 90% das marcas erram em "${topic}" (e o framework prático em 4 passos para dominar esse tema hoje):`,
        rationale: `Tópico de alta tração em ${comp.handle} (${comp.engagementRatePct}% de engajamento via ${comp.topFormat}) ainda inexplorado pelo seu workspace.`,
      });
    }
  }

  return opportunities.sort((a, b) => b.opportunityScore - a.opportunityScore).slice(0, 6);
}

// ============================================================================
// Self-contained TDD test suite when executed directly via `npx tsx`
// ============================================================================
if (typeof process !== 'undefined' && process.argv[1]?.includes('competitors.test')) {
  console.log('Running Feature 036 Competitor Benchmark Radar unit tests...');

  // Test 1: calculateWeeklyEngagedReach
  const reach = calculateWeeklyEngagedReach({
    followersCount: 50000,
    engagementRatePct: 4.5,
    postsPerWeek: 6,
  });
  assert.equal(reach, 13500, 'Should compute weekly engaged reach accurately');

  // Test 2: calculateCompetitiveThreatScore
  const highThreat = calculateCompetitiveThreatScore({
    engagementRatePct: 5.5,
    postsPerWeek: 7,
    growth30dPct: 11.2,
  });
  assert.ok(highThreat.threatScore >= 80, 'High performer should have threatScore >= 80');
  assert.equal(highThreat.threatLevel, 'critical');

  const lowThreat = calculateCompetitiveThreatScore({
    engagementRatePct: 1.5,
    postsPerWeek: 2,
    growth30dPct: 1.0,
  });
  assert.ok(lowThreat.threatScore < 45, 'Low performer should have threatScore < 45');
  assert.equal(lowThreat.threatLevel, 'low');

  // Test 3: calculateShareOfVoiceDistribution
  const mockBaseline: WorkspaceBenchmarkBaseline = {
    name: 'HupFlow Brand',
    handle: '@hupflow',
    followersCount: 40000,
    engagementRatePct: 5.0,
    postsPerWeek: 5,
    growth30dPct: 8.0,
    coveredTopics: ['Automação Social', 'Carrosséis IA'],
    weeklyEngagedReach: 0,
    shareOfVoicePct: 0,
  };

  const mockCompetitors: CompetitorProfile[] = [
    {
      id: 'c1',
      organizationId: 'org_1',
      name: 'Rival Alpha',
      handle: '@rival_alpha',
      channel: 'instagram',
      niche: 'SaaS',
      followersCount: 60000,
      engagementRatePct: 5.0,
      postsPerWeek: 5,
      growth30dPct: 10.0,
      topFormat: 'reel_video',
      topTopics: ['Reels Virais B2B', 'Automação Social'],
      threatScore: 82,
      threatLevel: 'critical',
      weeklyEngagedReach: 0,
      shareOfVoicePct: 0,
      lastSyncedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'c2',
      organizationId: 'org_1',
      name: 'Rival Beta',
      handle: '@rival_beta',
      channel: 'linkedin',
      niche: 'SaaS',
      followersCount: 50000,
      engagementRatePct: 5.0,
      postsPerWeek: 6,
      growth30dPct: 6.0,
      topFormat: 'carousel',
      topTopics: ['Social Selling LinkedIn', 'Copywriting com IA'],
      threatScore: 70,
      threatLevel: 'high',
      weeklyEngagedReach: 0,
      shareOfVoicePct: 0,
      lastSyncedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const { baselineWithSov, competitorsWithSov } = calculateShareOfVoiceDistribution(
    mockBaseline,
    mockCompetitors
  );
  // Baseline reach = 10,000; c1 reach = 15,000; c2 reach = 15,000; total = 40,000
  assert.equal(baselineWithSov.weeklyEngagedReach, 10000);
  assert.equal(baselineWithSov.shareOfVoicePct, 25);
  assert.equal(competitorsWithSov[0].shareOfVoicePct, 37.5);
  assert.equal(competitorsWithSov[1].shareOfVoicePct, 37.5);

  // Test 4: compareAgainstWorkspaceBaseline
  const comparison = compareAgainstWorkspaceBaseline(baselineWithSov, competitorsWithSov);
  assert.equal(comparison.nicheAvgEngagementPct, 5.0);
  assert.equal(comparison.nicheAvgPostsPerWeek, 5.5);
  assert.equal(comparison.cadenceDeltaPosts, -0.5);
  assert.equal(comparison.brandShareOfVoicePct, 25);

  // Test 5: detectContentGaps excludes already covered topics
  const gaps = detectContentGaps(baselineWithSov, competitorsWithSov);
  assert.equal(gaps.length, 3, 'Should detect 3 uncovered topics (excluding Automação Social)');
  assert.ok(
    !gaps.some((g) => g.topic.toLowerCase() === 'automação social'),
    'Should not include topics already covered by workspace'
  );
  assert.equal(gaps[0].topic, 'Reels Virais B2B');

  console.log('✅ All Feature 036 Competitor Benchmark Radar tests passed (100%)!');
}
