import assert from 'node:assert/strict';
import {
  AbHypothesisAngle,
  AbStatisticalEvaluation,
  AbTestExperiment,
  AbTestSummaryMetrics,
  AbTestVariant,
} from './types';

/**
 * Clean-Room Abramowitz & Stegun 26.2.17 polynomial approximation
 * for the Standard Normal Cumulative Distribution Function Phi(z).
 */
export function normalCdfApprox(z: number): number {
  if (z < -8) return 0;
  if (z > 8) return 1;

  const absZ = Math.abs(z);
  const p = 0.2316419;
  const b1 = 0.31938153;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;

  const t = 1 / (1 + p * absZ);
  const pdf = Math.exp(-0.5 * absZ * absZ) / Math.sqrt(2 * Math.PI);
  const poly =
    ((((b5 * t + b4) * t + b3) * t + b2) * t + b1) * t;
  const cdfPos = 1 - pdf * poly;

  return z >= 0 ? cdfPos : 1 - cdfPos;
}

/**
 * Evaluates two-proportion Z-test statistics for Variant A (Control) vs Variant B (Challenger).
 */
export function evaluateAbExperimentStatistics(input: {
  variantA: Pick<AbTestVariant, 'impressions' | 'conversions'>;
  variantB: Pick<AbTestVariant, 'impressions' | 'conversions'>;
  minSampleSize: number;
  targetConfidencePct: number;
}): AbStatisticalEvaluation {
  const nA = Math.max(0, input.variantA.impressions);
  const cA = Math.min(nA, Math.max(0, input.variantA.conversions));
  const nB = Math.max(0, input.variantB.impressions);
  const cB = Math.min(nB, Math.max(0, input.variantB.conversions));

  const pA = nA > 0 ? cA / nA : 0;
  const pB = nB > 0 ? cB / nB : 0;

  const rateAPct = Number((pA * 100).toFixed(2));
  const rateBPct = Number((pB * 100).toFixed(2));

  const relativeLiftPct =
    pA > 0 ? Number((((pB - pA) / pA) * 100).toFixed(2)) : pB > 0 ? 100 : 0;

  const hasMinSample = nA >= input.minSampleSize && nB >= input.minSampleSize;

  if (nA === 0 || nB === 0 || cA + cB === 0 || cA + cB === nA + nB) {
    return {
      rateAPct,
      rateBPct,
      relativeLiftPct,
      zScore: 0,
      confidencePct: 0,
      hasMinSample,
      isStatisticallySignificant: false,
      recommendedOutcome: 'keep_testing',
    };
  }

  const pPool = (cA + cB) / (nA + nB);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / nA + 1 / nB));
  const zScore = se > 0 ? Number(((pB - pA) / se).toFixed(2)) : 0;

  const rawConfidence = (2 * normalCdfApprox(Math.abs(zScore)) - 1) * 100;
  const confidencePct = Number(Math.min(99.9, Math.max(0, rawConfidence)).toFixed(1));

  const isStatisticallySignificant =
    hasMinSample && confidencePct >= input.targetConfidencePct;

  let recommendedOutcome: AbStatisticalEvaluation['recommendedOutcome'] = 'keep_testing';
  if (isStatisticallySignificant) {
    recommendedOutcome = pB > pA ? 'winner_b' : 'winner_a';
  } else if (nA >= input.minSampleSize * 3 && nB >= input.minSampleSize * 3 && confidencePct < 60) {
    recommendedOutcome = 'inconclusive';
  }

  return {
    rateAPct,
    rateBPct,
    relativeLiftPct,
    zScore,
    confidencePct,
    hasMinSample,
    isStatisticallySignificant,
    recommendedOutcome,
  };
}

/**
 * Generates a psychological Challenger Hook (Variant B) from Control Hook (Variant A).
 */
export function generateChallengerHookVariant(
  hookTextA: string,
  angle: AbHypothesisAngle
): string {
  const base = hookTextA.trim().replace(/[.!?]+$/, '');

  switch (angle) {
    case 'curiosity_gap':
      return `O detalhe silencioso em "${base}" que 93% dos profissionais ignoram (veja no slide 3):`;
    case 'contrarian_shock':
      return `Pare de seguir o conselho tradicional sobre "${base}" — faça exatamente o oposto hoje:`;
    case 'social_proof_numbers':
      return `Testamos "${base}" em 140 campanhas reais e estes 4 números mudaram nossa estratégia:`;
    case 'urgency_fomo':
      return `Se você ainda não ajustou "${base}" nesta semana, seu alcance orgânico já está perdendo tração:`;
  }
}

/**
 * Deterministically simulates a new traffic batch (+250 impressions per variant)
 * with realistic conversion delta favoring the stronger psychological hook.
 */
