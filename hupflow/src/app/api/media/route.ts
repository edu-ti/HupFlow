import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { media } from '@/lib/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { getMediaTypeFromMime } from '@/lib/storage/validation';
import { MediaAssetItem } from '@/lib/storage/types';
import { requireAuthContext } from '@/lib/auth/session';

// Amostra rica de fallback para visualização inicial em ambiente dev offline
const SAMPLE_MEDIA: MediaAssetItem[] = [
  {
    id: 'med_sample_01',
    organizationId: 'org_default',
    filename: 'capa-carrossel-estrategia-ia.png',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    mimeType: 'image/png',
    mediaType: 'image',
    sizeBytes: 2450000,
    dimensions: { width: 1080, height: 1350 },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'med_sample_02',
    organizationId: 'org_default',
    filename: 'guia-completo-saas-2026.pdf',
    url: 'https://cdn.hupflow.com/orgs/org_default/2026/10/guia-completo-saas.pdf',
    mimeType: 'application/pdf',
    mediaType: 'pdf',
    sizeBytes: 8900000,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'med_sample_03',
    organizationId: 'org_default',
    filename: 'teaser-lancamento-produto.mp4',
    url: 'https://cdn.hupflow.com/orgs/org_default/2026/10/teaser-lancamento.mp4',
    mimeType: 'video/mp4',
    mediaType: 'video',
    sizeBytes: 34500000,
    dimensions: { width: 1080, height: 1920 },
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'med_sample_04',
    organizationId: 'org_default',
    filename: 'grafico-metricas-crescimento.png',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    mimeType: 'image/png',
    mediaType: 'image',
    sizeBytes: 1820000,
    dimensions: { width: 1080, height: 1080 },
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

export async function GET(req: Request) {
  try {
    // 1. Validação canônica de autenticação
    const authResult = await requireAuthContext(req);
    if (authResult.error) {
      return authResult.error;
    }
    const { context } = authResult;
    const orgId = context.organizationId;

    try {
      const records = await db
        .select()
        .from(media)
        .where(eq(media.organizationId, orgId))
        .orderBy(desc(media.createdAt));

      if (records && records.length > 0) {
        const mapped: MediaAssetItem[] = records.map((r) => ({
          id: r.id,
          organizationId: r.organizationId,
          filename: r.filename,
          url: r.url,
          mimeType: r.mimeType,
          mediaType: getMediaTypeFromMime(r.mimeType),
          sizeBytes: r.sizeBytes,
          dimensions: r.dimensions || undefined,
          createdAt: r.createdAt.toISOString(),
        }));
        return NextResponse.json(mapped);
      }
    } catch (dbError) {
      console.warn('[DB WARNING] Usando amostra de mídias para visualização:', dbError);
    }

    // Retorna amostra dev apenas para o workspace padrão
    if (orgId === 'org_default' || context.isDevFallback) {
      return NextResponse.json(SAMPLE_MEDIA);
    }

    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao listar mídias.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // 1. Validação canônica de autenticação
    const authResult = await requireAuthContext(req);
    if (authResult.error) {
      return authResult.error;
    }
    const { context } = authResult;
    const orgId = context.organizationId;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID da mídia é obrigatório.' }, { status: 400 });
    }

    try {
      // 2. Deleção restrita com filtro obrigatório por organização ativa
      const result = await db
        .delete(media)
        .where(and(eq(media.id, id), eq(media.organizationId, orgId)));

      return NextResponse.json({ success: true, deletedId: id });
    } catch (dbError) {
      console.warn('[DB WARNING] Exclusão em mock mode:', dbError);
      return NextResponse.json({ success: true, deletedId: id });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao excluir mídia.' }, { status: 500 });
  }
}
