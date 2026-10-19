import { db } from '@/lib/db';
import { socialInboxMessages } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import {
  InboxChannel,
  InboxIntent,
  InboxInteractionType,
  InboxPriority,
  InboxSentiment,
  InboxStats,
  InboxStatus,
  SavedReplyMacro,
  SocialInboxMessage,
} from './types';
import {
  classifyInboxMessage,
  interpolateReplyTemplate,
  generateSmartReplies,
  calculateInboxStats,
} from './inbox-utils';

export {
  classifyInboxMessage,
  interpolateReplyTemplate,
  generateSmartReplies,
  calculateInboxStats,
};

const memoryInboxMessages = new Map<string, SocialInboxMessage[]>();

export const DEFAULT_SAVED_MACROS: SavedReplyMacro[] = [
  {
    id: 'macro_1',
    title: 'Enviar Planos & Demonstração',
    template:
      'Olá {{author_name}}! Obrigado pelo contato no {{channel}}. Te enviei os detalhes dos planos da {{brand_name}} e o link de acesso imediato na sua DM! 🚀',
  },
  {
    id: 'macro_2',
    title: 'Agradecer Engajamento no Carrossel',
    template:
      'Valeu demais pelo comentário, {{author_name}}! Ficamos muito felizes que esse carrossel ajudou sua operação. Qualquer dúvida, conte com a {{brand_name}}! 🙌',
  },
  {
    id: 'macro_3',
    title: 'Encaminhar para Suporte Prioritário',
    template:
      'Oi {{author_name}}, já acionamos nosso time técnico da {{brand_name}} para verificar isso imediatamente. Pode nos confirmar seu e-mail por DM? ⚡',
  },
];

function createDefaultDemoMessages(
  organizationId: string
): SocialInboxMessage[] {
  const now = Date.now();
  return [
    {
      id: 'msg_demo_1',
      organizationId,
      channel: 'linkedin',
      interactionType: 'comment',
      authorName: 'Ricardo Mendes',
      authorHandle: '@ricardomendes-b2b',
      postTitle: 'Carrossel PDF: 7 Automações de Vendas B2B com IA',
      content:
        'Excelente conteúdo! Qual o valor do plano Agency para gerenciarmos 12 clientes com os Portais White-Label?',
      intent: 'lead_intent',
      sentiment: 'positive',
      priority: 'high',
      status: 'unread',
      receivedAt: now - 1000 * 60 * 18,
      createdAt: now - 1000 * 60 * 18,
    },
    {
      id: 'msg_demo_2',
      organizationId,
      channel: 'instagram',
      interactionType: 'comment',
      authorName: 'Beatriz Lemos',
      authorHandle: '@bialemos.mkt',
      postTitle: 'Reels 9:16: Como Triplicar a Retenção nos Primeiros 3s',
      content:
        'Amei esse efeito de legenda estilo Hormozi! O HupFlow já exporta direto em arquivo SRT e VTT também?',
      intent: 'question',
      sentiment: 'positive',
      priority: 'normal',
      status: 'unread',
      receivedAt: now - 1000 * 60 * 45,
      createdAt: now - 1000 * 60 * 45,
    },
    {
      id: 'msg_demo_3',
      organizationId,
      channel: 'x',
      interactionType: 'mention',
      authorName: 'Lucas Dev',
      authorHandle: '@lucasdev_ts',
      postTitle: 'Thread: Arquitetura Clean-Room em 2026',
      content:
        'Estou tentando gerar o token da API pública mas recebi erro de permissão no meu usuário viewer, preciso de ajuda.',
      intent: 'support',
      sentiment: 'negative',
      priority: 'high',
      status: 'unread',
      receivedAt: now - 1000 * 60 * 110,
      createdAt: now - 1000 * 60 * 110,
    },
    {
      id: 'msg_demo_4',
      organizationId,
      channel: 'threads',
      interactionType: 'comment',
      authorName: 'Mariana Costa',
      authorHandle: '@maricosta.studio',
      postTitle: 'Bastidores do Estúdio 2D Fabric.js',
      content:
        'Sensacional! Melhor ferramenta de agendamento e criação de carrosséis que já testamos esse ano.',
      intent: 'praise',
      sentiment: 'positive',
      priority: 'normal',
      status: 'replied',
      replyText:
        'Muito obrigado pelo carinho, Mariana! 🙌 Ficamos felizes demais que o HupFlow esteja acelerando as entregas do seu estúdio!',
      repliedBy: 'Equipe HupFlow',
      repliedAt: now - 1000 * 60 * 120,
      receivedAt: now - 1000 * 60 * 180,
      createdAt: now - 1000 * 60 * 180,
    },
  ];
}

