import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { members, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { OrganizationMemberSummary, OrgRole } from '@/lib/auth/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const rows = await db
      .select({
        id: members.id,
        userId: members.userId,
        role: members.role,
        createdAt: members.createdAt,
        name: users.name,
        email: users.email,
        image: users.image,
      })
      .from(members)
      .innerJoin(users, eq(members.userId, users.id))
      .where(eq(members.organizationId, auth.organizationId));

    const memberList: OrganizationMemberSummary[] = rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      name: r.name,
      email: r.email,
      image: r.image,
      role: r.role as OrgRole,
      joinedAt: r.createdAt.toISOString(),
    }));

    // Se estiver vazio (ex: novo workspace ou mock dev), inclui o usuário da sessão
    if (memberList.length === 0) {
      memberList.push({
        id: `mem_${auth.user.id}`,
        userId: auth.user.id,
        name: auth.user.name,
        email: auth.user.email,
        image: auth.user.image,
        role: auth.organizationRole,
        joinedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      members: memberList,
      currentUserRole: auth.organizationRole,
      currentUserId: auth.user.id,
    });
  } catch (err: any) {
    if (auth.isDevFallback) {
      return NextResponse.json({
        members: [
          {
            id: `mem_${auth.user.id}`,
            userId: auth.user.id,
            name: auth.user.name,
            email: auth.user.email,
            image: auth.user.image,
            role: auth.organizationRole,
            joinedAt: new Date().toISOString(),
          },
        ],
        currentUserRole: auth.organizationRole,
        currentUserId: auth.user.id,
      });
    }

    return NextResponse.json(
      { error: 'Falha ao buscar membros da organização', details: err.message },
      { status: 500 }
    );
  }
}
