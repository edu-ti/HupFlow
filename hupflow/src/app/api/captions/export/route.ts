import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { exportToSrt, exportToVtt } from '@/lib/captions/service';
import { CaptionCue, CaptionExportFormat } from '@/lib/captions/types';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;

  try {
    const body = await req.json();
    const format: CaptionExportFormat = body.format === 'vtt' ? 'vtt' : 'srt';
    const cues: CaptionCue[] = Array.isArray(body.cues) ? body.cues : [];
    const rawTitle: string = body.title || 'legendas-hupflow';

    if (cues.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum segmento de legenda (cue) fornecido para exportação.' },
        { status: 400 }
      );
    }

    const safeSlug = rawTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) || 'legendas-hupflow';

    const content = format === 'vtt' ? exportToVtt(cues) : exportToSrt(cues);
    const filename = `${safeSlug}.${format}`;
    const mimeType = format === 'vtt' ? 'text/vtt' : 'application/x-subrip';

    return NextResponse.json({
      format,
      filename,
      mimeType,
      content,
    });
  } catch (err: any) {
    console.error('[Captions Export API] Erro ao exportar legendas:', err);
    return NextResponse.json(
      { error: 'Falha ao exportar arquivo de legendas' },
      { status: 500 }
    );
  }
}
