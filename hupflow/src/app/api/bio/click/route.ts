import { NextRequest, NextResponse } from 'next/server';
import { recordBioClick } from '@/lib/bio/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { linkId, profileId, referrer } = body;

    if (!linkId || !profileId) {
      return NextResponse.json(
        { error: 'linkId e profileId são obrigatórios' },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get('user-agent') || undefined;

    await recordBioClick(linkId, profileId, referrer, userAgent);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[Bio Click API] Erro ao registrar clique:', err);
    return NextResponse.json(
      { error: 'Falha ao registrar telemetria de clique' },
      { status: 500 }
    );
  }
}
