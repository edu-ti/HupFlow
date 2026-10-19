import { db } from '@/lib/db';
import { clientPortals } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import {
  ClientPortal,
  PortalDeliverable,
  PortalReviewInput,
  PortalStats,
  PublicPortalView,
} from './types';
import {
  generatePortalToken,
  isValidHexColor,
  normalizeBrandColor,
  isValidPortalPin,
  verifyPortalPinAccess,
  calculatePortalMetrics,
  applyDeliverableReview,
} from './portals-utils';

export {
  generatePortalToken,
  isValidHexColor,
  normalizeBrandColor,
  isValidPortalPin,
  verifyPortalPinAccess,
  calculatePortalMetrics,
  applyDeliverableReview,
};

const memoryPortals = new Map<string, ClientPortal[]>();

function createDefaultDemoPortals(organizationId: string): ClientPortal[] {
  const deliverables: PortalDeliverable[] = [
    {
      id: 'deliv_demo_1',
      title: 'Carrossel PDF: 7 Automação de Vendas B2B com IA',
      caption:
        'Descubra como reduzir o ciclo comercial em 40% combinando conteúdo técnico no LinkedIn e cadências multicanal.',
      channel: 'linkedin',
      scheduledDate: '2026-10-21T13:00:00Z',
      mediaType: 'carousel',
      slideCount: 7,
      status: 'pending_review',
    },
    {
      id: 'deliv_demo_2',
      title: 'Reels 9:16: Bastidores da Operação & Cultura',
      caption:
        'Um giro rápido pelos nossos rituais de produto com legendas dinâmicas estilo Hormozi.',
      channel: 'instagram',
      scheduledDate: '2026-10-22T18:00:00Z',
      mediaType: 'short_video',
      status: 'approved',
      reviewedBy: 'Fernanda (Diretora Mkt)',
      reviewedAt: Date.now() - 3600_000 * 5,
      feedbackNote: 'Aprovado! Adorei o gancho nos primeiros 3 segundos.',
    },
    {
      id: 'deliv_demo_3',
      title: 'Thread X: O Futuro do Clean-Room Software em 2026',
      caption:
        '1/5 Por que arquiteturas enxutas e zero-dependências restritivas estão dominando o SaaS moderno...',
      channel: 'x',
      scheduledDate: '2026-10-24T15:00:00Z',
      mediaType: 'single_image',
      status: 'pending_review',
    },
  ];

  return [
    {
      id: 'portal_demo_1',
      organizationId,
      clientName: 'Vortex Enterprise Tech',
      projectTitle: 'Sprint Outubro — LinkedIn, Reels & X',
      token: 'ptl_vortex2026demo8842a1b2c3',
      brandColor: '#6366F1',
      logoUrl: null,
      welcomeMessage:
        'Olá equipe Vortex! Revise abaixo as peças planejadas para a próxima semana. Você pode aprovar em 1 clique ou solicitar ajustes pontuais.',
      accessPin: null,
      hideHupflowBranding: false,
      isActive: true,
      deliverables,
      totalViews: 18,
      createdAt: Date.now() - 86400_000 * 2,
      updatedAt: Date.now() - 3600_000,
    },
  ];
}

function computeAggregateStats(portals: ClientPortal[]): PortalStats {
  let totalDeliverables = 0;
  let approvedCount = 0;
  let pendingCount = 0;
  let changesRequestedCount = 0;

  for (const p of portals) {
    for (const d of p.deliverables || []) {
      totalDeliverables++;
      if (d.status === 'approved') approvedCount++;
      else if (d.status === 'changes_requested') changesRequestedCount++;
      else pendingCount++;
    }
  }

  const approvalRate =
    totalDeliverables > 0
      ? Number(((approvedCount / totalDeliverables) * 100).toFixed(1))
      : 0;

  return {
    totalPortals: portals.length,
    totalDeliverables,
    approvedCount,
    pendingCount,
    changesRequestedCount,
    approvalRate,
  };
}

