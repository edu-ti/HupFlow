import { db } from '@/lib/db';
import { publishingDlq, posts, postChannels, socialAccounts } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import {
  DlqIncident,
  DlqErrorCategory,
  DlqStatus,
  DlqDiagnosisResult,
  DlqListResponse,
  DlqCounts,
} from './types';

/**
 * Analisa a mensagem de erro da rede social e retorna diagnóstico e ação recomendada.
 */
export function diagnosePublishingError(
  errorMessage: string,
  provider: string
): DlqDiagnosisResult {
  const msg = (errorMessage || '').toLowerCase();

  // 1. Falha de Autenticação / Token Expirado
  if (
    msg.includes('access token') ||
    msg.includes('expired') ||
    msg.includes('session') ||
    msg.includes('unauthorized') ||
    msg.includes('oauth') ||
    msg.includes('token_expired') ||
    msg.includes('invalid_token') ||
    msg.includes('permissions')
  ) {
    return {
      category: 'AUTH_EXPIRED',
      label: 'Token de Acesso Expirado',
      recommendedAction: `A permissão da conta do ${provider.toUpperCase()} expirou. Acesse a aba Contas Conectadas e clique em Reconectar para renovar a autorização.`,
      canRetry: false, // Requer reconexão prévia
    };
  }

  // 2. Mídia Incompatível ou Aspecto Fora dos Limites
  if (
    msg.includes('media') ||
    msg.includes('aspect ratio') ||
    msg.includes('dimension') ||
    msg.includes('resolution') ||
    msg.includes('filesize') ||
    msg.includes('file_size') ||
    msg.includes('unsupported format') ||
    msg.includes('image format') ||
    msg.includes('duration')
  ) {
    return {
      category: 'MEDIA_INVALID',
      label: 'Mídia ou Proporção Incompatível',
      recommendedAction:
        'A imagem ou vídeo não atende às exigências da rede social. Ajuste o aspecto para 1:1, 4:5 ou 9:16 e garanta peso inferior a 25MB para imagens.',
      canRetry: true,
    };
  }

  // 3. Rate Limit / Quota Excedida
  if (
    msg.includes('429') ||
    msg.includes('rate limit') ||
    msg.includes('too many requests') ||
    msg.includes('throttle') ||
    msg.includes('quota') ||
    msg.includes('user request limit')
  ) {
    return {
      category: 'RATE_LIMITED',
      label: 'Limite de Requisições da API Excedido',
      recommendedAction:
        'A API da rede social aplicou uma pausa temporária por excesso de requisições. Aguarde 15 a 30 minutos antes de tentar reenviar.',
      canRetry: true,
    };
  }

  // 4. Conteúdo Rejeitado / Política da Rede Social
  if (
    msg.includes('character limit') ||
    msg.includes('too long') ||
    msg.includes('duplicate content') ||
    msg.includes('policy') ||
    msg.includes('restricted') ||
    msg.includes('spam')
  ) {
    return {
      category: 'CONTENT_REJECTED',
      label: 'Texto Rejeitado por Diretrizes ou Tamanho',
      recommendedAction:
        'O texto ultrapassou o limite máximo de caracteres ou foi considerado duplicado pela rede social. Edite a publicação antes do reprocessamento.',
      canRetry: true,
    };
  }

  // 5. Instabilidade de Rede / Timeout
  if (
    msg.includes('timeout') ||
    msg.includes('502') ||
    msg.includes('503') ||
    msg.includes('504') ||
    msg.includes('econnreset') ||
    msg.includes('network') ||
    msg.includes('gateway')
  ) {
    return {
      category: 'NETWORK_TIMEOUT',
      label: 'Falha Transitória de Rede ou Gateway',
      recommendedAction:
        'Instabilidade temporária de comunicação entre os servidores. Este erro é seguro para reprocessamento imediato em 1 clique.',
      canRetry: true,
    };
  }

  // Fallback
  return {
    category: 'UNKNOWN',
    label: 'Erro Desconhecido da API',
    recommendedAction:
      'Inspecione os detalhes do erro bruto retornado pela rede social. Se o problema persistir, entre em contato com o suporte.',
    canRetry: true,
  };
}

/**
 * Registra um incidente de falha na DLQ para posterior triagem e reprocessamento.
 */
