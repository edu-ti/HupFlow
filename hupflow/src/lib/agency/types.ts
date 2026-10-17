export type BrandTier = 'standard' | 'premium' | 'enterprise_vip';

export type BrandStatus = 'active' | 'onboarding' | 'paused';

export interface AgencyBrandProfile {
  id: string;
  organizationId: string;
  brandName: string;
  slug: string;
  niche: string;
  colorHex: string;
  tier: BrandTier;
  isFavorite: boolean;
  connectedChannelsCount: number;
  scheduledPostsCount: number;
  monthlyPostQuota: number;
  status: BrandStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AgencyPortfolioSummary {
  totalBrands: number;
  activeBrands: number;
  totalConnectedChannels: number;
  totalScheduledPosts: number;
  favoriteBrandsCount: number;
  averageQuotaUtilizationPct: number;
}

export interface CreateAgencyBrandInput {
  brandName: string;
  slug: string;
  niche: string;
  colorHex?: string;
  tier?: BrandTier;
  monthlyPostQuota?: number;
  tags?: string[];
}

export interface FilterBrandsOptions {
  query?: string;
  niche?: string;
  favoritesOnly?: boolean;
  status?: BrandStatus;
}
