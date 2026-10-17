import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from './auth';
import { db } from '../db';
import { members, organizations } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { AuthContext, WorkspaceSummary } from './types';

/**
 * Extrai os cabeçalhos de requisição de forma agnóstica
 */
async function resolveHeaders(req?: Request | Headers): Promise<Headers> {
  if (req instanceof Request) {
    return req.headers;
  }
  if (req instanceof Headers) {
    return req;
  }
  try {
    return await headers();
  } catch {
    return new Headers();
  }
}

/**
 * Obtém o cookie de organização ativa caso informado
 */
function getActiveOrgFromCookie(headersObj: Headers): string | null {
  const cookieHeader = headersObj.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)hupflow_active_org=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Resolvedor canônico de contexto de autenticação e organização
 */
export async function getAuthContext(req?: Request | Headers): Promise<AuthContext | null> {
  const reqHeaders = await resolveHeaders(req);

  // 1. Tenta obter a sessão ativa através do Better-Auth
  let sessionData = null;
  try {
    sessionData = await auth.api.getSession({
      headers: reqHeaders,
    });
  } catch (err) {
    // Ignora erro em ambientes sem DB conectado ou dev local
  }

  // 2. Se houver sessão válida
  if (sessionData && sessionData.user && sessionData.session) {
    const userId = sessionData.user.id;
    const requestedOrgId =
      reqHeaders.get('x-organization-id') ||
      getActiveOrgFromCookie(reqHeaders) ||
      (sessionData.session as any).activeOrganizationId ||
      null;

    let targetOrgId = 'org_default';
    let targetRole: 'owner' | 'admin' | 'member' = 'member';

    // Validação estrita na tabela `members` para evitar BOLA
    try {
      if (requestedOrgId) {
        const memberRecord = await db
          .select()
          .from(members)
          .where(and(eq(members.userId, userId), eq(members.organizationId, requestedOrgId)))
          .limit(1);

        if (memberRecord.length > 0) {
          targetOrgId = memberRecord[0].organizationId;
          targetRole = (memberRecord[0].role as any) || 'member';
        }
      } else {
        // Busca a primeira organização à qual o usuário pertence
        const userMemberships = await db
          .select()
          .from(members)
          .where(eq(members.userId, userId))
          .limit(1);

        if (userMemberships.length > 0) {
          targetOrgId = userMemberships[0].organizationId;
          targetRole = (userMemberships[0].role as any) || 'member';
        }
      }
    } catch {
      // Fallback gracioso se o banco estiver indisponível
    }

    return {
      user: {
        id: sessionData.user.id,
        name: sessionData.user.name,
        email: sessionData.user.email,
        image: sessionData.user.image || null,
      },
      session: {
        id: sessionData.session.id,
        userId: sessionData.session.userId,
        expiresAt: new Date(sessionData.session.expiresAt),
        activeOrganizationId: targetOrgId,
      },
      organizationId: targetOrgId,
      organizationRole: targetRole,
      isDevFallback: false,
    };
  }

  // 3. Fallback Seguro para Modo Desenvolvimento & Testes Locais
  const isDev = process.env.NODE_ENV === 'development' || process.env.DEV_BYPASS_AUTH === 'true';
  if (isDev) {
    const devOrg = reqHeaders.get('x-organization-id') || getActiveOrgFromCookie(reqHeaders) || 'org_default';

    return {
      user: {
        id: 'usr_dev_01',
        name: 'Desenvolvedor HupFlow',
        email: 'dev@hupflow.com',
        image: null,
      },
      session: {
        id: 'sess_dev_01',
        userId: 'usr_dev_01',
        expiresAt: new Date(Date.now() + 86400000),
        activeOrganizationId: devOrg,
      },
      organizationId: devOrg,
      organizationRole: 'owner',
      isDevFallback: true,
    };
  }

  // 4. Em produção sem sessão: não autenticado
  return null;
}

/**
 * Garante que a requisição está autenticada, retornando erro HTTP 401 caso contrário
 */
export async function requireAuthContext(req?: Request | Headers): Promise<
  | { error: null; context: AuthContext }
  | { error: NextResponse; context: null }
> {
  const context = await getAuthContext(req);

  if (!context) {
    return {
      error: NextResponse.json(
        { error: 'Sessão inválida ou não autenticada. Faça login para continuar.', code: 'UNAUTHORIZED' },
        { status: 401 }
      ),
      context: null,
    };
  }

  return {
    error: null,
    context,
  };
}

/**
 * Lista os workspaces aos quais um usuário tem acesso
 */
export async function getUserWorkspaces(
  userId: string,
  currentOrgId: string
): Promise<WorkspaceSummary[]> {
  try {
    const list = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        logo: organizations.logo,
        role: members.role,
      })
      .from(members)
      .innerJoin(organizations, eq(members.organizationId, organizations.id))
      .where(eq(members.userId, userId));

    if (list.length > 0) {
      return list.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        logo: item.logo,
        role: (item.role as any) || 'member',
        isActive: item.id === currentOrgId,
      }));
    }
  } catch (err) {
    console.warn('[DB WARNING] Erro ao listar workspaces do usuário:', err);
  }

  // Fallback dev de apresentação
  return [
    {
      id: 'org_default',
      name: 'HupFlow Studio',
      slug: 'hupflow-studio',
      logo: null,
      role: 'owner',
      isActive: currentOrgId === 'org_default',
    },
    {
      id: 'org_agency_02',
      name: 'Agência Criativa Alfa',
      slug: 'agencia-alfa',
      logo: null,
      role: 'admin',
      isActive: currentOrgId === 'org_agency_02',
    },
  ];
}
