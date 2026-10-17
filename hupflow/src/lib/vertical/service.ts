import crypto from 'node:crypto';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { verticalVideoPosts } from '@/lib/db/schema';
import {
  VerticalVideoPost,
  VerticalChannelType,
  CreateVerticalPostInput,
  VerticalPublishSummary,
} from './types';
import {
  validateVerticalMediaRequirements,
  summarizeVerticalChannelPortfolio,
} from './vertical.test';

const memoryStore = new Map<string, VerticalVideoPost[]>();

function seedOrgVerticalPosts(organizationId: string): VerticalVideoPost[] {
  const existing = memoryStore.get(organizationId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const now = new Date().toISOString();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const seeds: VerticalVideoPost[] = [
    {
      id: 'vert_seed_saas_hook',
      organizationId,
      title: 'O Maior Erro no Tráfego Pago que Ninguém Te Conta',
      caption: 'Você está queimando orçamento no topo do funil sem nutrição. Veja como corrigir em 3 passos! #growth #saas #marketingdigital',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-man-working-on-his-laptop-42999-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
      channels: ['tiktok', 'youtube_shorts'],
      durationSeconds: 48,
      width: 1080,
      height: 1920,
      privacyLevel: 'public',
      tiktokSettings: {
        disableComments: false,
        disableDuet: false,
        disableStitch: false,
        isAiGenerated: true,
      },
      youtubeSettings: {
        isMadeForKids: false,
        containsPaidPromotion: false,
      },
      scheduledAt: tomorrow,
      status: 'scheduled',
      externalPublishIds: {
        tiktokPostId: 'tt_mock_9921',
        youtubeVideoId: 'yt_mock_7712',
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'vert_seed_quick_tutorial',
      organizationId,
      title: 'Tutorial Relâmpago: Automação em 60 Segundos',
      caption: 'Como conectar webhooks com n8n sem programar uma única linha. Salve para consultar depois! #tutorial #automacao #nocode',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-in-a-dimly-lit-room-43187-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      channels: ['youtube_shorts'],
      durationSeconds: 58,
      width: 1080,
      height: 1920,
      privacyLevel: 'public',
      tiktokSettings: {
        disableComments: false,
        disableDuet: false,
        disableStitch: false,
        isAiGenerated: false,
      },
      youtubeSettings: {
        isMadeForKids: false,
        containsPaidPromotion: false,
      },
      scheduledAt: undefined,
      status: 'published',
      externalPublishIds: {
        youtubeVideoId: 'yt_mock_pub_01',
      },
      createdAt: now,
      updatedAt: now,
    },
  ];

  memoryStore.set(organizationId, seeds);
  return seeds;
}

export async function getVerticalPosts(
  organizationId: string,
  filter?: { channel?: VerticalChannelType; status?: string }
): Promise<VerticalVideoPost[]> {
  try {
    const rows = await db
      .select()
      .from(verticalVideoPosts)
      .where(eq(verticalVideoPosts.organizationId, organizationId))
      .orderBy(desc(verticalVideoPosts.createdAt));

    if (rows && rows.length > 0) {
      let items: VerticalVideoPost[] = rows.map(r => ({
        id: r.id,
        organizationId: r.organizationId,
        title: r.title,
        caption: r.caption,
        videoUrl: r.videoUrl,
        thumbnailUrl: r.thumbnailUrl || undefined,
        channels: (r.channels as VerticalChannelType[]) || ['tiktok'],
        durationSeconds: r.durationSeconds,
        width: r.width,
        height: r.height,
        privacyLevel: r.privacyLevel as any,
        tiktokSettings: r.tiktokSettings as any,
        youtubeSettings: r.youtubeSettings as any,
        scheduledAt: r.scheduledAt ? new Date(r.scheduledAt).toISOString() : undefined,
        status: r.status as any,
        externalPublishIds: (r.externalPublishIds as any) || undefined,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      }));

      if (filter?.channel) {
        items = items.filter(p => p.channels.includes(filter.channel!));
      }
      if (filter?.status) {
        items = items.filter(p => p.status === filter.status);
      }

      return items;
    }
  } catch (error) {
    // Database connection or table unavailable; fallback to memory store
  }

  let memory = seedOrgVerticalPosts(organizationId);
  if (filter?.channel) {
    memory = memory.filter(p => p.channels.includes(filter.channel!));
  }
  if (filter?.status) {
    memory = memory.filter(p => p.status === filter.status);
  }
  return memory;
}

export async function getVerticalPostById(
  organizationId: string,
  id: string
): Promise<VerticalVideoPost | null> {
  try {
    const rows = await db
      .select()
      .from(verticalVideoPosts)
      .where(
        and(
          eq(verticalVideoPosts.organizationId, organizationId),
          eq(verticalVideoPosts.id, id)
        )
      )
      .limit(1);

    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        organizationId: r.organizationId,
        title: r.title,
        caption: r.caption,
        videoUrl: r.videoUrl,
        thumbnailUrl: r.thumbnailUrl || undefined,
        channels: (r.channels as VerticalChannelType[]) || ['tiktok'],
        durationSeconds: r.durationSeconds,
        width: r.width,
        height: r.height,
        privacyLevel: r.privacyLevel as any,
        tiktokSettings: r.tiktokSettings as any,
        youtubeSettings: r.youtubeSettings as any,
        scheduledAt: r.scheduledAt ? new Date(r.scheduledAt).toISOString() : undefined,
        status: r.status as any,
        externalPublishIds: (r.externalPublishIds as any) || undefined,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      };
    }
  } catch (error) {
    // Database fallback
  }

  const memory = seedOrgVerticalPosts(organizationId);
  return memory.find(p => p.id === id) || null;
}

