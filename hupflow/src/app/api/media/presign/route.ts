import { NextResponse } from 'next/server';
import { createPresignedUploadUrl } from '@/lib/storage/r2-client';
import { validateMediaFile } from '@/lib/storage/validation';
import { requireAuthContext } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    // 1. Validação canônica de autenticação e contexto de organização
    const authResult = await requireAuthContext(req);
    if (authResult.error) {
      return authResult.error;
    }
    const { context } = authResult;

    const body = await req.json();
    const { filename, mimeType, sizeBytes } = body;

    if (!filename || !mimeType || sizeBytes === undefined) {
      return NextResponse.json(
        { error: 'Campos "filename", "mimeType" e "sizeBytes" são obrigatórios.' },
        { status: 400 }
      );
    }

    // 2. Validação estrita de formato e limites de peso
    const validation = validateMediaFile(filename, mimeType, Number(sizeBytes));
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 3. Emissão da URL pré-assinada amarrada estritamente ao organizationId da sessão
    const presigned = await createPresignedUploadUrl({
      organizationId: context.organizationId,
      filename,
      mimeType,
      sizeBytes: Number(sizeBytes),
    });

    return NextResponse.json(presigned);
  } catch (error: any) {
    console.error('Erro na API /api/media/presign:', error);
    return NextResponse.json(
      { error: error?.message || 'Falha ao gerar URL de upload pré-assinada.' },
      { status: 500 }
    );
  }
}
