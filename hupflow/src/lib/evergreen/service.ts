import { db } from '@/lib/db';
import { evergreenItems } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import {
  EvergreenCategory,
  EvergreenItem,
  EvergreenStats,
  EvergreenVariation,
} from './types';
import {
  calculateEvergreenScore,
  generateSpunVariations,
  pickNextVariationForCycle,
  computeNextRecycleSlot,
  isEligibleForRecycle,
  calculateEvergreenStats,
} from './evergreen-utils';

export {
  calculateEvergreenScore,
  generateSpunVariations,
  pickNextVariationForCycle,
  computeNextRecycleSlot,
  isEligibleForRecycle,
  calculateEvergreenStats,
};

const memoryEvergreenItems = new Map<string, EvergreenItem[]>();

function createDefaultDemoEvergreen(organizationId: string): EvergreenItem[] {
  const now = Date.now();
  const title1 = 'Framework: 5 Pilares de Carrosséis B2B que Convertem Leads';
  const caption1 =
    '1. Gancho contraintuitivo no slide 1.\n2. Uma única premissa por slide.\n3. Contraste visual alto.\n4. Prova social ou dado concreto no slide 5.\n5. CTA com link rastreável na bio.';

  const title2 = 'Estudo de Caso: Como Reduzir 6h Semanais na Operação de Conteúdo';
  const caption2 =
    'Automatize a ingestão via RSS, use templates de Brand Kit no Canvas 2D e ative portais White-Label para aprovação sem fricção.';

  return [
    {
      id: 'evg_demo_1',
      organizationId,
      title: title1,
      originalCaption: caption1,
      category: 'framework',
      channels: ['linkedin', 'instagram'],
      mediaType: 'carousel',
      evergreenScore: calculateEvergreenScore(caption1, 'carousel', 6.2),
      cooldownDays: 30,
      recycleCount: 4,
      maxRecycles: 12,
      variations: generateSpunVariations(title1, caption1),
      isActive: true,
      lastRecycledAt: now - 35 * 86_400_000,
      nextScheduledAt: now + 2 * 86_400_000,
      createdAt: now - 90 * 86_400_000,
      updatedAt: now - 5 * 86_400_000,
    },
    {
      id: 'evg_demo_2',
      organizationId,
      title: title2,
      originalCaption: caption2,
      category: 'case_study',
      channels: ['linkedin', 'x', 'threads'],
      mediaType: 'carousel',
      evergreenScore: calculateEvergreenScore(caption2, 'carousel', 5.4),
      cooldownDays: 21,
      recycleCount: 2,
      maxRecycles: 10,
      variations: generateSpunVariations(title2, caption2),
      isActive: true,
      lastRecycledAt: now - 25 * 86_400_000,
      nextScheduledAt: now + 1 * 86_400_000,
      createdAt: now - 60 * 86_400_000,
      updatedAt: now - 2 * 86_400_000,
    },
  ];
}

export async function listEvergreenItems(organizationId: string): Promise<{
  items: EvergreenItem[];
  stats: EvergreenStats;
}> {
  try {
    const rows = await db
      .select()
      .from(evergreenItems)
      .where(eq(evergreenItems.organizationId, organizationId))
      .orderBy(desc(evergreenItems.updatedAt));

    if (rows.length > 0) {
      const items: EvergreenItem[] = rows.map((r) => ({
        id: r.id,
        organizationId: r.organizationId,
        title: r.title,
        originalCaption: r.originalCaption,
        category: (r.category as EvergreenCategory) || 'educational',
        channels: Array.isArray(r.channels)
          ? (r.channels as string[])
          : ['linkedin', 'instagram'],
        mediaType:
          (r.mediaType as 'carousel' | 'single_image' | 'short_video') ||
          'carousel',
        evergreenScore: r.evergreenScore || 85,
        cooldownDays: r.cooldownDays || 30,
        recycleCount: r.recycleCount || 0,
        maxRecycles: r.maxRecycles || 12,
        variations: Array.isArray(r.variations)
          ? (r.variations as EvergreenVariation[])
          : generateSpunVariations(r.title, r.originalCaption),
        isActive: r.isActive,
        lastRecycledAt: r.lastRecycledAt
          ? new Date(r.lastRecycledAt).getTime()
          : null,
        nextScheduledAt: r.nextScheduledAt
          ? new Date(r.nextScheduledAt).getTime()
          : null,
        createdAt: r.createdAt ? new Date(r.createdAt).getTime() : Date.now(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).getTime() : Date.now(),
      }));

      return { items, stats: calculateEvergreenStats(items) };
    }
  } catch (err) {
    console.warn('[EvergreenService] Fallback local ativado (listEvergreenItems):', err);
  }

  let list = memoryEvergreenItems.get(organizationId);
  if (!list || list.length === 0) {
    list = createDefaultDemoEvergreen(organizationId);
    memoryEvergreenItems.set(organizationId, list);
  }

  return { items: list, stats: calculateEvergreenStats(list) };
}