export async function listClientPortals(organizationId: string): Promise<{
  portals: ClientPortal[];
  stats: PortalStats;
}> {
  try {
    const rows = await db
      .select()
      .from(clientPortals)
      .where(eq(clientPortals.organizationId, organizationId))
      .orderBy(desc(clientPortals.updatedAt));

    if (rows.length > 0) {
      const portals: ClientPortal[] = rows.map((r) => ({
        id: r.id,
        organizationId: r.organizationId,
        clientName: r.clientName,
        projectTitle: r.projectTitle,
        token: r.token,
        brandColor: normalizeBrandColor(r.brandColor),
        logoUrl: r.logoUrl,
        welcomeMessage: r.welcomeMessage,
        accessPin: r.accessPin,
        hideHupflowBranding: r.hideHupflowBranding,
        isActive: r.isActive,
        deliverables: Array.isArray(r.deliverables)
          ? (r.deliverables as PortalDeliverable[])
          : [],
        totalViews: r.totalViews || 0,
        createdAt: r.createdAt ? new Date(r.createdAt).getTime() : Date.now(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).getTime() : Date.now(),
      }));

      return { portals, stats: computeAggregateStats(portals) };
    }
  } catch (err) {
    console.warn('[PortalsService] Fallback local ativado (listClientPortals):', err);
  }

  let list = memoryPortals.get(organizationId);
  if (!list || list.length === 0) {
    list = createDefaultDemoPortals(organizationId);
    memoryPortals.set(organizationId, list);
  }

  return { portals: list, stats: computeAggregateStats(list) };
}

