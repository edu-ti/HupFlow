import { NextResponse } from 'next/server';
import { generateCarouselFromPrompt } from '@/lib/ai/carousel-generator';
import { requireAuthContext } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    // Validação de autenticação obrigatória
    const authResult = await requireAuthContext(req);
    if (authResult.error) {
      return authResult.error;
    }

    const body = await req.json();
    const { prompt, targetAudience, slideCount } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt é obrigatório.' }, { status: 400 });
    }

    const carousel = await generateCarouselFromPrompt(
      prompt,
      targetAudience || 'Profissionais e Empreendedores',
      slideCount ? Number(slideCount) : 5
    );

    return NextResponse.json(carousel);
  } catch (error: any) {
    console.error('Erro na API de geração de carrossel:', error);
    return NextResponse.json(
      { error: error?.message || 'Falha ao gerar carrossel com IA.' },
      { status: 500 }
    );
  }
}
