import crypto from 'node:crypto';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { deviceMockups } from '@/lib/db/schema';
import {
  DeviceMockupItem,
  CreateMockupInput,
  DeviceType,
  MockupSummaryMetrics,
} from './types';
import { summarizeMockupsPortfolio } from './mockups-utils';

const memoryStore = new Map<string, DeviceMockupItem[]>();

function seedOrgMockups(organizationId: string): DeviceMockupItem[] {
  const existing = memoryStore.get(organizationId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const now = new Date().toISOString();
  const seeds: DeviceMockupItem[] = [
    {
      id: 'mock_seed_iphone_reel',
      organizationId,
      title: 'Mockup Anúncio Reels Instagram (Black Friday)',
      deviceType: 'iphone_16_pro',
      orientation: 'portrait',
      finishColor: 'titanium_black',
      shadowStyle: 'floating_3d',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      backgroundColorHex: '#09090b',
      perspectiveTiltX: 6,
      perspectiveTiltY: -10,
      tags: ['instagram', 'reels', 'blackfriday', 'mockup'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mock_seed_ipad_carousel',
      organizationId,
      title: 'Apresentação Carrossel LinkedIn no iPad Pro',
      deviceType: 'ipad_pro',
      orientation: 'landscape',
      finishColor: 'silver',
      shadowStyle: 'soft',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
      backgroundColorHex: '#0c0e14',
      perspectiveTiltX: 0,
      perspectiveTiltY: 0,
      tags: ['linkedin', 'b2b', 'carrossel', 'ipad'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mock_seed_macbook_saas',
      organizationId,
      title: 'Demonstração Painel SaaS no MacBook Air 15"',
      deviceType: 'macbook_air',
      orientation: 'landscape',
      finishColor: 'midnight',
      shadowStyle: 'floating_3d',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
      backgroundColorHex: '#05070a',
      perspectiveTiltX: 4,
      perspectiveTiltY: -4,
      tags: ['saas', 'dashboard', 'macbook'],
      createdAt: now,
      updatedAt: now,
    },
  ];

  memoryStore.set(organizationId, seeds);
  return seeds;
}

export async function getDeviceMockups(
  organizationId: string,
  filter?: { deviceType?: DeviceType }
): Promise<DeviceMockupItem[]> {
  try {
    const rows = await db
      .select()
      .from(deviceMockups)
      .where(eq(deviceMockups.organizationId, organizationId))
      .orderBy(desc(deviceMockups.createdAt));

    if (rows && rows.length > 0) {
      let items: DeviceMockupItem[] = rows.map(r => ({
        id: r.id,
        organizationId: r.organizationId,
        title: r.title,
        deviceType: r.deviceType as any,
        orientation: r.orientation as any,
        finishColor: r.finishColor as any,
        shadowStyle: r.shadowStyle as any,
        mediaType: r.mediaType as any,
        mediaUrl: r.mediaUrl,
        backgroundColorHex: r.backgroundColorHex,
        perspectiveTiltX: r.perspectiveTiltX,
        perspectiveTiltY: r.perspectiveTiltY,
        tags: (r.tags as string[]) || [],
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      }));

      if (filter?.deviceType) {
        items = items.filter(m => m.deviceType === filter.deviceType);
      }

      return items;
    }
  } catch (error) {
    // Database connection or table unavailable; fallback to memory store
  }

  let memory = seedOrgMockups(organizationId);
  if (filter?.deviceType) {
    memory = memory.filter(m => m.deviceType === filter.deviceType);
  }
  return memory;
}

export async function getDeviceMockupById(
  organizationId: string,
  id: string
): Promise<DeviceMockupItem | null> {
  try {
    const rows = await db
      .select()
      .from(deviceMockups)
      .where(
        and(
          eq(deviceMockups.organizationId, organizationId),
          eq(deviceMockups.id, id)
        )
      )
      .limit(1);

    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        organizationId: r.organizationId,
        title: r.title,
        deviceType: r.deviceType as any,
        orientation: r.orientation as any,
        finishColor: r.finishColor as any,
        shadowStyle: r.shadowStyle as any,
        mediaType: r.mediaType as any,
        mediaUrl: r.mediaUrl,
        backgroundColorHex: r.backgroundColorHex,
        perspectiveTiltX: r.perspectiveTiltX,
        perspectiveTiltY: r.perspectiveTiltY,
        tags: (r.tags as string[]) || [],
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      };
    }
  } catch (error) {
    // Database fallback
  }

  const memory = seedOrgMockups(organizationId);
  return memory.find(m => m.id === id) || null;
}

export async function createDeviceMockup(
  organizationId: string,
  input: CreateMockupInput
): Promise<DeviceMockupItem> {
  const id = `mock_${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const newMockup: DeviceMockupItem = {
    id,
    organizationId,
    title: input.title.trim(),
    deviceType: input.deviceType,
    orientation: input.orientation || 'portrait',
    finishColor: input.finishColor || 'titanium_black',
    shadowStyle: input.shadowStyle || 'floating_3d',
    mediaType: input.mediaType || 'image',
    mediaUrl: input.mediaUrl.trim(),
    backgroundColorHex: input.backgroundColorHex || '#09090b',
    perspectiveTiltX: input.perspectiveTiltX ?? 0,
    perspectiveTiltY: input.perspectiveTiltY ?? 0,
    tags: input.tags && input.tags.length > 0 ? input.tags : ['mockup', 'dispositivo'],
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.insert(deviceMockups).values({
      id: newMockup.id,
      organizationId: newMockup.organizationId,
      title: newMockup.title,
      deviceType: newMockup.deviceType,
      orientation: newMockup.orientation,
      finishColor: newMockup.finishColor,
      shadowStyle: newMockup.shadowStyle,
      mediaType: newMockup.mediaType,
      mediaUrl: newMockup.mediaUrl,
      backgroundColorHex: newMockup.backgroundColorHex,
      perspectiveTiltX: newMockup.perspectiveTiltX,
      perspectiveTiltY: newMockup.perspectiveTiltY,
      tags: newMockup.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    // Database fallback
  }

  const existing = seedOrgMockups(organizationId);
  memoryStore.set(organizationId, [newMockup, ...existing]);

  return newMockup;
}

export async function updateDeviceMockup(
  organizationId: string,
  id: string,
  patch: Partial<DeviceMockupItem>
): Promise<DeviceMockupItem | null> {
  const now = new Date().toISOString();

  try {
    const updateValues: Record<string, any> = { updatedAt: new Date() };
    if (patch.title !== undefined) updateValues.title = patch.title;
    if (patch.deviceType !== undefined) updateValues.deviceType = patch.deviceType;
    if (patch.orientation !== undefined) updateValues.orientation = patch.orientation;
    if (patch.finishColor !== undefined) updateValues.finishColor = patch.finishColor;
    if (patch.shadowStyle !== undefined) updateValues.shadowStyle = patch.shadowStyle;
    if (patch.mediaType !== undefined) updateValues.mediaType = patch.mediaType;
    if (patch.mediaUrl !== undefined) updateValues.mediaUrl = patch.mediaUrl;
    if (patch.backgroundColorHex !== undefined) updateValues.backgroundColorHex = patch.backgroundColorHex;
    if (patch.perspectiveTiltX !== undefined) updateValues.perspectiveTiltX = patch.perspectiveTiltX;
    if (patch.perspectiveTiltY !== undefined) updateValues.perspectiveTiltY = patch.perspectiveTiltY;
    if (patch.tags !== undefined) updateValues.tags = patch.tags;

    await db
      .update(deviceMockups)
      .set(updateValues)
      .where(
        and(
          eq(deviceMockups.organizationId, organizationId),
          eq(deviceMockups.id, id)
        )
      );
  } catch (error) {
    // Database fallback
  }

  const mockups = seedOrgMockups(organizationId);
  const target = mockups.find(m => m.id === id);
  if (target) {
    Object.assign(target, patch, { updatedAt: now });
    return target;
  }

  return null;
}

export async function deleteDeviceMockup(
  organizationId: string,
  id: string
): Promise<boolean> {
  try {
    await db
      .delete(deviceMockups)
      .where(
        and(
          eq(deviceMockups.organizationId, organizationId),
          eq(deviceMockups.id, id)
        )
      );
  } catch (error) {
    // Database fallback
  }

  const mockups = seedOrgMockups(organizationId);
  const filtered = mockups.filter(m => m.id !== id);
  memoryStore.set(organizationId, filtered);
  return true;
}

export async function getMockupsSummaryMetrics(
  organizationId: string
): Promise<MockupSummaryMetrics> {
  const mockups = await getDeviceMockups(organizationId);
  return summarizeMockupsPortfolio(mockups);
}
