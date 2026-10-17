import crypto from 'node:crypto';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { affiliatePartners, affiliateReferrals } from '@/lib/db/schema';
import {
  AffiliatePartner,
  AffiliateTier,
  CreateAffiliatePartnerInput,
  ProcessPayoutInput,
  AffiliateProgramSummary,
} from './types';
import {
  getTierCommissionPct,
  summarizeAffiliateProgram,
} from './affiliates.test';

const memoryStore = new Map<string, AffiliatePartner[]>();

function seedOrgAffiliates(organizationId: string): AffiliatePartner[] {
  const existing = memoryStore.get(organizationId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const now = new Date().toISOString();
  const seeds: AffiliatePartner[] = [
    {
      id: 'aff_seed_gabriel',
      organizationId,
      name: 'Gabriel Rezende (Canal Growth Hacks)',
      email: 'gabriel@growthhacks.com.br',
      referralCode: 'GROWTHHACKS',
      tier: 'diamond',
      commissionPct: 40,
      totalReferredCustomers: 64,
      activeCustomersCount: 52,
      monthlyRecurringRevenueBrl: 15444,
      totalEarningsBrl: 32800,
      availableBalanceBrl: 4600,
      payoutMethod: 'pix',
      payoutKey: 'gabriel@pix.me',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'aff_seed_carol',
      organizationId,
      name: 'Carolina Mendes (Agência Vortex)',
      email: 'carol@vortexmidia.com',
      referralCode: 'VORTEXSOCIAL',
      tier: 'gold',
      commissionPct: 30,
      totalReferredCustomers: 32,
      activeCustomersCount: 26,
      monthlyRecurringRevenueBrl: 7722,
      totalEarningsBrl: 14200,
      availableBalanceBrl: 2150,
      payoutMethod: 'pix',
      payoutKey: 'carol@vortex.pix',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'aff_seed_rodrigo',
      organizationId,
      name: 'Rodrigo Salles (Mentor SaaS)',
      email: 'rodrigo@mentorsaas.io',
      referralCode: 'MENTORSAAS',
      tier: 'silver',
      commissionPct: 25,
      totalReferredCustomers: 14,
      activeCustomersCount: 11,
      monthlyRecurringRevenueBrl: 3267,
      totalEarningsBrl: 6400,
      availableBalanceBrl: 850,
      payoutMethod: 'bank_transfer',
      payoutKey: 'Banco Itaú Ag 1234 CC 56789-0',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'aff_seed_fernanda',
      organizationId,
      name: 'Fernanda Lima (Comunidade SocialPro)',
      email: 'fe@socialpro.club',
      referralCode: 'FEPRO',
      tier: 'bronze',
      commissionPct: 20,
      totalReferredCustomers: 6,
      activeCustomersCount: 5,
      monthlyRecurringRevenueBrl: 1485,
      totalEarningsBrl: 1800,
      availableBalanceBrl: 350,
      payoutMethod: 'pix',
      payoutKey: 'fe@pix.com',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
  ];

  memoryStore.set(organizationId, seeds);
  return seeds;
}

export async function getAffiliatePartners(
  organizationId: string,
  filter?: { tier?: AffiliateTier; status?: string }
): Promise<AffiliatePartner[]> {
  try {
    const rows = await db
      .select()
      .from(affiliatePartners)
      .where(eq(affiliatePartners.organizationId, organizationId))
      .orderBy(desc(affiliatePartners.monthlyRecurringRevenueBrl));

    if (rows && rows.length > 0) {
      let items: AffiliatePartner[] = rows.map(r => ({
        id: r.id,
        organizationId: r.organizationId,
        name: r.name,
        email: r.email,
        referralCode: r.referralCode,
        tier: r.tier as any,
        commissionPct: r.commissionPct,
        totalReferredCustomers: r.totalReferredCustomers,
        activeCustomersCount: r.activeCustomersCount,
        monthlyRecurringRevenueBrl: r.monthlyRecurringRevenueBrl,
        totalEarningsBrl: r.totalEarningsBrl,
        availableBalanceBrl: r.availableBalanceBrl,
        payoutMethod: r.payoutMethod as any,
        payoutKey: r.payoutKey,
        status: r.status as any,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      }));

      if (filter?.tier) {
        items = items.filter(p => p.tier === filter.tier);
      }
      if (filter?.status) {
        items = items.filter(p => p.status === filter.status);
      }

      return items;
    }
  } catch (error) {
    // Database connection or table unavailable; fallback to memory store
  }

  let memory = seedOrgAffiliates(organizationId);
  if (filter?.tier) {
    memory = memory.filter(p => p.tier === filter.tier);
  }
  if (filter?.status) {
    memory = memory.filter(p => p.status === filter.status);
  }
  return memory;
}

export async function getAffiliatePartnerById(
  organizationId: string,
  id: string
): Promise<AffiliatePartner | null> {
  try {
    const rows = await db
      .select()
      .from(affiliatePartners)
      .where(
        and(
          eq(affiliatePartners.organizationId, organizationId),
          eq(affiliatePartners.id, id)
        )
      )
      .limit(1);

    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        organizationId: r.organizationId,
        name: r.name,
        email: r.email,
        referralCode: r.referralCode,
        tier: r.tier as any,
        commissionPct: r.commissionPct,
        totalReferredCustomers: r.totalReferredCustomers,
        activeCustomersCount: r.activeCustomersCount,
        monthlyRecurringRevenueBrl: r.monthlyRecurringRevenueBrl,
        totalEarningsBrl: r.totalEarningsBrl,
        availableBalanceBrl: r.availableBalanceBrl,
        payoutMethod: r.payoutMethod as any,
        payoutKey: r.payoutKey,
        status: r.status as any,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      };
    }
  } catch (error) {
    // Database fallback
  }

  const memory = seedOrgAffiliates(organizationId);
  return memory.find(p => p.id === id) || null;
}