export async function upsertEvergreenItem(
  organizationId: string,
  payload: {
    id?: string;
    title: string;
    originalCaption: string;
    category?: EvergreenCategory;
    channels?: string[];
    mediaType?: 'carousel' | 'single_image' | 'short_video';
    cooldownDays?: number;
    maxRecycles?: number;
    isActive?: boolean;
  }
): Promise<EvergreenItem> {
  const now = new Date();
  const itemId = payload.id || `evg_${Date.now()}`;
  const mediaType = payload.mediaType || 'carousel';
  const cooldownDays = Math.max(7, Math.min(365, Number(payload.cooldownDays) || 30));
  const maxRecycles = Math.max(1, Math.min(100, Number(payload.maxRecycles) || 12));
  const score = calculateEvergreenScore(payload.originalCaption, mediaType, 5.0);
  const variations = generateSpunVariations(payload.title, payload.originalCaption);
  const nextSlotMs = computeNextRecycleSlot(now.getTime(), cooldownDays);

  const itemObj: EvergreenItem = {
    id: itemId,
    organizationId,
    title: payload.title.trim(),
    originalCaption: payload.originalCaption.trim(),
    category: payload.category || 'educational',
    channels:
      Array.isArray(payload.channels) && payload.channels.length > 0
        ? payload.channels
        : ['linkedin', 'instagram'],
    mediaType,
    evergreenScore: score,
    cooldownDays,
    recycleCount: 0,
    maxRecycles,
    variations,
    isActive: payload.isActive ?? true,
    lastRecycledAt: null,
    nextScheduledAt: nextSlotMs,
    createdAt: now.getTime(),
    updatedAt: now.getTime(),
  };

  try {
    await db.insert(evergreenItems).values({
      id: itemObj.id,
      organizationId,
      title: itemObj.title,
      originalCaption: itemObj.originalCaption,
      category: itemObj.category,
      channels: itemObj.channels,
      mediaType: itemObj.mediaType,
      evergreenScore: itemObj.evergreenScore,
      cooldownDays: itemObj.cooldownDays,
      recycleCount: 0,
      maxRecycles: itemObj.maxRecycles,
      variations: itemObj.variations,
      isActive: itemObj.isActive,
      nextScheduledAt: new Date(nextSlotMs),
      createdAt: now,
      updatedAt: now,
    });
  } catch (err) {
    console.warn('[EvergreenService] Salvando item em memória:', err);
    const list =
      memoryEvergreenItems.get(organizationId) ||
      createDefaultDemoEvergreen(organizationId);
    list.unshift(itemObj);
    memoryEvergreenItems.set(organizationId, list);
  }

  return itemObj;
}

export async function deleteEvergreenItem(
  organizationId: string,
  itemId: string
): Promise<boolean> {
  try {
    await db
      .delete(evergreenItems)
      .where(
        and(
          eq(evergreenItems.id, itemId),
          eq(evergreenItems.organizationId, organizationId)
        )
      );
  } catch (err) {
    console.warn('[EvergreenService] Removendo item da memória:', err);
  }

  const list = memoryEvergreenItems.get(organizationId);
  if (list) {
    memoryEvergreenItems.set(
      organizationId,
      list.filter((i) => i.id !== itemId)
    );
  }

  return true;
}

export async function triggerEvergreenRecycle(
  organizationId: string,
  itemId: string,
  forceBypassCooldown = false
): Promise<{
  item: EvergreenItem;
  selectedVariation: EvergreenVariation | null;
}> {
  const nowMs = Date.now();
  const list =
    memoryEvergreenItems.get(organizationId) ||
    createDefaultDemoEvergreen(organizationId);
  const idx = list.findIndex((i) => i.id === itemId);

  if (idx < 0) {
    throw new Error('Item Evergreen não encontrado neste workspace.');
  }

  const target = list[idx];
  if (!forceBypassCooldown) {
    const check = isEligibleForRecycle(target, nowMs);
    if (!check.eligible) {
      throw new Error(check.reason || 'Item ainda em período de Cooldown.');
    }
  }

  const selectedVariation = pickNextVariationForCycle(
    target.variations,
    target.recycleCount
  );
  const newCount = target.recycleCount + 1;
  const nextScheduledAt = computeNextRecycleSlot(nowMs, target.cooldownDays);

  const updated: EvergreenItem = {
    ...target,
    recycleCount: newCount,
    lastRecycledAt: nowMs,
    nextScheduledAt,
    updatedAt: nowMs,
  };

  list[idx] = updated;
  memoryEvergreenItems.set(organizationId, list);

  try {
    await db
      .update(evergreenItems)
      .set({
        recycleCount: newCount,
        lastRecycledAt: new Date(nowMs),
        nextScheduledAt: new Date(nextScheduledAt),
        updatedAt: new Date(nowMs),
      })
      .where(
        and(
          eq(evergreenItems.id, itemId),
          eq(evergreenItems.organizationId, organizationId)
        )
      );
  } catch {
    // Fallback em memória já atualizado
  }

  return { item: updated, selectedVariation };
}
