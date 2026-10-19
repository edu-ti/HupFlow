import assert from 'node:assert';
import {
  calculateEvergreenScore,
  generateSpunVariations,
  pickNextVariationForCycle,
  computeNextRecycleSlot,
  isEligibleForRecycle,
  calculateEvergreenStats,
} from './evergreen-utils';

export {
  calculateEvergreenScore,
  generateSpunVariations,
  pickNextVariationForCycle,
  computeNextRecycleSlot,
  isEligibleForRecycle,
  calculateEvergreenStats,
};

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
