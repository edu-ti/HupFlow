import assert from 'node:assert';
import {
  generateWebhookSecret,
  signWebhookPayload,
  verifyWebhookSignature,
  isValidWebhookUrl,
} from './signer';

console.log('[TEST] Iniciando testes do subsistema de Webhooks Corporativos & Assinatura HMAC...');

// Teste 1: Geração de segredo único
const secret1 = generateWebhookSecret();
const secret2 = generateWebhookSecret();
assert(secret1.startsWith('whsec_'), 'Secret deve iniciar com prefixo whsec_');
assert(secret1.length >= 48, 'Secret deve ter comprimento seguro de pelo menos 48 caracteres');
assert(secret1 !== secret2, 'Segredos gerados subsequentemente devem ser únicos');
console.log('✅ Geração de segredos HMAC aleatórios validada.');

// Teste 2: Cálculo de assinatura HMAC-SHA256
const now = Math.floor(Date.now() / 1000);
const payload = JSON.stringify({
  id: 'evt_test_123',
  event: 'post.published',
  createdAt: new Date().toISOString(),
  organizationId: 'org_alpha',
  data: { postId: 'post_999', channel: 'linkedin' },
});

const signature = signWebhookPayload(secret1, now, payload);
assert(signature.startsWith('sha256='), 'Assinatura deve iniciar com prefixo sha256=');
assert(signature.length === 71, 'sha256= (7) + 64 hex chars = 71');
console.log('✅ Formatação e cálculo da assinatura HMAC-SHA256 validados.');

// Teste 3: Verificação de assinatura com sucesso
const isValid = verifyWebhookSignature(secret1, signature, now, payload);
assert.strictEqual(isValid, true, 'Assinatura válida deve ser confirmada com sucesso');
console.log('✅ Verificação timing-safe de assinatura confirmada.');

// Teste 4: Rejeição de adulteração de payload (Tampering)
const tamperedPayload = JSON.stringify({
  id: 'evt_test_123',
  event: 'post.published',
  createdAt: new Date().toISOString(),
  organizationId: 'org_alpha',
  data: { postId: 'post_999', channel: 'instagram' }, // alterado
});
const isValidTampered = verifyWebhookSignature(secret1, signature, now, tamperedPayload);
assert.strictEqual(isValidTampered, false, 'Payload adulterado deve ser rejeitado');
console.log('✅ Proteção contra adulteração de payload aprovada.');

// Teste 5: Rejeição com secret incorreto
const isValidWrongSecret = verifyWebhookSignature(secret2, signature, now, payload);
assert.strictEqual(isValidWrongSecret, false, 'Assinatura com secret incorreto deve ser rejeitada');
console.log('✅ Rejeição de segredos divergentes validada.');

// Teste 6: Rejeição por tolerância de tempo (Replay Attack)
const expiredTimestamp = now - 600; // 10 minutos atrás
const expiredSignature = signWebhookPayload(secret1, expiredTimestamp, payload);
const isValidExpired = verifyWebhookSignature(secret1, expiredSignature, expiredTimestamp, payload, 300);
assert.strictEqual(isValidExpired, false, 'Timestamp fora da janela de tolerância deve ser rejeitado');
console.log('✅ Proteção contra Replay Attacks aprovada.');

// Teste 7: Validação de URLs de endpoints
assert.strictEqual(isValidWebhookUrl('https://n8n.workflow.company/webhook/social'), true);
assert.strictEqual(isValidWebhookUrl('http://localhost:5678/webhook/test'), true);
assert.strictEqual(isValidWebhookUrl('ftp://ftp.invalid.com'), false);
assert.strictEqual(isValidWebhookUrl('not-a-valid-url'), false);
assert.strictEqual(isValidWebhookUrl('javascript:alert(1)'), false);
console.log('✅ Validação de URLs de webhook aprovada.');

console.log('✅ Todos os testes do subsistema de Webhooks passaram com 100% de sucesso!');
process.exit(0);
