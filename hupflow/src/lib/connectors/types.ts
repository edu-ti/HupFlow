export type SocialProvider = 'linkedin' | 'x' | 'instagram' | 'facebook' | 'threads';

export interface SocialPublishPayload {
  content: string;
  mediaUrls: string[];
  documentUrl?: string; // Para Carrosséis PDF nativos do LinkedIn
  documentTitle?: string;
  isThread?: boolean; // Para Threads do X (Twitter)
  threadNodes?: string[]; // Nós sequenciais da thread
  scheduledAt?: Date;
  extraSettings?: Record<string, any>;
}

export interface SocialPublishResult {
  success: boolean;
  externalPostId?: string;
  externalPostUrl?: string;
  threadPostIds?: string[]; // IDs de cada tweet da thread publicada
  error?: string;
}

export interface SocialAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  accountId: string;
  accountName: string;
  accountAvatar?: string;
}

export interface SocialConnector {
  provider: SocialProvider;
  getAuthUrl(state: string, redirectUri: string): Promise<string>;
  exchangeCode(code: string, redirectUri: string, codeVerifier?: string): Promise<SocialAuthTokens>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: Date }>;
  publish(accessToken: string, payload: SocialPublishPayload): Promise<SocialPublishResult>;
}

export interface SocialAccountSummary {
  id: string;
  organizationId: string;
  provider: SocialProvider;
  providerAccountId: string;
  accountName: string;
  accountAvatar?: string | null;
  connectedAt: string;
  status: 'active' | 'expired';
}
