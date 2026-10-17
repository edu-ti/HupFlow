import crypto from 'crypto';

/**
 * Utilitário RFC 7636 - Proof Key for Code Exchange (PKCE)
 * Usado obrigatoriamente pela API v2 do X (Twitter) e OAuth 2.0 moderno.
 */

export interface PkcePair {
  codeVerifier: string;
  codeChallenge: string;
}

/**
 * Converte Buffer para string Base64URL segura sem padding '='
 */
export function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Gera um code_verifier criptograficamente seguro (comprimento entre 43 e 128 chars).
 */
export function generateCodeVerifier(byteLength: number = 48): string {
  const randomBytes = crypto.randomBytes(byteLength);
  return base64UrlEncode(randomBytes);
}

/**
 * Gera o code_challenge a partir do code_verifier via SHA-256 (método 'S256').
 */
export function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return base64UrlEncode(hash);
}

/**
 * Gera o par completo de chaves PKCE
 */
export function generatePkcePair(): PkcePair {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge };
}

/**
 * Particiona um texto longo em nós sequenciais para Threads do X respeitando o limite de 280 caracteres.
 */
export function splitIntoTweetThread(fullText: string, maxLength: number = 280): string[] {
  const trimmed = fullText.trim();
  if (trimmed.length <= maxLength) {
    return [trimmed];
  }

  // Divide por quebras de parágrafo duplas ou simples
  const paragraphs = trimmed.split(/\n\n+/);
  const rawChunks: string[] = [];
  let currentChunk = '';

  for (const p of paragraphs) {
    if ((currentChunk + '\n\n' + p).trim().length <= maxLength - 8) {
      currentChunk = currentChunk ? `${currentChunk}\n\n${p}` : p;
    } else {
      if (currentChunk) rawChunks.push(currentChunk.trim());

      // Se o parágrafo individual exceder o limite, divide por frases ou palavras
      if (p.length > maxLength - 8) {
        const words = p.split(/\s+/);
        let wordChunk = '';
        for (const w of words) {
          if ((wordChunk + ' ' + w).trim().length <= maxLength - 8) {
            wordChunk = wordChunk ? `${wordChunk} ${w}` : w;
          } else {
            if (wordChunk) rawChunks.push(wordChunk.trim());
            wordChunk = w;
          }
        }
        if (wordChunk) currentChunk = wordChunk;
      } else {
        currentChunk = p;
      }
    }
  }

  if (currentChunk) {
    rawChunks.push(currentChunk.trim());
  }

  const total = rawChunks.length;
  if (total <= 1) return rawChunks;

  // Adiciona contadores (1/3), (2/3), etc.
  return rawChunks.map((chunk, index) => {
    const counter = ` (${index + 1}/${total})`;
    return `${chunk}${counter}`;
  });
}
