import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { posts, users, postChannels, socialAccounts } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import {
  PostApprovalStatus,
  ApprovalActionPayload,
  PostWithApproval,
  ApprovalCounts,
} from '@/lib/approvals/types';
import { executeApprovalTransition } from '@/lib/approvals/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const filterStatus = searchParams.get('status');

    // 1. Busca todos os posts da organização para montar a contagem
    const allOrgPosts = await db
      .select({
        id: posts.id,
        approvalStatus: posts.approvalStatus,
      })
      .from(posts)
      .where(eq(posts.organizationId, auth.organizationId));

    const counts: ApprovalCounts = {
      all: allOrgPosts.length,
      inReview: 0,
      approved: 0,
      rejected: 0,
      draft: 0,
    };

    allOrgPosts.forEach((p) => {
      const st = (p.approvalStatus || 'approved') as PostApprovalStatus;
      if (st === 'in_review') counts.inReview++;
      else if (st === 'approved') counts.approved++;
      else if (st === 'rejected') counts.rejected++;
      else if (st === 'draft') counts.draft++;
    });

    // 2. Consulta filtrada com join para autor
    const whereConditions = [eq(posts.organizationId, auth.organizationId)];
    if (filterStatus && filterStatus !== 'all') {
      whereConditions.push(eq(posts.approvalStatus, filterStatus));
    }

    const postRows = await db
      .select({
        id: posts.id,
        organizationId: posts.organizationId,
        content: posts.content,
        mediaIds: posts.mediaIds,
        status: posts.status,
        approvalStatus: posts.approvalStatus,
        scheduledAt: posts.scheduledAt,
        publishedAt: posts.publishedAt,
        authorId: posts.authorId,
        submittedById: posts.submittedById,
        approvedById: posts.approvedById,
        rejectionReason: posts.rejectionReason,
        reviewedAt: posts.reviewedAt,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorName: users.name,
        authorEmail: users.email,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(and(...whereConditions))
      .orderBy(desc(posts.createdAt))
      .limit(50);

    // 3. Busca canais sociais vinculados a cada post
    const postIds = postRows.map((p) => p.id);
    let channelsByPost: Record<string, { id: string; provider: string; accountName: string }[]> = {};

    if (postIds.length > 0) {
      const channelRows = await db
        .select({
          id: postChannels.id,
          postId: postChannels.postId,
          provider: socialAccounts.provider,
          accountName: socialAccounts.accountName,
        })
        .from(postChannels)
        .innerJoin(socialAccounts, eq(postChannels.socialAccountId, socialAccounts.id))
        .where(eq(socialAccounts.organizationId, auth.organizationId));

      channelRows.forEach((ch) => {
        if (!channelsByPost[ch.postId]) channelsByPost[ch.postId] = [];
        channelsByPost[ch.postId].push({
          id: ch.id,
          provider: ch.provider,
          accountName: ch.accountName,
        });
      });
    }

    const formattedPosts: PostWithApproval[] = postRows.map((r) => ({
      id: r.id,
      organizationId: r.organizationId,
      content: r.content,
      mediaIds: (r.mediaIds as string[]) || [],
      status: r.status,
      approvalStatus: (r.approvalStatus || 'approved') as PostApprovalStatus,
      scheduledAt: r.scheduledAt ? r.scheduledAt.toISOString() : null,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
      authorId: r.authorId,
      authorName: r.authorName,
      authorEmail: r.authorEmail,
      submittedById: r.submittedById,
      approvedById: r.approvedById,
      rejectionReason: r.rejectionReason,
      reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      channels: channelsByPost[r.id] || [],
    }));

    return NextResponse.json({
      posts: formattedPosts,
      counts,
    });
  } catch (err: any) {
    console.error('[Approvals API] Erro ao listar posts de aprovação:', err);
    return NextResponse.json({ error: 'Falha ao buscar posts para aprovação' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body: ApprovalActionPayload = await req.json();
    const { postId, action, feedback } = body;

    if (!postId || !action) {
      return NextResponse.json(
        { error: 'Parâmetros "postId" e "action" são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeApprovalTransition(
      postId,
      auth.organizationId,
      action,
      { id: auth.user.id, role: auth.organizationRole },
      feedback
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      postId,
      toStatus: result.toStatus,
    });
  } catch (err: any) {
    console.error('[Approvals API] Erro ao processar ação editorial:', err);
    return NextResponse.json({ error: err.message || 'Falha ao processar aprovação' }, { status: 500 });
  }
}
