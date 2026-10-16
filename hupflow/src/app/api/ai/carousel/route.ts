import { NextResponse } from 'next/server';
import { generateCarouselFromPrompt } from '@/lib/ai/carousel-generator';

export async function POST(req: Request) {
  try {
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
