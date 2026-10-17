import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { recommendHashtags } from '@/lib/hashtags/service';
import { RecommendHashtagsInput } from '@/lib/hashtags/types';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;

  try {
    const body: RecommendHashtagsInput = await req.json();

    const result = await recommendHashtags({
      text: body.text,
      topic: body.topic,
      network: body.network || 'linkedin',
      niche: body.niche,
      limit: body.limit || 8,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Hashtags AI API] Erro ao gerar recomendações:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao gerar recomendações de hashtags' },
      { status: 500 }
    );
  }
}
