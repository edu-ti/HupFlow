import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  getAffiliatePartners,
  createAffiliatePartner,
  updateAffiliatePartner,
  deleteAffiliatePartner,
  getAffiliateProgramSummaryMetrics,
} from '@/lib/affiliates/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const tier = (searchParams.get('tier') as any) || undefined;
    const status = searchParams.get('status') || undefined;

    const [partners, summary] = await Promise.all([
      getAffiliatePartners(auth.organizationId, { tier, status }),
      getAffiliateProgramSummaryMetrics(auth.organizationId),
    ]);

    return NextResponse.json({
      success: true,
      partners,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao buscar afiliados' },
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
    const { name, email, referralCode, tier, payoutMethod, payoutKey } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nome do parceiro é obrigatório.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'E-mail válido do parceiro é obrigatório.' },
        { status: 400 }
      );
    }

    if (!payoutKey || typeof payoutKey !== 'string' || payoutKey.trim().length === 0) {
      return NextResponse.json(
        { error: 'Chave Pix ou dados de saque são obrigatórios.' },
        { status: 400 }
      );
    }

    const created = await createAffiliatePartner(auth.organizationId, {
      name,
      email,
      referralCode,
      tier: tier || 'bronze',
      payoutMethod: payoutMethod || 'pix',
      payoutKey,
    });

    return NextResponse.json({
      success: true,
      partner: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao cadastrar parceiro afiliado' },
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
    const { id, ...patch } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do parceiro é obrigatório.' },
        { status: 400 }
      );
    }

    const updated = await updateAffiliatePartner(auth.organizationId, id, patch);
    if (!updated) {
      return NextResponse.json(
        { error: 'Parceiro afiliado não encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      partner: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao atualizar parceiro' },
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

    await deleteAffiliatePartner(auth.organizationId, id);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao excluir parceiro' },
      { status: 500 }
    );
  }
}
