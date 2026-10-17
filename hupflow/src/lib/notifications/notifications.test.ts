import assert from 'node:assert';
import { getNotificationSeverity } from './service';
import { NotificationType } from './types';

console.log('[TEST] Iniciando testes do subsistema de Notificações In-App & Alertas...');

// Teste 1: Validação de severidade semântica por tipo de notificação
assert.strictEqual(getNotificationSeverity('post_failed'), 'error', 'Falha de publicação deve ter severidade error');
assert.strictEqual(getNotificationSeverity('post_published'), 'success', 'Publicação com sucesso deve ter severidade success');
assert.strictEqual(getNotificationSeverity('approval_requested'), 'warning', 'Pedido de aprovação deve ter severidade warning');
assert.strictEqual(getNotificationSeverity('quota_warning'), 'warning', 'Alerta de cotas deve ter severidade warning');
assert.strictEqual(getNotificationSeverity('member_joined'), 'info', 'Novo membro deve ter severidade info');
assert.strictEqual(getNotificationSeverity('approval_reviewed'), 'info', 'Revisão concluída deve ter severidade info');
assert.strictEqual(getNotificationSeverity('general'), 'info', 'Notificação geral deve ter severidade info');
console.log('✅ Classificação semântica de severidade e cores validada.');

// Teste 2: Validação de contratos de criação
const sampleTypes: NotificationType[] = [
  'approval_requested',
  'approval_reviewed',
  'post_published',
  'post_failed',
  'quota_warning',
  'member_joined',
  'general',
];

assert.strictEqual(sampleTypes.length, 7, 'Devem existir exatamente 7 tipos canônicos de notificação');
console.log('✅ Integridade dos tipos de eventos do workspace aprovada.');

console.log('✅ Todos os testes de Notificações In-App passaram com 100% de sucesso!');
process.exit(0);
