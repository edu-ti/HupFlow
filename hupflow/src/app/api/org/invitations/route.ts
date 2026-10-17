import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole, hasMinRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { invitations, members, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { CreateInvitationRequest, InvitationSummary, OrgRole } from '@/lib/auth/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const rows = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.organizationId, auth.organizationId),
          eq(invitations.status, 'pending')
        )
      );

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    const list: InvitationSummary[] = rows.map((inv) => ({
      id: inv.id,
      email: inv.email,
      role: inv.role as OrgRole,
      status: inv.status as any,
      expiresAt: inv.expiresAt.toISOString(),
      createdAt: inv.createdAt.toISOString(),
      inviteLink: `${baseUrl}/accept-invite?token=${inv.id}`,
    }));

    return NextResponse.json({ invitations: list });
  } catch (err: any) {
    if (auth.isDevFallback) {
      return NextResponse.json({ invitations: [] });
    }

    return NextResponse.json(
      { error: 'Falha ao buscar convites da organização', details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = (await req.json()) as CreateInvitationRequest;
    const email = body?.email?.trim().toLowerCase();
    const role = body?.role;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Formato de e-mail inválido.' },
        { status: 400 }
      );
    }

    if (!role || !['admin', 'member', 'viewer'].includes(role)) {
      return NextResponse.json(
        { error: "Papel de convite inválido. Escolha 'admin', 'member' ou 'viewer'." },
        { status: 400 }
      );
    }

    // Regra: Apenas o owner pode convidar outro admin
    if (role === 'admin' && auth.organizationRole !== 'owner') {
      return NextResponse.json(
        { error: 'Apenas o proprietário da organização pode convidar novos Administradores.' },
        { status: 403 }
      );
    }

    // Verifica se já é membro ativo
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      const [existingMember] = await db
        .select()
        .from(members)
        .where(
          and(
            eq(members.organizationId, auth.organizationId),
            eq(members.userId, existingUser.id)
          )
        )
        .limit(1);

      if (existingMember) {
        return NextResponse.json(
          { error: 'Este usuário já é um membro ativo desta organização.' },
          { status: 400 }
        );
      }
    }

    const inviteId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    await db.insert(invitations).values({
      id: inviteId,
      organizationId: auth.organizationId,
      email,
      role,
      status: 'pending',
      expiresAt,
      inviterId: auth.user.id,
      createdAt: new Date(),
    });

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    const inviteLink = `${baseUrl}/accept-invite?token=${inviteId}`;

    const newInvitation: InvitationSummary = {
      id: inviteId,
      email,
      role,
      status: 'pending',
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      inviteLink,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Convite criado com sucesso.',
        invitation: newInvitation,
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (auth.isDevFallback) {
      const inviteId = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      return NextResponse.json(
        {
          success: true,
          message: 'Convite simulado criado com sucesso (modo dev).',
          invitation: {
            id: inviteId,
            email: 'convidado@empresa.com',
            role: 'member',
            status: 'pending',
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString(),
            inviteLink: `/accept-invite?token=${inviteId}`,
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: 'Falha ao criar convite', details: err.message },
      { status: 500 }
    );
  }
}
