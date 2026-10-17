import assert from 'node:assert';
import { hasMinRole, canManageMember, ROLE_HIERARCHY } from './rbac';
import { OrgRole } from './types';

console.log('[TEST] Iniciando testes de RBAC e hierarquia de papéis...');

// 1. Testes de hierarquia numérica e hasMinRole
const roles: OrgRole[] = ['owner', 'admin', 'member', 'viewer'];

assert.strictEqual(ROLE_HIERARCHY.owner, 4);
assert.strictEqual(ROLE_HIERARCHY.admin, 3);
assert.strictEqual(ROLE_HIERARCHY.member, 2);
assert.strictEqual(ROLE_HIERARCHY.viewer, 1);

// Owner deve ter acesso a tudo
assert.strictEqual(hasMinRole('owner', 'owner'), true);
assert.strictEqual(hasMinRole('owner', 'admin'), true);
assert.strictEqual(hasMinRole('owner', 'member'), true);
assert.strictEqual(hasMinRole('owner', 'viewer'), true);

// Admin
assert.strictEqual(hasMinRole('admin', 'owner'), false);
assert.strictEqual(hasMinRole('admin', 'admin'), true);
assert.strictEqual(hasMinRole('admin', 'member'), true);
assert.strictEqual(hasMinRole('admin', 'viewer'), true);

// Member
assert.strictEqual(hasMinRole('member', 'owner'), false);
assert.strictEqual(hasMinRole('member', 'admin'), false);
assert.strictEqual(hasMinRole('member', 'member'), true);
assert.strictEqual(hasMinRole('member', 'viewer'), true);

// Viewer
assert.strictEqual(hasMinRole('viewer', 'owner'), false);
assert.strictEqual(hasMinRole('viewer', 'admin'), false);
assert.strictEqual(hasMinRole('viewer', 'member'), false);
assert.strictEqual(hasMinRole('viewer', 'viewer'), true);

console.log('✅ hasMinRole validado para todas as combinações de papéis.');

// 2. Testes de canManageMember (regras de segurança)
// Caso 1: Usuário tentando modificar a si mesmo
const selfManage = canManageMember('owner', 'usr_1', 'owner', 'usr_1', 'admin');
assert.strictEqual(selfManage.allowed, false);

// Caso 2: Tentativa de modificar o owner
const targetOwner = canManageMember('admin', 'usr_admin', 'owner', 'usr_owner', 'member');
assert.strictEqual(targetOwner.allowed, false);

// Caso 3: Membro comum tentando gerenciar outro membro
const memberManage = canManageMember('member', 'usr_mem1', 'member', 'usr_mem2', 'viewer');
assert.strictEqual(memberManage.allowed, false);

// Caso 4: Admin gerenciando member
const adminManageMember = canManageMember('admin', 'usr_admin', 'member', 'usr_mem', 'viewer');
assert.strictEqual(adminManageMember.allowed, true);

// Caso 5: Admin tentando gerenciar outro admin
const adminManageAdmin = canManageMember('admin', 'usr_admin1', 'admin', 'usr_admin2', 'member');
assert.strictEqual(adminManageAdmin.allowed, false);

// Caso 6: Admin tentando promover member para admin
const adminPromoteAdmin = canManageMember('admin', 'usr_admin', 'member', 'usr_mem', 'admin');
assert.strictEqual(adminPromoteAdmin.allowed, false);

// Caso 7: Owner gerenciando admin ou promovendo membro
const ownerManageAdmin = canManageMember('owner', 'usr_owner', 'admin', 'usr_admin', 'member');
assert.strictEqual(ownerManageAdmin.allowed, true);

const ownerPromoteAdmin = canManageMember('owner', 'usr_owner', 'member', 'usr_mem', 'admin');
assert.strictEqual(ownerPromoteAdmin.allowed, true);

console.log('✅ canManageMember e regras de proteção de Owner validadas com sucesso!');

console.log('✅ Todos os testes de RBAC passaram com 100% de sucesso!');
process.exit(0);
