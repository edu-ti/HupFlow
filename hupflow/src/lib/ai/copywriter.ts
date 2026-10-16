import { z } from 'zod';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const CopywriterResponseSchema = z.object({
  mainCaption: z.string().describe('Legenda principal balanceada para redes sociais'),
  hooks: z.array(
    z.object({
      category: z.enum(['curiosity', 'counter_intuitive', 'direct_result']),
      label: z.string(),
      text: z.string(),
    })
  ).length(3).describe('Três opções de ganchos magnéticos para a primeira linha'),
  networkVariations: z.object({
    linkedin: z.string().describe('Versão profissional com narrativa, espaçamento e pergunta reflexiva'),
    x_twitter: z.string().describe('Versão enxuta e incisiva até 280 caracteres'),
    instagram: z.string().describe('Versão visual com emojis moderados e chamada para salvar'),
    threads: z.string().describe('Versão conversacional, casual e engajadora'),
  }),
  hashtags: z.array(z.string()).describe('Lista de 5 a 8 hashtags estratégicas sem o símbolo #'),
});

export type CopywriterResponse = z.infer<typeof CopywriterResponseSchema>;

export async function generateCopyAndHooks(
  prompt: string,
  tone: 'professional' | 'casual' | 'provocative' | 'educational' = 'educational'
): Promise<CopywriterResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Fallback estruturado de alta qualidade para desenvolvimento sem API key
    return {
      mainCaption: `Construir consistência em mídias sociais não é sobre publicar todo dia — é sobre relevância repetida.\n\nAqui estão 3 princípios práticos que aprendi nos últimos anos:\n\n1. Clareza antes de complexidade\n2. Design limpo retém atenção\n3. Uma chamada para ação clara por post\n\nQual desses pontos mais desafia sua rotina hoje?`,
      hooks: [
        {
          category: 'curiosity',
          label: 'Curiosidade / Ponto Cego',
          text: 'O erro sutil que faz 85% dos criadores abandonarem suas estratégias no primeiro mês...',
        },
        {
          category: 'counter_intuitive',
          label: 'Contrário ao Senso Comum',
          text: 'Pare de tentar postar 3x ao dia. Faça isso no lugar e veja seu engajamento dobrar:',
        },
        {
          category: 'direct_result',
          label: 'Resultado Direto',
          text: 'Como estruturar semanas de conteúdo relevante em apenas 45 minutos (passo a passo):',
        },
      ],
      networkVariations: {
        linkedin: `Construir consistência em mídias sociais não é sobre postar em excesso — é sobre relevância sustentável.\n\nDepois de analisar dezenas de estratégias digitais, o padrão se repete:\n\n• O conteúdo que educa gera autoridade real.\n• A formatação limpa respeita o tempo do leitor.\n• Uma boa reflexão no final abre conversas de alto valor nos comentários.\n\nComo você tem dosado frequência e profundidade nas suas publicações?`,
        x_twitter: `Postar todo dia sem estratégia só queima sua audiência.\n\n3 regras que mudam o jogo:\n1. 1 ideia central por post\n2. Gancho magnético na 1ª linha\n3. Espaços em branco importam\n\nQual regra você mais negligencia?`,
        instagram: `Menos ruído, mais conexão. ✨\n\nSalvar este post vai te economizar horas de bloqueio criativo na próxima semana. Quando você domina a estrutura antes de escrever, cada publicação ganha um propósito real.\n\n📌 Salve para aplicar no seu próximo post!\n💬 Qual o seu maior desafio de conteúdo hoje?`,
        threads: `Uma verdade que demorei para aceitar: se seu gancho não for bom, ninguém lê o resto, por mais incrível que seja o texto. Alguém mais sente isso?`,
      },
      hashtags: ['Produtividade', 'MarketingDigital', 'CriadoresDeConteudo', 'GestaoDeMidias', 'Empreendedorismo'],
    };
  }

  const openai = createOpenAI({ apiKey });

  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: CopywriterResponseSchema,
    prompt: `Atue como um Copywriter de classe mundial e estrategista de redes sociais.
Tema do post: "${prompt}".
Tom de voz desejado: ${tone}.

Forneça:
1. Uma legenda principal estruturada e cativante.
2. Exatamente 3 ganchos (hooks) de abertura (Curiosidade, Contrário ao senso comum, Resultado direto).
3. Adaptações específicas para cada plataforma (LinkedIn, X/Twitter com máx 280 chars, Instagram e Threads).
4. Uma lista de hashtags altamente relevantes.`,
  });

  return result.object;
}
