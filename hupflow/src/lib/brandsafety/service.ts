import { db } from '@/lib/db';
import { brandSafetySettings, crisisIncidentLogs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import {
  BrandSafetyConfig,
  CrisisIncidentLog,
  CrisisScope,
  ReconcileResumeOptions,
  ReconciledPostSummary,
  reconcileFrozenPostsOnResume,
  summarizeBrandSafetyHealth,
} from './types';

// In-memory store fallback
const memoryConfigStore = new Map<string, BrandSafetyConfig>();
const memoryLogsStore = new Map<string, CrisisIncidentLog[]>();

function getOrgConfig(organizationId: string): BrandSafetyConfig {
  if (!memoryConfigStore.has(organizationId)) {
    memoryConfigStore.set(organizationId, {
      organizationId,
      mode: 'operational',
      isEmergencyPaused: false,
      affectedPostsCount: 0,
      allowedChannels: ['x_twitter'],
      restrictedKeywords: ['escândalo', 'fraude', 'boicote', 'tragédia'],
      updatedAt: new Date().toISOString(),
    });
  }
  return memoryConfigStore.get(organizationId)!;
}

function getOrgLogs(organizationId: string): CrisisIncidentLog[] {
  if (!memoryLogsStore.has(organizationId)) {
    memoryLogsStore.set(organizationId, [
      {
        id: 'incident-seed-001',
        organizationId,
        action: 'kill_switch_activated',
        scope: 'global',
        reason: 'Simulação preventiva de crise institucional e teste de contingência',
        activatedByUserId: 'usr-admin-1',
        activatedByUserName: 'Eduardo (Admin)',
        affectedPostsCount: 6,
        details: { mode: 'drill' },
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      },
      {
        id: 'incident-seed-002',
        organizationId,
        action: 'kill_switch_deactivated',
        scope: 'global',
        reason: 'Fim do teste de contingência, fila reconciliada com sucesso',
        activatedByUserId: 'usr-admin-1',
        activatedByUserName: 'Eduardo (Admin)',
        affectedPostsCount: 6,
        details: { expiredStrategy: 'hold_for_review' },
        createdAt: new Date(Date.now() - 3600000 * 70).toISOString(),
      },
    ]);
  }
  return memoryLogsStore.get(organizationId)!;
}

export async function getBrandSafetyConfig(
  organizationId: string
): Promise<BrandSafetyConfig> {
  try {
    if (db) {
      const rows = await db
        .select()
        .from(brandSafetySettings)
        .where(eq(brandSafetySettings.organizationId, organizationId));

      if (rows && rows.length > 0) {
        const r = rows[0];
        return {
          organizationId: r.organizationId,
          mode: r.mode as any,
          isEmergencyPaused: Boolean(r.isEmergencyPaused),
          pausedAt: r.pausedAt ? (r.pausedAt instanceof Date ? r.pausedAt.toISOString() : String(r.pausedAt)) : undefined,
          pausedByUserName: r.pausedByUserName || undefined,
          pauseReason: r.pauseReason || undefined,
          affectedPostsCount: Number(r.affectedPostsCount || 0),
          autoResumeAt: r.autoResumeAt ? (r.autoResumeAt instanceof Date ? r.autoResumeAt.toISOString() : String(r.autoResumeAt)) : undefined,
          allowedChannels: typeof r.allowedChannels === 'string' ? JSON.parse(r.allowedChannels) : (Array.isArray(r.allowedChannels) ? r.allowedChannels : []),
          restrictedKeywords: typeof r.restrictedKeywords === 'string' ? JSON.parse(r.restrictedKeywords) : (Array.isArray(r.restrictedKeywords) ? r.restrictedKeywords : []),
          updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt),
        };
      }
    }
    return getOrgConfig(organizationId);
  } catch {
    return getOrgConfig(organizationId);
  }
}

export async function listCrisisIncidentLogs(
  organizationId: string,
  limit: number = 20
): Promise<CrisisIncidentLog[]> {
  try {
    if (db) {
      const rows = await db
        .select()
        .from(crisisIncidentLogs)
        .where(eq(crisisIncidentLogs.organizationId, organizationId))
        .orderBy(desc(crisisIncidentLogs.createdAt))
        .limit(limit);

      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          organizationId: r.organizationId,
          action: r.action,
          scope: r.scope,
          targetBrandSlug: r.targetBrandSlug || undefined,
          targetChannel: r.targetChannel || undefined,
          reason: r.reason,
          activatedByUserId: r.activatedByUserId,
          activatedByUserName: r.activatedByUserName,
          affectedPostsCount: Number(r.affectedPostsCount || 0),
          details: typeof r.details === 'string' ? JSON.parse(r.details) : (r.details || {}),
          createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
        }));
      }
    }
    return getOrgLogs(organizationId);
  } catch {
    return getOrgLogs(organizationId);
  }
}

