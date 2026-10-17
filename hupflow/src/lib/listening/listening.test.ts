import assert from 'node:assert/strict';
import {
  BrandHealthRadarSummary,
  CrisisRiskLevel,
  ListeningCategory,
  ListeningMentionItem,
  ListeningSentiment,
  StrategicResponsePlaybook,
} from './types';

const POSITIVE_MARKERS = [
  'incrível',
  'excelente',
  'melhor',
  'recomendo',
  'rápido',
  'impecável',
  'salvou',
  'perfeito',
  'limpo',
  'intuitivo',
];

const NEGATIVE_MARKERS = [
  'erro',
  'travou',
  'caiu',
  'lento',
  'instabilidade',
  'bug',
  'horrível',
  'caro',
  'suporte ruim',
  'perdi',
  'problema',
  'alternativa',
];

const CRISIS_MARKERS = [
  'erro 500',
  'fora do ar',
  'vazamento',
  'cobrança indevida',
  'perdi meus posts',
  'caiu geral',
  'instabilidade',
];

/**
 * Analyzes a social listening mention to compute sentiment, PR urgency score (0..100),
 * and crisis level classification.
 */
export function analyzeMentionSignal(input: {
  content: string;
  authorFollowers: number;
  velocityPerHour: number;
  category?: ListeningCategory;
}): {
  sentiment: ListeningSentiment;
  sentimentScore: number;
  urgencyScore: number;
  crisisLevel: CrisisRiskLevel;
  inferredCategory: ListeningCategory;
} {
  const lower = input.content.toLowerCase();

  let posHits = 0;
  let negHits = 0;
  let crisisHits = 0;

  for (const word of POSITIVE_MARKERS) {
    if (lower.includes(word)) posHits += 1;
  }
  for (const word of NEGATIVE_MARKERS) {
    if (lower.includes(word)) negHits += 1;
  }
  for (const word of CRISIS_MARKERS) {
    if (lower.includes(word)) crisisHits += 1;
  }

  let sentiment: ListeningSentiment = 'neutral';
  let sentimentScore = 0;

  if (negHits > posHits || crisisHits > 0) {
    sentiment = 'negative';
    sentimentScore = Math.max(-95, -(35 + negHits * 18 + crisisHits * 20));
  } else if (posHits > negHits) {
    sentiment = 'positive';
    sentimentScore = Math.min(95, 40 + posHits * 20);
  }

  let inferredCategory: ListeningCategory = input.category || 'brand_mention';
  if (!input.category) {
    if (crisisHits > 0) {
      inferredCategory = 'crisis_risk';
    } else if (lower.includes('alternativa') || lower.includes('migrar')) {
      inferredCategory = 'competitor_complaint';
    }
  }

  // Urgency Score (0..100): Lexical Risk (0..45) + Author Reach (0..25) + Velocity (0..30)
  const lexicalRisk =
    sentiment === 'negative'
      ? Math.min(45, 20 + negHits * 10 + crisisHits * 15)
      : inferredCategory === 'competitor_complaint'
      ? 28
      : 10;

  const followers = Math.max(100, input.authorFollowers);
  const reachComponent = Math.min(25, Math.round(Math.log10(followers) * 5));
  const velocityComponent = Math.min(
    30,
    Math.round(Math.max(0, input.velocityPerHour) * 0.35)
  );

  const urgencyScore = Math.min(
    100,
    Math.max(10, lexicalRisk + reachComponent + velocityComponent)
  );

  let crisisLevel: CrisisRiskLevel = 'normal';
  if (urgencyScore >= 75 && sentiment === 'negative') {
    crisisLevel = 'critical_crisis';
  } else if (urgencyScore >= 60) {
    crisisLevel = 'elevated';
  } else if (urgencyScore >= 42) {
    crisisLevel = 'watch';
  }

  return {
    sentiment,
    sentimentScore,
    urgencyScore,
    crisisLevel,
    inferredCategory,
  };
}

/**
 * Synthesizes an actionable PR / Social Selling response playbook for a mention.
 */
