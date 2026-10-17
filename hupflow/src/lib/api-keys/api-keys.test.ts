import assert from 'node:assert';
import {
  generateApiKeyToken,
  hashApiKey,
  hasScope,
  extractApiKeyFromHeaders,
} from './service';
import { ApiKeyScope } from './types';

console.log('[TEST] Iniciando testes do subsistema de Chaves de API Públicas (Public API Keys)...');

// Teste 1: Geração de token com formato canônico
const key1 = generateApiKeyToken();
const key2 = generateApiKeyToken();

assert(key1.token.startsWith('hup_live_'), 'O token deve iniciar com o prefixo canônico hup_live_');
assert(key1.token.length >= 50, `Comprimento do token deve ser >= 50 caracteres (obtido: ${key1.token.length})`);
assert(key1.token !== key2.token, 'Tokens gerados subsequentemente devem ser únicos');
assert(key1.keyPrefix.startsWith('hup_live_'), 'O prefixo público para exibição deve começar com hup_live_');
assert(key1.keyPrefix.endsWith('...'), 'O prefixo público deve terminar com reticências para indicar mascaramento');
console.log('✅ Geração de tokens de API criptograficamente seguros validada.');

// Teste 2: Hashing determinístico SHA-256
const hash1 = hashApiKey(key1.token);
const hash1Repeat = hashApiKey(key1.token);
const hash2 = hashApiKey(key2.token);

assert.strictEqual(hash1.length, 64, 'Hash SHA-256 deve ter exatamente 64 caracteres hexadecimais');
assert.strictEqual(hash1, hash1Repeat, 'O hash de um mesmo token deve ser estritamente determinístico');
assert.notStrictEqual(hash1, hash2, 'Hashes de tokens distintos não podem colidir');
console.log('✅ Hashing SHA-256 determinístico e proteção unidirecional validados.');

// Teste 3: Validação granular de escopos
const readOnlyScopes: ApiKeyScope[] = ['posts:read', 'analytics:read'];
assert.strictEqual(hasScope(readOnlyScopes, 'posts:read'), true, 'Escopo posts:read deve ser autorizado');
assert.strictEqual(hasScope(readOnlyScopes, 'analytics:read'), true, 'Escopo analytics:read deve ser autorizado');
assert.strictEqual(hasScope(readOnlyScopes, 'posts:write'), false, 'Escopo posts:write não concedido deve ser rejeitado');
assert.strictEqual(hasScope(readOnlyScopes, 'webhooks:manage'), false, 'Escopo webhooks:manage não concedido deve ser rejeitado');

const wildcardScopes: ApiKeyScope[] = ['*'];
assert.strictEqual(hasScope(wildcardScopes, 'posts:write'), true, 'Escopo wildcard * deve autorizar posts:write');
assert.strictEqual(hasScope(wildcardScopes, 'media:upload'), true, 'Escopo wildcard * deve autorizar media:upload');
assert.strictEqual(hasScope(wildcardScopes, 'webhooks:manage'), true, 'Escopo wildcard * deve autorizar webhooks:manage');
console.log('✅ Validação granular de escopos e herança do wildcard (*) validadas.');

// Teste 4: Extração de token via Authorization: Bearer <key>
const mockReqHeaders1 = new Headers({
  'authorization': `Bearer ${key1.token}`,
});
const extractedAuth = extractApiKeyFromHeaders(mockReqHeaders1);
assert.strictEqual(extractedAuth, key1.token, 'Deve extrair token corretamente de Authorization: Bearer');

// Teste 5: Extração de token via X-API-Key: <key>
const mockReqHeaders2 = new Headers({
  'x-api-key': key2.token,
});
const extractedCustom = extractApiKeyFromHeaders(mockReqHeaders2);
assert.strictEqual(extractedCustom, key2.token, 'Deve extrair token corretamente de X-API-Key');

// Teste 6: Extração de headers de dicionário simples
const plainHeaders = {
  'X-API-Key': key1.token,
};
const extractedPlain = extractApiKeyFromHeaders(plainHeaders);
assert.strictEqual(extractedPlain, key1.token, 'Deve extrair token de objeto de dicionário case-insensitive');

// Teste 7: Rejeição de formatos espúrios ou ausentes
const invalidHeaders = new Headers({
  'authorization': 'Bearer some_invalid_jwt_format',
});
assert.strictEqual(extractApiKeyFromHeaders(invalidHeaders), null, 'Tokens sem o prefixo hup_live_ devem ser ignorados');

const emptyHeaders = new Headers({});
assert.strictEqual(extractApiKeyFromHeaders(emptyHeaders), null, 'Headers vazios devem retornar null');
console.log('✅ Extração e higienização de cabeçalhos de autenticação aprovadas.');

console.log('✅ Todos os testes unitários de Chaves de API Públicas passaram com 100% de sucesso!');
process.exit(0);
