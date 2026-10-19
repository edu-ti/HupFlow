import {
  AffiliateTier,
  AffiliatePartner,
  AffiliateProgramSummary,
} from './types';

export function getTierCommissionPct(tier: AffiliateTier): number {
  switch (tier) {
    case 'diamond':
      return 40;
    case 'gold':
      return 30;
    case 'silver':
      return 25;
    case 'bronze':
    default:
      return 20;
  }
}

export function determineTierUpgrade(activeCustomers: number, monthlyMrrBrl: number): AffiliateTier {
  if (activeCustomers >= 50 || monthlyMrrBrl >= 15000) {
    return 'diamond';
  }
  if (activeCustomers >= 25 || monthlyMrrBrl >= 7500) {
    return 'gold';
  }
  if (activeCustomers >= 10 || monthlyMrrBrl >= 3000) {
    return 'silver';
  }
  return 'bronze';
}

export function calculateAffiliateCommission(
  planAmountBrl: number,
  commissionPct: number
): number {
  return Math.round(planAmountBrl * (commissionPct / 100));
}

export function summarizeAffiliateProgram(
  partners: AffiliatePartner[]
): AffiliateProgramSummary {
  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.status === 'active').length;
  const totalReferredMrrBrl = partners.reduce((acc, p) => acc + (p.monthlyRecurringRevenueBrl || 0), 0);
  const pendingPayoutsBrl = partners.reduce((acc, p) => acc + (p.availableBalanceBrl || 0), 0);
  const totalEarnings = partners.reduce((acc, p) => acc + (p.totalEarningsBrl || 0), 0);
  const totalCommissionsPaidBrl = Math.max(0, totalEarnings - pendingPayoutsBrl);

  const totalCustomers = partners.reduce((acc, p) => acc + (p.totalReferredCustomers || 0), 0);
  // Estimated LTV across typical 8-month retention for SaaS accounts
  const averageCustomerLtvBrl =
    totalCustomers > 0 ? Math.round((totalReferredMrrBrl * 8) / totalCustomers) : 0;

  return {
    totalPartners,
    activePartners,
    totalReferredMrrBrl,
    totalCommissionsPaidBrl,
    pendingPayoutsBrl,
    averageCustomerLtvBrl,
  };
}

// -------------------------------------------------------------------
// Test Execution Suite
// -------------------------------------------------------------------
function runAffiliateUnitTests() {
  console.log('--- Running Feature 045 Affiliate Program & Recurring Commission Unit Tests ---');

  // 1. Tier percentage rates
  if (getTierCommissionPct('bronze') !== 20) throw new Error('Bronze should be 20%');
  if (getTierCommissionPct('silver') !== 25) throw new Error('Silver should be 25%');
  if (getTierCommissionPct('gold') !== 30) throw new Error('Gold should be 30%');
  if (getTierCommissionPct('diamond') !== 40) throw new Error('Diamond should be 40%');

  // 2. Tier automatic upgrade rules
  if (determineTierUpgrade(5, 1200) !== 'bronze') throw new Error('Expected bronze for 5 cust / 1200 MRR');
  if (determineTierUpgrade(12, 3500) !== 'silver') throw new Error('Expected silver for 12 cust / 3500 MRR');
  if (determineTierUpgrade(30, 8500) !== 'gold') throw new Error('Expected gold for 30 cust / 8500 MRR');
  if (determineTierUpgrade(55, 18000) !== 'diamond') throw new Error('Expected diamond for 55 cust / 18000 MRR');

  // 3. Commission calculations on plan values
  // Starter Plan (R$ 97) at Bronze (20%) -> R$ 19
  const commStarterBronze = calculateAffiliateCommission(97, 20);
  if (commStarterBronze !== 19) throw new Error(`Expected 19 for 97@20%, got ${commStarterBronze}`);

  // Pro Plan (R$ 297) at Gold (30%) -> R$ 89
  const commProGold = calculateAffiliateCommission(297, 30);
  if (commProGold !== 89) throw new Error(`Expected 89 for 297@30%, got ${commProGold}`);

  // Agency Plan (R$ 797) at Diamond (40%) -> R$ 319
  const commAgencyDiamond = calculateAffiliateCommission(797, 40);
  if (commAgencyDiamond !== 319) throw new Error(`Expected 319 for 797@40%, got ${commAgencyDiamond}`);

  // 4. Program Summary Aggregation
  const now = new Date().toISOString();
  const mockPartners: AffiliatePartner[] = [
    {
      id: 'partner-01',
      organizationId: 'org-test',
      name: 'Lucas Growth Marketer',
      email: 'lucas@growth.io',
      referralCode: 'LUCASGROWTH',
      tier: 'gold',
      commissionPct: 30,
      totalReferredCustomers: 28,
      activeCustomersCount: 25,
      monthlyRecurringRevenueBrl: 7425,
      totalEarningsBrl: 15400,
      availableBalanceBrl: 2200,
      payoutMethod: 'pix',
      payoutKey: 'lucas@pix.com',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'partner-02',
      organizationId: 'org-test',
      name: 'Mariana Social Media',
      email: 'mariana@social.com',
      referralCode: 'MARISOCIAL',
      tier: 'silver',
      commissionPct: 25,
      totalReferredCustomers: 12,
      activeCustomersCount: 10,
      monthlyRecurringRevenueBrl: 2970,
      totalEarningsBrl: 5800,
      availableBalanceBrl: 1100,
      payoutMethod: 'pix',
      payoutKey: 'mariana@pix.com',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const summary = summarizeAffiliateProgram(mockPartners);
  if (summary.totalPartners !== 2) throw new Error(`Expected 2 partners, got ${summary.totalPartners}`);
  if (summary.activePartners !== 2) throw new Error('Expected 2 active partners');
  if (summary.totalReferredMrrBrl !== 10395) throw new Error(`Expected 10395 MRR, got ${summary.totalReferredMrrBrl}`);
  if (summary.pendingPayoutsBrl !== 3300) throw new Error(`Expected 3300 pending, got ${summary.pendingPayoutsBrl}`);
  if (summary.totalCommissionsPaidBrl !== 17900) {
    // 15400 + 5800 = 21200 total earnings - 3300 pending = 17900 paid
    throw new Error(`Expected 17900 paid, got ${summary.totalCommissionsPaidBrl}`);
  }

  console.log('✅ All Feature 045 Affiliate Program & Commission unit tests passed successfully!');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('affiliates.test')) {
  runAffiliateUnitTests();
}
