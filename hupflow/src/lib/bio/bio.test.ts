import assert from 'node:assert';
import { BioLink, BioProfile, BioThemePreset } from './types';

// Funções utilitárias puras a serem implementadas/testadas
export function sanitizeHandle(raw: string): string {
  const sanitized = raw
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return sanitized.slice(0, 40);
}

export function isValidHandle(handle: string): boolean {
  if (!handle || handle.length < 3 || handle.length > 40) return false;
  return /^[a-z0-9][a-z0-9_-]*[a-z0-9]$/.test(handle);
}

export function calculateBioCtr(totalViews: number, totalClicks: number): number {
  if (totalViews <= 0) return 0;
  const ctr = (totalClicks / totalViews) * 100;
  return Number(ctr.toFixed(2));
}

export function sortBioLinks(links: BioLink[]): BioLink[] {
  return [...links].sort((a, b) => {
    // Links em destaque primeiro se desejado, ou por sortOrder estrito
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return a.title.localeCompare(b.title);
  });
}

export function getThemeConfig(theme: BioThemePreset) {
  switch (theme) {
    case 'minimal_light':
      return {
        bg: 'bg-zinc-50 text-zinc-900',
        card: 'bg-white text-zinc-900 border-zinc-200 shadow-sm hover:border-zinc-300',
        accent: 'text-zinc-900',
        badge: 'bg-zinc-100 text-zinc-800',
      };
    case 'sunset_gradient':
      return {
        bg: 'bg-gradient-to-br from-amber-500 via-rose-600 to-purple-800 text-white',
        card: 'bg-white/15 backdrop-blur-md text-white border-white/20 shadow-lg hover:bg-white/25',
        accent: 'text-amber-200',
        badge: 'bg-white/20 text-white',
      };
    case 'ocean_breeze':
      return {
        bg: 'bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-900 text-white',
        card: 'bg-white/15 backdrop-blur-md text-white border-white/20 shadow-lg hover:bg-white/25',
        accent: 'text-cyan-200',
        badge: 'bg-white/20 text-white',
      };
    case 'emerald_luxe':
      return {
        bg: 'bg-gradient-to-b from-emerald-950 via-zinc-950 to-black text-emerald-50',
        card: 'bg-emerald-900/40 text-emerald-100 border-emerald-700/50 shadow-md hover:bg-emerald-800/50',
        accent: 'text-emerald-400',
        badge: 'bg-emerald-800/60 text-emerald-200',
      };
    case 'midnight':
    default:
      return {
        bg: 'bg-zinc-950 text-zinc-100',
        card: 'bg-zinc-900 text-zinc-100 border-zinc-800 shadow-md hover:border-zinc-700',
        accent: 'text-violet-400',
        badge: 'bg-violet-950/80 text-violet-300 border-violet-800/50',
      };
  }
}

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