export async function listInboxMessages(
  organizationId: string,
  filters?: {
    status?: string | null;
    channel?: string | null;
    intent?: string | null;
  }
): Promise<{
  messages: SocialInboxMessage[];
  stats: InboxStats;
  macros: SavedReplyMacro[];
}> {
  let allMessages: SocialInboxMessage[] = [];

  try {
    const rows = await db
      .select()
      .from(socialInboxMessages)
      .where(eq(socialInboxMessages.organizationId, organizationId))
      .orderBy(desc(socialInboxMessages.receivedAt));

    if (rows.length > 0) {
      allMessages = rows.map((r) => ({
        id: r.id,
        organizationId: r.organizationId,
        channel: (r.channel as InboxChannel) || 'linkedin',
        interactionType:
          (r.interactionType as InboxInteractionType) || 'comment',
        authorName: r.authorName,
        authorHandle: r.authorHandle,
        authorAvatar: r.authorAvatar,
        postTitle: r.postTitle,
        content: r.content,
        intent: (r.intent as InboxIntent) || 'question',
        sentiment: (r.sentiment as InboxSentiment) || 'neutral',
        priority: (r.priority as InboxPriority) || 'normal',
        status: (r.status as InboxStatus) || 'unread',
        replyText: r.replyText,
        repliedBy: r.repliedBy,
        repliedAt: r.repliedAt ? new Date(r.repliedAt).getTime() : null,
        receivedAt: r.receivedAt ? new Date(r.receivedAt).getTime() : Date.now(),
        createdAt: r.createdAt ? new Date(r.createdAt).getTime() : Date.now(),
      }));
    }
  } catch (err) {
    console.warn('[InboxService] Fallback local ativado (listInboxMessages):', err);
  }

  if (allMessages.length === 0) {
    let memList = memoryInboxMessages.get(organizationId);
    if (!memList || memList.length === 0) {
      memList = createDefaultDemoMessages(organizationId);
      memoryInboxMessages.set(organizationId, memList);
    }
    allMessages = memList;
  }

  const stats = calculateInboxStats(allMessages);

  let filtered = [...allMessages];
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter((m) => m.status === filters.status);
  }
  if (filters?.channel && filters.channel !== 'all') {
    filtered = filtered.filter((m) => m.channel === filters.channel);
  }
  if (filters?.intent && filters.intent !== 'all') {
    filtered = filtered.filter((m) => m.intent === filters.intent);
  }

  return {
    messages: filtered,
    stats,
    macros: DEFAULT_SAVED_MACROS,
  };
}

export async function ingestInboxMessage(
  organizationId: string,
  payload: {
    channel: InboxChannel;
    interactionType?: InboxInteractionType;
    authorName: string;
    authorHandle?: string;
    postTitle?: string | null;
    content: string;
  }
): Promise<SocialInboxMessage> {
  const classification = classifyInboxMessage(payload.content);
  const now = new Date();
  const id = `msg_${Date.now()}`;

  const newMsg: SocialInboxMessage = {
    id,
    organizationId,
    channel: payload.channel || 'linkedin',
    interactionType: payload.interactionType || 'comment',
    authorName: payload.authorName.trim(),
    authorHandle:
      payload.authorHandle?.trim() ||
      `@${payload.authorName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    postTitle: payload.postTitle || 'Publicação Recente',
    content: payload.content.trim(),
    intent: classification.intent,
    sentiment: classification.sentiment,
    priority: classification.priority,
    status: 'unread',
    receivedAt: now.getTime(),
    createdAt: now.getTime(),
  };

  try {
    await db.insert(socialInboxMessages).values({
      id: newMsg.id,
      organizationId,
      channel: newMsg.channel,
      interactionType: newMsg.interactionType,
      authorName: newMsg.authorName,
      authorHandle: newMsg.authorHandle,
      postTitle: newMsg.postTitle,
      content: newMsg.content,
      intent: newMsg.intent,
      sentiment: newMsg.sentiment,
      priority: newMsg.priority,
      status: 'unread',
      receivedAt: now,
      createdAt: now,
    });
  } catch (err) {
    console.warn('[InboxService] Ingerindo mensagem em memória (fallback DB):', err);
    const list =
      memoryInboxMessages.get(organizationId) ||
      createDefaultDemoMessages(organizationId);
    list.unshift(newMsg);
    memoryInboxMessages.set(organizationId, list);
  }

  return newMsg;
}

export async function replyOrUpdateInboxMessage(
  organizationId: string,
  payload: {
    messageId: string;
    action: 'reply' | 'archive' | 'mark_unread';
    replyText?: string;
    repliedBy?: string;
  }
): Promise<SocialInboxMessage | null> {
  const now = new Date();
  const newStatus: InboxStatus =
    payload.action === 'reply'
      ? 'replied'
      : payload.action === 'archive'
      ? 'archived'
      : 'unread';

  try {
    const existing = await db
      .select()
      .from(socialInboxMessages)
      .where(
        and(
          eq(socialInboxMessages.id, payload.messageId),
          eq(socialInboxMessages.organizationId, organizationId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(socialInboxMessages)
        .set({
          status: newStatus,
          replyText:
            payload.action === 'reply'
              ? payload.replyText?.trim() || null
              : existing[0].replyText,
          repliedBy:
            payload.action === 'reply'
              ? payload.repliedBy || 'Equipe HupFlow'
              : existing[0].repliedBy,
          repliedAt: payload.action === 'reply' ? now : existing[0].repliedAt,
        })
        .where(eq(socialInboxMessages.id, payload.messageId));
    }
  } catch (err) {
    console.warn('[InboxService] Atualizando mensagem em memória:', err);
  }

  const list =
    memoryInboxMessages.get(organizationId) ||
    createDefaultDemoMessages(organizationId);
  const idx = list.findIndex((m) => m.id === payload.messageId);
  if (idx >= 0) {
    list[idx] = {
      ...list[idx],
      status: newStatus,
      replyText:
        payload.action === 'reply'
          ? payload.replyText?.trim() || list[idx].replyText
          : list[idx].replyText,
      repliedBy:
        payload.action === 'reply'
          ? payload.repliedBy || 'Equipe HupFlow'
          : list[idx].repliedBy,
      repliedAt: payload.action === 'reply' ? now.getTime() : list[idx].repliedAt,
    };
    memoryInboxMessages.set(organizationId, list);
    return list[idx];
  }

  return null;
}
