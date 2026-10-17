export type HashtagTier = 'broad' | 'niche' | 'community';

export type SocialNetwork = 'instagram' | 'threads' | 'linkedin' | 'x';

export interface HashtagRecommendation {
  tag: string;
  formattedTag: string;
  tier: HashtagTier;
  relevanceScore: number;
  estimatedReach: 'high' | 'medium' | 'targeted';
  category: string;
}

export interface NetworkGuidance {
  network: SocialNetwork;
  recommendedCount: number;
  maxAllowed: number;
  tip: string;
}

export interface RecommendHashtagsInput {
  text?: string;
  topic?: string;
  network?: SocialNetwork;
  niche?: string;
  limit?: number;
}

export interface HashtagRecommendationResult {
  recommendations: HashtagRecommendation[];
  guidance: NetworkGuidance;
}

export interface HashtagSet {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  tags: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHashtagSetInput {
  name: string;
  category?: string;
  tags: string[];
}
