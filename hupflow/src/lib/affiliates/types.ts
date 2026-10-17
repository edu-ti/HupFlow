export type AffiliateTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export type AffiliatePartnerStatus = 'active' | 'pending_approval' | 'suspended';

export type PayoutMethod = 'pix' | 'bank_transfer' | 'stripe_connect' | 'paypal';

export interface AffiliatePartner {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  referralCode: string;
  tier: AffiliateTier;
  commissionPct: number;
  totalReferredCustomers: number;
  activeCustomersCount: number;
  monthlyRecurringRevenueBrl: number;
  totalEarningsBrl: number;
  availableBalanceBrl: number;
  payoutMethod: PayoutMethod;
  payoutKey: string;
  status: AffiliatePartnerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateReferralEvent {
  id: string;
  organizationId: string;
  partnerId: string;
  customerEmail: string;
  planName: string;
  planAmountBrl: number;
  commissionAmountBrl: number;
  status: 'active' | 'churned' | 'refunded';
  createdAt: string;
}

export interface AffiliateProgramSummary {
  totalPartners: number;
  activePartners: number;
  totalReferredMrrBrl: number;
  totalCommissionsPaidBrl: number;
  pendingPayoutsBrl: number;
  averageCustomerLtvBrl: number;
}

export interface CreateAffiliatePartnerInput {
  name: string;
  email: string;
  referralCode?: string;
  tier?: AffiliateTier;
  payoutMethod?: PayoutMethod;
  payoutKey: string;
}

export interface ProcessPayoutInput {
  partnerId: string;
  amountBrl: number;
  paymentReference?: string;
}