export function simulateTrafficBatch(experiment: AbTestExperiment): AbTestExperiment {
  const nextA: AbTestVariant = {
    ...experiment.variantA,
    impressions: experiment.variantA.impressions + 250,
    conversions: experiment.variantA.conversions + 11,
  };
  const nextB: AbTestVariant = {
    ...experiment.variantB,
    impressions: experiment.variantB.impressions + 250,
    conversions: experiment.variantB.conversions + 19,
  };

  const stats = evaluateAbExperimentStatistics({
    variantA: nextA,
    variantB: nextB,
    minSampleSize: experiment.minSampleSize,
    targetConfidencePct: experiment.targetConfidencePct,
  });

  let status = experiment.status;
  let winningVariantId = experiment.winningVariantId;

  if (stats.isStatisticallySignificant) {
    status = 'completed';
    winningVariantId = stats.recommendedOutcome === 'winner_b' ? 'B' : 'A';
  }

  return {
    ...experiment,
    variantA: nextA,
    variantB: nextB,
    stats,
    status,
    winningVariantId,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Aggregates summary KPIs across an organization's A/B experiments.
 */
export function summarizeAbExperiments(
  experiments: AbTestExperiment[]
): AbTestSummaryMetrics {
  if (experiments.length === 0) {
    return {
      totalExperiments: 0,
      runningCount: 0,
      completedCount: 0,
      avgRelativeLiftPct: 0,
      avgConfidencePct: 0,
    };
  }

  const runningCount = experiments.filter((e) => e.status === 'running').length;
  const completedCount = experiments.filter((e) => e.status === 'completed').length;

  const avgRelativeLiftPct = Number(
    (
      experiments.reduce((acc, e) => acc + Math.abs(e.stats.relativeLiftPct), 0) /
      experiments.length
    ).toFixed(1)
  );
  const avgConfidencePct = Number(
    (
      experiments.reduce((acc, e) => acc + e.stats.confidencePct, 0) /
      experiments.length
    ).toFixed(1)
  );

  return {
    totalExperiments: experiments.length,
    runningCount,
    completedCount,
    avgRelativeLiftPct,
    avgConfidencePct,
  };
}

// ============================================================================
// Self-contained TDD test suite when executed directly via `npx tsx`
// ============================================================================
if (typeof process !== 'undefined' && process.argv[1]?.includes('ab-testing.test')) {
  console.log('Running Feature 037 Campaign A/B Testing Hooks unit tests...');

  // Test 1: normalCdfApprox accuracy
  assert.ok(Math.abs(normalCdfApprox(0) - 0.5) < 0.001, 'Phi(0) should be 0.5');
  assert.ok(Math.abs(normalCdfApprox(1.96) - 0.975) < 0.001, 'Phi(1.96) should be ~0.975');

  // Test 2: evaluateAbExperimentStatistics significant winner B
  const evalSig = evaluateAbExperimentStatistics({
    variantA: { impressions: 1200, conversions: 48 }, // 4.0%
    variantB: { impressions: 1200, conversions: 84 }, // 7.0%
    minSampleSize: 300,
    targetConfidencePct: 95,
  });
  assert.equal(evalSig.rateAPct, 4.0);
  assert.equal(evalSig.rateBPct, 7.0);
  assert.equal(evalSig.relativeLiftPct, 75.0);
  assert.equal(evalSig.hasMinSample, true);
  assert.equal(evalSig.isStatisticallySignificant, true);
  assert.equal(evalSig.recommendedOutcome, 'winner_b');

  // Test 3: Guard against premature winner before minSampleSize
  const evalSmallSample = evaluateAbExperimentStatistics({
    variantA: { impressions: 50, conversions: 2 },
    variantB: { impressions: 50, conversions: 10 },
    minSampleSize: 200,
    targetConfidencePct: 95,
  });
  assert.equal(evalSmallSample.hasMinSample, false);
  assert.equal(evalSmallSample.isStatisticallySignificant, false);
  assert.equal(evalSmallSample.recommendedOutcome, 'keep_testing');

  // Test 4: generateChallengerHookVariant
  const challenger = generateChallengerHookVariant(
    'Como estruturar um carrossel de alta conversão',
    'social_proof_numbers'
  );
  assert.ok(challenger.includes('140 campanhas'), 'Should include social proof numbers framing');

  // Test 5: simulateTrafficBatch auto-promotes winner when reaching significance
  const mockExp: AbTestExperiment = {
    id: 'ab_1',
    organizationId: 'org_1',
    title: 'Teste Hook Reels',
    channel: 'instagram',
    testType: 'hook_copy',
    hypothesisAngle: 'curiosity_gap',
    targetMetric: 'engagement_rate',
    minSampleSize: 200,
    targetConfidencePct: 95,
    status: 'running',
    winningVariantId: null,
    variantA: { id: 'A', label: 'Controle', hookText: 'Hook A', impressions: 800, conversions: 30 },
    variantB: { id: 'B', label: 'Desafiante', hookText: 'Hook B', impressions: 800, conversions: 56 },
    stats: evaluateAbExperimentStatistics({
      variantA: { impressions: 800, conversions: 30 },
      variantB: { impressions: 800, conversions: 56 },
      minSampleSize: 200,
      targetConfidencePct: 95,
    }),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const afterBatch = simulateTrafficBatch(mockExp);
  assert.equal(afterBatch.variantA.impressions, 1050);
  assert.equal(afterBatch.status, 'completed');
  assert.equal(afterBatch.winningVariantId, 'B');

  console.log('✅ All Feature 037 Campaign A/B Testing Hooks tests passed (100%)!');
}
