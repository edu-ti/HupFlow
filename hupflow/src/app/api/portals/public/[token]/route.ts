import { NextRequest, NextResponse } from 'next/server';
import { getPublicPortalByToken } from '@/lib/portals/service';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get('pin') || req.headers.get('x-portal-pin');

    const result = await getPublicPortalByToken(token, pin);
    if (!result.portal) {
      return NextResponse.json(
        { error: 'Portal não encontrado ou desativado pela agência.' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Public Portal API] Erro ao carregar portal público:', err);
    return NextResponse.json(
      { error: 'Erro ao carregar portal de aprovação' },
      { status: 500 }
    );
  }
}
