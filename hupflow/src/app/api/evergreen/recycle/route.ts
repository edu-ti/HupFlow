import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { triggerEvergreenRecycle } from '@/lib/evergreen/service';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    if (!body.itemId) {
      return NextResponse.json(
        { error: 'ID do item Evergreen é obrigatório.' },
        { status: 400 }
      );
    }

    const result = await triggerEvergreenRecycle(
      auth.organizationId,
      body.itemId,
      Boolean(body.force)
    );
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Evergreen Recycle API] Erro ao reciclar item:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao reciclar publicação' },
      { status: 400 }
    );
  }
}
