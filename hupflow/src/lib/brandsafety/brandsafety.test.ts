import {
  BrandSafetyConfig,
  EvaluatePostSafetyInput,
  EvaluatePostSafetyResult,
  ReconcileResumeOptions,
  ReconciledPostSummary,
} from './types';

/**
 * Avalia se uma publicação específica pode ser disparada à luz das regras de Brand Safety ativas.
 */
export function evaluatePostBrandSafety(
  config: BrandSafetyConfig,
  post: EvaluatePostSafetyInput
): EvaluatePostSafetyResult {
  // 1. Verificação de Palavras Proibidas / Termos Sensíveis (ativo mesmo fora do modo de emergência)
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

  // 2. Se o Kill Switch NÃO estiver ativado, publicação está liberada
  if (!config.isEmergencyPaused) {
    return { canPublish: true };
  }

  // 3. Exceção de Canais Autorizados para Gestão de Crise (ex: comunicado oficial no X)
  if (config.allowedChannels && config.allowedChannels.includes(post.channel)) {
    return { canPublish: true };
  }

  // 4. Bloqueio por Kill Switch Ativo
  return {
    canPublish: false,
    reason: `Kill Switch ativado para a organização: "${config.pauseReason || 'Pausa de segurança emergencial'}"`,
    scopeBlocked: 'global',
  };
}

/**
 * Reconcilia a fila de publicações vencidas durante uma pausa de emergência para evitar efeito avalanche.
 */
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

    // Se o post já era futuro em relação ao momento de retomada, não foi impactado pela janela de atraso
    if (postScheduledTime > resumeTime) {
      untouchedFuturePostsCount++;
      continue;
    }

    // Se venceu durante a crise
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

/**
 * Sumariza o índice de resiliência e saúde da marca
 */
export function summarizeBrandSafetyHealth(config: BrandSafetyConfig): {
  healthScore: number;
  statusLabel: string;
  isProtected: boolean;
} {
  if (config.isEmergencyPaused) {
    return {
      healthScore: 50,
      statusLabel: 'CRÍTICO — Operação Interrompida Preventivamente',
      isProtected: true,
    };
  }

  let score = 100;
  if (!config.restrictedKeywords || config.restrictedKeywords.length === 0) {
    score -= 15; // Sem filtros de termos sensíveis
  }
  if (!config.allowedChannels || config.allowedChannels.length === 0) {
    score -= 10; // Sem canal de contingência cadastrado
  }

  return {
    healthScore: score,
    statusLabel: score >= 90 ? 'Excelente Proteção' : 'Proteção Parcial',
    isProtected: true,
  };
}

// -------------------------------------------------------------------
// Suíte de Testes Unitários
// -------------------------------------------------------------------
function runBrandSafetyUnitTests() {
  console.log('--- Running Feature 048 Brand Safety & Crisis Kill Switch Unit Tests ---');

  const baseConfig: BrandSafetyConfig = {
    organizationId: 'org-test-1',
    mode: 'operational',
    isEmergencyPaused: false,
    affectedPostsCount: 0,
    allowedChannels: ['x_twitter'], // Apenas canal de contingência
    restrictedKeywords: ['tragédia', 'escândalo', 'fraude'],
    updatedAt: new Date().toISOString(),
  };

  // Teste 1: Publicação normal sem termos restritos e sem kill switch
  const res1 = evaluatePostBrandSafety(baseConfig, {
    organizationId: 'org-test-1',
    channel: 'instagram',
    content: 'Aproveite a nossa super promoção de verão!',
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
  });
  if (!res1.canPublish) {
    throw new Error('Post normal deveria ter sido aprovado');
  }

  // Teste 2: Bloqueio por palavra proibida
  const res2 = evaluatePostBrandSafety(baseConfig, {
    organizationId: 'org-test-1',
    channel: 'instagram',
    content: 'Comunicamos que a recente fraude foi contornada.',
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
  });
  if (res2.canPublish || !res2.flaggedKeywords?.includes('fraude')) {
    throw new Error('Post com palavra restrita deveria ter sido bloqueado');
  }

  // Teste 3: Ativação do Kill Switch bloqueia canal padrão
  const pausedConfig: BrandSafetyConfig = {
    ...baseConfig,
    mode: 'emergency_paused',
    isEmergencyPaused: true,
    pauseReason: 'Recall de produto internacional',
    affectedPostsCount: 8,
  };

  const res3 = evaluatePostBrandSafety(pausedConfig, {
    organizationId: 'org-test-1',
    channel: 'instagram',
    content: 'Confira as novidades do nosso lançamento!',
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
  });
  if (res3.canPublish) {
    throw new Error('Post no Instagram deveria ter sido bloqueado pelo Kill Switch ativo');
  }

  // Teste 4: Canal de contingência (x_twitter) tem permissão de postar nota oficial
  const res4 = evaluatePostBrandSafety(pausedConfig, {
    organizationId: 'org-test-1',
    channel: 'x_twitter',
    content: 'Nota oficial da diretoria sobre o recall programado.',
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
  });
  if (!res4.canPublish) {
    throw new Error('Canal de contingência cadastrado deveria ter sido liberado');
  }

  // Teste 5: Reconciliação sem avalanche na retomada
  const now = Date.now();
  const testPosts = [
    { id: 'p1', scheduledAt: new Date(now - 7200000).toISOString(), status: 'scheduled' }, // 2h atrasado
    { id: 'p2', scheduledAt: new Date(now - 3600000).toISOString(), status: 'scheduled' }, // 1h atrasado
    { id: 'p3', scheduledAt: new Date(now + 3600000).toISOString(), status: 'scheduled' }, // 1h no futuro
  ];

  const reconcileRes = reconcileFrozenPostsOnResume(testPosts, {
    expiredPostStrategy: 'hold_for_review',
    resumedAt: new Date(now).toISOString(),
  });

  if (reconcileRes.heldForReviewCount !== 2) {
    throw new Error(`Esperado 2 posts retidos para revisão, obtido ${reconcileRes.heldForReviewCount}`);
  }
  if (reconcileRes.untouchedFuturePostsCount !== 1) {
    throw new Error('Esperado 1 post futuro intacto');
  }

  console.log('✅ All Feature 048 Brand Safety & Crisis Kill Switch unit tests passed successfully!');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('brandsafety.test')) {
  runBrandSafetyUnitTests();
}
