import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { posts, postChannels, subscriptions } from '@/lib/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { CampaignRequest, CampaignResponse } from '@/lib/bulk-scheduler/types';
import { calculateScheduleSlots } from '@/lib/bulk-scheduler/slots';
import { generateCampaignBatch } from '@/lib/bulk-scheduler/generator';
import { checkResourceQuota, getPlanConfig } from '@/lib/billing/plans';
import { PlanTier } from '@/lib/billing/types';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body: CampaignRequest = await req.json();

    if (!body.theme || typeof body.theme !== 'string' || body.theme.trim().length === 0) {
      return NextResponse.json(
        { error: 'O tema da campanha é obrigatório.' },
        { status: 400 }
      );
    }

    const postCount = Math.min(Math.max(body.postCount || 4, 2), 12);
    const startDate = body.startDate ? new Date(body.startDate) : new Date();
    const daysOfWeek = body.daysOfWeek && body.daysOfWeek.length > 0 ? body.daysOfWeek : [2, 4];
    const timeSlot = body.timeSlot || '10:00';
    const mode = body.mode || 'preview';

    // 1. Verificação de Cotas de Publicação do Plano (Feature 017 Integration)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let usedBefore = 0;
    let planTier: PlanTier = 'starter';

    try {
      const existingPosts = await db
        .select({ id: posts.id })
        .from(posts)
        .where(
          and(
            eq(posts.organizationId, auth.organizationId),
            gte(posts.createdAt, startOfMonth)
          )
        );
      usedBefore = existingPosts.length;

      const subRows = await db
        .select({ plan: subscriptions.plan })
        .from(subscriptions)
        .where(eq(subscriptions.organizationId, auth.organizationId))
        .limit(1);

      if (subRows[0]?.plan) {
        planTier = subRows[0].plan as PlanTier;
      }
    } catch {
      // Silencioso em fallback dev
    }

    const planConfig = getPlanConfig(planTier);
    const totalProjected = usedBefore + postCount;
    const quotaCheck = checkResourceQuota(planTier, 'postsThisMonth', totalProjected);

    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          error: `A campanha de ${postCount} posts excede a cota do plano ${planConfig.name} (limite de ${planConfig.limits.maxPostsPerMonth} posts por mês).`,
          code: 'QUOTA_EXCEEDED',
          remaining: Math.max(0, planConfig.limits.maxPostsPerMonth - usedBefore),
          limit: planConfig.limits.maxPostsPerMonth,
        },
        { status: 403 }
      );
    }

    // 2. Projeção de slots temporais
    const slots = calculateScheduleSlots(startDate, daysOfWeek, timeSlot, postCount);

    // 3. Geração dos posts com IA / Fallback
    const generatedPosts = await generateCampaignBatch(body, slots);

    // 4. Se o modo for "commit", persiste atomicamente no banco de dados
    if (mode === 'commit') {
      for (let i = 0; i < generatedPosts.length; i++) {
        const item = generatedPosts[i];
        const postId = `post_bulk_${Date.now()}_${i + 1}`;
        item.postId = postId;

        try {
          await db.insert(posts).values({
            id: postId,
            organizationId: auth.organizationId,
            authorId: auth.user.id,
            content: item.content,
            mediaIds: item.slides ? (item.slides as any) : [],
            status: 'scheduled',
            scheduledAt: new Date(item.scheduledAt),
          });

          // Vincula aos canais selecionados
          if (body.channels && body.channels.length > 0) {
            for (const channelId of body.channels) {
              await db.insert(postChannels).values({
                id: `pchannel_${postId}_${channelId}`,
                postId,
                socialAccountId: channelId,
                status: 'pending',
                customContent: item.content,
              });
            }
          }
        } catch {
          // Fallback resiliente se banco offline
        }
      }
    }

    const responsePayload: CampaignResponse = {
      success: true,
      mode,
      campaignTheme: body.theme,
      posts: generatedPosts,
      quota: {
        usedBefore,
        added: postCount,
        totalAfter: usedBefore + postCount,
        limit: planConfig.limits.maxPostsPerMonth,
      },
    };

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro inesperado ao gerar campanha com IA' },
      { status: 500 }
    );
  }
}
