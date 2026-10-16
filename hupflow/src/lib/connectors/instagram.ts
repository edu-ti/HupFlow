import { SocialConnector, SocialPublishPayload, SocialPublishResult, SocialAuthTokens } from './types';

export class InstagramConnector implements SocialConnector {
  public provider: 'instagram' = 'instagram';

  private appId = process.env.META_APP_ID || '';
  private appSecret = process.env.META_APP_SECRET || '';

  async getAuthUrl(state: string, redirectUri: string): Promise<string> {
    const scopes = encodeURIComponent('instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement');
    return `https://www.facebook.com/v21.0/dialog/oauth?client_id=${this.appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&scope=${scopes}&response_type=code`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<SocialAuthTokens> {
    if (!this.appId || !this.appSecret || code === 'mock_code') {
      // Mock seguro para desenvolvimento local
      return {
        accessToken: `ig_mock_token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 dias
        accountId: '17841400000000000',
        accountName: 'Perfil Instagram (Dev)',
        accountAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      };
    }

    // 1. Obter token de curta duração
    const tokenUrl = `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${this.appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&client_secret=${this.appSecret}&code=${code}`;

    const tokenRes = await fetch(tokenUrl);
    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      throw new Error(`Erro ao trocar código do Instagram/Meta: ${err}`);
    }
    const tokenData = await tokenRes.json();

    // 2. Trocar pelo token de longa duração (60 dias)
    const longLivedUrl = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appId}&client_secret=${this.appSecret}&fb_exchange_token=${tokenData.access_token}`;
    const longLivedRes = await fetch(longLivedUrl);
    const longLivedData = await longLivedRes.json();
    const finalToken = longLivedData.access_token || tokenData.access_token;

    // 3. Obter ID da conta do Instagram conectada
    const meRes = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${finalToken}`);
    const meData = await meRes.json();
    const pageId = meData.data?.[0]?.id || 'unknown';

    const igAccountRes = await fetch(
      `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account{id,username,profile_picture_url}&access_token=${finalToken}`
    );
    const igAccountData = await igAccountRes.json();
    const igUser = igAccountData.instagram_business_account;

    return {
      accessToken: finalToken,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      accountId: igUser?.id || pageId,
      accountName: igUser?.username ? `@${igUser.username}` : 'Instagram Professional',
      accountAvatar: igUser?.profile_picture_url,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: Date }> {
    const refreshUrl = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appId}&client_secret=${this.appSecret}&fb_exchange_token=${refreshToken}`;
    const res = await fetch(refreshUrl);
    const data = await res.json();
    return {
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    };
  }

  async publish(accessToken: string, payload: SocialPublishPayload): Promise<SocialPublishResult> {
    try {
      if (accessToken.startsWith('ig_mock_token_')) {
        return {
          success: true,
          externalPostId: `ig_post_mock_${Date.now()}`,
          externalPostUrl: 'https://instagram.com/p/mock123/',
        };
      }

      const igUserId = payload.extraSettings?.igUserId || 'me';
      const hasMedia = payload.mediaUrls && payload.mediaUrls.length > 0;
      const imageUrl = hasMedia ? payload.mediaUrls[0] : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080';

      // Passo 1: Criar container de mídia na Meta Graph API
      const containerRes = await fetch(`https://graph.facebook.com/v21.0/${igUserId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: payload.content,
          access_token: accessToken,
        }),
      });

      if (!containerRes.ok) {
        const err = await containerRes.text();
        return {
          success: false,
          error: `Falha ao criar container do Instagram: ${err}`,
        };
      }

      const containerData = await containerRes.json();
      const creationId = containerData.id;

      // Passo 2: Publicar o container
      const publishRes = await fetch(`https://graph.facebook.com/v21.0/${igUserId}/media_publish`, {
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
          error: `Falha ao publicar container no feed do Instagram: ${err}`,
        };
      }

      const publishData = await publishRes.json();
      return {
        success: true,
        externalPostId: publishData.id,
        externalPostUrl: `https://www.instagram.com/p/${publishData.id}/`,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Erro inesperado na publicação do Instagram.',
      };
    }
  }
}

export const instagramConnector = new InstagramConnector();
