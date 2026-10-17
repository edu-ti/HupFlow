import {
  CampaignRequest,
  ScheduleSlot,
  GeneratedCampaignPost,
  CampaignSlide,
} from './types';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const EDITORIAL_ANGLES = [
  'O Diagnóstico do Problema & Impacto Real',
  'Mito vs Realidade do Mercado',
  'Guia Prático Passo a Passo',
  'Estudo de Caso & Métricas de Sucesso',
  'Checklist de Execução Imediata',
  'Os 3 Maiores Erros a Evitar a Todo Custo',
  'Framework & Método Recomendado',
  'Quebra de Objeção e Contraponto',
  'Tendências & O Futuro do Setor',
  'Chamada para Ação Estratégica (CTA)',
  'Bastidores & Lições Aprendidas na Prática',
  'Perguntas Frequentes & Respostas Diretas',
];

const CampaignPostSchema = z.object({
  angle: z.string(),
  headline: z.string(),
  content: z.string(),
  hashtags: z.array(z.string()),
  isCarousel: z.boolean(),
  slideCount: z.number().optional(),
  slides: z
    .array(
      z.object({
        slideNumber: z.number(),
        type: z.enum(['cover', 'content', 'quote', 'statistic', 'cta']),
        headline: z.string(),
        bodyText: z.string(),
        highlightText: z.string().optional(),
      })
    )
    .optional(),
});

const CampaignBatchSchema = z.object({
  posts: z.array(CampaignPostSchema),
});

/**
 * Gera um lote de posts coordenados com IA ou fallback determinístico robusto.
 */
export async function generateCampaignBatch(
  request: CampaignRequest,
  slots: ScheduleSlot[]
): Promise<GeneratedCampaignPost[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const openai = createOpenAI({ apiKey });
      const prompt = `Você é um Estrategista Chefe de Mídia Social B2B e Copywriter especializado em LinkedIn, Instagram e X.
Gere uma campanha de ${slots.length} postagens coordenadas e complementares sobre o tema:
"${request.theme}"
Público Alvo: ${request.targetAudience || 'Profissionais e Empreendedores'}
Quantidade de Posts: ${slots.length}
Incluir Carrosséis: ${request.includeCarousels ? 'Sim, alterne posts de texto simples e carrosséis com slides' : 'Não, apenas posts de texto'}

Cada post DEVE ter um ângulo editorial único da lista de arquétipos (Diagnóstico, Mito vs Realidade, Passo a Passo, Erros Comuns, etc.) sem repetir a mesma mensagem.`;

      const result = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: CampaignBatchSchema,
        prompt,
      });

      if (result.object.posts && result.object.posts.length > 0) {
        return slots.map((slot, index) => {
          const generated = result.object.posts[index] || result.object.posts[0];
          return {
            index: index + 1,
            scheduledAt: slot.date.toISOString(),
            dayOfWeekName: slot.dayOfWeekName,
            angle: generated.angle || EDITORIAL_ANGLES[index % EDITORIAL_ANGLES.length],
            headline: generated.headline,
            content: generated.content,
            hashtags: generated.hashtags || ['#HupFlow', '#Marketing', '#Conteudo'],
            isCarousel: generated.isCarousel,
            slideCount: generated.slides?.length,
            slides: generated.slides,
            postId: null,
          };
        });
      }
    } catch (err) {
      console.warn('Fallback ativado na geração de campanha com IA:', err);
    }
  }

  // Fallback determinístico rico para desenvolvimento local e ambiente offline
  const themeClean = request.theme.trim();
  const audience = request.targetAudience || 'Profissionais e Criadores';

  return slots.map((slot, index) => {
    const angle = EDITORIAL_ANGLES[index % EDITORIAL_ANGLES.length];
    const isCarousel = request.includeCarousels ? index % 2 === 0 : false;

    let headline = '';
    let body = '';
    let slides: CampaignSlide[] | undefined;

    switch (index % 4) {
      case 0:
        headline = `O Grande Desafio de ${themeClean} que ninguém comenta`;
        body = `A maioria dos ${audience} tenta resolver este problema da forma mais demorada e manual possível.\n\nDepois de analisar centenas de operações, o ponto cego fica evidente: a falta de um processo previsível.\n\nQual é a sua maior dificuldade com esse tema hoje? Compartilhe nos comentários! 👇`;
        break;
      case 1:
        headline = `Mito vs Realidade sobre ${themeClean}`;
        body = `❌ MITO: Você precisa passar horas todos os dias criando postagens avulsas.\n\n✅ REALIDADE: As marcas com maior engajamento planejam em lote com antecedência e focam na estratégia.\n\nEconomizar tempo não significa perder qualidade quando a sua mensagem é clara. Concorda?`;
        break;
      case 2:
        headline = `3 Passos Práticos para Dominar ${themeClean}`;
        body = `Aqui está o playbook que você pode aplicar ainda hoje:\n\n1. Identifique o gargalo principal da sua audiência.\n2. Simplifique a mensagem em tópicos acionáveis.\n3. Distribua consistentemente nos canais corretos.\n\nSalve este post para consultar depois! 📌`;
        break;
      default:
        headline = `Checklist de Execução: ${themeClean}`;
        body = `Antes de colocar sua estratégia no ar, valide estes 4 pontos:\n\n[ ] Proposta de valor clara no gancho inicial\n[ ] Formatação agradável e sem blocos densos de texto\n[ ] Chamada para ação objetiva\n[ ] Mídia de apoio de alta qualidade\n\nQual desses pontos você já domina?`;
        break;
    }

    if (isCarousel) {
      slides = [
        {
          slideNumber: 1,
          type: 'cover',
          headline,
          bodyText: `Guia prático para ${audience}. Deslize para aprender ➔`,
          highlightText: 'Playbook Oficial',
        },
        {
          slideNumber: 2,
          type: 'content',
          headline: '1. O Cenário Atual',
          bodyText: 'Identificar a raiz da ineficiência é o primeiro passo para obter resultados exponenciais.',
        },
        {
          slideNumber: 3,
          type: 'content',
          headline: '2. A Virada de Chave',
          bodyText: 'Ao substituir o improviso por processos previsíveis, a sua escala aumenta sem elevar custos.',
        },
        {
          slideNumber: 4,
          type: 'cta',
          headline: 'Pronto para Transformar sua Operação?',
          bodyText: 'Acompanhe nosso perfil para mais insights semanais sobre tecnologia e produtividade.',
          highlightText: 'Siga para mais',
        },
      ];
    }

    const tagBase = themeClean
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 15);

    const hashtags = [
      `#${tagBase || 'HupFlow'}`,
      '#Produtividade',
      '#Inovacao',
      '#Estrategia',
    ];

    return {
      index: index + 1,
      scheduledAt: slot.date.toISOString(),
      dayOfWeekName: slot.dayOfWeekName,
      angle,
      headline,
      content: `${headline}\n\n${body}\n\n${hashtags.join(' ')}`,
      hashtags,
      isCarousel,
      slideCount: slides?.length,
      slides,
      postId: null,
    };
  });
}