export async function activateCrisisKillSwitch(
  organizationId: string,
  params: {
    reason: string;
    scope?: CrisisScope;
    targetBrandSlug?: string;
    targetChannel?: string;
    activatedByUserId: string;
    activatedByUserName: string;
    affectedPostsCount?: number;
  }
): Promise<{ config: BrandSafetyConfig; incidentLog: CrisisIncidentLog }> {
  const count = params.affectedPostsCount || 5;
  const now = new Date();

  const updatedConfig: BrandSafetyConfig = {
    organizationId,
    mode: 'emergency_paused',
    isEmergencyPaused: true,
    pausedAt: now.toISOString(),
    pausedByUserName: params.activatedByUserName,
    pauseReason: params.reason,
    affectedPostsCount: count,
    allowedChannels: ['x_twitter'],
    restrictedKeywords: ['escândalo', 'fraude', 'boicote', 'tragédia'],
    updatedAt: now.toISOString(),
  };

  const incidentLog: CrisisIncidentLog = {
    id: `incident-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    organizationId,
    action: 'kill_switch_activated',
    scope: params.scope || 'global',
    targetBrandSlug: params.targetBrandSlug,
    targetChannel: params.targetChannel,
    reason: params.reason,
    activatedByUserId: params.activatedByUserId,
    activatedByUserName: params.activatedByUserName,
    affectedPostsCount: count,
    details: {
      timestamp: now.toISOString(),
      initiatedFrom: 'dashboard_emergency_button',
    },
    createdAt: now.toISOString(),
  };

  try {
    if (db) {
      await db
        .insert(brandSafetySettings)
        .values({
          id: `bss-${organizationId}`,
          organizationId,
          mode: 'emergency_paused',
          isEmergencyPaused: true,
          pausedAt: now,
          pausedByUserName: params.activatedByUserName,
          pauseReason: params.reason,
          affectedPostsCount: count,
          allowedChannels: JSON.stringify(updatedConfig.allowedChannels),
          restrictedKeywords: JSON.stringify(updatedConfig.restrictedKeywords),
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: brandSafetySettings.organizationId,
          set: {
            mode: 'emergency_paused',
            isEmergencyPaused: true,
            pausedAt: now,
            pausedByUserName: params.activatedByUserName,
            pauseReason: params.reason,
            affectedPostsCount: count,
            updatedAt: now,
          },
        });

      await db.insert(crisisIncidentLogs).values({
        id: incidentLog.id,
        organizationId,
        action: incidentLog.action,
        scope: incidentLog.scope,
        targetBrandSlug: incidentLog.targetBrandSlug,
        targetChannel: incidentLog.targetChannel,
        reason: incidentLog.reason,
        activatedByUserId: incidentLog.activatedByUserId,
        activatedByUserName: incidentLog.activatedByUserName,
        affectedPostsCount: incidentLog.affectedPostsCount,
        details: incidentLog.details,
        createdAt: now,
      });
    }
  } catch {
    // In-memory fallback
  }

  memoryConfigStore.set(organizationId, updatedConfig);
  const logs = getOrgLogs(organizationId);
  logs.unshift(incidentLog);

  return { config: updatedConfig, incidentLog };
}

export async function deactivateCrisisKillSwitch(
  organizationId: string,
  params: {
    reason: string;
    expiredPostStrategy: 'hold_for_review' | 'reschedule_next_day' | 'discard';
    resumedByUserId: string;
    resumedByUserName: string;
  }
): Promise<{ config: BrandSafetyConfig; incidentLog: CrisisIncidentLog; summary: ReconciledPostSummary }> {
  const currentConfig = await getBrandSafetyConfig(organizationId);
  const now = new Date();

  // Simulação de reconciliação de posts
  const dummyFrozenPosts = [
    { id: 'post-1', scheduledAt: new Date(now.getTime() - 3600000).toISOString(), status: 'paused' },
    { id: 'post-2', scheduledAt: new Date(now.getTime() - 7200000).toISOString(), status: 'paused' },
    { id: 'post-3', scheduledAt: new Date(now.getTime() + 86400000).toISOString(), status: 'paused' },
  ];

  const summary = reconcileFrozenPostsOnResume(dummyFrozenPosts, {
    expiredPostStrategy: params.expiredPostStrategy,
    resumedAt: now.toISOString(),
  });

  const updatedConfig: BrandSafetyConfig = {
    ...currentConfig,
    mode: 'operational',
    isEmergencyPaused: false,
    pausedAt: undefined,
    pausedByUserName: undefined,
    pauseReason: undefined,
    affectedPostsCount: 0,
    updatedAt: now.toISOString(),
  };

  const incidentLog: CrisisIncidentLog = {
    id: `incident-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    organizationId,
    action: 'kill_switch_deactivated',
    scope: 'global',
    reason: params.reason,
    activatedByUserId: params.resumedByUserId,
    activatedByUserName: params.resumedByUserName,
    affectedPostsCount: currentConfig.affectedPostsCount,
    details: {
      expiredPostStrategy: params.expiredPostStrategy,
      reconciliationSummary: summary,
    },
    createdAt: now.toISOString(),
  };

  try {
    if (db) {
      await db
        .update(brandSafetySettings)
        .set({
          mode: 'operational',
          isEmergencyPaused: false,
          pausedAt: null,
          pausedByUserName: null,
          pauseReason: null,
          affectedPostsCount: 0,
          updatedAt: now,
        })
        .where(eq(brandSafetySettings.organizationId, organizationId));

      await db.insert(crisisIncidentLogs).values({
        id: incidentLog.id,
        organizationId,
        action: incidentLog.action,
        scope: incidentLog.scope,
        reason: incidentLog.reason,
        activatedByUserId: incidentLog.activatedByUserId,
        activatedByUserName: incidentLog.activatedByUserName,
        affectedPostsCount: incidentLog.affectedPostsCount,
        details: incidentLog.details,
        createdAt: now,
      });
    }
  } catch {
    // In-memory fallback
  }

  memoryConfigStore.set(organizationId, updatedConfig);
  const logs = getOrgLogs(organizationId);
  logs.unshift(incidentLog);

  return { config: updatedConfig, incidentLog, summary };
}
