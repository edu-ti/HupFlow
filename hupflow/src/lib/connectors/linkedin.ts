import { SocialConnector, SocialPublishPayload, SocialPublishResult, SocialAuthTokens } from './types';

export class LinkedInConnector implements SocialConnector {
  public provider: 'linkedin' = 'linkedin';

  private clientId = process.env.LINKEDIN_CLIENT_ID || '';
  private clientSecret = process.env.LINKEDIN_CLIENT_SECRET || '';

  async getAuthUrl(state: string, redirectUri: string): Promise<string> {
    const scopes = encodeURIComponent('openid profile email w_member_social');
    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&scope=${scopes}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<SocialAuthTokens> {
    if (!this.clientId || !this.clientSecret) {
      // Retorno simulado seguro para ambiente local de desenvolvimento
      return {
        accessToken: `li_mock_token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 dias
        accountId: 'urn:li:person:mock123',
        accountName: 'Perfil LinkedIn (Dev)',
        accountAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      };
    }

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Erro ao trocar código do LinkedIn: ${err}`);
    }

    const data = await response.json();
    const expiresAt = new Date(Date.now() + (data.expires_in || 5184000) * 1000);

    // Buscar dados do perfil
    const userinfoRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const profile = await userinfoRes.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
      accountId: profile.sub || 'unknown',
      accountName: profile.name || 'Usuário LinkedIn',
      accountAvatar: profile.picture,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: Date }> {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    const data = await response.json();
    return {
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + (data.expires_in || 5184000) * 1000),
    };
  }

  async publish(accessToken: string, payload: SocialPublishPayload): Promise<SocialPublishResult> {
    try {
      if (accessToken.startsWith('li_mock_token_')) {
        return {
          success: true,
          externalPostId: `urn:li:share:mock_${Date.now()}`,
          externalPostUrl: 'https://www.linkedin.com/feed/',
        };
      }

      // Publicação na UGC Posts API do LinkedIn
      const body = {
        author: 'urn:li:person:me', // O ID real do autor
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: payload.content,
            },
            shareMediaCategory: payload.mediaUrls.length > 0 ? 'IMAGE' : 'NONE',
            media: payload.mediaUrls.map((url) => ({
              status: 'READY',
              originalUrl: url,
            })),
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        return {
          success: false,
          error: `Falha na publicação LinkedIn (${res.status}): ${errText}`,
        };
      }

      const data = await res.json();
      return {
        success: true,
        externalPostId: data.id,
        externalPostUrl: `https://www.linkedin.com/feed/update/${data.id}`,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Erro inesperado ao publicar no LinkedIn',
      };
    }
  }
}

export const linkedInConnector = new LinkedInConnector();
