import { htmlToPlainText, checkCharLimit } from './text-utils';

function testComposerUtils() {
  console.log('[TEST] Iniciando testes de text-utils...');

  // Teste 1: Conversão HTML para Texto Limpo
  const htmlInput = '<p>Olá mundo!</p><p>Este é um <strong>post</strong> formatado.</p>';
  const plainText = htmlToPlainText(htmlInput);

  if (plainText.includes('<p>') || plainText.includes('<strong>')) {
    throw new Error('Falha ao remover tags HTML');
  }

  if (!plainText.includes('Olá mundo!') || !plainText.includes('post')) {
    throw new Error('Falha ao preservar conteúdo de texto');
  }

  // Teste 2: Limite de Caracteres para X/Twitter
  const tweetText = 'A'.repeat(281);
  const checkX = checkCharLimit(tweetText, 'x');
  if (!checkX.isOver || checkX.remaining !== -1) {
    throw new Error('Falha na validação de limite do X/Twitter');
  }

  // Teste 3: Limite de Caracteres para LinkedIn
  const checkLi = checkCharLimit('Texto curto', 'linkedin');
  if (checkLi.isOver || checkLi.remaining <= 0) {
    throw new Error('Falha na validação de limite do LinkedIn');
  }

  console.log('✅ Todos os testes de text-utils passaram com 100% de sucesso!');
}

testComposerUtils();
