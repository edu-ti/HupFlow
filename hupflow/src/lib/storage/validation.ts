import { MediaType } from './types';

export const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024;   // 25 MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
] as const;

export const ALLOWED_PDF_MIME_TYPES = [
  'application/pdf',
] as const;

export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
] as const;

export const ALL_ALLOWED_MIME_TYPES = [
  ...ALLOWED_IMAGE_MIME_TYPES,
  ...ALLOWED_PDF_MIME_TYPES,
  ...ALLOWED_VIDEO_MIME_TYPES,
] as const;

/**
 * Resolve a categoria visual e de rede social a partir do MIME type
 */
export function getMediaTypeFromMime(mimeType: string): MediaType {
  const normalized = mimeType.toLowerCase().trim();
  if (ALLOWED_IMAGE_MIME_TYPES.includes(normalized as any)) {
    return 'image';
  }
  if (ALLOWED_PDF_MIME_TYPES.includes(normalized as any)) {
    return 'pdf';
  }
  if (ALLOWED_VIDEO_MIME_TYPES.includes(normalized as any)) {
    return 'video';
  }
  return 'other';
}

/**
 * Sanitiza o nome do arquivo para prevenir directory traversal e caracteres perigosos
 */
export function sanitizeFileName(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'unnamed-file';
  }

  // Remove caminhos e barras
  const basename = filename.split(/[/\\]/).pop() || 'unnamed-file';

  // Separa nome e extensão
  const lastDotIndex = basename.lastIndexOf('.');
  let namePart = lastDotIndex !== -1 ? basename.substring(0, lastDotIndex) : basename;
  const extPart = lastDotIndex !== -1 ? basename.substring(lastDotIndex).toLowerCase() : '';

  // Substitui caracteres especiais, espaços e acentos por hífens
  namePart = namePart
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-zA-Z0-9_-]/g, '-') // apenas alfanumérico e traço
    .replace(/-+/g, '-') // múltiplos traços viram um só
    .replace(/^-|-$/g, ''); // remove traço no início/fim

  if (!namePart) {
    namePart = 'file';
  }

  // Limita o tamanho do nome base para 100 caracteres
  const sanitized = namePart.substring(0, 100) + extPart;
  return sanitized;
}

/**
 * Formata bytes em representação amigável (ex: 2.4 MB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  mediaType?: MediaType;
}

/**
 * Valida o arquivo por MIME type, peso em bytes e extensão
 */
export function validateMediaFile(
  filename: string,
  mimeType: string,
  sizeBytes: number
): ValidationResult {
  if (!filename || !filename.trim()) {
    return { valid: false, error: 'Nome do arquivo não pode ser vazio.' };
  }

  if (sizeBytes <= 0) {
    return { valid: false, error: 'O arquivo está vazio (0 bytes).' };
  }

  const normalizedMime = mimeType.toLowerCase().trim();
  const mediaType = getMediaTypeFromMime(normalizedMime);

  if (mediaType === 'other') {
    return {
      valid: false,
      error: `Formato "${mimeType}" não suportado. Permitidos: PNG, JPG, WEBP, GIF, PDF e MP4.`,
    };
  }

  if (mediaType === 'image' && sizeBytes > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Imagem excede o limite máximo de ${formatBytes(MAX_IMAGE_SIZE_BYTES)} (arquivo possui ${formatBytes(sizeBytes)}).`,
    };
  }

  if (mediaType === 'pdf' && sizeBytes > MAX_PDF_SIZE_BYTES) {
    return {
      valid: false,
      error: `Documento PDF excede o limite máximo de ${formatBytes(MAX_PDF_SIZE_BYTES)} (arquivo possui ${formatBytes(sizeBytes)}).`,
    };
  }

  if (mediaType === 'video' && sizeBytes > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      error: `Vídeo excede o limite máximo de ${formatBytes(MAX_VIDEO_SIZE_BYTES)} (arquivo possui ${formatBytes(sizeBytes)}).`,
    };
  }

  return {
    valid: true,
    mediaType,
  };
}
