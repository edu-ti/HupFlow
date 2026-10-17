import assert from 'node:assert';
import { diagnosePublishingError } from './service';

console.log('[TEST] Iniciando testes do subsistema Dead-Letter Queue (DLQ) & Diagnóstico de Falhas...');

// Teste 1: Diagnóstico de Erros de Autenticação / Token Expirado (Meta / LinkedIn)
const metaAuthError = 'Error validating access token: Session has expired on Monday, 12-Oct-26 14:00:00 PDT.';
const diagAuth1 = diagnosePublishingError(metaAuthError, 'instagram');
assert.strictEqual(diagAuth1.category, 'AUTH_EXPIRED', 'Erro de sessão expirada deve ser classificado como AUTH_EXPIRED');
assert.strictEqual(diagAuth1.canRetry, false, 'AUTH_EXPIRED requer reconexão prévia e não permite retry cego');
assert(diagAuth1.recommendedAction.includes('Reconectar'), 'Ação recomendada deve orientar a reconexão');

const linkedinAuthError = 'EXPIRED_ACCESS_TOKEN: The provided access token has expired.';
const diagAuth2 = diagnosePublishingError(linkedinAuthError, 'linkedin');
assert.strictEqual(diagAuth2.category, 'AUTH_EXPIRED');
console.log('✅ Diagnóstico de expiração de credenciais OAuth validado.');

// Teste 2: Diagnóstico de Mídia Incompatível ou Aspecto Fora dos Limites (Instagram)
const mediaAspectError = 'The aspect ratio is not supported. Please crop the media to a valid ratio.';
const diagMedia = diagnosePublishingError(mediaAspectError, 'instagram');
assert.strictEqual(diagMedia.category, 'MEDIA_INVALID');
assert.strictEqual(diagMedia.canRetry, true);
assert(diagMedia.recommendedAction.includes('1:1'), 'Ação recomendada deve mencionar proporções aceitas');
console.log('✅ Diagnóstico de incompatibilidade de mídia e aspect ratio validado.');

// Teste 3: Diagnóstico de Rate Limit / Too Many Requests (X / Twitter)
const twitterRateError = 'Client Error: 429 Too Many Requests. Rate limit reached for /2/tweets.';
const diagRate = diagnosePublishingError(twitterRateError, 'x');
assert.strictEqual(diagRate.category, 'RATE_LIMITED');
assert.strictEqual(diagRate.canRetry, true);
assert(diagRate.recommendedAction.includes('15 a 30 minutos'), 'Ação recomendada deve sugerir aguardar');
console.log('✅ Diagnóstico de Rate Limits das APIs sociais validado.');

// Teste 4: Diagnóstico de Conteúdo Rejeitado (Texto muito longo)
const textTooLongError = 'Validation failed: character limit exceeded for status update.';
const diagContent = diagnosePublishingError(textTooLongError, 'threads');
assert.strictEqual(diagContent.category, 'CONTENT_REJECTED');
assert.strictEqual(diagContent.canRetry, true);
console.log('✅ Diagnóstico de restrições de texto e conteúdo validado.');

// Teste 5: Diagnóstico de Falha Transitória de Rede / Gateway 504
const gatewayTimeoutError = 'Bad Gateway: 504 Gateway Timeout while contacting remote server.';
const diagNetwork = diagnosePublishingError(gatewayTimeoutError, 'linkedin');
assert.strictEqual(diagNetwork.category, 'NETWORK_TIMEOUT');
assert.strictEqual(diagNetwork.canRetry, true);
assert(diagNetwork.recommendedAction.includes('seguro para reprocessamento'), 'Timeout deve orientar reprocessamento seguro');
console.log('✅ Diagnóstico de falhas transitórias de rede validado.');

// Teste 6: Fallback para erro genérico desconhecido
const obscureError = 'Internal server condition 0xDEADBEEF.';
const diagUnknown = diagnosePublishingError(obscureError, 'instagram');
assert.strictEqual(diagUnknown.category, 'UNKNOWN');
assert.strictEqual(diagUnknown.canRetry, true);
console.log('✅ Fallback resiliente para erros desconhecidos validado.');

console.log('✅ Todos os testes da Dead-Letter Queue (DLQ) passaram com 100% de sucesso!');
process.exit(0);
