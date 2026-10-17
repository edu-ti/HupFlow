import { NextResponse } from 'next/server';

/**
 * Endpoint de suporte para desenvolvimento local e offline
 * Recebe o PUT do binário e retorna 200 OK sem necessidade de conexão com a Cloudflare
 */
export async function PUT(req: Request) {
  try {
    // Consome o stream/blob simulado
    const blob = await req.blob();
    return new NextResponse(null, {
      status: 200,
      headers: {
        'x-mock-storage-size': String(blob.size),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro no mock upload' }, { status: 500 });
  }
}
