import assert from 'node:assert';
import {
  EvergreenItem,
  EvergreenStats,
  EvergreenVariation,
} from './types';

/**
 * Calcula o Índice de Perenidade (Evergreen Score) de 0 a 100
 * bonificando estrutura educativa/carrossel e penalizando termos efêmeros/datados.
 */
export function calculateEvergreenScore(
  caption: string,
  mediaType: 'carousel' | 'single_image' | 'short_video' = 'carousel',
  historicalEngagementRate = 4.5
): number {
  let score = 60;

  // Bônus por formato de alta retenção
  if (mediaType === 'carousel') score += 15;
  else if (mediaType === 'short_video') score += 10;

  // Bônus por engajamento histórico
  score += Math.min(15, Math.round(historicalEngagementRate * 2));

  // Bônus por listas estruturadas ou guias passo a passo
  if (/(\b1\.|\bpasso 1|guia|checklist|como |estrat[ée]gia|framework)/i.test(caption)) {
    score += 10;
  }

  // Penalidade para marcadores temporais efêmeros (notícias de ocasião)
  if (
    /\b(ontem|amanh[ãa]|nesta sexta|hoje à noite|black friday|feliz natal|feliz ano novo|2022|2023|2024)\b/i.test(
      caption
    )
  ) {
    score -= 30;
  }

  return Math.max(10, Math.min(100, score));
}

/**
 * Gera 3 variações de gancho/copy para rotação round-robin em cada ciclo de reciclagem
 */
export function generateSpunVariations(
  title: string,
  originalCaption: string
): EvergreenVariation[] {
  const cleanTitle = (title || 'Guia Prático').trim();
  const cleanBody = (originalCaption || '').trim();

  return [
    {
      id: 'var_contrarian',
      angle: 'contrarian',
      label: 'Ângulo 1: Provocativo / Contrarian',
      caption: `⚡ A maioria das equipes ainda erra nisso em "${cleanTitle}":\n\n${cleanBody}\n\nSalve este post para consultar antes da sua próxima sprint! 📌`,
    },
    {
      id: 'var_checklist',
      angle: 'checklist',
      label: 'Ângulo 2: Checklist Direto ao Ponto',
      caption: `📋 Checklist Rápido — ${cleanTitle}:\n\n${cleanBody}\n\nQual desses pilares já está rodando na sua operação? Comente abaixo! 👇`,
    },
    {
      id: 'var_story',
      angle: 'story_hook',
      label: 'Ângulo 3: Lição de Campo & Retenção',
      caption: `💡 Se você perdeu este guia da primeira vez, aqui está o resumo prático sobre ${cleanTitle}:\n\n${cleanBody}\n\nCompartilhe com o seu time! 🚀`,
    },
  ];
}

/**
 * Seleciona a variação correspondente ao ciclo atual em round-robin
 */
export function pickNextVariationForCycle(
  variations: EvergreenVariation[],
  recycleCount: number
): EvergreenVariation | null {
  if (!variations || variations.length === 0) return null;
  const idx = Math.max(0, recycleCount) % variations.length;
  return variations[idx];
}

/**
 * Calcula o timestamp da próxima janela de reciclagem respeitando o cooldown mínimo de 7 dias
 */
export function computeNextRecycleSlot(
  fromTimestampMs: number,
  cooldownDays: number
): number {
  const safeCooldown = Math.max(7, Math.min(365, Math.round(cooldownDays || 30)));
  const dayMs = 86_400_000;
  return fromTimestampMs + safeCooldown * dayMs;
}

/**
 * Verifica se o item está elegível para reciclagem imediata ou automática
 */
export function isEligibleForRecycle(
  item: Pick<
    EvergreenItem,
    'isActive' | 'recycleCount' | 'maxRecycles' | 'lastRecycledAt' | 'cooldownDays'
  >,
  nowMs = Date.now()
): { eligible: boolean; reason?: string } {
  if (!item.isActive) {
    return { eligible: false, reason: 'Item pausado na biblioteca Evergreen.' };
  }
  if (item.recycleCount >= item.maxRecycles) {
    return {
      eligible: false,
      reason: `Limite máximo de ${item.maxRecycles} reciclagens atingido.`,
    };
  }
  if (item.lastRecycledAt) {
    const minNextMs = computeNextRecycleSlot(
      item.lastRecycledAt,
      item.cooldownDays
    );
    if (nowMs < minNextMs) {
      const remainingDays = Math.ceil((minNextMs - nowMs) / 86_400_000);
      return {
        eligible: false,
        reason: `Em período de Cooldown (${remainingDays}d restantes).`,
      };
    }
  }
  return { eligible: true };
}

