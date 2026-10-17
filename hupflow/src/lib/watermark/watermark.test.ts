import assert from 'node:assert';
import {
  calculateWatermarkCoordinates,
  validateWatermarkInputs,
  getDefaultWatermarkSettings,
} from './service';
import { WatermarkPosition } from './types';

console.log('[TEST] Iniciando bateria de testes do Subsistema de Marca d\'Água & Selos Corporativos...');

// ----------------------------------------------------------------------------
// Teste 1: Cálculo Geométrico de Coordenadas nos 5 Quadrantes
// ----------------------------------------------------------------------------
const mediaW = 1000;
const mediaH = 1000;
const scale = 20; // 20% -> width = 200, height = 100 (aspect 2:1)
const margin = 30;
const aspect = 2.0;

// 1.1 Bottom Right
const br = calculateWatermarkCoordinates(mediaW, mediaH, scale, 'bottom_right', margin, aspect);
assert.strictEqual(br.width, 200, 'Largura calculada deve ser 20% de 1000 = 200');
assert.strictEqual(br.height, 100, 'Altura com aspect 2:1 deve ser 100');
assert.strictEqual(br.x, 1000 - 200 - 30, 'Coordenada X em bottom_right deve respeitar a margem direita');
assert.strictEqual(br.y, 1000 - 100 - 30, 'Coordenada Y em bottom_right deve respeitar a margem inferior');

// 1.2 Top Left
const tl = calculateWatermarkCoordinates(mediaW, mediaH, scale, 'top_left', margin, aspect);
assert.strictEqual(tl.x, 30, 'Coordenada X em top_left deve ser a margem');
assert.strictEqual(tl.y, 30, 'Coordenada Y em top_left deve ser a margem');

// 1.3 Top Right
const tr = calculateWatermarkCoordinates(mediaW, mediaH, scale, 'top_right', margin, aspect);
assert.strictEqual(tr.x, 1000 - 200 - 30, 'Coordenada X em top_right deve respeitar a margem direita');
assert.strictEqual(tr.y, 30, 'Coordenada Y em top_right deve ser a margem superior');

// 1.4 Bottom Left
const bl = calculateWatermarkCoordinates(mediaW, mediaH, scale, 'bottom_left', margin, aspect);
assert.strictEqual(bl.x, 30, 'Coordenada X em bottom_left deve ser a margem esquerda');
assert.strictEqual(bl.y, 1000 - 100 - 30, 'Coordenada Y em bottom_left deve respeitar a margem inferior');

// 1.5 Center
const center = calculateWatermarkCoordinates(mediaW, mediaH, scale, 'center', margin, aspect);
assert.strictEqual(center.x, Math.round((1000 - 200) / 2), 'Coordenada X em center deve ser centralizada');
assert.strictEqual(center.y, Math.round((1000 - 100) / 2), 'Coordenada Y em center deve ser centralizada');
console.log('✅ Cálculo geométrico nos 5 quadrantes validado com exatidão.');

// ----------------------------------------------------------------------------
// Teste 2: Prevenção de Overflow e Clamping em Mídias Pequenas
// ----------------------------------------------------------------------------
const tinyW = 100;
const tinyH = 100;
const overflowCoords = calculateWatermarkCoordinates(tinyW, tinyH, 50, 'bottom_right', 80, 1.0);

assert.ok(overflowCoords.x >= 0, 'Coordenada X nunca pode ser negativa');
assert.ok(overflowCoords.y >= 0, 'Coordenada Y nunca pode ser negativa');
assert.ok(overflowCoords.x + overflowCoords.width <= tinyW, 'Selo não pode transbordar largura da mídia');
assert.ok(overflowCoords.y + overflowCoords.height <= tinyH, 'Selo não pode transbordar altura da mídia');
console.log('✅ Clamping anti-transbordo aprovado.');

// ----------------------------------------------------------------------------
// Teste 3: Validação de Parâmetros de Entrada
// ----------------------------------------------------------------------------
assert.strictEqual(validateWatermarkInputs({ opacity: 120 }).opacity, 100, 'Opacidade acima de 100 deve ser limitada a 100');
assert.strictEqual(validateWatermarkInputs({ opacity: 5 }).opacity, 10, 'Opacidade abaixo de 10 deve ser limitada a 10');
assert.strictEqual(validateWatermarkInputs({ scalePercent: 50 }).scalePercent, 35, 'Escala acima de 35% deve ser limitada a 35%');
assert.strictEqual(validateWatermarkInputs({ scalePercent: 1 }).scalePercent, 5, 'Escala abaixo de 5% deve ser limitada a 5%');
assert.strictEqual(validateWatermarkInputs({ marginPx: -10 }).marginPx, 0, 'Margem negativa deve ser ajustada para 0');
console.log('✅ Sanitização de limites operacionais aprovada.');

// ----------------------------------------------------------------------------
// Teste 4: Defaults do Workspace
// ----------------------------------------------------------------------------
const defaults = getDefaultWatermarkSettings('org_demo');
assert.strictEqual(defaults.organizationId, 'org_demo');
assert.strictEqual(defaults.position, 'bottom_right');
assert.strictEqual(defaults.opacity, 85);
assert.strictEqual(defaults.scalePercent, 15);
assert.strictEqual(defaults.autoApply, false);
console.log('✅ Configurações padrão do workspace validadas.');

console.log('🎉 Todos os testes de Marca d\'Água passaram com 100% de sucesso!');
process.exit(0);
