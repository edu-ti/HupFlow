import assert from 'node:assert';
import {
  InboxChannel,
  InboxIntent,
  InboxPriority,
  InboxSentiment,
  InboxStats,
  SmartReplySuggestion,
  SocialInboxMessage,
} from './types';
import {
  classifyInboxMessage,
  interpolateReplyTemplate,
  generateSmartReplies,
  calculateInboxStats,
} from './inbox-utils';

export {
  classifyInboxMessage,
  interpolateReplyTemplate,
  generateSmartReplies,
  calculateInboxStats,
};

// Bateria de Testes Unitários
async function runTests() {
  console.log(
    '[TEST] Iniciando bateria de testes do Unified Social Inbox & AI Smart Replies...'
  );

  // 1. Classificação Semântica de Intenção e Prioridade
  const leadMsg = classifyInboxMessage(
    'Parabéns pelo post! Qual o valor do plano para agência com 10 clientes?'
  );
  assert.strictEqual(leadMsg.intent, 'lead_intent');
  assert.strictEqual(leadMsg.priority, 'high');
  assert.strictEqual(leadMsg.sentiment, 'positive');

  const supMsg = classifyInboxMessage(
    'Estou com um erro ao conectar minha conta, não funciona o botão.'
  );
  assert.strictEqual(supMsg.intent, 'support');
  assert.strictEqual(supMsg.priority, 'high');
  assert.strictEqual(supMsg.sentiment, 'negative');

  const praiseMsg = classifyInboxMessage(
    'Conteúdo sensacional! Muito bom mesmo, amei o design.'
  );
  assert.strictEqual(praiseMsg.intent, 'praise');
  assert.strictEqual(praiseMsg.sentiment, 'positive');

  const spamMsg = classifyInboxMessage(
    'Ganhe dinheiro fácil com cripto grátis agora!'
  );
  assert.strictEqual(spamMsg.intent, 'spam');
  assert.strictEqual(spamMsg.priority, 'low');
  console.log('✅ Classificador semântico de intenção, sentimento e prioridade aprovado.');

  // 2. Interpolação de Templates Salvos
  const interpolated = interpolateReplyTemplate(
    'Olá {{author_name}}, bem-vindo à {{brand_name}} no {{channel}}!',
    { authorName: 'Eduardo Silva', brandName: 'HupFlow', channel: 'LinkedIn' }
  );
  assert.strictEqual(
    interpolated,
    'Olá Eduardo, bem-vindo à HupFlow no LinkedIn!'
  );
  console.log('✅ Interpolação de variáveis dinâmicas em templates aprovada.');

  // 3. Geração de Smart Replies com Limite de Caracteres por Rede
  const suggestions = generateSmartReplies(
    {
      authorName: 'Camila Rocha',
      channel: 'x',
      intent: 'lead_intent',
      content: 'Quero contratar o plano Pro!',
    },
    'HupFlow'
  );
  assert.strictEqual(suggestions.length, 3);
  assert.ok(suggestions[0].text.includes('Camila'));
  assert.ok(
    suggestions.every((s) => s.text.length <= 280),
    'Todas as respostas para X devem respeitar 280 caracteres'
  );
  console.log('✅ Gerador de Smart Replies IA e proteção de limite X (280c) aprovados.');

  // 4. Estatísticas de Inbox Zero
  const stats = calculateInboxStats([
    {
      id: 'm1',
      organizationId: 'org1',
      channel: 'linkedin',
      interactionType: 'comment',
      authorName: 'A',
      authorHandle: '@a',
      content: 'Preço?',
      intent: 'lead_intent',
      sentiment: 'neutral',
      priority: 'high',
      status: 'replied',
      receivedAt: 100,
      createdAt: 100,
    },
    {
      id: 'm2',
      organizationId: 'org1',
      channel: 'instagram',
      interactionType: 'comment',
      authorName: 'B',
      authorHandle: '@b',
      content: 'Dúvida?',
      intent: 'question',
      sentiment: 'neutral',
      priority: 'normal',
      status: 'unread',
      receivedAt: 200,
      createdAt: 200,
    },
  ]);
  assert.strictEqual(stats.totalMessages, 2);
  assert.strictEqual(stats.unreadCount, 1);
  assert.strictEqual(stats.leadIntentCount, 1);
  assert.strictEqual(stats.responseRate, 50.0);
  console.log('✅ Cálculo de métricas e Response Rate aprovado.');

  console.log(
    '🎉 Todos os testes unitários do Unified Social Inbox passaram com 100% de sucesso!'
  );
}

if (require.main === module) {
  runTests().catch((err) => {
    console.error('❌ Falha nos testes do Social Inbox:', err);
    process.exit(1);
  });
}
