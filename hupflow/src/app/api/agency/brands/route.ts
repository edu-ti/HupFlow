import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  getAgencyBrands,
  createAgencyBrand,
  updateAgencyBrand,
  toggleBrandFavorite,
  deleteAgencyBrand,
  getAgencyPortfolioSummaryMetrics,
} from '@/lib/agency/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || undefined;
    const niche = searchParams.get('niche') || undefined;
    const favoritesOnly = searchParams.get('favoritesOnly') === 'true';

    const [brands, summary] = await Promise.all([
      getAgencyBrands(auth.organizationId, {
        query,
        niche,
        favoritesOnly,
      }),
      getAgencyPortfolioSummaryMetrics(auth.organizationId),
    ]);

    return NextResponse.json({
      success: true,
      brands,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao buscar marcas da agência' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const { brandName, slug, niche, colorHex, tier, monthlyPostQuota, tags } = body;

    if (!brandName || typeof brandName !== 'string' || brandName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nome da marca cliente é obrigatório.' },
        { status: 400 }
      );
    }

    const created = await createAgencyBrand(auth.organizationId, {
      brandName,
      slug: slug || brandName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      niche: niche || 'Geral',
      colorHex: colorHex || '#6366f1',
      tier: tier || 'standard',
      monthlyPostQuota: Number(monthlyPostQuota) || 60,
      tags: Array.isArray(tags) ? tags : [],
    });

    return NextResponse.json({
      success: true,
      brand: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao cadastrar marca da agência' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const { id, action, ...patch } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID da marca é obrigatório.' },
        { status: 400 }
      );
    }

    if (action === 'toggle_favorite') {
      const updated = await toggleBrandFavorite(auth.organizationId, id);
      return NextResponse.json({
        success: true,
        brand: updated,
      });
    }

    const updated = await updateAgencyBrand(auth.organizationId, id, patch);
    if (!updated) {
      return NextResponse.json(
        { error: 'Marca não encontrada.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      brand: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao atualizar marca' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Parâmetro "id" é obrigatório.' },
        { status: 400 }
      );
    }

    await deleteAgencyBrand(auth.organizationId, id);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao excluir marca' },
      { status: 500 }
    );
  }
}