export async function createVerticalPost(
  organizationId: string,
  input: CreateVerticalPostInput
): Promise<VerticalVideoPost> {
  const width = input.width || 1080;
  const height = input.height || 1920;
  const durationSeconds = input.durationSeconds || 30;

  // Validate technical requirements against each selected channel
  for (const channel of input.channels) {
    const result = validateVerticalMediaRequirements({ width, height, durationSeconds }, channel);
    if (!result.isValid) {
      throw new Error(`Erro de validação para ${channel}: ${result.errors.join('; ')}`);
    }
  }

  const id = `vert_${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const newPost: VerticalVideoPost = {
    id,
    organizationId,
    title: input.title.trim(),
    caption: input.caption.trim(),
    videoUrl: input.videoUrl.trim(),
    thumbnailUrl: input.thumbnailUrl?.trim() || undefined,
    channels: input.channels,
    durationSeconds,
    width,
    height,
    privacyLevel: input.privacyLevel || 'public',
    tiktokSettings: {
      disableComments: input.tiktokSettings?.disableComments ?? false,
      disableDuet: input.tiktokSettings?.disableDuet ?? false,
      disableStitch: input.tiktokSettings?.disableStitch ?? false,
      isAiGenerated: input.tiktokSettings?.isAiGenerated ?? true,
    },
    youtubeSettings: {
      isMadeForKids: input.youtubeSettings?.isMadeForKids ?? false,
      containsPaidPromotion: input.youtubeSettings?.containsPaidPromotion ?? false,
    },
    scheduledAt: input.scheduledAt || undefined,
    status: input.scheduledAt ? 'scheduled' : 'draft',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.insert(verticalVideoPosts).values({
      id: newPost.id,
      organizationId: newPost.organizationId,
      title: newPost.title,
      caption: newPost.caption,
      videoUrl: newPost.videoUrl,
      thumbnailUrl: newPost.thumbnailUrl || null,
      channels: newPost.channels,
      durationSeconds: newPost.durationSeconds,
      width: newPost.width,
      height: newPost.height,
      privacyLevel: newPost.privacyLevel,
      tiktokSettings: newPost.tiktokSettings,
      youtubeSettings: newPost.youtubeSettings,
      scheduledAt: newPost.scheduledAt ? new Date(newPost.scheduledAt) : null,
      status: newPost.status,
      externalPublishIds: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    // Database fallback
  }

  const existing = seedOrgVerticalPosts(organizationId);
  memoryStore.set(organizationId, [newPost, ...existing]);

  return newPost;
}

export async function updateVerticalPost(
  organizationId: string,
  id: string,
  patch: Partial<VerticalVideoPost>
): Promise<VerticalVideoPost | null> {
  const now = new Date().toISOString();

  try {
    const updateValues: Record<string, any> = { updatedAt: new Date() };
    if (patch.title !== undefined) updateValues.title = patch.title;
    if (patch.caption !== undefined) updateValues.caption = patch.caption;
    if (patch.status !== undefined) updateValues.status = patch.status;
    if (patch.scheduledAt !== undefined) {
      updateValues.scheduledAt = patch.scheduledAt ? new Date(patch.scheduledAt) : null;
    }

    await db
      .update(verticalVideoPosts)
      .set(updateValues)
      .where(
        and(
          eq(verticalVideoPosts.organizationId, organizationId),
          eq(verticalVideoPosts.id, id)
        )
      );
  } catch (error) {
    // Database fallback
  }

  const posts = seedOrgVerticalPosts(organizationId);
  const target = posts.find(p => p.id === id);
  if (target) {
    Object.assign(target, patch, { updatedAt: now });
    return target;
  }

  return null;
}

export async function deleteVerticalPost(
  organizationId: string,
  id: string
): Promise<boolean> {
  try {
    await db
      .delete(verticalVideoPosts)
      .where(
        and(
          eq(verticalVideoPosts.organizationId, organizationId),
          eq(verticalVideoPosts.id, id)
        )
      );
  } catch (error) {
    // Database fallback
  }

  const posts = seedOrgVerticalPosts(organizationId);
  const filtered = posts.filter(p => p.id !== id);
  memoryStore.set(organizationId, filtered);
  return true;
}

export async function getVerticalPublishSummaryMetrics(
  organizationId: string
): Promise<VerticalPublishSummary> {
  const posts = await getVerticalPosts(organizationId);
  return summarizeVerticalChannelPortfolio(posts);
}
