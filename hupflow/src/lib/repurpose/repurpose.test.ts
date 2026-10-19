import {
  RepurposingSourceType,
  RepurposingTone,
  CarouselSlideItem,
  XThreadTweet,
  VerticalReelScript,
  ExecutiveNewsletter,
  ContentRepurposingKit,
  RepurposingSummaryMetrics,
} from './types';

export function decomposeLongFormContent(rawText: string) {
  const words = rawText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const sentences = rawText
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  const mainThesis = sentences[0] || 'Transforme processos manuais em fluxos automatizados de alto impacto.';
  const pillar1 = sentences[1] || 'Elimine redundâncias operacionais com orquestração inteligente.';
  const pillar2 = sentences[2] || 'Garanta consistência e retenção de marca em todos os pontos de contato.';
  const pillar3 = sentences[3] || 'Meça resultados com métricas de conversão e engajamento em tempo real.';

  return {
    wordCount,
    sentences,
    mainThesis,
    pillar1,
    pillar2,
    pillar3,
  };
}

export function generateCarouselSlides(
  title: string,
  rawText: string,
  tone: RepurposingTone = 'authoritative'
): CarouselSlideItem[] {
  const decomposed = decomposeLongFormContent(rawText);
  const prefix = tone === 'casual_storytelling' ? 'Bate-papo:' : tone === 'provocative_growth' ? 'Alerta:' : 'Guia Executivo:';

  return [
    {
      slideNumber: 1,
      badge: `${prefix} VISÃO GERAL`,
      headline: title,
      body: `Descubra como dominar esse princípio em 5 minutos. Deslize para entender o método.`,
      visualCue: 'Fundo escuro, tipografia grande em destaque, seta indicando deslize à direita.',
    },
    {
      slideNumber: 2,
      badge: 'O PROBLEMA OCULTO',
      headline: 'Por que a maioria das equipes falha?',
      body: `A maioria das abordagens tradicionais ignora um gargalo central: ${decomposed.pillar1}`,
      visualCue: 'Ícone de alerta vermelho suave, gráfico de dispersão com baixa eficiência.',
    },
    {
      slideNumber: 3,
      badge: 'PILARES FUNDAMENTAIS - 01',
      headline: 'A Regra de Ouro da Estrutura',
      body: `${decomposed.mainThesis} Sem essa base, qualquer esforço de escala perde tração.`,
      visualCue: 'Diagrama de 3 blocos empilhados com destaque para o bloco inferior.',
    },
    {
      slideNumber: 4,
      badge: 'PILARES FUNDAMENTAIS - 02',
      headline: 'Execução e Repetibilidade',
      body: `${decomposed.pillar2} Crie rotinas previsíveis e delegáveis para acelerar o aprendizado.`,
      visualCue: 'Linha do tempo circular mostrando iteração contínua sem atrito.',
    },
    {
      slideNumber: 5,
      badge: 'PILARES FUNDAMENTAIS - 03',
      headline: 'Medição e Otimização',
      body: `${decomposed.pillar3} Não ajuste o que você não consegue auditar de ponta a ponta.`,
      visualCue: 'Card minimalista com score card numérico e indicador de crescimento verde.',
    },
    {
      slideNumber: 6,
      badge: 'CHECKLIST RÁPIDO',
      headline: 'Plano de Ação em 3 Passos',
      body: '1. Audite seu fluxo atual.\n2. Aplique o framework de forma isolada.\n3. Meça a tração em 7 dias.',
      visualCue: 'Três caixas de verificação com ícones verdes de sucesso e tipografia limpa.',
    },
    {
      slideNumber: 7,
      badge: 'CONCLUSÃO & AÇÃO',
      headline: 'Pronto para Implementar?',
      body: 'Salve este carrossel para consultar na sua próxima sessão estratégica e compartilhe com seu time.',
      visualCue: 'Ícone de marcador/salvar em destaque, avatar do autor e chamada de comentários.',
    },
  ];
}

