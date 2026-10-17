import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  activateCrisisKillSwitch,
  deactivateCrisisKillSwitch,
} from '@/lib/brandsafety/service';

export async function POST(req: NextRequest) {
  // Exige perfil de admin ou owner para alterar o Kill Switch
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const action = body.action; // 'activate' | 'deactivate'

    if (action === 'activate') {
      if (!body.reason || typeof body.reason !== 'string' || body.reason.trim().length === 0) {
        return NextResponse.json({ error: 'Motivo da ativação de emergência é obrigatório.' }, { status: 400 });
      }

      // Trava de confirmação textual para evitar cliques acidentais
      const confirmation = body.confirmationText?.trim().toUpperCase();
      if (confirmation !== 'CONFIRMAR PAUSA' && confirmation !== 'PAUSAR') {
        return NextResponse.json({
          error: 'Confirmação inválida. Digite "CONFIRMAR PAUSA" para prosseguir.',
        }, { status: 400 });
      }

      const result = await activateCrisisKillSwitch(auth.organizationId, {
        reason: body.reason.trim(),
        scope: body.scope || 'global',
        targetBrandSlug: body.targetBrandSlug,
        targetChannel: body.targetChannel,
        activatedByUserId: auth.user.id,
        activatedByUserName: auth.user.name || 'Administrador',
      });

      return NextResponse.json({
        success: true,
        message: '🚨 Kill Switch de emergência ativado! Toda a fila de publicações foi congelada.',
        config: result.config,
        incidentLog: result.incidentLog,
      });
    }

    if (action === 'deactivate') {
      if (!body.reason || typeof body.reason !== 'string' || body.reason.trim().length === 0) {
        return NextResponse.json({ error: 'Justificativa para desativar a pausa é obrigatória.' }, { status: 400 });
      }

      const strategy = body.expiredPostStrategy || 'hold_for_review';
      const result = await deactivateCrisisKillSwitch(auth.organizationId, {
        reason: body.reason.trim(),
        expiredPostStrategy: strategy,
        resumedByUserId: auth.user.id,
        resumedByUserName: auth.user.name || 'Administrador',
      });

      return NextResponse.json({
        success: true,
        message: '✅ Kill Switch desativado. Fila de postagens normalizada e reconciliada.',
        config: result.config,
        incidentLog: result.incidentLog,
        summary: result.summary,
      });
    }

    return NextResponse.json({ error: 'Ação desconhecida. Use "activate" ou "deactivate".' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao processar Kill Switch.' }, { status: 500 });
  }
}
