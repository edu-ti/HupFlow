import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  listShortLinks,
  createShortLink,
  deleteShortLink,
  generateChannelVariants,
} from '@/lib/shortlinks/service';
import { CreateShortLinkInput } from '@/lib/shortlinks/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const links = await listShortLinks(auth.organizationId);
    return NextResponse.json({ shortLinks: links });
  } catch (err: any) {
    console.error('[ShortLinks Route] Erro ao listar links:', err);
    return NextResponse.json(
      { error: 'Falha ao buscar links encurtados' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body: CreateShortLinkInput = await req.json();

    if (!body.destinationUrl || !body.destinationUrl.trim()) {
      return NextResponse.json(
        { error: 'A URL de destino é obrigatória' },
        { status: 400 }
      );
    }

    const shortLink = await createShortLink(
      auth.organizationId,
      body,
      auth.user.id
    );

    const variants = generateChannelVariants(shortLink.destinationUrl, {
      utmCampaign: shortLink.utmCampaign || undefined,
      utmMedium: shortLink.utmMedium || undefined,
      utmContent: shortLink.utmContent || undefined,
      utmTerm: shortLink.utmTerm || undefined,
    });

    return NextResponse.json(
      {
        shortLink,
        variants,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[ShortLinks Route] Erro ao criar link:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao criar link encurtado' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {
        // Sem body JSON
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: 'ID do link não informado para exclusão' },
        { status: 400 }
      );
    }

    await deleteShortLink(auth.organizationId, id);

    return NextResponse.json({
      success: true,
      message: 'Link encurtado excluído com sucesso.',
    });
  } catch (err: any) {
    console.error('[ShortLinks Route] Erro ao excluir link:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao excluir link' },
      { status: 500 }
    );
  }
}
