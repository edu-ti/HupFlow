import { getDimensionsForAspectRatio, calculateTextLines } from './canvas-utils';

function runTests() {
  console.log('[TEST] Iniciando testes de canvas-utils...');

  // Teste 1: Proporções
  const square = getDimensionsForAspectRatio('1:1');
  if (square.width !== 1080 || square.height !== 1080) {
    throw new Error('Falha no teste 1:1 Quadrado');
  }

  const portrait = getDimensionsForAspectRatio('4:5');
  if (portrait.width !== 1080 || portrait.height !== 1350) {
    throw new Error('Falha no teste 4:5 Retrato');
  }

  const stories = getDimensionsForAspectRatio('9:16');
  if (stories.width !== 1080 || stories.height !== 1920) {
    throw new Error('Falha no teste 9:16 Stories');
  }

  // Teste 2: Quebra de Linhas
  // Simula cada caractere tendo 10px de largura
  const mockMeasureWidth = (t: string) => t.length * 10;
  const sampleText = 'Como escalar um produto SaaS sem funding externo';
  const lines = calculateTextLines(sampleText, 250, mockMeasureWidth);

  if (lines.length < 2) {
    throw new Error(`Falha no teste de quebra de linhas: esperava pelo menos 2 linhas, obteve ${lines.length}`);
  }

  console.log('✅ Todos os testes de canvas-utils passaram com sucesso!');
}

runTests();
