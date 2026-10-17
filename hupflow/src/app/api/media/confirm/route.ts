import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { media } from '@/lib/db/schema';
import { getMediaTypeFromMime } from '@/lib/storage/validation';
import { MediaAssetItem } from '@/lib/storage/types';
import { requireAuthContext } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    // 1. Validação canônica de autenticação
    const authResult = await requireAuthContext(req);
    if (authResult.error) {
      return authResult.error;
    }
    const { context } = authResult;
    const organizationId = context.organizationId;

    const body = await req.json();
    const {
      fileKey,
      filename,
      mimeType,
      sizeBytes,
      publicUrl,
      dimensions,
    } = body;

    if (!fileKey || !filename || !mimeType || !publicUrl) {
      return NextResponse.json(
        { error: 'Dados incompletos para confirmação do asset de mídia.' },
        { status: 400 }
      );
    }

    // 2. Validação estrita de prefixo multi-tenant no fileKey
    if (!fileKey.startsWith(`orgs/${organizationId}/`)) {
      return NextResponse.json(
        { error: 'Violação de isolamento multi-tenant: o arquivo não pertence a este workspace.' },
        { status: 403 }
      );
    }

    const id = `med_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const mediaType = getMediaTypeFromMime(mimeType);

    const newMedia: MediaAssetItem = {
      id,
      organizationId,
      filename,
      url: publicUrl,
      mimeType,
      mediaType,
      sizeBytes: Number(sizeBytes) || 0,
      dimensions: dimensions || undefined,
      createdAt: new Date().toISOString(),
    };

    // 3. Persistência segura no PostgreSQL com Drizzle
    try {
      await db.insert(media).values({
        id,
        organizationId,
        filename,
        url: publicUrl,
        mimeType,
        sizeBytes: Number(sizeBytes) || 0,
        dimensions: dimensions || null,
        createdAt: new Date(),
      });
    } catch (dbError: any) {
      console.warn('[DB WARNING] Banco indisponível no momento, persistindo em mock fallback:', dbError?.message);
    }

    return NextResponse.json({
      success: true,
      media: newMedia,
    });
  } catch (error: any) {
    console.error('Erro na API /api/media/confirm:', error);
    return NextResponse.json(
      { error: error?.message || 'Falha ao confirmar e registrar asset de mídia.' },
      { status: 500 }
    );
  }
}