export async function recordDlqIncident(params: {
  organizationId: string;
  postId: string;
  channelId: string;
  provider: string;
  accountName: string;
  rawErrorMessage: string;
}): Promise<DlqIncident> {
  const diagnosis = diagnosePublishingError(params.rawErrorMessage, params.provider);
  const now = new Date();
  const id = `dlq_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // Verifica se já existe incidente para este canal
  const existing = await db
    .select()
    .from(publishingDlq)
    .where(
      and(
        eq(publishingDlq.postId, params.postId),
        eq(publishingDlq.channelId, params.channelId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const prev = existing[0];
    await db
      .update(publishingDlq)
      .set({
        rawErrorMessage: params.rawErrorMessage,
        errorCategory: diagnosis.category,
        recommendedAction: diagnosis.recommendedAction,
        status: 'pending',
        updatedAt: now,
      })
      .where(eq(publishingDlq.id, prev.id));

    return {
      id: prev.id,
      organizationId: prev.organizationId,
      postId: prev.postId,
      channelId: prev.channelId,
      provider: prev.provider,
      accountName: prev.accountName,
      errorCategory: diagnosis.category,
      rawErrorMessage: params.rawErrorMessage,
      recommendedAction: diagnosis.recommendedAction,
      retryCount: prev.retryCount,
      lastRetryAt: prev.lastRetryAt ? prev.lastRetryAt.toISOString() : null,
      status: 'pending',
      createdAt: prev.createdAt.toISOString(),
      updatedAt: now.toISOString(),
    };
  }

  await db.insert(publishingDlq).values({
    id,
    organizationId: params.organizationId,
    postId: params.postId,
    channelId: params.channelId,
    provider: params.provider,
    accountName: params.accountName,
    errorCategory: diagnosis.category,
    rawErrorMessage: params.rawErrorMessage,
    recommendedAction: diagnosis.recommendedAction,
    retryCount: 0,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    organizationId: params.organizationId,
    postId: params.postId,
    channelId: params.channelId,
    provider: params.provider,
    accountName: params.accountName,
    errorCategory: diagnosis.category,
    rawErrorMessage: params.rawErrorMessage,
    recommendedAction: diagnosis.recommendedAction,
    retryCount: 0,
    lastRetryAt: null,
    status: 'pending',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Lista incidentes da DLQ para um workspace com contadores consolidados.
 */
export async function listDlqIncidents(
  organizationId: string,
  filterStatus?: string
): Promise<DlqListResponse> {
  const allRows = await db
    .select({
      dlq: publishingDlq,
      post: {
        content: posts.content,
      },
    })
    .from(publishingDlq)
    .leftJoin(posts, eq(publishingDlq.postId, posts.id))
    .where(eq(publishingDlq.organizationId, organizationId))
    .orderBy(desc(publishingDlq.createdAt));

  const counts: DlqCounts = {
    pending: 0,
    retrying: 0,
    resolved: 0,
    dismissed: 0,
    total: allRows.length,
  };

  allRows.forEach((r) => {
    const st = r.dlq.status as DlqStatus;
    if (counts[st] !== undefined) {
      counts[st]++;
    }
  });

  const filtered = filterStatus && filterStatus !== 'all'
    ? allRows.filter((r) => r.dlq.status === filterStatus)
    : allRows;

  const incidents: DlqIncident[] = filtered.map(({ dlq, post }) => ({
    id: dlq.id,
    organizationId: dlq.organizationId,
    postId: dlq.postId,
    channelId: dlq.channelId,
    provider: dlq.provider,
    accountName: dlq.accountName,
    errorCategory: dlq.errorCategory as DlqErrorCategory,
    rawErrorMessage: dlq.rawErrorMessage,
    recommendedAction: dlq.recommendedAction,
    retryCount: dlq.retryCount,
    lastRetryAt: dlq.lastRetryAt ? dlq.lastRetryAt.toISOString() : null,
    status: dlq.status as DlqStatus,
    createdAt: dlq.createdAt.toISOString(),
    updatedAt: dlq.updatedAt.toISOString(),
    postContent: post?.content || undefined,
  }));

  return { incidents, counts };
}

/**
 * Executa o reprocessamento imediato de um incidente na DLQ.
 */
export async function retryDlqIncident(
  incidentId: string,
  organizationId: string,
  updatedContent?: string
): Promise<{ success: boolean; error?: string; status?: DlqStatus }> {
  const rows = await db
    .select()
    .from(publishingDlq)
    .where(
      and(
        eq(publishingDlq.id, incidentId),
        eq(publishingDlq.organizationId, organizationId)
      )
    )
    .limit(1);

  if (rows.length === 0) {
    return { success: false, error: 'Incidente não encontrado no workspace.' };
  }

  const incident = rows[0];
  const now = new Date();

  // 1. Atualizar conteúdo se fornecido
  if (updatedContent && updatedContent.trim()) {
    await db
      .update(postChannels)
      .set({ customContent: updatedContent.trim() })
      .where(eq(postChannels.id, incident.channelId));

    await db
      .update(posts)
      .set({ content: updatedContent.trim(), updatedAt: now })
      .where(eq(posts.id, incident.postId));
  }

  // 2. Reenfileirar o canal específico (status = pending)
  await db
    .update(postChannels)
    .set({
      status: 'pending',
      errorMessage: null,
    })
    .where(eq(postChannels.id, incident.channelId));

  // 3. Atualizar o post para scheduled/publishing imediato
  await db
    .update(posts)
    .set({
      status: 'scheduled',
      scheduledAt: now,
      errorMessage: null,
      updatedAt: now,
    })
    .where(eq(posts.id, incident.postId));

  // 4. Atualizar registro da DLQ para retrying
  await db
    .update(publishingDlq)
    .set({
      status: 'retrying',
      retryCount: incident.retryCount + 1,
      lastRetryAt: now,
      updatedAt: now,
    })
    .where(eq(publishingDlq.id, incident.id));

  return {
    success: true,
    status: 'retrying',
  };
}

/**
 * Descarta ou arquiva um incidente da DLQ.
 */
export async function dismissDlqIncident(
  incidentId: string,
  organizationId: string
): Promise<boolean> {
  const result = await db
    .update(publishingDlq)
    .set({
      status: 'dismissed',
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(publishingDlq.id, incidentId),
        eq(publishingDlq.organizationId, organizationId)
      )
    );

  return true;
}
