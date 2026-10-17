import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  getWatermarkSettings,
  upsertWatermarkSettings,
} from '@/lib/watermark/service';
import { UpdateWatermarkSettingsInput } from '@/lib/watermark/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const data = await getWatermarkSettings(auth.organizationId);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[Watermark API] Erro ao obter configurações:', err);
    return NextResponse.json(
      { error: 'Falha ao buscar configurações de marca d\'água' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body: UpdateWatermarkSettingsInput = await req.json();

    const updated = await upsertWatermarkSettings(auth.organizationId, body);
    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (err: any) {
    console.error('[Watermark API] Erro ao salvar configurações:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao atualizar marca d\'água' },
      { status: 400 }
    );
  }
}
