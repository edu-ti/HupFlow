import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  getBrandSafetyConfig,
  listCrisisIncidentLogs,
} from '@/lib/brandsafety/service';
import { summarizeBrandSafetyHealth } from '@/lib/brandsafety/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  const config = await getBrandSafetyConfig(auth.organizationId);
  const incidents = await listCrisisIncidentLogs(auth.organizationId);
  const health = summarizeBrandSafetyHealth(config);

  return NextResponse.json({
    success: true,
    config,
    health,
    recentIncidents: incidents,
  });
}
