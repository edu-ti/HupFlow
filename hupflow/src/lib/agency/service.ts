import crypto from 'node:crypto';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { agencyBrandProfiles } from '@/lib/db/schema';
import {
  AgencyBrandProfile,
  AgencyPortfolioSummary,
  CreateAgencyBrandInput,
  FilterBrandsOptions,
} from './types';
import {
  filterAgencyBrands,
  calculateAgencyPortfolioSummary,
} from './agency.test';

const memoryStore = new Map<string, AgencyBrandProfile[]>();

function seedOrgBrands(organizationId: string): AgencyBrandProfile[] {
  const existing = memoryStore.get(organizationId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const now = new Date().toISOString();
  const seeds: AgencyBrandProfile[] = [
    {
      id: 'brand_seed_nordic',
      organizationId,
      brandName: 'Nordic Coffeemakers',
      slug: 'nordic-coffee',
      niche: 'E-commerce & Gourmet',
      colorHex: '#d97706',
      tier: 'premium',
      isFavorite: true,
      connectedChannelsCount: 3,
      scheduledPostsCount: 14,
      monthlyPostQuota: 60,
      status: 'active',
      tags: ['cafe', 'gourmet', 'ecommerce', 'lifestyle'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'brand_seed_pulse',
      organizationId,
      brandName: 'Pulse Fintech B2B',
      slug: 'pulse-fintech',
      niche: 'Finanças & B2B',
      colorHex: '#2563eb',
      tier: 'enterprise_vip',
      isFavorite: true,
      connectedChannelsCount: 4,
      scheduledPostsCount: 22,
      monthlyPostQuota: 90,
      status: 'active',
      tags: ['fintech', 'b2b', 'linkedin', 'series-a'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'brand_seed_aura',
      organizationId,
      brandName: 'Aura Skincare & Dermato',
      slug: 'aura-skincare',
      niche: 'Saúde & Beleza',
      colorHex: '#ec4899',
      tier: 'standard',
      isFavorite: false,
      connectedChannelsCount: 2,
      scheduledPostsCount: 8,
      monthlyPostQuota: 45,
      status: 'active',
      tags: ['beleza', 'dermato', 'instagram', 'ugc'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'brand_seed_urban',
      organizationId,
      brandName: 'Urban Habitat Imóveis',
      slug: 'urban-habitat',
      niche: 'Imobiliário Alto Padrão',
      colorHex: '#059669',
      tier: 'premium',
      isFavorite: false,
      connectedChannelsCount: 2,
      scheduledPostsCount: 6,
      monthlyPostQuota: 40,
      status: 'onboarding',
      tags: ['imoveis', 'luxo', 'tour-virtual'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'brand_seed_zenith',
      organizationId,
      brandName: 'Zenith Escola de Programação',
      slug: 'zenith-tech',
      niche: 'Educação & Infoprodutos',
      colorHex: '#8b5cf6',
      tier: 'standard',
      isFavorite: false,
      connectedChannelsCount: 3,
      scheduledPostsCount: 12,
      monthlyPostQuota: 50,
      status: 'active',
      tags: ['tech', 'bootcamp', 'youtube', 'carrossel'],
      createdAt: now,
      updatedAt: now,
    },
  ];

  memoryStore.set(organizationId, seeds);
  return seeds;
}

export async function getAgencyBrands(
  organizationId: string,
  options?: FilterBrandsOptions
): Promise<AgencyBrandProfile[]> {
  try {
    const rows = await db
      .select()
      .from(agencyBrandProfiles)
      .where(eq(agencyBrandProfiles.organizationId, organizationId))
      .orderBy(desc(agencyBrandProfiles.isFavorite), desc(agencyBrandProfiles.scheduledPostsCount));

    if (rows && rows.length > 0) {
      const mapped: AgencyBrandProfile[] = rows.map(r => ({
        id: r.id,
        organizationId: r.organizationId,
        brandName: r.brandName,
        slug: r.slug,
        niche: r.niche,
        colorHex: r.colorHex,
        tier: r.tier as any,
        isFavorite: r.isFavorite,
        connectedChannelsCount: r.connectedChannelsCount,
        scheduledPostsCount: r.scheduledPostsCount,
        monthlyPostQuota: r.monthlyPostQuota,
        status: r.status as any,
        tags: (r.tags as string[]) || [],
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      }));

      return filterAgencyBrands(mapped, options);
    }
  } catch (error) {
    // Database connection or table unavailable; fallback to memory store
  }

  const memory = seedOrgBrands(organizationId);
  return filterAgencyBrands(memory, options);
}

export async function getAgencyBrandById(
  organizationId: string,
  id: string
): Promise<AgencyBrandProfile | null> {
  try {
    const rows = await db
      .select()
      .from(agencyBrandProfiles)
      .where(
        and(
          eq(agencyBrandProfiles.organizationId, organizationId),
          eq(agencyBrandProfiles.id, id)
        )
      )
      .limit(1);

    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        organizationId: r.organizationId,
        brandName: r.brandName,
        slug: r.slug,
        niche: r.niche,
        colorHex: r.colorHex,
        tier: r.tier as any,
        isFavorite: r.isFavorite,
        connectedChannelsCount: r.connectedChannelsCount,
        scheduledPostsCount: r.scheduledPostsCount,
        monthlyPostQuota: r.monthlyPostQuota,
        status: r.status as any,
        tags: (r.tags as string[]) || [],
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      };
    }
  } catch (error) {
    // Database fallback
  }

  const memory = seedOrgBrands(organizationId);
  return memory.find(b => b.id === id) || null;
}

export async function createAgencyBrand(
  organizationId: string,
  input: CreateAgencyBrandInput
): Promise<AgencyBrandProfile> {
  const id = `brand_${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const newBrand: AgencyBrandProfile = {
    id,
    organizationId,
    brandName: input.brandName.trim(),
    slug: input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    niche: input.niche.trim(),
    colorHex: input.colorHex || '#6366f1',
    tier: input.tier || 'standard',
    isFavorite: false,
    connectedChannelsCount: 2,
    scheduledPostsCount: 0,
    monthlyPostQuota: input.monthlyPostQuota || 60,
    status: 'active',
    tags: input.tags && input.tags.length > 0 ? input.tags : ['marca', 'cliente'],
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.insert(agencyBrandProfiles).values({
      id: newBrand.id,
      organizationId: newBrand.organizationId,
      brandName: newBrand.brandName,
      slug: newBrand.slug,
      niche: newBrand.niche,
      colorHex: newBrand.colorHex,
      tier: newBrand.tier,
      isFavorite: newBrand.isFavorite,
      connectedChannelsCount: newBrand.connectedChannelsCount,
      scheduledPostsCount: newBrand.scheduledPostsCount,
      monthlyPostQuota: newBrand.monthlyPostQuota,
      status: newBrand.status,
      tags: newBrand.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    // Database fallback
  }

  const existing = seedOrgBrands(organizationId);
  memoryStore.set(organizationId, [newBrand, ...existing]);

  return newBrand;
}

export async function updateAgencyBrand(
  organizationId: string,
  id: string,
  patch: Partial<AgencyBrandProfile>
): Promise<AgencyBrandProfile | null> {
  const now = new Date().toISOString();

  try {
    const updateValues: Record<string, any> = { updatedAt: new Date() };
    if (patch.brandName !== undefined) updateValues.brandName = patch.brandName;
    if (patch.niche !== undefined) updateValues.niche = patch.niche;
    if (patch.colorHex !== undefined) updateValues.colorHex = patch.colorHex;
    if (patch.tier !== undefined) updateValues.tier = patch.tier;
    if (patch.status !== undefined) updateValues.status = patch.status;
    if (patch.isFavorite !== undefined) updateValues.isFavorite = patch.isFavorite;
    if (patch.monthlyPostQuota !== undefined) updateValues.monthlyPostQuota = patch.monthlyPostQuota;
    if (patch.scheduledPostsCount !== undefined) updateValues.scheduledPostsCount = patch.scheduledPostsCount;
    if (patch.tags !== undefined) updateValues.tags = patch.tags;

    await db
      .update(agencyBrandProfiles)
      .set(updateValues)
      .where(
        and(
          eq(agencyBrandProfiles.organizationId, organizationId),
          eq(agencyBrandProfiles.id, id)
        )
      );
  } catch (error) {
    // Database fallback
  }

  const brands = seedOrgBrands(organizationId);
  const target = brands.find(b => b.id === id);
  if (target) {
    Object.assign(target, patch, { updatedAt: now });
    return target;
  }

  return null;
}

export async function toggleBrandFavorite(
  organizationId: string,
  id: string
): Promise<AgencyBrandProfile | null> {
  const brands = await getAgencyBrands(organizationId);
  const target = brands.find(b => b.id === id);
  if (!target) return null;

  return updateAgencyBrand(organizationId, id, {
    isFavorite: !target.isFavorite,
  });
}

export async function deleteAgencyBrand(
  organizationId: string,
  id: string
): Promise<boolean> {
  try {
    await db
      .delete(agencyBrandProfiles)
      .where(
        and(
          eq(agencyBrandProfiles.organizationId, organizationId),
          eq(agencyBrandProfiles.id, id)
        )
      );
  } catch (error) {
    // Database fallback
  }

  const brands = seedOrgBrands(organizationId);
  const filtered = brands.filter(b => b.id !== id);
  memoryStore.set(organizationId, filtered);
  return true;
}

export async function getAgencyPortfolioSummaryMetrics(
  organizationId: string
): Promise<AgencyPortfolioSummary> {
  const brands = await getAgencyBrands(organizationId);
  return calculateAgencyPortfolioSummary(brands);
}
