import assert from 'assert';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generatePkcePair,
  splitIntoTweetThread,
} from './pkce';
import { linkedInConnector } from './linkedin';
import { xTwitterConnector } from './x-twitter';

async function runTests() {
  console.log('[TEST] Iniciando testes dos conectores LinkedIn e X/Twitter...');

  // 1. Testes de PKCE (RFC 7636)
  const pair = generatePkcePair();
  assert(pair.codeVerifier.length >= 43, 'codeVerifier deve ter no mínimo 43 caracteres');
  assert(!pair.codeVerifier.includes('+'), 'codeVerifier não pode conter +');
  assert(!pair.codeVerifier.includes('/'), 'codeVerifier não pode conter /');
  assert(!pair.codeVerifier.includes('='), 'codeVerifier não pode conter =');

  const knownVerifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
  const challenge = generateCodeChallenge(knownVerifier);
  assert(typeof challenge === 'string' && challenge.length > 0, 'codeChallenge deve ser string não vazia');
  assert(!challenge.includes('+') && !challenge.includes('=') && !challenge.includes('/'), 'Challenge deve ser Base64URL pura');
  console.log('✅ Utilitário PKCE RFC 7636 validado com sucesso.');

  // 2. Testes de Particionamento de Threads do X
  const shortTweet = 'Um tweet curto e direto de 35 caracteres.';
  const shortRes = splitIntoTweetThread(shortTweet);
  assert.strictEqual(shortRes.length, 1);
  assert.strictEqual(shortRes[0], shortTweet);

  const longText = `Primeiro parágrafo de introdução sobre a arquitetura Clean-Room do HupFlow e como eliminamos dependências AGPL.

Segundo parágrafo detalhando o motor de canvas 2D em Fabric.js, suporte nativo a PDF carrosséis para LinkedIn e integração com Meta Graph API.

Terceiro parágrafo apresentando a suíte de faturamento automatizado com Stripe Checkout, verificação de HMAC de webhooks e gestão transparente de cotas de membros e contas sociais.

Quarto parágrafo concluindo com os benefícios de manter 100% de conformidade com licenças MIT/Apache e código estritamente tipado em TypeScript.`;

  const threadRes = splitIntoTweetThread(longText, 200);
  assert(threadRes.length > 1, 'Texto longo deve gerar múltiplos tweets');
  for (const t of threadRes) {
    assert(t.length <= 200, `Tweet individual não pode exceder o limite: ${t.length}`);
    assert(/\(\d+\/\d+\)$/.test(t), 'Tweet deve conter sufixo indicador (ex: (1/4))');
  }
  console.log(`✅ Particionamento de Threads aprovado: ${threadRes.length} tweets gerados.`);

  // 3. Teste do Conector LinkedIn (Auth URL & Publicação de Documento PDF)
  const liAuthUrl = await linkedInConnector.getAuthUrl('state_test_123', 'http://localhost:3000/callback');
  assert(liAuthUrl.includes('linkedin.com/oauth/v2/authorization'), 'URL de auth LinkedIn incorreta');
  assert(liAuthUrl.includes('w_member_social'), 'Scope w_member_social ausente');

  const liPublishRes = await linkedInConnector.publish('li_mock_token_dev', {
    content: 'Carrossel PDF exclusivo no LinkedIn',
    mediaUrls: [],
    documentUrl: 'https://storage.hupflow.com/carousels/pdf_123.pdf',
    documentTitle: 'Guia Clean-Room HupFlow',
  });
  assert.strictEqual(liPublishRes.success, true);
  assert(liPublishRes.externalPostId?.startsWith('urn:li:share:'), 'externalPostId do LinkedIn inválido');
  console.log('✅ Conector LinkedIn validado (Auth URL e Publicação de Documentos PDF).');

  // 4. Teste do Conector X/Twitter (Auth URL PKCE & Publicação de Threads)
  const xAuthUrl = await xTwitterConnector.getAuthUrl('state_x_123', 'http://localhost:3000/x-callback');
  assert(xAuthUrl.includes('twitter.com/i/oauth2/authorize'), 'URL de auth X incorreta');
  assert(xAuthUrl.includes('code_challenge='), 'Parâmetro code_challenge ausente no X');

  const xPublishRes = await xTwitterConnector.publish('x_mock_token_dev', {
    content: longText,
    mediaUrls: [],
    isThread: true,
  });
  assert.strictEqual(xPublishRes.success, true);
  assert(xPublishRes.externalPostId?.startsWith('x_tweet_'), 'externalPostId do X inválido');
  assert(Array.isArray(xPublishRes.threadPostIds) && xPublishRes.threadPostIds.length > 1, 'threadPostIds deve conter múltiplos tweets');
  console.log('✅ Conector X/Twitter validado (Auth PKCE e Publicação de Threads).');

  console.log('✅ Todos os testes de Conectores Sociais passaram com 100% de sucesso!');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Falha nos testes de conectores:', err);
  process.exit(1);
});
