import { NextResponse } from 'next/server';
import { generateCopyAndHooks } from '@/lib/ai/copywriter';
import { requireAuthContext } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    // Validação de autenticação obrigatória
    const authResult = await requireAuthContext(req);
    if (authResult.error) {
      return authResult.error;
    }

    const body = await req.json();
    const { prompt, tone } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt é obrigatório.' }, { status: 400 });
    }

    const response = await generateCopyAndHooks(prompt, tone);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Erro na API de Copywriter:', error);
    return NextResponse.json(
      { error: error?.message || 'Falha ao gerar copy com IA.' },
      { status: 500 }
    );
  }
}
