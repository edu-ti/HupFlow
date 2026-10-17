import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { getSystemDiagnostics } from '@/lib/system/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;

  const diagnostics = await getSystemDiagnostics();

  return NextResponse.json({
    success: true,
    ...diagnostics,
  });
}
