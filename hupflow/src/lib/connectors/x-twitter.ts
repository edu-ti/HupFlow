import { SocialConnector, SocialPublishPayload, SocialPublishResult, SocialAuthTokens } from './types';

export class XTwitterConnector implements SocialConnector {
  public provider: 'x' = 'x';

  private clientId = process.env.X_CLIENT_ID || '';
  private clientSecret = process.env.X_CLIENT_SECRET || '';

  async getAuthUrl(state: string, redirectUri: string): Promise<string> {
    const scopes = encodeURIComponent('tweet.read tweet.write users.read offline.access');
    return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scopes}&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<SocialAuthTokens> {
    if (!this.clientId || !this.clientSecret) {
      // Mock para ambiente local de desenvolvimento
      return {
        accessToken: `x_mock_token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
        accountId: '123456789_x',
        accountName: '@hupflow_dev',
        accountAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      };
    }

    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: this.clientId,
        redirect_uri: redirectUri,
        code_verifier: 'challenge',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Erro ao trocar código do X/Twitter: ${err}`);
    }

    const data = await response.json();
    const expiresAt = new Date(Date.now() + (data.expires_in || 7200) * 1000);

    // Buscar informações do usuário
    const meRes = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const me = await meRes.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
      accountId: me.data?.id || 'unknown',
      accountName: `@${me.data?.username || 'user'}`,
      accountAvatar: me.data?.profile_image_url,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: Date }> {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        client_id: this.clientId,
      }),
    });

    const data = await response.json();
    return {
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + (data.expires_in || 7200) * 1000),
    };
  }

  async publish(accessToken: string, payload: SocialPublishPayload): Promise<SocialPublishResult> {
    try {
      if (accessToken.startsWith('x_mock_token_')) {
        return {
          success: true,
          externalPostId: `x_tweet_${Date.now()}`,
          externalPostUrl: 'https://x.com/home',
        };
      }

      const body: { text: string } = {
        text: payload.content,
      };

      const res = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        return {
          success: false,
          error: `Erro ao publicar no X/Twitter (${res.status}): ${err}`,
        };
      }

      const data = await res.json();
      return {
        success: true,
        externalPostId: data.data?.id,
        externalPostUrl: `https://x.com/i/web/status/${data.data?.id}`,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Erro inesperado ao publicar no X/Twitter',
      };
    }
  }
}

export const xTwitterConnector = new XTwitterConnector();
