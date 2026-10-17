export type PlanTier = 'starter' | 'pro' | 'agency';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled';

export interface PlanLimits {
  maxSocialAccounts: number; // -1 = ilimitado
  maxTeamMembers: number;
  maxPostsPerMonth: number; // -1 = ilimitado
  maxStorageBytes: number;
  hasAiCopywriter: boolean;
  hasVectorPdfExport: boolean;
  hasPrioritySupport: boolean;
}

export interface PlanConfig {
  id: PlanTier;
  name: string;
  tagline: string;
  priceMonthly: number; // em BRL
  currency: string;
  badge?: string;
  limits: PlanLimits;
  features: string[];
}

export interface SubscriptionSummary {
  id: string;
  organizationId: string;
  plan: PlanTier;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}

export interface UsageSummary {
  socialAccounts: number;
  teamMembers: number;
  postsThisMonth: number;
  storageBytes: number;
}

export interface BillingDetailsResponse {
  subscription: SubscriptionSummary;
  limits: PlanLimits;
  usage: UsageSummary;
  plans: PlanConfig[];
}
