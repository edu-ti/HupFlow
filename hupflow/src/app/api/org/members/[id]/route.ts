import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole, canManageMember } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { OrgRole } from '@/lib/auth/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;
  const { id: memberId } = await context.params;

  try {
    const body = await req.json();
    const newRole = body?.role as OrgRole;

    if (!newRole || !['admin', 'member', 'viewer'].includes(newRole)) {
      return NextResponse.json(
        { error: "Papel inválido. Deve ser 'admin', 'member' ou 'viewer'." },
        { status: 400 }
      );
    }

    // Busca o membro alvo na organização ativa
    const [targetMember] = await db
      .select()
      .from(members)
      .where(and(eq(members.id, memberId), eq(members.organizationId, auth.organizationId)))
      .limit(1);

    if (!targetMember) {
      // Em modo dev fallback, se o membro for simulado
      if (auth.isDevFallback) {
        return NextResponse.json({
          success: true,
          message: 'Papel atualizado com sucesso (modo dev).',
          member: { id: memberId, role: newRole },
        });
      }

      return NextResponse.json(
        { error: 'Membro não encontrado nesta organização.' },
        { status: 404 }
      );
    }

    const check = canManageMember(
      auth.organizationRole,
      auth.user.id,
      targetMember.role as OrgRole,
      targetMember.userId,
      newRole
    );

    if (!check.allowed) {
      return NextResponse.json(
        { error: check.reason || 'Operação não permitida pelas regras de controle de acesso.' },
        { status: 403 }
      );
    }

    await db
      .update(members)
      .set({ role: newRole })
      .where(and(eq(members.id, memberId), eq(members.organizationId, auth.organizationId)));

    return NextResponse.json({
      success: true,
      message: 'Papel do membro atualizado com sucesso.',
      member: {
        id: memberId,
        role: newRole,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erro ao atualizar papel do membro', details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;
  const { id: memberId } = await context.params;

  try {
    const [targetMember] = await db
      .select()
      .from(members)
      .where(and(eq(members.id, memberId), eq(members.organizationId, auth.organizationId)))
      .limit(1);

    if (!targetMember) {
      if (auth.isDevFallback) {
        return NextResponse.json({
          success: true,
          message: 'Membro removido com sucesso (modo dev).',
        });
      }

      return NextResponse.json(
        { error: 'Membro não encontrado nesta organização.' },
        { status: 404 }
      );
    }

    const check = canManageMember(
      auth.organizationRole,
      auth.user.id,
      targetMember.role as OrgRole,
      targetMember.userId
    );

    if (!check.allowed) {
      return NextResponse.json(
        { error: check.reason || 'Operação de remoção não permitida.' },
        { status: 403 }
      );
    }

    await db
      .delete(members)
      .where(and(eq(members.id, memberId), eq(members.organizationId, auth.organizationId)));

    return NextResponse.json({
      success: true,
      message: 'Membro removido da organização com sucesso.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erro ao remover membro da organização', details: err.message },
      { status: 500 }
    );
  }
}
