import { OrgRole, AuthContext } from './types';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from './session';

export const ROLE_HIERARCHY: Record<OrgRole, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
};

/**
 * Verifica se um papel de usuário possui o nível mínimo requerido na hierarquia.
 */
export function hasMinRole(userRole: OrgRole, requiredRole: OrgRole): boolean {
  const userWeight = ROLE_HIERARCHY[userRole] ?? 0;
  const requiredWeight = ROLE_HIERARCHY[requiredRole] ?? 999;
  return userWeight >= requiredWeight;
}

/**
 * Verifica se um usuário (ator) possui autorização para gerenciar ou alterar o papel de outro membro (alvo).
 */
export function canManageMember(
  actorRole: OrgRole,
  actorUserId: string,
  targetRole: OrgRole,
  targetUserId: string,
  newRole?: OrgRole
): { allowed: boolean; reason?: string } {
  if (actorUserId === targetUserId) {
    return { allowed: false, reason: 'Você não pode alterar seu próprio papel ou se auto-remover.' };
  }

  if (targetRole === 'owner') {
    return { allowed: false, reason: 'O proprietário (owner) da organização não pode ser modificado ou removido.' };
  }

  if (!hasMinRole(actorRole, 'admin')) {
    return { allowed: false, reason: 'Apenas administradores e proprietários podem gerenciar membros.' };
  }

  if (actorRole === 'admin') {
    if (targetRole === 'admin') {
      return { allowed: false, reason: 'Administradores não podem modificar outros administradores. Apenas o proprietário possui essa permissão.' };
    }
    if (newRole && hasMinRole(newRole, 'admin')) {
      return { allowed: false, reason: 'Apenas o proprietário pode promover membros para Administrador ou Proprietário.' };
    }
  }

  return { allowed: true };
}

/**
 * Helper para Route Handlers: exige que o usuário esteja autenticado E possua um papel mínimo no workspace.
 */
export async function requireOrgRole(
  req: NextRequest,
  minRole: OrgRole
): Promise<{ auth: AuthContext } | { response: NextResponse }> {
  const auth = await getAuthContext(req);

  if (!auth) {
    return {
      response: NextResponse.json(
        { error: 'Não autorizado. Sessão necessária.', code: 'UNAUTHORIZED' },
        { status: 401 }
      ),
    };
  }

  if (!hasMinRole(auth.organizationRole, minRole)) {
    return {
      response: NextResponse.json(
        {
          error: `Acesso negado. Esta ação requer permissão mínima de '${minRole}'. Seu nível atual é '${auth.organizationRole}'.`,
          code: 'FORBIDDEN',
        },
        { status: 403 }
      ),
    };
  }

  return { auth };
}
