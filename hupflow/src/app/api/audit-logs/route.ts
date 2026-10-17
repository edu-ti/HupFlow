import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  listAuditLogs,
  recordAuditLog,
  serializeAuditLogsToCsv,
} from '@/lib/audit/service';
import { AuditCategory, CreateAuditLogInput } from '@/lib/audit/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as AuditCategory | 'all' | null;
    const action = searchParams.get('action') || undefined;
    const search = searchParams.get('search') || undefined;
    const days = searchParams.get('days') ? Number(searchParams.get('days')) : undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 50;
    const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : 0;
    const isExport = searchParams.get('export') === 'csv';

    const result = await listAuditLogs(auth.organizationId, {
      category: category || undefined,
      action,
      search,
      days,
      limit: isExport ? 1000 : limit,
      offset: isExport ? 0 : offset,
    });

    if (isExport) {
      const csvContent = serializeAuditLogsToCsv(result.logs);
      const filename = `hupflow_audit_${auth.organizationId}_${new Date().toISOString().split('T')[0]}.csv`;

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Audit Logs API] Erro ao listar logs de auditoria:', err);
    return NextResponse.json({ error: 'Falha ao buscar logs de auditoria' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body: CreateAuditLogInput = await req.json();

    if (!body.action || !body.category || !body.entityType) {
      return NextResponse.json(
        { error: 'Campos action, category e entityType são obrigatórios.' },
        { status: 400 }
      );
    }

    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;

    const log = await recordAuditLog(
      auth.organizationId,
      {
        id: auth.user.id,
        name: auth.user.name,
        email: auth.user.email,
      },
      {
        ...body,
        ipAddress: body.ipAddress || clientIp,
      }
    );

    return NextResponse.json({ log }, { status: 201 });
  } catch (err: any) {
    console.error('[Audit Logs API] Erro ao gravar log de auditoria:', err);
    return NextResponse.json({ error: 'Falha ao gravar evento de auditoria' }, { status: 500 });
  }
}
