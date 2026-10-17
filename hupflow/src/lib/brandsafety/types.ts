export type BrandSafetyMode = 'operational' | 'warning' | 'emergency_paused';

export type CrisisScope = 'global' | 'brand_specific' | 'channel_specific';

export interface CrisisIncidentLog {
  id: string;
  organizationId: string;
  action: 'kill_switch_activated' | 'kill_switch_deactivated' | 'posts_frozen' | 'posts_resumed';
  scope: CrisisScope;
  targetBrandSlug?: string;
  targetChannel?: string;
  reason: string;
  activatedByUserId: string;
  activatedByUserName: string;
  affectedPostsCount: number;
  details: Record<string, any>;
  createdAt: string;
}

export interface BrandSafetyConfig {
  organizationId: string;
  mode: BrandSafetyMode;
  isEmergencyPaused: boolean;
  pausedAt?: string;
  pausedByUserName?: string;
  pauseReason?: string;
  affectedPostsCount: number;
  autoResumeAt?: string;
  allowedChannels: string[]; // Canais que continuam podendo postar (ex: notas oficiais no Twitter)
  restrictedKeywords: string[]; // Palavras que bloqueiam postagens mesmo sem pausa global
  updatedAt: string;
}

export interface EvaluatePostSafetyInput {
  organizationId: string;
  brandSlug?: string;
  channel: string;
  content: string;
  scheduledAt: string;
}

export interface EvaluatePostSafetyResult {
  canPublish: boolean;
  reason?: string;
  flaggedKeywords?: string[];
  scopeBlocked?: CrisisScope;
}

export interface ReconcileResumeOptions {
  expiredPostStrategy: 'hold_for_review' | 'reschedule_next_day' | 'discard';
  resumedAt: string;
}

export interface ReconciledPostSummary {
  heldForReviewCount: number;
  rescheduledCount: number;
  discardedCount: number;
  untouchedFuturePostsCount: number;
}

// -------------------------------------------------------------------
// Pure Helper Functions
// -------------------------------------------------------------------

export function evaluatePostBrandSafety(
  config: BrandSafetyConfig,
  post: EvaluatePostSafetyInput
): EvaluatePostSafetyResult {
  if (config.restrictedKeywords && config.restrictedKeywords.length > 0) {
    const textLower = post.content.toLowerCase();
    const flagged = config.restrictedKeywords.filter(keyword =>
      textLower.includes(keyword.toLowerCase().trim())
    );
    if (flagged.length > 0) {
      return {
        canPublish: false,
        reason: `Publicação contém termos sensíveis restritos: [${flagged.join(', ')}]`,
        flaggedKeywords: flagged,
      };
    }
  }

  if (!config.isEmergencyPaused) {
    return { canPublish: true };
  }

  if (config.allowedChannels && config.allowedChannels.includes(post.channel)) {
    return { canPublish: true };
  }

  return {
    canPublish: false,
    reason: `Kill Switch ativado para a organização: "${config.pauseReason || 'Pausa de segurança emergencial'}"`,
    scopeBlocked: 'global',
  };
}

export function reconcileFrozenPostsOnResume(
  posts: Array<{ id: string; scheduledAt: string; status: string }>,
  options: ReconcileResumeOptions
): ReconciledPostSummary {
  const resumeTime = new Date(options.resumedAt).getTime();
  let heldForReviewCount = 0;
  let rescheduledCount = 0;
  let discardedCount = 0;
  let untouchedFuturePostsCount = 0;

  for (const post of posts) {
    const postScheduledTime = new Date(post.scheduledAt).getTime();

    if (postScheduledTime > resumeTime) {
      untouchedFuturePostsCount++;
      continue;
    }

    if (options.expiredPostStrategy === 'hold_for_review') {
      heldForReviewCount++;
    } else if (options.expiredPostStrategy === 'reschedule_next_day') {
      rescheduledCount++;
    } else if (options.expiredPostStrategy === 'discard') {
      discardedCount++;
    }
  }

  return {
    heldForReviewCount,
    rescheduledCount,
    discardedCount,
    untouchedFuturePostsCount,
  };
}

export function summarizeBrandSafetyHealth(config: BrandSafetyConfig): {
  healthScore: number;
  statusLabel: string;
  isProtected: boolean;
} {
  if (config.isEmergencyPaused) {
    return {
      healthScore: 50,
      statusLabel: 'CRÍTICO — Fila Pausada Preventivamente',
      isProtected: true,
    };
  }

  let score = 100;
  if (!config.restrictedKeywords || config.restrictedKeywords.length === 0) {
    score -= 15;
  }
  if (!config.allowedChannels || config.allowedChannels.length === 0) {
    score -= 10;
  }

  return {
    healthScore: score,
    statusLabel: score >= 90 ? 'Excelente Proteção' : 'Proteção Parcial',
    isProtected: true,
  };
}
