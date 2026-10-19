import { PortalDeliverable, PortalReviewInput } from './types';

const BASE62_ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function getRandomBytes(length: number): Uint8Array {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    return arr;
  }
  const arr = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
}

/**
 * Gera um Capability Token URL-safe com prefixo 'ptl_' e 24 caracteres de alta entropia
 */
export function generatePortalToken(length = 24): string {
  const bytes = getRandomBytes(length);
  let chars = '';
  for (let i = 0; i < length; i++) {
    chars += BASE62_ALPHABET[bytes[i] % BASE62_ALPHABET.length];
  }
  return `ptl_${chars}`;
}

/**
 * Valida se uma cor hexadecimal White-Label é válida (#RRGGBB)
 */
export function isValidHexColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;
  return /^#[0-9A-Fa-f]{6}$/.test(color.trim());
}

/**
 * Normaliza cor hexadecimal, aplicando fallback #6366F1 se inválida
 */
export function normalizeBrandColor(color?: string | null): string {
  if (color && isValidHexColor(color)) {
    return color.trim().toUpperCase();
  }
  return '#6366F1';
}

/**
 * Valida PIN numérico opcional (vazio = sem PIN, ou 4 a 6 dígitos)
 */
export function isValidPortalPin(pin?: string | null): boolean {
  if (!pin || pin.trim() === '') return true;
  return /^\d{4,6}$/.test(pin.trim());
}

/**
 * Verifica se o PIN informado pelo visitante confere com o PIN configurado no portal
 */
export function verifyPortalPinAccess(
  configuredPin?: string | null,
  providedPin?: string | null
): boolean {
  if (!configuredPin || configuredPin.trim() === '') return true;
  if (!providedPin) return false;
  return configuredPin.trim() === providedPin.trim();
}

/**
 * Calcula estatísticas de entregas de um portal
 */
export function calculatePortalMetrics(deliverables: PortalDeliverable[]): {
  total: number;
  approved: number;
  pending: number;
  changesRequested: number;
  approvalRate: number;
} {
  const total = deliverables.length;
  if (total === 0) {
    return {
      total: 0,
      approved: 0,
      pending: 0,
      changesRequested: 0,
      approvalRate: 0,
    };
  }

  let approved = 0;
  let pending = 0;
  let changesRequested = 0;

  for (const d of deliverables) {
    if (d.status === 'approved') approved++;
    else if (d.status === 'changes_requested') changesRequested++;
    else pending++;
  }

  const approvalRate = Number(((approved / total) * 100).toFixed(1));
  return { total, approved, pending, changesRequested, approvalRate };
}

/**
 * Aplica a decisão de revisão externa (aprovação ou solicitação de ajuste)
 * em um item do portal, validando obrigatoriedade de nota em caso de ajustes.
 */
export function applyDeliverableReview(
  deliverables: PortalDeliverable[],
  input: PortalReviewInput
): PortalDeliverable[] {
  const reviewer = (input.reviewerName || '').trim();
  if (reviewer.length < 2) {
    throw new Error('Informe seu nome (mínimo 2 caracteres) para registrar a avaliação.');
  }

  const note = (input.feedbackNote || '').trim();
  if (input.decision === 'changes_requested' && note.length < 3) {
    throw new Error(
      'Ao solicitar alterações, descreva o ajuste desejado (mínimo 3 caracteres).'
    );
  }

  const exists = deliverables.some((d) => d.id === input.deliverableId);
  if (!exists) {
    throw new Error('Item de entrega não encontrado neste portal.');
  }

  const now = Date.now();
  return deliverables.map((d) => {
    if (d.id !== input.deliverableId) return d;
    return {
      ...d,
      status: input.decision,
      reviewedBy: reviewer,
      reviewedAt: now,
      feedbackNote: note || (input.decision === 'approved' ? 'Aprovado sem ressalvas' : null),
    };
  });
}
