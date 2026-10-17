import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { postApprovalHistory, users } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { ApprovalHistoryEntry } from '@/lib/approvals/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Parâmetro "postId" é obrigatório' }, { status: 400 });
    }

    const rows = await db
      .select({
        id: postApprovalHistory.id,
        postId: postApprovalHistory.postId,
        organizationId: postApprovalHistory.organizationId,
        action: postApprovalHistory.action,
        fromStatus: postApprovalHistory.fromStatus,
        toStatus: postApprovalHistory.toStatus,
        actorId: postApprovalHistory.actorId,
        actorName: users.name,
        feedback: postApprovalHistory.feedback,
        createdAt: postApprovalHistory.createdAt,
      })
      .from(postApprovalHistory)
      .leftJoin(users, eq(postApprovalHistory.actorId, users.id))
      .where(
        and(
          eq(postApprovalHistory.postId, postId),
          eq(postApprovalHistory.organizationId, auth.organizationId)
        )
      )
      .orderBy(desc(postApprovalHistory.createdAt));

    const history: ApprovalHistoryEntry[] = rows.map((r) => ({
      id: r.id,
      postId: r.postId,
      organizationId: r.organizationId,
      action: r.action as any,
      fromStatus: r.fromStatus as any,
      toStatus: r.toStatus as any,
      actorId: r.actorId,
      actorName: r.actorName,
      feedback: r.feedback,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({ history });
  } catch (err: any) {
    console.error('[Approvals History API] Erro ao buscar histórico:', err);
    return NextResponse.json({ error: 'Falha ao buscar histórico de auditoria' }, { status: 500 });
  }
}
