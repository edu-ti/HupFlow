import assert from 'node:assert';
import { BioLink, BioProfile, BioThemePreset } from './types';
import {
  sanitizeHandle,
  isValidHandle,
  calculateBioCtr,
  sortBioLinks,
  getThemeConfig,
} from './bio-utils';

export {
  sanitizeHandle,
  isValidHandle,
  calculateBioCtr,
  sortBioLinks,
  getThemeConfig,
};

// Bateria de Testes
async function runTests() {
  console.log('[TEST] Iniciando bateria de testes do Smart Link-in-Bio...');

  // 1. Sanitização e validação de Handle
  assert.strictEqual(sanitizeHandle('Eduardo TI 2026!'), 'eduardo-ti-2026');
  assert.strictEqual(sanitizeHandle('  @Minha_Marca__Oficial$$  '), 'minha_marca__oficial');
  assert.strictEqual(isValidHandle('hupflow'), true);
  assert.strictEqual(isValidHandle('hup-flow_2026'), true);
  assert.strictEqual(isValidHandle('ab'), false, 'Handle com menos de 3 chars deve ser inválido');
  assert.strictEqual(isValidHandle('-invalido'), false, 'Não deve começar com hífen');
  console.log('✅ Sanitização e validação de handle aprovadas.');

  // 2. Cálculo de CTR
  assert.strictEqual(calculateBioCtr(0, 0), 0);
  assert.strictEqual(calculateBioCtr(1000, 250), 25.0);
  assert.strictEqual(calculateBioCtr(3, 1), 33.33);
  console.log('✅ Cálculo de CTR e proteção contra divisão por zero aprovados.');

  // 3. Ordenação determinística de links
  const sampleLinks: BioLink[] = [
    {
      id: 'l3',
      profileId: 'p1',
      title: 'Z Link 3',
      url: 'https://3.com',
      isFeatured: false,
      isActive: true,
      sortOrder: 2,
      clickCount: 10,
      createdAt: 100,
      updatedAt: 100,
    },
    {
      id: 'l1',
      profileId: 'p1',
      title: 'B Link 1',
      url: 'https://1.com',
      isFeatured: false,
      isActive: true,
      sortOrder: 0,
      clickCount: 50,
      createdAt: 100,
      updatedAt: 100,
    },
    {
      id: 'l2',
      profileId: 'p1',
      title: 'A Link 2',
      url: 'https://2.com',
      isFeatured: true,
      isActive: true,
      sortOrder: 1,
      clickCount: 30,
      createdAt: 100,
      updatedAt: 100,
    },
  ];

  const sorted = sortBioLinks(sampleLinks);
  assert.strictEqual(sorted[0].id, 'l1');
  assert.strictEqual(sorted[1].id, 'l2');
  assert.strictEqual(sorted[2].id, 'l3');
  console.log('✅ Ordenação determinística de botões aprovada.');

  // 4. Resolução de Temas
  const midnight = getThemeConfig('midnight');
  assert.ok(midnight.bg.includes('zinc-950'));
  assert.ok(midnight.accent.includes('violet-400'));

  const sunset = getThemeConfig('sunset_gradient');
  assert.ok(sunset.bg.includes('from-amber-500'));

  console.log('✅ Resolução de paletas de temas aprovada.');
  console.log('🎉 Todos os testes unitários do Smart Link-in-Bio passaram com 100% de sucesso!');
}

runTests().catch((err) => {
  console.error('❌ Falha nos testes de Bio:', err);
  process.exit(1);
});
