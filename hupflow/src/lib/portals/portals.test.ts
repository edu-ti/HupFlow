import assert from 'node:assert';
import { PortalDeliverable, PortalReviewInput } from './types';
import {
  generatePortalToken,
  isValidHexColor,
  normalizeBrandColor,
  isValidPortalPin,
  verifyPortalPinAccess,
  calculatePortalMetrics,
  applyDeliverableReview,
} from './portals-utils';

export {
  generatePortalToken,
  isValidHexColor,
  normalizeBrandColor,
  isValidPortalPin,
  verifyPortalPinAccess,
  calculatePortalMetrics,
  applyDeliverableReview,
};

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
