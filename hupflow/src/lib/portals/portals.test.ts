import assert from 'node:assert';
import crypto from 'node:crypto';
import { PortalDeliverable, PortalReviewInput } from './types';

const BASE62_ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Gera um Capability Token URL-safe com prefixo 'ptl_' e 24 caracteres de alta entropia
 */
export function generatePortalToken(length = 24): string {
  const bytes = crypto.randomBytes(length);
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

// Bateria de Testes Unitários
async function runTests() {
  console.log('[TEST] Iniciando bateria de testes do White-Label Client Portals...');

  // 1. Geração de Capability Token
  const t1 = generatePortalToken();
  const t2 = generatePortalToken();
  assert.ok(t1.startsWith('ptl_'), 'Token deve iniciar com ptl_');
  assert.strictEqual(t1.length, 28, 'Token deve ter 4 + 24 = 28 caracteres');
  assert.notStrictEqual(t1, t2, 'Tokens devem ser criptograficamente distintos');
  console.log('✅ Geração de Capability Tokens (ptl_...) aprovada.');

  // 2. Validação de Cores White-Label e PIN
  assert.strictEqual(isValidHexColor('#6366F1'), true);
  assert.strictEqual(isValidHexColor('#10b981'), true);
  assert.strictEqual(isValidHexColor('red'), false);
  assert.strictEqual(normalizeBrandColor('invalido'), '#6366F1');
  assert.strictEqual(isValidPortalPin('2026'), true);
  assert.strictEqual(isValidPortalPin('12'), false);
  assert.strictEqual(verifyPortalPinAccess('2026', '2026'), true);
  assert.strictEqual(verifyPortalPinAccess('2026', '9999'), false);
  assert.strictEqual(verifyPortalPinAccess(null, undefined), true);
  console.log('✅ Validação de cor White-Label e proteção por PIN aprovadas.');

  // 3. Máquina de Revisão Externa e Métricas
  const initialDeliverables: PortalDeliverable[] = [
    {
      id: 'd1',
      title: 'Carrossel IA Varejo',
      caption: 'Texto 1',
      channel: 'linkedin',
      scheduledDate: '2026-10-20',
      mediaType: 'carousel',
      slideCount: 6,
      status: 'pending_review',
    },
    {
      id: 'd2',
      title: 'Reels Bastidores',
      caption: 'Texto 2',
      channel: 'instagram',
      scheduledDate: '2026-10-22',
      mediaType: 'short_video',
      status: 'pending_review',
    },
  ];

  // Aprovar d1
  const afterApproval = applyDeliverableReview(initialDeliverables, {
    deliverableId: 'd1',
    decision: 'approved',
    reviewerName: 'Carlos Cliente',
  });
  assert.strictEqual(afterApproval[0].status, 'approved');
  assert.strictEqual(afterApproval[0].reviewedBy, 'Carlos Cliente');

  // Tentar pedir alteração em d2 sem comentário deve lançar erro
  assert.throws(() => {
    applyDeliverableReview(afterApproval, {
      deliverableId: 'd2',
      decision: 'changes_requested',
      reviewerName: 'Carlos Cliente',
      feedbackNote: '',
    });
  }, /descreva o ajuste/);

  // Pedir alteração em d2 com comentário válido
  const afterChanges = applyDeliverableReview(afterApproval, {
    deliverableId: 'd2',
    decision: 'changes_requested',
    reviewerName: 'Carlos Cliente',
    feedbackNote: 'Trocar a cor do slide 2 para azul marinho.',
  });
  assert.strictEqual(afterChanges[1].status, 'changes_requested');

  const metrics = calculatePortalMetrics(afterChanges);
  assert.strictEqual(metrics.total, 2);
  assert.strictEqual(metrics.approved, 1);
  assert.strictEqual(metrics.changesRequested, 1);
  assert.strictEqual(metrics.approvalRate, 50.0);
  console.log('✅ Máquina de estados de aprovação externa e cálculo de métricas aprovados.');

  console.log('🎉 Todos os testes unitários do White-Label Client Portals passaram com 100% de sucesso!');
}

if (require.main === module) {
  runTests().catch((err) => {
    console.error('❌ Falha nos testes de Portals:', err);
    process.exit(1);
  });
}
