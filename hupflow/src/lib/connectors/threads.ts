import { SocialConnector, SocialPublishPayload, SocialPublishResult, SocialAuthTokens } from './types';

export class ThreadsConnector implements SocialConnector {
  public provider: 'threads' = 'threads';

  private appId = process.env.THREADS_APP_ID || '';
  private appSecret = process.env.THREADS_APP_SECRET || '';

  async getAuthUrl(state: string, redirectUri: string): Promise<string> {
    const scopes = encodeURIComponent('threads_basic,threads_content_publish');
    return `https://threads.net/oauth/authorize?client_id=${this.appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scopes}&response_type=code&state=${state}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<SocialAuthTokens> {
    if (!this.appId || !this.appSecret || code === 'mock_code') {
      // Mock seguro para desenvolvimento local
      return {
        accessToken: `th_mock_token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 dias
        accountId: 'threads_user_123',
        accountName: '@hupflow_threads',
        accountAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      };
    }

    const tokenUrl = 'https://graph.threads.net/oauth/access_token';
    const form = new URLSearchParams({
      client_id: this.appId,
      client_secret: this.appSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code,
    });

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Erro ao trocar código do Threads: ${err}`);
    }

    const data = await res.json();

    // Obter dados do perfil do Threads
    const meRes = await fetch(
      `https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url&access_token=${data.access_token}`
    );
    const me = await meRes.json();

    return {
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      accountId: me.id || data.user_id,
      accountName: me.username ? `@${me.username}` : 'Usuário Threads',
      accountAvatar: me.threads_profile_picture_url,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: Date }> {
    const url = `https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=${refreshToken}`;
    const res = await fetch(url);
    const data = await res.json();
    return {
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    };
  }

  async publish(accessToken: string, payload: SocialPublishPayload): Promise<SocialPublishResult> {
    try {
      if (accessToken.startsWith('th_mock_token_')) {
        return {
          success: true,
          externalPostId: `th_post_mock_${Date.now()}`,
          externalPostUrl: 'https://threads.net/@hupflow_threads/post/mock123',
        };
      }

      const threadsUserId = payload.extraSettings?.threadsUserId || 'me';

      // Passo 1: Criar container no Threads
      const hasMedia = payload.mediaUrls && payload.mediaUrls.length > 0;
      const bodyParams: Record<string, string> = {
        media_type: hasMedia ? 'IMAGE' : 'TEXT',
        text: payload.content.slice(0, 500),
        access_token: accessToken,
      };

      if (hasMedia) {
        bodyParams.image_url = payload.mediaUrls[0];
      }

      const containerRes = await fetch(`https://graph.threads.net/v1.0/${threadsUserId}/threads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyParams),
      });

      if (!containerRes.ok) {
        const err = await containerRes.text();
        return {
          success: false,
          error: `Falha ao criar container do Threads: ${err}`,
        };
      }

      const containerData = await containerRes.json();
      const creationId = containerData.id;

      // Passo 2: Publicar o container
      const publishRes = await fetch(`https://graph.threads.net/v1.0/${threadsUserId}/threads_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      });

      if (!publishRes.ok) {
        const err = await publishRes.text();
        return {
          success: false,
          error: `Falha ao publicar no Threads: ${err}`,
        };
      }

      const publishData = await publishRes.json();
      return {
        success: true,
        externalPostId: publishData.id,
        externalPostUrl: `https://threads.net/post/${publishData.id}`,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Erro inesperado na publicação do Threads.',
      };
    }
  }
}

export const threadsConnector = new ThreadsConnector();
