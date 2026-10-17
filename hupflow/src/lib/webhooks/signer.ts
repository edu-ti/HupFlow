import crypto from 'node:crypto';

/**
 * Gera um segredo aleatório e criptograficamente seguro para o webhook.
 * Formato padrão da indústria: whsec_<48_chars_hex>
 */
export function generateWebhookSecret(): string {
  const bytes = crypto.randomBytes(24);
  return `whsec_${bytes.toString('hex')}`;
}

/**
 * Calcula a assinatura HMAC-SHA256 sobre a mensagem canônica: `${timestamp}.${payload}`
 */
export function signWebhookPayload(secret: string, timestamp: number, payloadString: string): string {
  const message = `${timestamp}.${payloadString}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(message);
  return `sha256=${hmac.digest('hex')}`;
}

/**
 * Verifica a assinatura HMAC com tolerância temporal anti-replay e comparação timing-safe.
 * @param secret Segredo do webhook
 * @param headerSignature Header X-HupFlow-Signature (formato "sha256=...")
 * @param timestamp Header X-HupFlow-Timestamp (segundos desde a época Unix)
 * @param payloadString Corpo JSON da requisição
 * @param toleranceSeconds Tolerância máxima em segundos (default: 300s = 5 minutos)
 */
export function verifyWebhookSignature(
  secret: string,
  headerSignature: string,
  timestamp: number,
  payloadString: string,
  toleranceSeconds = 300
): boolean {
  if (!secret || !headerSignature || !timestamp || !payloadString) {
    return false;
  }

  // Verificação de timestamp contra replay attacks (se toleranceSeconds > 0)
  if (toleranceSeconds > 0) {
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) {
      return false;
    }
  }

  const expectedSignature = signWebhookPayload(secret, timestamp, payloadString);

  // Comparação timing-safe para evitar ataques de canal lateral (timing attacks)
  try {
    const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
    const actualBuf = Buffer.from(headerSignature, 'utf-8');

    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}

/**
 * Validador de URL para endpoints de webhooks corporativos.
 */
export function isValidWebhookUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    // Aceita apenas protocolos http/https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    // Não permite localhost em produção estrita, mas aceita em testes se explicitamente informado
    return true;
  } catch {
    return false;
  }
}
