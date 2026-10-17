import assert from 'node:assert';
import {
  InboxChannel,
  InboxIntent,
  InboxPriority,
  InboxSentiment,
  InboxStats,
  SmartReplySuggestion,
  SocialInboxMessage,
} from './types';

/**
 * Classifica deterministicamente o conteúdo de um comentário ou menção social
 * em intenção, sentimento e prioridade de atendimento.
 */
export function classifyInboxMessage(rawText: string): {
  intent: InboxIntent;
  sentiment: InboxSentiment;
  priority: InboxPriority;
} {
  const text = (rawText || '').toLowerCase().trim();

  // 1. Detecção de Spam
  if (
    /\b(ganhe dinheiro f[áa]cil|cripto gr[áa]tis|clique no meu perfil urgente|forex garantido|sorteio pix)\b/i.test(
      text
    )
  ) {
    return { intent: 'spam', sentiment: 'neutral', priority: 'low' };
  }

  // 2. Detecção de Suporte / Reclamação (Alta Prioridade)
  if (
    /\b(erro|n[ãa]o funciona|bug|travou|problema|falha|reclama[çc][ãa]o|cancelei|suporte|ajuda urgente)\b/i.test(
      text
    )
  ) {
    return { intent: 'support', sentiment: 'negative', priority: 'high' };
  }

  // 3. Detecção de Oportunidade Comercial / Lead Intent (Alta Prioridade)
  if (
    /\b(pre[çc]o|valor|plano|or[çc]amento|contratar|como funciona o plano|ag[êe]ncia|demo|demonstra[çc][ãa]o|comprar|assinatura|proposta|quero testar)\b/i.test(
      text
    )
  ) {
    const isAlsoPositive =
      /\b(parab[ée]ns|incr[íi]vel|sensacional|excelente|amei|muito bom|top)\b/i.test(
        text
      );
    return {
      intent: 'lead_intent',
      sentiment: isAlsoPositive ? 'positive' : 'neutral',
      priority: 'high',
    };
  }

  // 4. Detecção de Elogio / Engajamento Positivo
  if (
    /\b(parab[ée]ns|incr[íi]vel|sensacional|excelente|amei|muito bom|top|brabo|perfeito|obrigado por compartilhar)\b/i.test(
      text
    )
  ) {
    return { intent: 'praise', sentiment: 'positive', priority: 'normal' };
  }

  // 5. Padrão: Pergunta / Comentário Geral
  return { intent: 'question', sentiment: 'neutral', priority: 'normal' };
}

/**
 * Interpola variáveis dinâmicas em templates de respostas rápidas
 */
export function interpolateReplyTemplate(
  template: string,
  vars: { authorName?: string; brandName?: string; channel?: string }
): string {
  const firstName = (vars.authorName || 'você').trim().split(' ')[0];
  const brand = (vars.brandName || 'HupFlow').trim();
  const channel = (vars.channel || 'rede social').trim();

  return template
    .replace(/\{\{\s*author_name\s*\}\}/gi, firstName)
    .replace(/\{\{\s*brand_name\s*\}\}/gi, brand)
    .replace(/\{\{\s*channel\s*\}\}/gi, channel);
}

/**
 * Gera 3 sugestões de respostas inteligentes contextualizadas com a intenção e o canal
 */
