import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { invitations, members, organizations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token de convite não fornecido.' }, { status: 400 });
  }

  try {
    const [inv] = await db
      .select({
        id: invitations.id,
        email: invitations.email,
        role: invitations.role,
        status: invitations.status,
        expiresAt: invitations.expiresAt,
        organizationId: invitations.organizationId,
        organizationName: organizations.name,
        organizationSlug: organizations.slug,
        organizationLogo: organizations.logo,
      })
      .from(invitations)
      .innerJoin(organizations, eq(invitations.organizationId, organizations.id))
      .where(eq(invitations.id, token))
      .limit(1);

    if (!inv) {
      return NextResponse.json(
        { error: 'Convite não encontrado ou inválido.' },
        { status: 404 }
      );
    }

    if (inv.status !== 'pending') {
      return NextResponse.json(
        { error: 'Este convite já foi utilizado ou não está mais ativo.' },
        { status: 400 }
      );
    }

    if (new Date(inv.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Este convite expirou. Solicite um novo envio ao administrador.' },
        { status: 410 }
      );
    }

    return NextResponse.json({ invitation: inv });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erro ao consultar convite', details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body?.token;

    if (!token) {
      return NextResponse.json({ error: 'Token de convite ausente.' }, { status: 400 });
    }

    const auth = await getAuthContext(req);

    if (!auth) {
      return NextResponse.json(
        {
          error: 'Você precisa estar logado para aceitar o convite.',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    const [inv] = await db
      .select()
      .from(invitations)
      .where(eq(invitations.id, token))
      .limit(1);

    if (!inv) {
      if (auth.isDevFallback) {
        return NextResponse.json({
          success: true,
          message: 'Convite aceito com sucesso (modo dev simulado).',
          organizationId: 'org_default',
        });
      }

      return NextResponse.json(
        { error: 'Convite não encontrado ou inválido.' },
        { status: 404 }
      );
    }

    if (inv.status !== 'pending') {
      return NextResponse.json(
        { error: 'Este convite já foi aceito ou cancelado.' },
        { status: 400 }
      );
    }

    if (new Date(inv.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Este convite expirou.' },
        { status: 410 }
      );
    }

    // Verifica se já é membro
    const [existingMember] = await db
      .select()
      .from(members)
      .where(
        and(
          eq(members.organizationId, inv.organizationId),
          eq(members.userId, auth.user.id)
        )
      )
      .limit(1);

    if (!existingMember) {
      await db.insert(members).values({
        id: crypto.randomUUID(),
        organizationId: inv.organizationId,
        userId: auth.user.id,
        role: inv.role,
        createdAt: new Date(),
      });
    }

    // Atualiza status do convite
    await db
      .update(invitations)
      .set({ status: 'accepted' })
      .where(eq(invitations.id, token));

    return NextResponse.json({
      success: true,
      message: 'Convite aceito com sucesso! Bem-vindo ao workspace.',
      organizationId: inv.organizationId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Falha ao processar o aceite do convite', details: err.message },
      { status: 500 }
    );
  }
}