export function generateXThread(
  title: string,
  rawText: string,
  tone: RepurposingTone = 'authoritative'
): XThreadTweet[] {
  const decomposed = decomposeLongFormContent(rawText);
  const toneHook =
    tone === 'provocative_growth'
      ? 'A maioria está fazendo isso completamente errado.'
      : tone === 'casual_storytelling'
      ? 'Passei os últimos meses testando isso na prática.'
      : 'Um framework direto para quem precisa de resultados:';

  const t1 = `🧵 ${title.toUpperCase()}\n\n${toneHook}\n\nAqui está a síntese exata do que realmente funciona (1/5):`;
  const t2 = `1/ O erro invisível:\n\n${decomposed.pillar1}\n\nQuando você remove essa fricção, a velocidade da equipe dobra quase que imediatamente. (2/5)`;
  const t3 = `2/ A fundação:\n\n${decomposed.mainThesis}\n\nFoque em consistência operacional antes de tentar qualquer truque de escala artificial. (3/5)`;
  const t4 = `3/ O divisor de águas:\n\n${decomposed.pillar2}\n\n${decomposed.pillar3} (4/5)`;
  const t5 = `Resumo executivo:\n\n• Clareza de tese\n• Execução disciplinada\n• Auditoria de dados\n\nCurtiu? Dê RT no 1º tweet e comente sua experiência! 🚀 (5/5)`;

  const rawTweets = [
    { num: 1, text: t1, hookType: 'contrarian' as const },
    { num: 2, text: t2, hookType: 'question' as const },
    { num: 3, text: t3, hookType: 'data_nugget' as const },
    { num: 4, text: t4, hookType: 'data_nugget' as const },
    { num: 5, text: t5, hookType: 'takeaway' as const },
  ];

  return rawTweets.map(item => {
    // Truncate safely if it somehow exceeds 280
    const finalContent = item.text.length > 280 ? item.text.slice(0, 276) + '...' : item.text;
    return {
      tweetNumber: item.num,
      content: finalContent,
      charCount: finalContent.length,
      hookType: item.hookType,
    };
  });
}

export function generateVerticalReelScript(
  title: string,
  rawText: string,
  _tone: RepurposingTone = 'authoritative'
): VerticalReelScript {
  const decomposed = decomposeLongFormContent(rawText);

  return {
    durationSeconds: 60,
    hook: {
      durationSec: 3,
      spokenLine: `Pare de perder tempo com isso. Se você quer dominar ${title}, assista até o final.`,
      onScreenText: `ATENÇÃO: Segredo de ${title.slice(0, 24)}...`,
      bRollVisual: 'Corte rápido para close do apresentador com expressão séria e zoom digital rápido.',
    },
    keyPoints: [
      {
        timestampSec: 3,
        title: 'O Mito Comum',
        actionCue: 'Gesto de corte com a mão, tela com filtro preto e branco de 1 segundo.',
        spokenText: `Primeiro erro: acreditar que volume supera método. ${decomposed.pillar1}`,
      },
      {
        timestampSec: 20,
        title: 'O Ponto de Virada',
        actionCue: 'Apresentador aponta para a direita com pop-up de infográfico animado.',
        spokenText: `O que os melhores times fazem diferente: ${decomposed.mainThesis} É simples e reproduzível.`,
      },
      {
        timestampSec: 40,
        title: 'A Regra Prática',
        actionCue: 'Troca de ângulo de câmera para visão lateral com foco em anotação.',
        spokenText: `Aplique esta regra hoje: ${decomposed.pillar2} e audite a resposta.`,
      },
    ],
    callToAction: {
      durationSec: 5,
      spokenLine: 'Comente "MATRIZ" aqui embaixo que eu te envio o checklist completo no privado.',
      stickerOrGraphic: 'Sticker de balão de comentário piscando com a palavra MATRIZ.',
    },
  };
}

export function generateExecutiveNewsletter(
  title: string,
  rawText: string,
  _tone: RepurposingTone = 'authoritative'
): ExecutiveNewsletter {
  const decomposed = decomposeLongFormContent(rawText);

  return {
    subjectLine: `[Edição Estratégica] ${title}`,
    previewText: `Como transformar teoria em execução prática com 3 lições diretas.`,
    greeting: 'Olá, líder e estrategista,',
    coreInsight: decomposed.mainThesis,
    keyBulletTakeaways: [
      `1. O Gargalo Operacional: ${decomposed.pillar1}`,
      `2. O Framework Recomendado: ${decomposed.pillar2}`,
      `3. A Métrica de Sucesso: ${decomposed.pillar3}`,
    ],
    ctaButtonText: 'Acessar Workspace Completo',
    ctaUrl: 'https://hupflow.com/dashboard/repurpose',
    readingTimeMinutes: Math.max(2, Math.ceil(decomposed.wordCount / 200)),
  };
}

export function summarizeRepurposingPortfolio(kits: ContentRepurposingKit[]): RepurposingSummaryMetrics {
  const totalKits = kits.length;
  const totalSlidesGenerated = kits.reduce((acc, k) => acc + (k.carouselSlides?.length || 0), 0);
  const totalTweetsGenerated = kits.reduce((acc, k) => acc + (k.xThread?.length || 0), 0);
  const totalReelScriptsGenerated = kits.reduce((acc, k) => acc + (k.reelScript ? 1 : 0), 0);
  const totalNewslettersGenerated = kits.reduce((acc, k) => acc + (k.newsletter ? 1 : 0), 0);
  const totalMinutes = kits.reduce((acc, k) => acc + (k.estimatedTimeSavedMinutes || 240), 0);

  return {
    totalKits,
    totalSlidesGenerated,
    totalTweetsGenerated,
    totalReelScriptsGenerated,
    totalNewslettersGenerated,
    totalHoursSaved: Math.round((totalMinutes / 60) * 10) / 10,
  };
}

