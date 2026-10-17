import assert from 'node:assert';
import {
  validateApprovalTransition,
  canPublishPost,
} from './service';

console.log('[TEST] Iniciando testes do Fluxo Editorial de Aprovações & Máquina de Estados...');

// Teste 1: Submissão de rascunho por membro comum
const resSubmit = validateApprovalTransition('draft', 'submit', 'member');
assert.strictEqual(resSubmit.success, true, 'Membro deve conseguir submeter rascunho');
assert.strictEqual(resSubmit.toStatus, 'in_review', 'Status destino deve ser in_review');
console.log('✅ Submissão de rascunho para revisão validada.');

// Teste 2: Impedir aprovação direta sem submissão
const resDirectApprove = validateApprovalTransition('draft', 'approve', 'admin');
assert.strictEqual(resDirectApprove.success, false, 'Não deve aprovar rascunho diretamente sem passar por in_review');
console.log('✅ Bloqueio de aprovação direta de rascunho aprovado.');

// Teste 3: Aprovação por administrador
const resApproveAdmin = validateApprovalTransition('in_review', 'approve', 'admin');
assert.strictEqual(resApproveAdmin.success, true, 'Admin deve conseguir aprovar');
assert.strictEqual(resApproveAdmin.toStatus, 'approved', 'Status destino deve ser approved');
console.log('✅ Aprovação por administrador validada com sucesso.');

// Teste 4: Aprovação por owner
const resApproveOwner = validateApprovalTransition('in_review', 'approve', 'owner');
assert.strictEqual(resApproveOwner.success, true, 'Owner deve conseguir aprovar');
assert.strictEqual(resApproveOwner.toStatus, 'approved');
console.log('✅ Aprovação por proprietário validada.');

// Teste 5: Rejeição de permissão - Membro tentando aprovar
const resApproveMember = validateApprovalTransition('in_review', 'approve', 'member');
assert.strictEqual(resApproveMember.success, false, 'Membro comum NÃO deve ter permissão para aprovar');
assert(resApproveMember.error?.includes('Permissão insuficiente'), 'Mensagem de erro de RBAC correta');
console.log('✅ Proteção RBAC contra aprovação indevida aprovada.');

// Teste 6: Rejeição de publicação com devolução de feedback
const resReject = validateApprovalTransition('in_review', 'reject', 'admin');
assert.strictEqual(resReject.success, true, 'Admin deve conseguir rejeitar post em revisão');
assert.strictEqual(resReject.toStatus, 'rejected', 'Status destino deve ser rejected');
console.log('✅ Rejeição editorial validada.');

// Teste 7: Re-submissão de post após ajustes
const resResubmit = validateApprovalTransition('rejected', 'submit', 'member');
assert.strictEqual(resResubmit.success, true, 'Autor deve conseguir re-submeter post rejeitado após correções');
assert.strictEqual(resResubmit.toStatus, 'in_review');
console.log('✅ Re-submissão de post corrigido aprovada.');

// Teste 8: Validador de despacho de rede canPublishPost
assert.strictEqual(canPublishPost('approved'), true, 'Apenas posts aprovados podem ser despachados');
assert.strictEqual(canPublishPost('draft'), false, 'Rascunhos não podem ser despachados');
assert.strictEqual(canPublishPost('in_review'), false, 'Posts em revisão não podem ser despachados');
assert.strictEqual(canPublishPost('rejected'), false, 'Posts rejeitados não podem ser despachados');
console.log('✅ Trava de publicação canPublishPost validada com 100% de precisão.');

console.log('✅ Todos os testes do Fluxo Editorial de Aprovações passaram com sucesso!');
process.exit(0);
