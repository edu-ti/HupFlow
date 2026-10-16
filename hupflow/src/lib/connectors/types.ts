export type SocialProvider = 'linkedin' | 'x' | 'instagram' | 'facebook' | 'threads';

export interface SocialPublishPayload {
  content: string;
  mediaUrls: string[];
  scheduledAt?: Date;
  extraSettings?: Record<string, any>;
}

export interface SocialPublishResult {
  success: boolean;
  externalPostId?: string;
  externalPostUrl?: string;
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
  exchangeCode(code: string, redirectUri: string): Promise<SocialAuthTokens>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: Date }>;
  publish(accessToken: string, payload: SocialPublishPayload): Promise<SocialPublishResult>;
}