// ----------------------------------------------------
// Test Suite Execution
// ----------------------------------------------------
function runRepurposeUnitTests() {
  console.log('--- Running Feature 042 Content Repurposing Matrix Unit Tests ---');

  const sampleRawText = `
    A distribuição de conteúdo omnicanal é a maior alavanca de crescimento sustentável em 2026.
    A maioria das marcas comete o erro de criar conteúdo do zero para cada rede social, queimando orçamento e esgotando a equipe.
    O segredo consiste em produzir uma peça profunda e depois desmembrá-la de forma cirúrgica para cada mídia nativa.
    Com uma esteira automatizada, 1 vídeo de 20 minutos se converte em 7 dias de presença dominante sem esforço duplicado.
    Comece hoje catalogando seus 3 melhores conteúdos do último trimestre.
  `;

  // 1. Decompose
  const decomposed = decomposeLongFormContent(sampleRawText);
  if (decomposed.wordCount < 40) throw new Error(`Expected wordCount >= 40, got ${decomposed.wordCount}`);
  if (!decomposed.mainThesis.includes('distribuição')) throw new Error('Main thesis extraction failed');

  // 2. Carousel Slides
  const slides = generateCarouselSlides('Framework de Multiplicação de Conteúdo', sampleRawText, 'authoritative');
  if (slides.length !== 7) throw new Error(`Expected 7 carousel slides, got ${slides.length}`);
  if (slides[0].slideNumber !== 1 || slides[6].slideNumber !== 7) throw new Error('Slide numbering mismatch');
  if (!slides[6].badge.includes('AÇÃO')) throw new Error('Slide 7 badge mismatch');

  // 3. X Thread
  const thread = generateXThread('Framework de Multiplicação de Conteúdo', sampleRawText, 'provocative_growth');
  if (thread.length !== 5) throw new Error(`Expected 5 tweets, got ${thread.length}`);
  for (const tweet of thread) {
    if (tweet.charCount > 280) throw new Error(`Tweet ${tweet.tweetNumber} exceeds 280 chars: ${tweet.charCount}`);
  }

  // 4. Vertical Reel Script
  const reel = generateVerticalReelScript('Multiplicação de Conteúdo', sampleRawText, 'authoritative');
  if (reel.durationSeconds !== 60) throw new Error('Expected 60s reel duration');
  if (reel.hook.durationSec !== 3) throw new Error('Expected 3s hook');
  if (reel.keyPoints.length !== 3) throw new Error(`Expected 3 key points, got ${reel.keyPoints.length}`);

  // 5. Executive Newsletter
  const newsletter = generateExecutiveNewsletter('Multiplicação de Conteúdo', sampleRawText);
  if (!newsletter.subjectLine.includes('Edição Estratégica')) throw new Error('Newsletter subject line mismatch');
  if (newsletter.keyBulletTakeaways.length < 3) throw new Error('Newsletter must have at least 3 bullet points');

  // 6. Portfolio Metrics
  const mockKit: ContentRepurposingKit = {
    id: 'rep-001',
    organizationId: 'org-test',
    title: 'Multiplicação de Conteúdo',
    sourceType: 'youtube_transcript',
    sourceWordCount: decomposed.wordCount,
    tone: 'authoritative',
    status: 'approved',
    carouselSlides: slides,
    xThread: thread,
    reelScript: reel,
    newsletter: newsletter,
    tags: ['ia', 'crescimento', 'repurpose'],
    estimatedTimeSavedMinutes: 240,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const metrics = summarizeRepurposingPortfolio([mockKit, mockKit]);
  if (metrics.totalKits !== 2) throw new Error(`Expected 2 kits, got ${metrics.totalKits}`);
  if (metrics.totalSlidesGenerated !== 14) throw new Error(`Expected 14 slides, got ${metrics.totalSlidesGenerated}`);
  if (metrics.totalTweetsGenerated !== 10) throw new Error(`Expected 10 tweets, got ${metrics.totalTweetsGenerated}`);
  if (metrics.totalReelScriptsGenerated !== 2) throw new Error(`Expected 2 reel scripts, got ${metrics.totalReelScriptsGenerated}`);
  if (metrics.totalNewslettersGenerated !== 2) throw new Error(`Expected 2 newsletters, got ${metrics.totalNewslettersGenerated}`);
  if (metrics.totalHoursSaved !== 8) throw new Error(`Expected 8 hours saved, got ${metrics.totalHoursSaved}`);

  console.log('✅ All Feature 042 Content Repurposing Matrix unit tests passed successfully!');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('repurpose.test')) {
  runRepurposeUnitTests();
}
