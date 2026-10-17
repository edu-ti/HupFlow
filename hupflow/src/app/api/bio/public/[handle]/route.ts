import { NextRequest, NextResponse } from 'next/server';
import { getPublicBioData, recordBioView } from '@/lib/bio/service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    if (!handle) {
      return NextResponse.json({ error: 'Handle não fornecido' }, { status: 400 });
    }

    const data = await getPublicBioData(handle);
    if (!data) {
      return NextResponse.json(
        { error: 'Página de bio não encontrada ou desativada' },
        { status: 404 }
      );
    }

    // Registra visualização da bio em background
    recordBioView(data.profile.id).catch((err) =>
      console.warn('[Bio Public] Falha ao registrar view:', err)
    );

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[Bio Public API] Erro:', err);
    return NextResponse.json(
      { error: 'Falha ao buscar página pública de bio' },
      { status: 500 }
    );
  }
}