export function generateSmartReplies(
  message: Pick<
    SocialInboxMessage,
    'authorName' | 'channel' | 'intent' | 'content'
  >,
  brandName = 'HupFlow'
): SmartReplySuggestion[] {
  const firstName = (message.authorName || 'Olá').trim().split(' ')[0];
  const maxLen = message.channel === 'x' ? 275 : 800;

  const clamp = (str: string) =>
    str.length > maxLen ? str.slice(0, maxLen - 3) + '...' : str;

  switch (message.intent) {
    case 'lead_intent':
      return [
        {
          id: 'sr_lead_1',
          tone: 'consultative',
          label: 'Consultiva (Converter Lead)',
          text: clamp(
            `Olá ${firstName}! Que ótimo saber do seu interesse na ${brandName}. Temos planos sob medida para criadores e agências (incluindo Portais White-Label e Carrosséis IA). Posso te enviar os detalhes e um link de teste gratuito por DM? 🚀`
          ),
        },
        {
          id: 'sr_lead_2',
          tone: 'friendly',
          label: 'Amigável + Link na Bio',
          text: clamp(
            `Oi ${firstName}! Muito obrigado por acompanhar. Você pode conferir todos os planos e testar gratuitamente no link oficial da nossa bio! Qualquer dúvida sobre o plano ideal para sua operação, me chama aqui. 💬`
          ),
        },
        {
          id: 'sr_lead_3',
          tone: 'direct',
          label: 'Direta & Rápida',
          text: clamp(
            `Olá ${firstName}! Te enviei agora na DM os valores atualizados da ${brandName} e o acesso para demonstração. Confira lá! ⚡`
          ),
        },
      ];

    case 'support':
      return [
        {
          id: 'sr_sup_1',
          tone: 'consultative',
          label: 'Acolhedora & Solucionadora',
          text: clamp(
            `Olá ${firstName}, sentimos muito por esse contratempo! Nossa engenharia na ${brandName} já pode verificar sua conta imediatamente. Pode nos enviar seu e-mail de cadastro por DM para resolvermos com prioridade máxima? 🛠️`
          ),
        },
        {
          id: 'sr_sup_2',
          tone: 'direct',
          label: 'Triagem Rápida DM',
          text: clamp(
            `Oi ${firstName}! Vamos resolver isso agora mesmo. Te chamei na DM para coletar os detalhes técnicos e destravar seu fluxo.`
          ),
        },
        {
          id: 'sr_sup_3',
          tone: 'friendly',
          label: 'Status & Suporte Dedicado',
          text: clamp(
            `Obrigado pelo aviso, ${firstName}! Nosso time técnico está à disposição no suporte prioritário. Me manda um "oi" na DM que te acompanho pessoalmente nessa solução!`
          ),
        },
      ];

    case 'praise':
      return [
        {
          id: 'sr_praise_1',
          tone: 'friendly',
          label: 'Agradecimento + Pergunta de Engajamento',
          text: clamp(
            `Muito obrigado pelo carinho, ${firstName}! 🙌 Ficamos felizes demais que o conteúdo agregou. Qual desses pontos você já pretende aplicar essa semana?`
          ),
        },
        {
          id: 'sr_praise_2',
          tone: 'consultative',
          label: 'Nutrição de Comunidade',
          text: clamp(
            `Valeu demais, ${firstName}! Toda semana trazemos novos carrosséis e guias práticos aqui na ${brandName}. Continue acompanhando! 🚀`
          ),
        },
        {
          id: 'sr_praise_3',
          tone: 'direct',
          label: 'Curta & Calorosa',
          text: clamp(
            `Obrigado pelo feedback incrível, ${firstName}! Tamo junto! 🔥✨`
          ),
        },
      ];

    case 'spam':
      return [
        {
          id: 'sr_spam_1',
          tone: 'direct',
          label: 'Aviso Moderado',
          text: 'Agradecemos a visita, mas mantemos os comentários focados exclusivamente no tema da publicação.',
        },
      ];

    case 'question':
    default:
      return [
        {
          id: 'sr_q_1',
          tone: 'consultative',
          label: 'Explicativa & Didática',
          text: clamp(
            `Excelente pergunta, ${firstName}! Na ${brandName} recomendamos estruturar esse fluxo combinando consistência editorial e automação multicanal. Se quiser, posso detalhar melhor no próximo carrossel!`
          ),
        },
        {
          id: 'sr_q_2',
          tone: 'friendly',
          label: 'Engajadora',
          text: clamp(
            `Oi ${firstName}! Ótimo ponto! Isso funciona de forma 100% integrada no nosso estúdio. Conta pra gente: hoje você faz esse processo manualmente? 💡`
          ),
        },
        {
          id: 'sr_q_3',
          tone: 'direct',
          label: 'Objetiva',
          text: clamp(
            `Olá ${firstName}! Sim, exatamente! Temos um guia passo a passo no link da nossa bio explicando todos os detalhes. Confira lá! 👇`
          ),
        },
      ];
  }
}

/**
 * Calcula estatísticas agregadas do Social Inbox
 */
export function calculateInboxStats(
  messages: SocialInboxMessage[]
): InboxStats {
  const nonSpam = messages.filter((m) => m.intent !== 'spam');
  const totalMessages = messages.length;
  const unreadCount = messages.filter((m) => m.status === 'unread').length;
  const leadIntentCount = messages.filter(
    (m) => m.intent === 'lead_intent'
  ).length;
  const repliedCount = messages.filter((m) => m.status === 'replied').length;

  const responseRate =
    nonSpam.length > 0
      ? Number(
          (
            (nonSpam.filter((m) => m.status === 'replied').length /
              nonSpam.length) *
            100
          ).toFixed(1)
        )
      : 100;

  return {
    totalMessages,
    unreadCount,
    leadIntentCount,
    repliedCount,
    responseRate,
  };
}

