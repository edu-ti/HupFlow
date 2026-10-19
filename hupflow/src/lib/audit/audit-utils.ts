import { AuditLogEntry } from './types';

/**
 * Traduz o código de ação de auditoria para um rótulo legível em português.
 */
export function formatAuditAction(action: string): string {
  const map: Record<string, string> = {
    'auth.login': 'Login no Workspace',
    'auth.logout': 'Logout efetuado',
    'post.created': 'Publicação Criada',
    'post.updated': 'Publicação Editada',
    'post.deleted': 'Publicação Excluída',
    'post.submitted': 'Submetido para Revisão',
    'post.approved': 'Publicação Aprovada',
    'post.rejected': 'Publicação Rejeitada',
    'post.published': 'Despachado com Sucesso',
    'post.failed': 'Falha na Publicação',
    'channel.connected': 'Canal Social Conectado',
    'channel.disconnected': 'Canal Social Desconectado',
    'member.invited': 'Membro Convidado',
    'member.removed': 'Membro Removido',
    'member.role_updated': 'Nível de Permissão Alterado',
    'api_key.created': 'Chave de API Gerada',
    'api_key.revoked': 'Chave de API Revogada',
    'webhook.created': 'Webhook Criado',
    'webhook.updated': 'Webhook Atualizado',
    'webhook.deleted': 'Webhook Excluído',
  };

  return map[action] || action;
}

/**
 * Converte um array de logs de auditoria em conteúdo CSV (RFC 4180).
 */
export function serializeAuditLogsToCsv(logs: AuditLogEntry[]): string {
  const headers = [
    'ID',
    'Data/Hora (ISO)',
    'Categoria',
    'Ação',
    'Ator',
    'Email do Ator',
    'Tipo de Entidade',
    'ID da Entidade',
    'Endereço IP',
    'Detalhes JSON',
  ];

  const escapeCsv = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const rows = logs.map((log) => [
    escapeCsv(log.id),
    escapeCsv(log.createdAt),
    escapeCsv(log.category),
    escapeCsv(formatAuditAction(log.action)),
    escapeCsv(log.actorName),
    escapeCsv(log.actorEmail),
    escapeCsv(log.entityType),
    escapeCsv(log.entityId || ''),
    escapeCsv(log.ipAddress || ''),
    escapeCsv(log.details),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}