export async function upsertClientPortal(
  organizationId: string,
  payload: {
    id?: string;
    clientName: string;
    projectTitle: string;
    brandColor?: string;
    logoUrl?: string | null;
    welcomeMessage?: string | null;
    accessPin?: string | null;
    hideHupflowBranding?: boolean;
    isActive?: boolean;
    regenerateToken?: boolean;
    deliverables?: PortalDeliverable[];
  }
): Promise<ClientPortal> {
  if (!isValidPortalPin(payload.accessPin)) {
    throw new Error('O PIN de acesso deve conter entre 4 e 6 dígitos numéricos.');
  }

  const now = new Date();
  const portalId = payload.id || `portal_${Date.now()}`;
  const brandColor = normalizeBrandColor(payload.brandColor);
  const cleanPin = payload.accessPin?.trim() ? payload.accessPin.trim() : null;

  let existingToken = generatePortalToken();
  let existingViews = 0;
  let existingDeliverables: PortalDeliverable[] = [];

  try {
    const existingRows = await db
      .select()
      .from(clientPortals)
      .where(
        and(
          eq(clientPortals.id, portalId),
          eq(clientPortals.organizationId, organizationId)
        )
      )
      .limit(1);

    if (existingRows.length > 0) {
      existingToken = payload.regenerateToken
        ? generatePortalToken()
        : existingRows[0].token;
      existingViews = existingRows[0].totalViews || 0;
      existingDeliverables = Array.isArray(existingRows[0].deliverables)
        ? (existingRows[0].deliverables as PortalDeliverable[])
        : [];
    }
  } catch {
    const memList = memoryPortals.get(organizationId) || [];
    const found = memList.find((p) => p.id === portalId);
    if (found) {
      existingToken = payload.regenerateToken ? generatePortalToken() : found.token;
      existingViews = found.totalViews;
      existingDeliverables = found.deliverables;
    }
  }

  const finalDeliverables = Array.isArray(payload.deliverables)
    ? payload.deliverables
    : existingDeliverables;

  const portalObj: ClientPortal = {
    id: portalId,
    organizationId,
    clientName: payload.clientName.trim(),
    projectTitle: payload.projectTitle.trim(),
    token: existingToken,
    brandColor,
    logoUrl: payload.logoUrl || null,
    welcomeMessage: payload.welcomeMessage || null,
    accessPin: cleanPin,
    hideHupflowBranding: payload.hideHupflowBranding ?? false,
    isActive: payload.isActive ?? true,
    deliverables: finalDeliverables,
    totalViews: existingViews,
    createdAt: now.getTime(),
    updatedAt: now.getTime(),
  };

  try {
    const existing = await db
      .select()
      .from(clientPortals)
      .where(
        and(
          eq(clientPortals.id, portalId),
          eq(clientPortals.organizationId, organizationId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(clientPortals)
        .set({
          clientName: portalObj.clientName,
          projectTitle: portalObj.projectTitle,
          token: portalObj.token,
          brandColor: portalObj.brandColor,
          logoUrl: portalObj.logoUrl,
          welcomeMessage: portalObj.welcomeMessage,
          accessPin: portalObj.accessPin,
          hideHupflowBranding: portalObj.hideHupflowBranding,
          isActive: portalObj.isActive,
          deliverables: portalObj.deliverables,
          updatedAt: now,
        })
        .where(eq(clientPortals.id, portalId));
    } else {
      await db.insert(clientPortals).values({
        id: portalObj.id,
        organizationId,
        clientName: portalObj.clientName,
        projectTitle: portalObj.projectTitle,
        token: portalObj.token,
        brandColor: portalObj.brandColor,
        logoUrl: portalObj.logoUrl,
        welcomeMessage: portalObj.welcomeMessage,
        accessPin: portalObj.accessPin,
        hideHupflowBranding: portalObj.hideHupflowBranding,
        isActive: portalObj.isActive,
        deliverables: portalObj.deliverables,
        totalViews: 0,
        createdAt: now,
        updatedAt: now,
      });
    }
  } catch (err) {
    console.warn('[PortalsService] Salvando portal em memória (fallback DB):', err);
    const list =
      memoryPortals.get(organizationId) || createDefaultDemoPortals(organizationId);
    const idx = list.findIndex((item) => item.id === portalId);
    if (idx >= 0) {
      list[idx] = portalObj;
    } else {
      list.unshift(portalObj);
    }
    memoryPortals.set(organizationId, list);
  }

  return portalObj;
}

export async function deleteClientPortal(
  organizationId: string,
  portalId: string
): Promise<boolean> {
  try {
    await db
      .delete(clientPortals)
      .where(
        and(
          eq(clientPortals.id, portalId),
          eq(clientPortals.organizationId, organizationId)
        )
      );
  } catch (err) {
    console.warn('[PortalsService] Removendo portal da memória:', err);
  }

  const list = memoryPortals.get(organizationId);
  if (list) {
    memoryPortals.set(
      organizationId,
      list.filter((item) => item.id !== portalId)
    );
  }

  return true;
}

export async function getPublicPortalByToken(
  token: string,
  providedPin?: string | null
): Promise<{
  portal: PublicPortalView | null;
  pinLocked?: boolean;
}> {
  let foundPortal: ClientPortal | null = null;

  try {
    const rows = await db
      .select()
      .from(clientPortals)
      .where(and(eq(clientPortals.token, token), eq(clientPortals.isActive, true)))
      .limit(1);

    if (rows.length > 0) {
      const r = rows[0];
      foundPortal = {
        id: r.id,
        organizationId: r.organizationId,
        clientName: r.clientName,
        projectTitle: r.projectTitle,
        token: r.token,
        brandColor: normalizeBrandColor(r.brandColor),
        logoUrl: r.logoUrl,
        welcomeMessage: r.welcomeMessage,
        accessPin: r.accessPin,
        hideHupflowBranding: r.hideHupflowBranding,
        isActive: r.isActive,
        deliverables: Array.isArray(r.deliverables)
          ? (r.deliverables as PortalDeliverable[])
          : [],
        totalViews: (r.totalViews || 0) + 1,
        createdAt: r.createdAt ? new Date(r.createdAt).getTime() : Date.now(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).getTime() : Date.now(),
      };
    }
  } catch {
    // Fallback em memória
  }

  if (!foundPortal) {
    for (const [_, list] of memoryPortals.entries()) {
      const match = list.find((p) => p.token === token && p.isActive);
      if (match) {
        foundPortal = match;
        break;
      }
    }
  }

  if (!foundPortal && token.startsWith('ptl_')) {
    const demo = createDefaultDemoPortals('org_demo')[0];
    foundPortal = { ...demo, token };
  }

  if (!foundPortal) {
    return { portal: null };
  }

  const requiresPin = Boolean(foundPortal.accessPin && foundPortal.accessPin.trim());
  const pinValid = verifyPortalPinAccess(foundPortal.accessPin, providedPin);

  if (requiresPin && !pinValid) {
    return {
      pinLocked: true,
      portal: {
        id: foundPortal.id,
        clientName: foundPortal.clientName,
        projectTitle: foundPortal.projectTitle,
        token: foundPortal.token,
        brandColor: foundPortal.brandColor,
        logoUrl: foundPortal.logoUrl,
        welcomeMessage: foundPortal.welcomeMessage,
        requiresPin: true,
        hideHupflowBranding: foundPortal.hideHupflowBranding,
        deliverables: [],
        metrics: {
          total: 0,
          approved: 0,
          pending: 0,
          changesRequested: 0,
          approvalRate: 0,
        },
      },
    };
  }

  return {
    pinLocked: false,
    portal: {
      id: foundPortal.id,
      clientName: foundPortal.clientName,
      projectTitle: foundPortal.projectTitle,
      token: foundPortal.token,
      brandColor: foundPortal.brandColor,
      logoUrl: foundPortal.logoUrl,
      welcomeMessage: foundPortal.welcomeMessage,
      requiresPin,
      hideHupflowBranding: foundPortal.hideHupflowBranding,
      deliverables: foundPortal.deliverables,
      metrics: calculatePortalMetrics(foundPortal.deliverables),
    },
  };
}

export async function submitExternalPortalReview(params: {
  token: string;
  pin?: string | null;
  review: PortalReviewInput;
}): Promise<PublicPortalView> {
  const { token, pin, review } = params;

  // Localiza portal no DB ou memória
  let targetPortal: ClientPortal | null = null;
  let fromDb = false;

  try {
    const rows = await db
      .select()
      .from(clientPortals)
      .where(and(eq(clientPortals.token, token), eq(clientPortals.isActive, true)))
      .limit(1);

    if (rows.length > 0) {
      const r = rows[0];
      fromDb = true;
      targetPortal = {
        id: r.id,
        organizationId: r.organizationId,
        clientName: r.clientName,
        projectTitle: r.projectTitle,
        token: r.token,
        brandColor: normalizeBrandColor(r.brandColor),
        logoUrl: r.logoUrl,
        welcomeMessage: r.welcomeMessage,
        accessPin: r.accessPin,
        hideHupflowBranding: r.hideHupflowBranding,
        isActive: r.isActive,
        deliverables: Array.isArray(r.deliverables)
          ? (r.deliverables as PortalDeliverable[])
          : [],
        totalViews: r.totalViews || 0,
        createdAt: r.createdAt ? new Date(r.createdAt).getTime() : Date.now(),
        updatedAt: Date.now(),
      };
    }
  } catch {
    // Fallback
  }

  if (!targetPortal) {
    for (const [_, list] of memoryPortals.entries()) {
      const match = list.find((p) => p.token === token && p.isActive);
      if (match) {
        targetPortal = match;
        break;
      }
    }
  }

  if (!targetPortal && token.startsWith('ptl_')) {
    const demo = createDefaultDemoPortals('org_demo')[0];
    targetPortal = { ...demo, token };
    memoryPortals.set('org_demo', [targetPortal]);
  }

  if (!targetPortal) {
    throw new Error('Portal não encontrado ou inativo.');
  }

  if (!verifyPortalPinAccess(targetPortal.accessPin, pin)) {
    throw new Error('PIN de acesso inválido para este portal.');
  }

  const updatedDeliverables = applyDeliverableReview(
    targetPortal.deliverables,
    review
  );
  targetPortal.deliverables = updatedDeliverables;
  targetPortal.updatedAt = Date.now();

  if (fromDb) {
    try {
      await db
        .update(clientPortals)
        .set({
          deliverables: updatedDeliverables,
          updatedAt: new Date(),
        })
        .where(eq(clientPortals.id, targetPortal.id));
    } catch (err) {
      console.warn('[PortalsService] Erro ao persistir revisão no DB:', err);
    }
  }

  return {
    id: targetPortal.id,
    clientName: targetPortal.clientName,
    projectTitle: targetPortal.projectTitle,
    token: targetPortal.token,
    brandColor: targetPortal.brandColor,
    logoUrl: targetPortal.logoUrl,
    welcomeMessage: targetPortal.welcomeMessage,
    requiresPin: Boolean(targetPortal.accessPin),
    hideHupflowBranding: targetPortal.hideHupflowBranding,
    deliverables: updatedDeliverables,
    metrics: calculatePortalMetrics(updatedDeliverables),
  };
}