/**
 * Calcula estatísticas agregadas da biblioteca Evergreen
 */
export function calculateEvergreenStats(items: EvergreenItem[]): EvergreenStats {
  const totalItems = items.length;
  const activeItems = items.filter((i) => i.isActive).length;
  const totalRecyclesExecuted = items.reduce(
    (acc, i) => acc + (i.recycleCount || 0),
    0
  );
  const averageEvergreenScore =
    totalItems > 0
      ? Math.round(
          items.reduce((acc, i) => acc + (i.evergreenScore || 0), 0) / totalItems
        )
      : 0;
  // Cada reciclagem automatizada economiza ~0.75h (45 min) de criação/copy/design
  const estimatedHoursSaved = Number((totalRecyclesExecuted * 0.75).toFixed(1));

  return {
    totalItems,
    activeItems,
    totalRecyclesExecuted,
    averageEvergreenScore,
    estimatedHoursSaved,
  };
}

// Bateria de Testes Unitários
async function runTests() {
  console.log(
    '[TEST] Iniciando bateria de testes do Evergreen Content Recycler...'
  );

  // 1. Cálculo de Evergreen Score (Perene vs Datado)
  const highEvergreen = calculateEvergreenScore(
    'Guia prático: 1. Defina a persona. 2. Crie um framework de distribuição.',
    'carousel',
    5.0
  );
  const datedPost = calculateEvergreenScore(
    'Aproveite nossa promoção de Black Friday 2023 que acaba amanhã!',
    'single_image',
    2.0
  );
  assert.ok(highEvergreen >= 85, 'Post educativo em carrossel deve ter score >= 85');
  assert.ok(
    datedPost < 50,
    'Post com termos efêmeros (amanhã, Black Friday 2023) deve sofrer penalidade'
  );
  console.log('✅ Cálculo de Evergreen Score e penalização de posts datados aprovados.');

  // 2. Geração e Seleção Round-Robin de Variações
  const variations = generateSpunVariations(
    '7 Leis do SaaS B2B',
    'Foque em retenção líquida (NRR) e onboarding rápido.'
  );
  assert.strictEqual(variations.length, 3);
  assert.strictEqual(pickNextVariationForCycle(variations, 0)?.angle, 'contrarian');
  assert.strictEqual(pickNextVariationForCycle(variations, 1)?.angle, 'checklist');
  assert.strictEqual(pickNextVariationForCycle(variations, 2)?.angle, 'story_hook');
  assert.strictEqual(pickNextVariationForCycle(variations, 3)?.angle, 'contrarian');
  console.log('✅ Geração de variações e rotação round-robin aprovadas.');

  // 3. Guardião de Cooldown e Elegibilidade
  const now = 1_700_000_000_000;
  const recentRecycle = now - 5 * 86_400_000; // reciclado há 5 dias
  const checkCooldown = isEligibleForRecycle(
    {
      isActive: true,
      recycleCount: 2,
      maxRecycles: 10,
      cooldownDays: 30,
      lastRecycledAt: recentRecycle,
    },
    now
  );
  assert.strictEqual(checkCooldown.eligible, false);
  assert.ok(checkCooldown.reason?.includes('Cooldown'));

  const checkReady = isEligibleForRecycle(
    {
      isActive: true,
      recycleCount: 2,
      maxRecycles: 10,
      cooldownDays: 14,
      lastRecycledAt: now - 20 * 86_400_000,
    },
    now
  );
  assert.strictEqual(checkReady.eligible, true);
  console.log('✅ Validação de Cooldown anti-saturação e limite de ciclos aprovada.');

  console.log(
    '🎉 Todos os testes unitários do Evergreen Content Recycler passaram com 100% de sucesso!'
  );
}

if (require.main === module) {
  runTests().catch((err) => {
    console.error('❌ Falha nos testes de Evergreen:', err);
    process.exit(1);
  });
}