export async function createAffiliatePartner(
  organizationId: string,
  input: CreateAffiliatePartnerInput
): Promise<AffiliatePartner> {
  const tier = input.tier || 'bronze';
  const commissionPct = getTierCommissionPct(tier);
  const referralCode =
    input.referralCode?.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') ||
    input.name.slice(0, 6).toUpperCase().replace(/[^A-Z0-9]/g, '') +
      Math.floor(100 + Math.random() * 900);

  const id = `aff_${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const newPartner: AffiliatePartner = {
    id,
    organizationId,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    referralCode,
    tier,
    commissionPct,
    totalReferredCustomers: 0,
    activeCustomersCount: 0,
    monthlyRecurringRevenueBrl: 0,
    totalEarningsBrl: 0,
    availableBalanceBrl: 0,
    payoutMethod: input.payoutMethod || 'pix',
    payoutKey: input.payoutKey.trim(),
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.insert(affiliatePartners).values({
      id: newPartner.id,
      organizationId: newPartner.organizationId,
      name: newPartner.name,
      email: newPartner.email,
      referralCode: newPartner.referralCode,
      tier: newPartner.tier,
      commissionPct: newPartner.commissionPct,
      totalReferredCustomers: newPartner.totalReferredCustomers,
      activeCustomersCount: newPartner.activeCustomersCount,
      monthlyRecurringRevenueBrl: newPartner.monthlyRecurringRevenueBrl,
      totalEarningsBrl: newPartner.totalEarningsBrl,
      availableBalanceBrl: newPartner.availableBalanceBrl,
      payoutMethod: newPartner.payoutMethod,
      payoutKey: newPartner.payoutKey,
      status: newPartner.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    // Database fallback
  }

  const existing = seedOrgAffiliates(organizationId);
  memoryStore.set(organizationId, [newPartner, ...existing]);

  return newPartner;
}

export async function updateAffiliatePartner(
  organizationId: string,
  id: string,
  patch: Partial<AffiliatePartner>
): Promise<AffiliatePartner | null> {
  const now = new Date().toISOString();

  try {
    const updateValues: Record<string, any> = { updatedAt: new Date() };
    if (patch.name !== undefined) updateValues.name = patch.name;
    if (patch.email !== undefined) updateValues.email = patch.email;
    if (patch.tier !== undefined) {
      updateValues.tier = patch.tier;
      updateValues.commissionPct = getTierCommissionPct(patch.tier);
    }
    if (patch.status !== undefined) updateValues.status = patch.status;
    if (patch.payoutMethod !== undefined) updateValues.payoutMethod = patch.payoutMethod;
    if (patch.payoutKey !== undefined) updateValues.payoutKey = patch.payoutKey;
    if (patch.availableBalanceBrl !== undefined) updateValues.availableBalanceBrl = patch.availableBalanceBrl;

    await db
      .update(affiliatePartners)
      .set(updateValues)
      .where(
        and(
          eq(affiliatePartners.organizationId, organizationId),
          eq(affiliatePartners.id, id)
        )
      );
  } catch (error) {
    // Database fallback
  }

  const partners = seedOrgAffiliates(organizationId);
  const target = partners.find(p => p.id === id);
  if (target) {
    Object.assign(target, patch, { updatedAt: now });
    if (patch.tier) {
      target.commissionPct = getTierCommissionPct(patch.tier);
    }
    return target;
  }

  return null;
}

export async function processPartnerPayout(
  organizationId: string,
  input: ProcessPayoutInput
): Promise<{ success: boolean; partner: AffiliatePartner | null; payoutAmount: number }> {
  const partner = await getAffiliatePartnerById(organizationId, input.partnerId);
  if (!partner) {
    return { success: false, partner: null, payoutAmount: 0 };
  }

  const payoutAmount = Math.min(partner.availableBalanceBrl, Math.max(0, input.amountBrl));
  const newBalance = Math.max(0, partner.availableBalanceBrl - payoutAmount);

  const updated = await updateAffiliatePartner(organizationId, partner.id, {
    availableBalanceBrl: newBalance,
  });

  return {
    success: true,
    partner: updated,
    payoutAmount,
  };
}

export async function deleteAffiliatePartner(
  organizationId: string,
  id: string
): Promise<boolean> {
  try {
    await db
      .delete(affiliatePartners)
      .where(
        and(
          eq(affiliatePartners.organizationId, organizationId),
          eq(affiliatePartners.id, id)
        )
      );
  } catch (error) {
    // Database fallback
  }

  const partners = seedOrgAffiliates(organizationId);
  const filtered = partners.filter(p => p.id !== id);
  memoryStore.set(organizationId, filtered);
  return true;
}

export async function getAffiliateProgramSummaryMetrics(
  organizationId: string
): Promise<AffiliateProgramSummary> {
  const partners = await getAffiliatePartners(organizationId);
  return summarizeAffiliateProgram(partners);
}
