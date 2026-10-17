import { NextResponse } from 'next/server';
import { getAuthContext, getUserWorkspaces } from '@/lib/auth/session';

export async function GET(req: Request) {
  try {
    const authContext = await getAuthContext(req);
    const userId = authContext?.user?.id || 'usr_dev_01';
    const currentOrgId = authContext?.organizationId || 'org_default';

    const workspaces = await getUserWorkspaces(userId, currentOrgId);

    return NextResponse.json({
      workspaces,
      activeOrganizationId: currentOrgId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro ao listar workspaces' }, { status: 500 });
  }
}
