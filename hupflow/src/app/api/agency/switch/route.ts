import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { getAgencyBrandById } from '@/lib/agency/service';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const { targetBrandId } = body;

    if (!targetBrandId) {
      return NextResponse.json(
        { error: 'Parâmetro "targetBrandId" é obrigatório.' },
        { status: 400 }
      );
    }

    const brand = await getAgencyBrandById(auth.organizationId, targetBrandId);
    if (!brand) {
      return NextResponse.json(
        { error: 'Marca destino não encontrada na carteira da agência.' },
        { status: 404 }
      );
    }

    // Prepare response with cookies updated to the target organization context
    const res = NextResponse.json({
      success: true,
      activeOrganizationId: brand.organizationId,
      activeBrandId: brand.id,
      brandName: brand.brandName,
      slug: brand.slug,
      colorHex: brand.colorHex,
    });

    // Set cookie for tenant context persistence
    res.cookies.set('hupflow_org_context', brand.organizationId, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    res.cookies.set('hupflow_brand_slug', brand.slug, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao alternar contexto da marca' },
      { status: 500 }
    );
  }
}