export function generateStrategicResponsePlaybook(input: {
  authorHandle: string;
  keywordMatched: string;
  category: ListeningCategory;
  sentiment: ListeningSentiment;
}): StrategicResponsePlaybook {
  const handle = input.authorHandle.startsWith('@')
    ? input.authorHandle
    : `@${input.authorHandle}`;

  switch (input.category) {
    case 'crisis_risk':
      return {
        strategyLabel: 'Contenção Proativa de RP & Transparência',
        recommendedAction:
          'Responder publicamente em até 15 minutos com status técnico objetivo e oferecer canal prioritário.',
        suggestedPublicReply: `Olá ${handle}! Monitoramos esse sinal em "${input.keywordMatched}" em tempo real. No HupFlow nossa fila com Dead-Letter Queue (DLQ) já protege os agendamentos com retry automático sem perda de dados. Nos chame na DM se precisar de apoio imediato!`,
      };
    case 'competitor_complaint':
      return {
        strategyLabel: 'Social Selling Consultivo (Zero Spam)',
        recommendedAction:
          'Validar a dor relatada pelo usuário e convidar para testar a arquitetura Clean-Room do HupFlow.',
        suggestedPublicReply: `Oi ${handle}! Vimos seu ponto sobre "${input.keywordMatched}". Construímos o HupFlow exatamente para resolver esse gargalo com Estúdio de Carrosséis nativo e Portais White-Label de aprovação em 1 clique. Se quiser testar um workspace gratuito, te envio o convite!`,
      };
    case 'industry_trend':
      return {
        strategyLabel: 'Newsjacking & Autoridade de Nicho',
        recommendedAction:
          'Transformar a discussão em um carrossel analítico ou comentar acrescentando dados exclusivos.',
        suggestedPublicReply: `Excelente levantamento, ${handle}! Nos nossos benchmarks de "${input.keywordMatched}", notamos que combinar esse formato com ganchos testados em A/B eleva a retenção em +42%.`,
      };
    case 'brand_mention':
    default:
      if (input.sentiment === 'positive') {
        return {
          strategyLabel: 'Amplificação de Prova Social & UGC',
          recommendedAction:
            'Agradecer em público, repostar nos Stories e solicitar permissão para usar como depoimento.',
          suggestedPublicReply: `Muito obrigado pelo feedback, ${handle}! Ficamos felizes demais em ver o HupFlow acelerando sua operação. Podemos destacar seu comentário na nossa vitrine de casos reais? 🚀`,
        };
      }
      return {
        strategyLabel: 'Atendimento Consultivo da Comunidade',
        recommendedAction:
          'Esclarecer a dúvida rapidamente e compartilhar link da documentação ou template.',
        suggestedPublicReply: `Olá ${handle}! Obrigado por mencionar "${input.keywordMatched}". Estamos à disposição caso queira explorar nossos fluxos de automação e aprovação!`,
      };
  }
}

/**
 * Evaluates overall Brand Health (Net Sentiment Score -100..+100) and active crisis status.
 */
export function evaluateBrandHealthAndCrisisRadar(
  mentions: ListeningMentionItem[]
): BrandHealthRadarSummary {
  if (mentions.length === 0) {
    return {
      totalMentions: 0,
      netSentimentScore: 100,
      criticalCrisisCount: 0,
      competitorLeadOpportunities: 0,
      crisisAlertActive: false,
      topTrendingKeyword: 'N/A',
    };
  }

  let positives = 0;
  let negatives = 0;
  let criticalCrisisCount = 0;
  let competitorLeadOpportunities = 0;
  const keywordCounts = new Map<string, number>();

  for (const m of mentions) {
    if (m.sentiment === 'positive') positives += 1;
    if (m.sentiment === 'negative') negatives += 1;
    if (m.crisisLevel === 'critical_crisis' && m.status === 'open') {
      criticalCrisisCount += 1;
    }
    if (m.category === 'competitor_complaint' && m.status !== 'ignored') {
      competitorLeadOpportunities += 1;
    }
    keywordCounts.set(
      m.keywordMatched,
      (keywordCounts.get(m.keywordMatched) || 0) + m.velocityPerHour
    );
  }

  const netSentimentScore = Math.round(
    ((positives - negatives) / mentions.length) * 100
  );

  let topTrendingKeyword = mentions[0].keywordMatched;
  let bestVelocity = -1;
  for (const [kw, vel] of keywordCounts.entries()) {
    if (vel > bestVelocity) {
      bestVelocity = vel;
      topTrendingKeyword = kw;
    }
  }

  return {
    totalMentions: mentions.length,
    netSentimentScore,
    criticalCrisisCount,
    competitorLeadOpportunities,
    crisisAlertActive: criticalCrisisCount > 0 || netSentimentScore <= -30,
    topTrendingKeyword,
  };
}

