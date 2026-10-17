import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  getDeviceMockups,
  createDeviceMockup,
  updateDeviceMockup,
  deleteDeviceMockup,
  getMockupsSummaryMetrics,
} from '@/lib/mockups/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const deviceType = (searchParams.get('deviceType') as any) || undefined;

    const [mockups, summary] = await Promise.all([
      getDeviceMockups(auth.organizationId, { deviceType }),
      getMockupsSummaryMetrics(auth.organizationId),
    ]);

    return NextResponse.json({
      success: true,
      mockups,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao buscar mockups de dispositivos' },
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
    const {
      title,
      deviceType,
      orientation,
      finishColor,
      shadowStyle,
      mediaType,
      mediaUrl,
      backgroundColorHex,
      perspectiveTiltX,
      perspectiveTiltY,
      tags,
    } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Título do mockup é obrigatório.' },
        { status: 400 }
      );
    }

    if (!mediaUrl || typeof mediaUrl !== 'string' || mediaUrl.trim().length === 0) {
      return NextResponse.json(
        { error: 'URL da mídia (imagem ou vídeo) é obrigatória.' },
        { status: 400 }
      );
    }

    const created = await createDeviceMockup(auth.organizationId, {
      title,
      deviceType: deviceType || 'iphone_16_pro',
      orientation: orientation || 'portrait',
      finishColor: finishColor || 'titanium_black',
      shadowStyle: shadowStyle || 'floating_3d',
      mediaType: mediaType || 'image',
      mediaUrl,
      backgroundColorHex: backgroundColorHex || '#09090b',
      perspectiveTiltX: Number(perspectiveTiltX) || 0,
      perspectiveTiltY: Number(perspectiveTiltY) || 0,
      tags: Array.isArray(tags) ? tags : [],
    });

    return NextResponse.json({
      success: true,
      mockup: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao salvar mockup' },
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
        { error: 'ID do mockup é obrigatório.' },
        { status: 400 }
      );
    }

    const updated = await updateDeviceMockup(auth.organizationId, id, patch);
    if (!updated) {
      return NextResponse.json(
        { error: 'Mockup não encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mockup: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao atualizar mockup' },
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

    await deleteDeviceMockup(auth.organizationId, id);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao excluir mockup' },
      { status: 500 }
    );
  }
}
