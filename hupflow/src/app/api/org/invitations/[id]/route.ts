import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { invitations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;
  const { id: invitationId } = await context.params;

  try {
    const [inv] = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.id, invitationId),
          eq(invitations.organizationId, auth.organizationId)
        )
      )
      .limit(1);

    if (!inv) {
      if (auth.isDevFallback) {
        return NextResponse.json({
          success: true,
          message: 'Convite revogado com sucesso (modo dev).',
        });
      }

      return NextResponse.json(
        { error: 'Convite não encontrado nesta organização.' },
        { status: 404 }
      );
    }

    await db
      .delete(invitations)
      .where(
        and(
          eq(invitations.id, invitationId),
          eq(invitations.organizationId, auth.organizationId)
        )
      );

    return NextResponse.json({
      success: true,
      message: 'Convite revogado com sucesso.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Falha ao revogar convite', details: err.message },
      { status: 500 }
    );
  }
}
