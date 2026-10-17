import assert from 'node:assert';
import {
  formatAuditAction,
  serializeAuditLogsToCsv,
} from './service';
import { AuditLogEntry } from './types';

console.log('[TEST] Iniciando testes da Trilha de Auditoria do Workspace (Workspace Audit Logs)...');

// Teste 1: Tradução e formatação de ações de auditoria
assert.strictEqual(formatAuditAction('auth.login'), 'Login no Workspace');
assert.strictEqual(formatAuditAction('post.published'), 'Despachado com Sucesso');
assert.strictEqual(formatAuditAction('api_key.created'), 'Chave de API Gerada');
assert.strictEqual(formatAuditAction('member.role_updated'), 'Nível de Permissão Alterado');
assert.strictEqual(formatAuditAction('custom.unknown_event'), 'custom.unknown_event');
console.log('✅ Formatação e dicionário de ações auditáveis validados.');

// Teste 2: Serialização CSV e conformidade RFC 4180
const mockLogs: AuditLogEntry[] = [
  {
    id: 'aud_001',
    organizationId: 'org_alpha',
    actorId: 'usr_1',
    actorName: 'Eduardo "Dev" Silva',
    actorEmail: 'eduardo@empresa.com',
    action: 'post.created',
    category: 'content',
    entityType: 'post',
    entityId: 'post_999',
    details: { title: 'Post com vírgula, ok?' },
    ipAddress: '192.168.1.1',
    createdAt: '2026-10-16T20:00:00.000Z',
  },
  {
    id: 'aud_002',
    organizationId: 'org_alpha',
    actorId: null,
    actorName: 'Sistema',
    actorEmail: 'system@hupflow.com',
    action: 'api_key.revoked',
    category: 'security',
    entityType: 'api_key',
    entityId: 'apk_123',
    details: null,
    ipAddress: null,
    createdAt: '2026-10-16T20:15:00.000Z',
  },
];

const csv = serializeAuditLogsToCsv(mockLogs);
const lines = csv.split('\r\n');

assert(lines.length === 3, `CSV deve conter 3 linhas (header + 2 registros), obtido: ${lines.length}`);
assert(lines[0].startsWith('"ID","Data/Hora (ISO)"'), 'Header do CSV deve conter colunas esperadas');
assert(lines[1].includes('"aud_001"'), 'Registro aud_001 deve constar no CSV');
assert(lines[1].includes('""Dev""'), 'Aspas internas no nome do ator devem ser escapadas com aspas duplas RFC 4180');
assert(lines[2].includes('"aud_002"'), 'Registro aud_002 com valores nulos deve constar no CSV');
console.log('✅ Serializador CSV com escape RFC 4180 validado.');

console.log('✅ Todos os testes da Trilha de Auditoria passaram com 100% de sucesso!');
process.exit(0);
