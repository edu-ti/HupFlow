export type AdvocacyChannel = 'linkedin' | 'instagram' | 'x';

export type AdvocacyPersonaType =
  | 'executive_vision'
  | 'technical_builder'
  | 'sales_advisor';

export type AmbassadorBadgeTier =
  | 'Diamond Ambassador'
  | 'Gold Voice'
  | 'Rising Star';

export interface AdvocacyPersonaVariation {
  persona: AdvocacyPersonaType;
  label: string;
  copyText: string;
}

export interface AdvocacyCampaignImpact {
  totalOrganicReach: number;
  estimatedClicks: number;
  adSpendSavedBrl: number;
}

export interface AdvocacyCampaignItem {
  id: string;
  organizationId: string;
  title: string;
  department: string;
  channel: AdvocacyChannel;
  baseMessage: string;
  targetUrl: string;
  pointsReward: number;
  sharesCount: number;
  avgReachPerShare: number;
  personaVariations: AdvocacyPersonaVariation[];
  impact: AdvocacyCampaignImpact;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdvocacyLeaderboardMember {
  id: string;
  memberName: string;
  roleTitle: string;
  sharesCount: number;
  points: number;
  organicReachGenerated: number;
  badge: AmbassadorBadgeTier;
}

export interface AdvocacyProgramSummary {
  totalCampaigns: number;
  totalShares: number;
  totalOrganicReach: number;
  totalAdSpendSavedBrl: number;
  activeAmbassadors: number;
}

export interface CreateAdvocacyCampaignInput {
  title: string;
  department?: string;
  channel: AdvocacyChannel;
  baseMessage: string;
  targetUrl: string;
  pointsReward?: number;
  avgReachPerShare?: number;
}
