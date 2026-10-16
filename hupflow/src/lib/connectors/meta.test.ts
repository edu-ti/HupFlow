import { InstagramConnector } from './instagram';
import { ThreadsConnector } from './threads';

async function testMetaConnectors() {
  console.log('[TEST] Iniciando testes dos conectores Meta (Instagram & Threads)...');

  // Teste 1: Instagram Connector
  const ig = new InstagramConnector();
  if (ig.provider !== 'instagram') {
    throw new Error('Falha no provider do Instagram');
  }

  const igAuthUrl = await ig.getAuthUrl('state123', 'http://localhost:3000/callback');
  if (!igAuthUrl.includes('instagram.com') && !igAuthUrl.includes('facebook.com')) {
    throw new Error('Falha na URL de autorização do Instagram');
  }

  const igTokens = await ig.exchangeCode('mock_code', 'http://localhost:3000/callback');
  if (!igTokens.accessToken || !igTokens.accountId) {
    throw new Error('Falha no exchangeCode do Instagram');
  }

  const igPublishResult = await ig.publish(igTokens.accessToken, {
    content: 'Teste de post Instagram via HupFlow Studio',
    mediaUrls: ['https://example.com/slide1.png'],
  });
  if (!igPublishResult.success) {
    throw new Error(`Falha no publish do Instagram: ${igPublishResult.error}`);
  }

  // Teste 2: Threads Connector
  const th = new ThreadsConnector();
  if (th.provider !== 'threads') {
    throw new Error('Falha no provider do Threads');
  }

  const thAuthUrl = await th.getAuthUrl('state456', 'http://localhost:3000/callback');
  if (!thAuthUrl.includes('threads.net')) {
    throw new Error('Falha na URL de autorização do Threads');
  }

  const thTokens = await th.exchangeCode('mock_code', 'http://localhost:3000/callback');
  if (!thTokens.accessToken) {
    throw new Error('Falha no exchangeCode do Threads');
  }

  const thPublishResult = await th.publish(thTokens.accessToken, {
    content: 'Texto curto publicado no Threads via HupFlow!',
    mediaUrls: [],
  });
  if (!thPublishResult.success) {
    throw new Error(`Falha no publish do Threads: ${thPublishResult.error}`);
  }

  console.log('✅ Todos os testes dos conectores Meta passaram com 100% de sucesso!');
}

testMetaConnectors().catch((err) => {
  console.error('❌ Falha nos testes Meta:', err);
  process.exit(1);
});
