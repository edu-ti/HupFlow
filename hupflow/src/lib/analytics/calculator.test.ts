import assert from 'node:assert';
import {
  calculateEngagementRate,
  rateToBase10000,
  base10000ToRate,
  generateDailyDateRange,
  fillDailySeries,
  calculateChannelBreakdown,
  generateMockAnalyticsData,
} from './calculator';

console.log('[TEST] Iniciando testes do motor de cálculos de analytics...');

// 1. Taxa de engajamento
const zeroRate = calculateEngagementRate(10, 5, 2, 0);
assert.strictEqual(zeroRate, 0, 'Alcance zero deve retornar taxa zero');

const validRate = calculateEngagementRate(100, 20, 10, 2000); // 130 / 2000 * 100 = 6.5%
assert.strictEqual(validRate, 6.5, 'Taxa calculada deve ser exatamente 6.5%');

// 2. Base 10000 conversion
assert.strictEqual(rateToBase10000(6.5), 650);
assert.strictEqual(base10000ToRate(650), 6.5);
assert.strictEqual(rateToBase10000(11.25), 1125);
assert.strictEqual(base10000ToRate(1125), 11.25);

console.log('✅ Cálculos de taxa de engajamento e conversão de base aprovados.');

// 3. Geração de intervalo diário
const range7 = generateDailyDateRange(7);
assert.strictEqual(range7.length, 7, 'Intervalo de 7 dias deve conter 7 elementos');

const todayStr = new Date().toISOString().slice(0, 10);
assert.strictEqual(range7[range7.length - 1], todayStr, 'Último dia da série deve ser hoje');

// 4. Preenchimento de séries com lacunas
const sparseRaw = [
  { date: range7[1], impressions: 500, reach: 350, engagements: 25 },
  { date: range7[5], impressions: 800, reach: 600, engagements: 45 },
];

const filled = fillDailySeries(sparseRaw, 7);
assert.strictEqual(filled.length, 7, 'Série preenchida deve ter exatamente 7 pontos');
assert.strictEqual(filled[0].reach, 0, 'Data sem dados deve ser preenchida com zero');
assert.strictEqual(filled[1].reach, 350, 'Data com dados deve manter valor original');
assert.strictEqual(filled[5].impressions, 800);

console.log('✅ Preenchimento de séries temporais diárias validado.');

// 5. Agregação por canal
const channelItems = [
  { provider: 'instagram' as const, reach: 1000, engagements: 80, count: 2 },
  { provider: 'instagram' as const, reach: 500, engagements: 30, count: 1 },
  { provider: 'linkedin' as const, reach: 500, engagements: 25, count: 1 },
];

const breakdown = calculateChannelBreakdown(channelItems);
assert.ok(breakdown.length >= 2);
const ig = breakdown.find((b) => b.provider === 'instagram');
assert.strictEqual(ig?.totalReach, 1500);
assert.strictEqual(ig?.totalEngagements, 110);
assert.strictEqual(ig?.totalPosts, 3);

console.log('✅ Agregação por canal social validada.');

// 6. Gerador demonstrativo
const mock30 = generateMockAnalyticsData('30d', 'all');
assert.strictEqual(mock30.dailySeries.length, 30);
assert.ok(mock30.kpis.totalReach > 0);
assert.ok(mock30.kpis.totalImpressions >= mock30.kpis.totalReach);
assert.ok(mock30.topPosts.length > 0);

console.log('✅ Gerador demonstrativo de analytics aprovado.');

console.log('✅ Todos os testes de Analytics passaram com 100% de sucesso!');
process.exit(0);
