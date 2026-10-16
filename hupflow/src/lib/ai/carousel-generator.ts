import { z } from 'zod';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const CarouselSlideSchema = z.object({
  slideNumber: z.number(),
  type: z.enum(['cover', 'content', 'quote', 'statistic', 'cta']),
  headline: z.string().describe('Título curto e magnético do slide'),
  bodyText: z.string().describe('Texto explicativo conciso, máximo 3 frases'),
  highlightText: z.string().optional().describe('Frase ou número chave a destacar'),
  suggestedIcon: z.string().optional().describe('Ícone temático Lucide'),
});

export const CarouselResultSchema = z.object({
  topic: z.string(),
  targetAudience: z.string(),
  colorPalette: z.object({
    background: z.string(),
    primaryText: z.string(),
    accentColor: z.string(),
  }),
  slides: z.array(CarouselSlideSchema).min(3).max(10),
});

export type CarouselResult = z.infer<typeof CarouselResultSchema>;

export async function generateCarouselFromPrompt(
  prompt: string,
  targetAudience: string = 'Profissionais e Empreendedores',
  slideCount: number = 5
): Promise<CarouselResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Retorno de fallback estruturado em desenvolvimento sem API key
    return {
      topic: prompt,
      targetAudience,
      colorPalette: {
        background: '#0B0F17',
        primaryText: '#F8FAFC',
        accentColor: '#6366F1',
      },
      slides: [
        {
          slideNumber: 1,
          type: 'cover',
          headline: `Como Dominar: ${prompt}`,
          bodyText: 'Guia definitivo e prático para transformar seus resultados.',
          highlightText: 'Deslize para ver ➔',
          suggestedIcon: 'Sparkles',
        },
        {
          slideNumber: 2,
          type: 'content',
          headline: 'O Grande Problema',
          bodyText: 'A maioria das abordagens tradicionais foca em métricas de vaidade sem gerar valor real.',
          highlightText: 'O erro comum',
          suggestedIcon: 'AlertCircle',
        },
        {
          slideNumber: 3,
          type: 'statistic',
          headline: 'O Impacto Real',
          bodyText: 'Estratégias orientadas a consistência superam esforços isolados em mais de 3x.',
          highlightText: '300% mais retenção',
          suggestedIcon: 'TrendingUp',
        },
        {
          slideNumber: 4,
          type: 'content',
          headline: 'O Plano de Ação',
          bodyText: 'Estruture seu processo com automação, design claro e narrativa persuasiva.',
          highlightText: '3 passos essenciais',
          suggestedIcon: 'CheckCircle2',
        },
        {
          slideNumber: 5,
          type: 'cta',
          headline: 'Gostou do Conteúdo?',
          bodyText: 'Salve este post para consultar depois e compartilhe com sua equipe!',
          highlightText: 'Salve & Compartilhe',
          suggestedIcon: 'Bookmark',
        },
      ],
    };
  }

  const openai = createOpenAI({ apiKey });

  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: CarouselResultSchema,
    prompt: `Crie um carrossel educativo e profissional de alto impacto sobre: "${prompt}".
Público-alvo: ${targetAudience}.
Quantidade de slides desejada: ${slideCount}.
Garanta ganchos fortes, texto conciso e excelente ritmo narrativo (Capa, Problema/Contexto, Insights acionáveis, Métricas e Chamada para Ação no último slide).`,
  });

  return result.object;
}
