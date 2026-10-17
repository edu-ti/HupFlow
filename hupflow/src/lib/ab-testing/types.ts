export type AbTestChannel = 'instagram' | 'linkedin' | 'tiktok' | 'x';

export type AbTestType = 'hook_copy' | 'carousel_cover' | 'cta_button';

export type AbHypothesisAngle =
  | 'curiosity_gap'
  | 'contrarian_shock'
  | 'social_proof_numbers'
  | 'urgency_fomo';

export type AbTargetMetric = 'engagement_rate' | 'ctr_clicks' | 'saves_rate';

export type AbExperimentStatus = 'running' | 'completed' | 'paused';

export type AbRecommendedOutcome =
  | 'keep_testing'
  | 'winner_a'
  | 'winner_b'
  | 'inconclusive';

export interface AbTestVariant {
  id: 'A' | 'B';
  label: string;
  hookText: string;
  impressions: number;
  conversions: number;
}

export interface AbStatisticalEvaluation {
  rateAPct: number;
  rateBPct: number;
  relativeLiftPct: number;
  zScore: number;
  confidencePct: number;
  hasMinSample: boolean;
  isStatisticallySignificant: boolean;
  recommendedOutcome: AbRecommendedOutcome;
}

export interface AbTestExperiment {
  id: string;
  organizationId: string;
  title: string;
  channel: AbTestChannel;
  testType: AbTestType;
  hypothesisAngle: AbHypothesisAngle;
  targetMetric: AbTargetMetric;
  minSampleSize: number;
  targetConfidencePct: number;
  status: AbExperimentStatus;
  winningVariantId: 'A' | 'B' | null;
  variantA: AbTestVariant;
  variantB: AbTestVariant;
  stats: AbStatisticalEvaluation;
  createdAt: string;
  updatedAt: string;
}

export interface AbTestSummaryMetrics {
  totalExperiments: number;
  runningCount: number;
  completedCount: number;
  avgRelativeLiftPct: number;
  avgConfidencePct: number;
}

export interface CreateAbTestInput {
  title: string;
  channel: AbTestChannel;
  testType: AbTestType;
  hypothesisAngle: AbHypothesisAngle;
  targetMetric?: AbTargetMetric;
  minSampleSize?: number;
  targetConfidencePct?: number;
  hookTextA: string;
  hookTextB?: string;
}
