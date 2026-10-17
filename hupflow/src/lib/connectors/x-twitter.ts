import { SocialConnector, SocialPublishPayload, SocialPublishResult, SocialAuthTokens } from './types';
import { generateCodeChallenge, generateCodeVerifier, splitIntoTweetThread } from './pkce';

export class XTwitterConnector implements SocialConnector {
  public provider: 'x' = 'x';

  private clientId = process.env.X_CLIENT_ID || '';
  private clientSecret = process.env.X_CLIENT_SECRET || '';

  async getAuthUrl(state: string, redirectUri: string, codeVerifier?: string): Promise<string> {
    const verifier = codeVerifier || generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    const scopes = encodeURIComponent('tweet.read tweet.write users.read offline.access');

    return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scopes}&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`;
  }

  async exchangeCode(code: string, redirectUri: string, codeVerifier: string = 'challenge'): Promise<SocialAuthTokens> {
    if (!this.clientId || !this.clientSecret || code.startsWith('mock_')) {
      // Mock seguro para ambiente local de desenvolvimento
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
        code_verifier: codeVerifier,
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
      const isThreadRequested = payload.isThread || payload.content.length > 280;
      const nodes = isThreadRequested
        ? payload.threadNodes || splitIntoTweetThread(payload.content, 280)
        : [payload.content];

      if (accessToken.startsWith('x_mock_token_') || !this.clientId) {
        const mockIds = nodes.map((_, i) => `x_tweet_${Date.now()}_${i + 1}`);
        return {
          success: true,
          externalPostId: mockIds[0],
          externalPostUrl: `https://x.com/home/status/${mockIds[0]}`,
          threadPostIds: mockIds,
        };
      }

      // Publicação real via API v2 com suporte a threads sequenciais
      const publishedIds: string[] = [];
      let previousTweetId: string | null = null;

      for (let i = 0; i < nodes.length; i++) {
        const tweetText = nodes[i];
        const bodyPayload: any = {
          text: tweetText,
        };

        if (previousTweetId) {
          bodyPayload.reply = {
            in_reply_to_tweet_id: previousTweetId,
          };
        }

        const res = await fetch('https://api.twitter.com/2/tweets', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyPayload),
        });

        if (!res.ok) {
          const errText = await res.text();
          return {
            success: false,
            error: `Erro ao publicar tweet ${i + 1} no X/Twitter (${res.status}): ${errText}`,
            threadPostIds: publishedIds,
          };
        }

        const data = await res.json();
        const tweetId = data.data?.id;
        publishedIds.push(tweetId);
        previousTweetId = tweetId;
      }

      return {
        success: true,
        externalPostId: publishedIds[0],
        externalPostUrl: `https://x.com/i/web/status/${publishedIds[0]}`,
        threadPostIds: publishedIds,
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