// ============================================================================
// Self-contained TDD test suite when executed directly via `npx tsx`
// ============================================================================
if (typeof process !== 'undefined' && process.argv[1]?.includes('listening.test')) {
  console.log('Running Feature 038 Social Listening & Brand Mentions unit tests...');

  // Test 1: Crisis detection on high-velocity negative mention
  const crisisSignal = analyzeMentionSignal({
    content: 'Erro 500 e instabilidade grave hoje! Perdi meus posts agendados.',
    authorFollowers: 50000,
    velocityPerHour: 90,
  });
  assert.equal(crisisSignal.sentiment, 'negative');
  assert.ok(crisisSignal.urgencyScore >= 75, 'High velocity + crisis words must score >= 75');
  assert.equal(crisisSignal.crisisLevel, 'critical_crisis');
  assert.equal(crisisSignal.inferredCategory, 'crisis_risk');

  // Test 2: Positive brand advocate signal
  const advocateSignal = analyzeMentionSignal({
    content: 'O estúdio de carrosséis do HupFlow é incrível e rápido, recomendo demais!',
    authorFollowers: 8500,
    velocityPerHour: 20,
    category: 'brand_mention',
  });
  assert.equal(advocateSignal.sentiment, 'positive');
  assert.ok(advocateSignal.sentimentScore > 50);
  assert.equal(advocateSignal.crisisLevel, 'normal');

  // Test 3: Strategic Playbook generation for competitor complaint
  const playbook = generateStrategicResponsePlaybook({
    authorHandle: '@agencia_scale',
    keywordMatched: 'Alternativa Postiz',
    category: 'competitor_complaint',
    sentiment: 'negative',
  });
  assert.ok(playbook.strategyLabel.includes('Social Selling'));
  assert.ok(playbook.suggestedPublicReply.includes('@agencia_scale'));

  // Test 4: Brand Health & Net Sentiment Score calculation
  const now = new Date().toISOString();
  const sampleMentions: ListeningMentionItem[] = [
    {
      id: 'm1',
      organizationId: 'org_1',
      keywordMatched: 'HupFlow Carrossel',
      channel: 'linkedin',
      category: 'brand_mention',
      authorName: 'Ana',
      authorHandle: '@ana',
      authorFollowers: 10000,
      content: 'Excelente plataforma!',
      sentiment: 'positive',
      sentimentScore: 80,
      velocityPerHour: 40,
      urgencyScore: 35,
      crisisLevel: 'normal',
      status: 'open',
      playbook,
      detectedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'm2',
      organizationId: 'org_1',
      keywordMatched: 'API Meta Instabilidade',
      channel: 'x',
      category: 'crisis_risk',
      authorName: 'Carlos',
      authorHandle: '@carlos',
      authorFollowers: 45000,
      content: 'Erro 500 na API',
      sentiment: 'negative',
      sentimentScore: -75,
      velocityPerHour: 95,
      urgencyScore: 86,
      crisisLevel: 'critical_crisis',
      status: 'open',
      playbook,
      detectedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const radar = evaluateBrandHealthAndCrisisRadar(sampleMentions);
  assert.equal(radar.totalMentions, 2);
  assert.equal(radar.netSentimentScore, 0); // (1 pos - 1 neg) / 2 * 100 = 0
  assert.equal(radar.criticalCrisisCount, 1);
  assert.equal(radar.crisisAlertActive, true);
  assert.equal(radar.topTrendingKeyword, 'API Meta Instabilidade');

  console.log('✅ All Feature 038 Social Listening & Brand Mentions tests passed (100%)!');
}