// Bateria de Testes Unitários
async function runTests() {
  console.log(
    '[TEST] Iniciando bateria de testes do Unified Social Inbox & AI Smart Replies...'
  );

  // 1. Classificação Semântica de Intenção e Prioridade
  const leadMsg = classifyInboxMessage(
    'Parabéns pelo post! Qual o valor do plano para agência com 10 clientes?'
  );
  assert.strictEqual(leadMsg.intent, 'lead_intent');
  assert.strictEqual(leadMsg.priority, 'high');
  assert.strictEqual(leadMsg.sentiment, 'positive');

  const supMsg = classifyInboxMessage(
    'Estou com um erro ao conectar minha conta, não funciona o botão.'
  );
  assert.strictEqual(supMsg.intent, 'support');
  assert.strictEqual(supMsg.priority, 'high');
  assert.strictEqual(supMsg.sentiment, 'negative');

  const praiseMsg = classifyInboxMessage(
    'Conteúdo sensacional! Muito bom mesmo, amei o design.'
  );
  assert.strictEqual(praiseMsg.intent, 'praise');
  assert.strictEqual(praiseMsg.sentiment, 'positive');

  const spamMsg = classifyInboxMessage(
    'Ganhe dinheiro fácil com cripto grátis agora!'
  );
  assert.strictEqual(spamMsg.intent, 'spam');
  assert.strictEqual(spamMsg.priority, 'low');
  console.log('✅ Classificador semântico de intenção, sentimento e prioridade aprovado.');

  // 2. Interpolação de Templates Salvos
  const interpolated = interpolateReplyTemplate(
    'Olá {{author_name}}, bem-vindo à {{brand_name}} no {{channel}}!',
    { authorName: 'Eduardo Silva', brandName: 'HupFlow', channel: 'LinkedIn' }
  );
  assert.strictEqual(
    interpolated,
    'Olá Eduardo, bem-vindo à HupFlow no LinkedIn!'
  );
  console.log('✅ Interpolação de variáveis dinâmicas em templates aprovada.');

  // 3. Geração de Smart Replies com Limite de Caracteres por Rede
  const suggestions = generateSmartReplies(
    {
      authorName: 'Camila Rocha',
      channel: 'x',
      intent: 'lead_intent',
      content: 'Quero contratar o plano Pro!',
    },
    'HupFlow'
  );
  assert.strictEqual(suggestions.length, 3);
  assert.ok(suggestions[0].text.includes('Camila'));
  assert.ok(
    suggestions.every((s) => s.text.length <= 280),
    'Todas as respostas para X devem respeitar 280 caracteres'
  );
  console.log('✅ Gerador de Smart Replies IA e proteção de limite X (280c) aprovados.');

  // 4. Estatísticas de Inbox Zero
  const stats = calculateInboxStats([
    {
      id: 'm1',
      organizationId: 'org1',
      channel: 'linkedin',
      interactionType: 'comment',
      authorName: 'A',
      authorHandle: '@a',
      content: 'Preço?',
      intent: 'lead_intent',
      sentiment: 'neutral',
      priority: 'high',
      status: 'replied',
      receivedAt: 100,
      createdAt: 100,
    },
    {
      id: 'm2',
      organizationId: 'org1',
      channel: 'instagram',
      interactionType: 'comment',
      authorName: 'B',
      authorHandle: '@b',
      content: 'Dúvida?',
      intent: 'question',
      sentiment: 'neutral',
      priority: 'normal',
      status: 'unread',
      receivedAt: 200,
      createdAt: 200,
    },
  ]);
  assert.strictEqual(stats.totalMessages, 2);
  assert.strictEqual(stats.unreadCount, 1);
  assert.strictEqual(stats.leadIntentCount, 1);
  assert.strictEqual(stats.responseRate, 50.0);
  console.log('✅ Cálculo de métricas e Response Rate aprovado.');

  console.log(
    '🎉 Todos os testes unitários do Unified Social Inbox passaram com 100% de sucesso!'
  );
}

if (require.main === module) {
  runTests().catch((err) => {
    console.error('❌ Falha nos testes do Social Inbox:', err);
    process.exit(1);
  });
}
