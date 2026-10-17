import crypto from 'crypto';
import { PresignedUploadResponse } from './types';
import { sanitizeFileName, validateMediaFile } from './validation';

export interface StorageConfig {
  accountId?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucketName: string;
  publicUrl: string;
}

export function getStorageConfig(): StorageConfig {
  return {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME || 'hupflow-media',
    publicUrl: process.env.R2_PUBLIC_URL || 'https://cdn.hupflow.com',
  };
}

/**
 * Gera a chave hierárquica e isolada do objeto no bucket
 * Padrão: orgs/{organizationId}/{ano}/{mes}/{uuid}_{sanitizedFilename}
 */
export function generateMediaFileKey(organizationId: string, filename: string): string {
  const sanitized = sanitizeFileName(filename);
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const uuid = crypto.randomUUID().substring(0, 12);

  return `orgs/${organizationId}/${year}/${month}/${uuid}_${sanitized}`;
}

/**
 * Cria assinatura AWS SigV4 para URL pré-assinada de upload (PUT) compatível com Cloudflare R2 / AWS S3
 */
function generateSigV4PresignedUrl(params: {
  endpoint: string;
  bucket: string;
  fileKey: string;
  mimeType: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  expiresInSeconds?: number;
}): string {
  const {
    endpoint,
    bucket,
    fileKey,
    mimeType,
    accessKeyId,
    secretAccessKey,
    region,
    expiresInSeconds = 900,
  } = params;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ''); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.substring(0, 8); // YYYYMMDD
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;

  const host = new URL(endpoint).host;
  const canonicalUri = `/${bucket}/${fileKey}`;

  // Query parameters ordenados lexicograficamente
  const queryParams: Record<string, string> = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${accessKeyId}/${credentialScope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(expiresInSeconds),
    'X-Amz-SignedHeaders': 'content-type;host',
  };

  const canonicalQueryString = Object.keys(queryParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
    .join('&');

  const canonicalHeaders = `content-type:${mimeType.toLowerCase()}\nhost:${host}\n`;
  const signedHeaders = 'content-type;host';

  const payloadHash = 'UNSIGNED-PAYLOAD';

  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n');

  // Cálculo das chaves HMAC derivadas
  const kDate = crypto.createHmac('sha256', `AWS4${secretAccessKey}`).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
  const kService = crypto.createHmac('sha256', kRegion).update('s3').digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  return `${endpoint}${canonicalUri}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
}

/**
 * Emite a Presigned Upload URL ou ativa o modo de fallback transparente em dev offline
 */
export async function createPresignedUploadUrl(params: {
  organizationId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}): Promise<PresignedUploadResponse> {
  const { organizationId, filename, mimeType, sizeBytes } = params;

  // 1. Validação estrita
  const validation = validateMediaFile(filename, mimeType, sizeBytes);
  if (!validation.valid) {
    throw new Error(validation.error || 'Arquivo de mídia inválido.');
  }

  const fileKey = generateMediaFileKey(organizationId, filename);
  const config = getStorageConfig();
  const expiresInSeconds = 900; // 15 minutos

  // 2. Se credenciais R2 reais estiverem configuradas
  if (config.accessKeyId && config.secretAccessKey && config.accountId) {
    const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;
    const uploadUrl = generateSigV4PresignedUrl({
      endpoint,
      bucket: config.bucketName,
      fileKey,
      mimeType,
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: 'auto',
      expiresInSeconds,
    });

    const publicUrl = `${config.publicUrl.replace(/\/$/, '')}/${fileKey}`;

    return {
      uploadUrl,
      fileKey,
      publicUrl,
      expiresInSeconds,
    };
  }

  // 3. Fallback Gracioso para Desenvolvimento Local / Offline
  // Gera uma URL simulada que o frontend reconhece e permite confirmar imediatamente
  const mockPublicUrl = `${config.publicUrl.replace(/\/$/, '')}/${fileKey}`;
  const mockUploadUrl = `/api/media/mock-upload?key=${encodeURIComponent(fileKey)}`;

  return {
    uploadUrl: mockUploadUrl,
    fileKey,
    publicUrl: mockPublicUrl,
    expiresInSeconds,
  };
}
