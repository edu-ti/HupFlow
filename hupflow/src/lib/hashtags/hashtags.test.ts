import assert from 'node:assert';
import {
  sanitizeTag,
  getNetworkGuidance,
  categorizeHashtagTier,
  recommendHashtags,
} from './service';
import { SocialNetwork } from './types';

console.log('[TEST] Iniciando bateria de testes do Recomendador de Hashtags com IA...');

// ----------------------------------------------------------------------------
// Teste 1: Higienização e Normalização de Hashtags
// ----------------------------------------------------------------------------
assert.strictEqual(sanitizeTag('#MarketingDigital'), 'MarketingDigital', 'Deve remover o símbolo # inicial');
assert.strictEqual(sanitizeTag('  inteligência artificial!  '), 'InteligenciaArtificial', 'Deve remover acentos, pontuações e formatar');
assert.strictEqual(sanitizeTag('saas_b2b'), 'SaasB2b', 'Deve converter underscores e hífens');
assert.strictEqual(sanitizeTag(''), '', 'Deve retornar vazio para string nula');
console.log('✅ Higienização e formatação de tags validada.');

// ----------------------------------------------------------------------------
// Teste 2: Diretrizes Algorítmicas por Rede Social (Guidance)
// ----------------------------------------------------------------------------
const networks: SocialNetwork[] = ['linkedin', 'x', 'instagram', 'threads'];

for (const net of networks) {
  const guidance = getNetworkGuidance(net);
  assert.strictEqual(guidance.network, net);
  assert.ok(guidance.recommendedCount > 0, 'Deve possuir contagem recomendada positiva');
  assert.ok(guidance.maxAllowed >= guidance.recommendedCount, 'Max deve ser maior ou igual à recomendada');
  assert.ok(guidance.tip.length > 10, 'Deve conter dica explicativa para a rede');
}

assert.strictEqual(getNetworkGuidance('linkedin').recommendedCount, 5, 'LinkedIn deve recomendar até 5 tags');
assert.strictEqual(getNetworkGuidance('x').recommendedCount, 2, 'X deve recomendar até 2 tags para economizar caracteres');
assert.strictEqual(getNetworkGuidance('threads').recommendedCount, 1, 'Threads deve recomendar 1 tag principal');
console.log('✅ Diretrizes algorítmicas por rede social aprovadas.');

// ----------------------------------------------------------------------------
// Teste 3: Classificação em Tiers de Alcance (Broad, Niche, Community)
// ----------------------------------------------------------------------------
assert.strictEqual(categorizeHashtagTier('Tecnologia', 92), 'broad', 'Score >= 85 deve ser broad');
assert.strictEqual(categorizeHashtagTier('SaaSMarketing', 78), 'niche', 'Score 70-84 deve ser niche');
assert.strictEqual(categorizeHashtagTier('CriadoresCampinas', 55), 'community', 'Score < 70 deve ser community');
console.log('✅ Classificação por tiers de alcance validada.');

// ----------------------------------------------------------------------------
// Teste 4: Recomendação Semântica de Hashtags (Modo Offline / Heurístico)
// ----------------------------------------------------------------------------
async function runRecommendationTest() {
  const result = await recommendHashtags({
    text: 'Aprenda como escalar seu software SaaS no mercado B2B com produtividade e equipe enxuta.',
    topic: 'Gestão SaaS e Startups',
    network: 'linkedin',
    limit: 6,
  });

  assert.ok(Array.isArray(result.recommendations), 'Deve retornar array de recomendações');
  assert.ok(result.recommendations.length > 0, 'Deve encontrar tags relevantes para o texto');
  assert.strictEqual(result.guidance.network, 'linkedin');

  // Verifica se cada recomendação possui os campos essenciais
  for (const rec of result.recommendations) {
    assert.ok(rec.tag.length > 0, 'Tag não pode ser vazia');
    assert.ok(rec.formattedTag.startsWith('#'), 'Tag formatada deve iniciar com #');
    assert.ok(['broad', 'niche', 'community'].includes(rec.tier), 'Tier deve ser válido');
    assert.ok(rec.relevanceScore >= 0 && rec.relevanceScore <= 100, 'Score deve estar entre 0 e 100');
  }

  console.log('✅ Motor de recomendação semântica validado.');
  console.log('🎉 Todos os testes unitários de Hashtags IA passaram com 100% de sucesso!');
  process.exit(0);
}

runRecommendationTest().catch((err) => {
  console.error('❌ Falha nos testes de hashtags:', err);
  process.exit(1);
});
