import assert from 'assert';
import {
  isValidHexColor,
  validateBrandColors,
  brandColorsToCanvasPalette,
  createDefaultBrandKit,
} from './service';
import { BRAND_PRESETS } from './presets';

async function runTests() {
  console.log('[TEST] Iniciando testes do subsistema de Brand Kits & Presets...');

  // 1. Validação de códigos hexadecimais
  assert.strictEqual(isValidHexColor('#6366F1'), true);
  assert.strictEqual(isValidHexColor('#000000'), true);
  assert.strictEqual(isValidHexColor('#fff'), true);
  assert.strictEqual(isValidHexColor('#ABC'), true);
  assert.strictEqual(isValidHexColor('#1234567'), false);
  assert.strictEqual(isValidHexColor('blue'), false);
  assert.strictEqual(isValidHexColor('rgb(255, 0, 0)'), false);
  assert.strictEqual(isValidHexColor(''), false);
  console.log('✅ Validação de cores hexadecimais aprovada.');

  // 2. Validação da paleta corporativa completa
  const validPalette = {
    primary: '#6366F1',
    secondary: '#4F46E5',
    accent: '#06B6D4',
    background: '#0B0F17',
    text: '#F8FAFC',
  };
  const resValid = validateBrandColors(validPalette);
  assert.strictEqual(resValid.valid, true);

  const missingKey = {
    primary: '#6366F1',
    secondary: '#4F46E5',
    accent: '#06B6D4',
    background: '#0B0F17',
  };
  const resMissing = validateBrandColors(missingKey);
  assert.strictEqual(resMissing.valid, false);
  assert(resMissing.error?.includes('text'));

  const invalidHex = {
    ...validPalette,
    accent: 'invalido',
  };
  const resInvalid = validateBrandColors(invalidHex);
  assert.strictEqual(resInvalid.valid, false);
  assert(resInvalid.error?.includes('invalido'));
  console.log('✅ Validação de integridade de paleta corporativa aprovada.');

  // 3. Conversor de cores para Canvas 2D
  const canvasPalette = brandColorsToCanvasPalette(validPalette);
  assert.strictEqual(canvasPalette.background, '#0B0F17');
  assert.strictEqual(canvasPalette.primaryText, '#F8FAFC');
  assert.strictEqual(canvasPalette.accentColor, '#6366F1');
  console.log('✅ Conversor de BrandColors para ColorPalette do Canvas validado.');

  // 4. Presets canônicos de fábrica
  assert.strictEqual(BRAND_PRESETS.length, 5, 'Devem existir 5 presets de fábrica');
  for (const p of BRAND_PRESETS) {
    const val = validateBrandColors(p.colors);
    assert.strictEqual(val.valid, true, `Preset ${p.name} deve ter cores válidas`);
    assert(p.typography.fontFamilyHeading.length > 0, `Preset ${p.name} deve ter fonte de título`);
  }
  console.log('✅ Todos os 5 presets canônicos de fábrica validados com sucesso.');

  // 5. Instanciação de Kit padrão
  const defaultKit = createDefaultBrandKit('org_123');
  assert.strictEqual(defaultKit.organizationId, 'org_123');
  assert.strictEqual(defaultKit.isDefault, true);
  assert.strictEqual(defaultKit.handle, '@hupflow');
  console.log('✅ Instanciação de Kit de Marca padrão aprovada.');

  console.log('✅ Todos os testes de Brand Kits passaram com 100% de sucesso!');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Falha nos testes de Brand Kits:', err);
  process.exit(1);
});
