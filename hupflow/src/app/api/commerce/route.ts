import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  createSocialCommerceProduct,
  listSocialCommerceProducts,
} from '@/lib/commerce/service';
import {
  CommerceProductCategory,
  CommerceSocialChannel,
} from '@/lib/commerce/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get('category') || 'all';

    const data = await listSocialCommerceProducts(
      auth.organizationId,
      categoryParam
    );
    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao listar catálogo Social Commerce.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();

    if (!body?.name || !body?.checkoutUrl) {
      return NextResponse.json(
        { error: 'Nome do produto e URL de checkout são obrigatórios.' },
        { status: 400 }
      );
    }

    const product = await createSocialCommerceProduct(auth.organizationId, {
      sku: body.sku ? String(body.sku) : undefined,
      name: String(body.name),
      category: (body.category as CommerceProductCategory) || 'saas_plan',
      channel: (body.channel as CommerceSocialChannel) || 'instagram',
      priceBrl: Number(body.priceBrl || 297),
      checkoutUrl: String(body.checkoutUrl),
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao adicionar produto ao catálogo Social Commerce.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
