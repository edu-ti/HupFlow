import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { mutateSocialCommerceProduct } from '@/lib/commerce/service';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const productId = String(body?.productId || '');
    const action = body?.action === 'delete' ? 'delete' : 'simulate_order';

    if (!productId) {
      return NextResponse.json(
        { error: 'O identificador productId é obrigatório.' },
        { status: 400 }
      );
    }

    const result = await mutateSocialCommerceProduct(
      auth.organizationId,
      productId,
      action
    );

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao atualizar produto Social Commerce.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
