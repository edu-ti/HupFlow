import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { getBioProfileByOrganization, upsertBioProfile } from '@/lib/bio/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const data = await getBioProfileByOrganization(auth.organizationId);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[Bio API] Erro ao carregar bio:', err);
    return NextResponse.json(
      { error: 'Falha ao carregar configuração de bio' },
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

    if (!body.handle || !body.title) {
      return NextResponse.json(
        { error: 'Identificador (handle) e título da bio são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await upsertBioProfile(auth.organizationId, body);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Bio API] Erro ao salvar bio:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao salvar configuração de bio' },
      { status: 400 }
    );
  }
}
