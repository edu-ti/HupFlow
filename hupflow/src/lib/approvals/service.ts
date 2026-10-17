import { db } from '@/lib/db';
import { posts, postApprovalHistory } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import {
  PostApprovalStatus,
  ApprovalAction,
  ApprovalTransitionResult,
} from './types';
import { OrgRole } from '@/lib/auth/types';
import { hasMinRole } from '@/lib/auth/rbac';

/**
 * Validador puro da máquina de estados editorial.
 * Define as transições válidas e papéis mínimos necessários.
 */
export function validateApprovalTransition(
  currentStatus: PostApprovalStatus,
  action: ApprovalAction,
  role: OrgRole
): ApprovalTransitionResult {
  switch (action) {
    case 'submit': {
      // Pode submeter rascunho ou post rejeitado que foi editado
      if (currentStatus !== 'draft' && currentStatus !== 'rejected') {
        return {
          success: false,
          error: `Não é possível submeter para revisão a partir do status "${currentStatus}".`,
          fromStatus: currentStatus,
          toStatus: currentStatus,
        };
      }
      return {
        success: true,
        fromStatus: currentStatus,
        toStatus: 'in_review',
      };
    }

    case 'approve': {
      // Apenas admin ou owner pode aprovar
      if (!hasMinRole(role, 'admin')) {
        return {
          success: false,
          error: 'Permissão insuficiente: apenas administradores ou proprietários podem aprovar publicações.',
          fromStatus: currentStatus,
          toStatus: currentStatus,
        };
      }

      if (currentStatus !== 'in_review') {
        return {
          success: false,
          error: `Apenas posts com status "in_review" podem ser aprovados (status atual: "${currentStatus}").`,
          fromStatus: currentStatus,
          toStatus: currentStatus,
        };
      }

      return {
        success: true,
        fromStatus: currentStatus,
        toStatus: 'approved',
      };
    }

    case 'reject': {
      // Apenas admin ou owner pode rejeitar
      if (!hasMinRole(role, 'admin')) {
        return {
          success: false,
          error: 'Permissão insuficiente: apenas administradores ou proprietários podem rejeitar publicações.',
          fromStatus: currentStatus,
          toStatus: currentStatus,
        };
      }

      if (currentStatus !== 'in_review') {
        return {
          success: false,
          error: `Apenas posts com status "in_review" podem ser rejeitados (status atual: "${currentStatus}").`,
          fromStatus: currentStatus,
          toStatus: currentStatus,
        };
      }

      return {
        success: true,
        fromStatus: currentStatus,
        toStatus: 'rejected',
      };
    }

    case 'reset': {
      // Reverter para rascunho
      return {
        success: true,
        fromStatus: currentStatus,
        toStatus: 'draft',
      };
    }

    default:
      return {
        success: false,
        error: `Ação de aprovação desconhecida: "${action}".`,
        fromStatus: currentStatus,
        toStatus: currentStatus,
      };
  }
}

/**
 * Verifica se o post está autorizado para despacho em redes sociais.
 */
export function canPublishPost(approvalStatus: PostApprovalStatus): boolean {
  return approvalStatus === 'approved';
}

/**
 * Executa a transição de estado de aprovação com persistência no banco e histórico de auditoria.
 */
export async function executeApprovalTransition(
  postId: string,
  organizationId: string,
  action: ApprovalAction,
  actor: { id: string; role: OrgRole },
  feedback?: string
): Promise<{ success: boolean; error?: string; toStatus?: PostApprovalStatus }> {
  // 1. Localiza o post
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, postId), eq(posts.organizationId, organizationId)))
    .limit(1);

  if (rows.length === 0) {
    return { success: false, error: 'Publicação não encontrada no workspace ativo.' };
  }

  const post = rows[0];
  const currentStatus = (post.approvalStatus || 'approved') as PostApprovalStatus;

  // 2. Valida a transição
  const validation = validateApprovalTransition(currentStatus, action, actor.role);
  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  // 3. Validação de feedback obrigatório em caso de rejeição
  if (action === 'reject') {
    if (!feedback || feedback.trim().length < 5) {
      return {
        success: false,
        error: 'É obrigatório informar uma justificativa detalhada (mínimo de 5 caracteres) ao devolver um post.',
      };
    }
  }

  const now = new Date();
  const historyId = `apprh_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // 4. Prepara atualização do post
  const updates: Record<string, any> = {
    approvalStatus: validation.toStatus,
    updatedAt: now,
  };

  if (action === 'submit') {
    updates.submittedById = actor.id;
    updates.rejectionReason = null;
  } else if (action === 'approve') {
    updates.approvedById = actor.id;
    updates.reviewedAt = now;
    updates.rejectionReason = null;
  } else if (action === 'reject') {
    updates.rejectionReason = feedback?.trim() || null;
    updates.reviewedAt = now;
  } else if (action === 'reset') {
    updates.rejectionReason = null;
  }

  // 5. Executa mutação atômica
  await db
    .update(posts)
    .set(updates)
    .where(and(eq(posts.id, postId), eq(posts.organizationId, organizationId)));

  // 6. Insere registro no histórico de auditoria
  try {
    await db.insert(postApprovalHistory).values({
      id: historyId,
      postId,
      organizationId,
      action,
      fromStatus: validation.fromStatus,
      toStatus: validation.toStatus,
      actorId: actor.id,
      feedback: feedback?.trim() || null,
      createdAt: now,
    });
  } catch (err) {
    console.error('[Approvals] Erro ao gravar histórico de aprovação:', err);
  }

  return {
    success: true,
    toStatus: validation.toStatus,
  };
}
