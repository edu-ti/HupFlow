import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  listClientReports,
  getReportsPortfolioMetrics,
} from '@/lib/reports/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  const url = new URL(req.url);
  const brandSlug = url.searchParams.get('brandSlug') || undefined;

  const reports = await listClientReports(auth.organizationId, { brandSlug });
  const metrics = await getReportsPortfolioMetrics(auth.organizationId);

  return NextResponse.json({
    success: true,
    reports,
    metrics,
  });
}
