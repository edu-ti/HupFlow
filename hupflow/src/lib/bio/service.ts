import { db } from '@/lib/db';
import { bioProfiles, bioLinks, bioClicks, organizations } from '@/lib/db/schema';
import { eq, desc, asc, and } from 'drizzle-orm';
import {
  BioLink,
  BioProfile,
  BioPublicData,
  BioStats,
  BioThemePreset,
  BioSocialLinks,
  BioCustomTheme,
  BioShowcasePost,
} from './types';
import {
  sanitizeHandle,
  isValidHandle,
  calculateBioCtr,
  sortBioLinks,
  getThemeConfig,
} from './bio-utils';

export {
  sanitizeHandle,
  isValidHandle,
  calculateBioCtr,
  sortBioLinks,
  getThemeConfig,
};

// Mock in-memory state para ambientes de teste e sandbox
const memoryBioProfiles = new Map<string, BioProfile>();
const memoryBioLinks = new Map<string, BioLink[]>();

export async function getBioProfileByOrganization(organizationId: string): Promise<{
  profile: BioProfile | null;
  links: BioLink[];
  stats: BioStats;
}> {
  try {
    const profileRows = await db
      .select()
      .from(bioProfiles)
      .where(eq(bioProfiles.organizationId, organizationId))
      .limit(1);

    if (profileRows.length > 0) {
      const p = profileRows[0];
      const linkRows = await db
        .select()
        .from(bioLinks)
        .where(eq(bioLinks.profileId, p.id))
        .orderBy(asc(bioLinks.sortOrder));

      const links: BioLink[] = linkRows.map((l) => ({
        id: l.id,
        profileId: l.profileId,
        title: l.title,
        subtitle: l.subtitle,
        url: l.url,
        icon: l.icon,
        isFeatured: l.isFeatured,
        isActive: l.isActive,
        sortOrder: l.sortOrder,
        clickCount: l.clickCount,
        createdAt: l.createdAt ? new Date(l.createdAt).getTime() : Date.now(),
        updatedAt: l.updatedAt ? new Date(l.updatedAt).getTime() : Date.now(),
      }));

      const totalClicks = links.reduce((acc, curr) => acc + curr.clickCount, 0);
      const totalViews = p.totalViews || 0;
      const ctr = calculateBioCtr(totalViews, totalClicks);

      const profile: BioProfile = {
        id: p.id,
        workspaceId: p.organizationId,
        handle: p.handle,
        title: p.title,
        bio: p.bio,
        avatarUrl: p.avatarUrl,
        theme: (p.theme as BioThemePreset) || 'midnight',
        customThemeConfig: (p.customThemeConfig as BioCustomTheme) || null,
        socialLinks: (p.socialLinks as BioSocialLinks) || {},
        showPostsShowcase: p.showPostsShowcase,
        isPublished: p.isPublished,
        totalViews,
        createdAt: p.createdAt ? new Date(p.createdAt).getTime() : Date.now(),
        updatedAt: p.updatedAt ? new Date(p.updatedAt).getTime() : Date.now(),
      };

      return { profile, links: sortBioLinks(links), stats: { totalViews, totalClicks, ctr } };
    }
  } catch (err) {
    console.warn('[BioService] Falha de conexão DB, usando fallback local:', err);
  }

  // Fallback in-memory
  const p = memoryBioProfiles.get(organizationId);
  if (p) {
    const links = memoryBioLinks.get(p.id) || [];
    const totalClicks = links.reduce((acc, curr) => acc + curr.clickCount, 0);
    const totalViews = p.totalViews || 0;
    const ctr = calculateBioCtr(totalViews, totalClicks);
    return { profile: p, links: sortBioLinks(links), stats: { totalViews, totalClicks, ctr } };
  }

  // Perfil padrão inicial não persistido
  const defaultProfile: BioProfile = {
    id: `bio_${Date.now()}`,
    workspaceId: organizationId,
    handle: `workspace-${organizationId.slice(0, 8)}`,
    title: 'Meu Negócio Oficial',
    bio: 'Bem-vindo à nossa página oficial de links! Acesse nossos produtos, novidades e redes sociais.',
    avatarUrl: null,
    theme: 'midnight',
    socialLinks: {
      instagram: 'hupflow',
      linkedin: 'hupflow-app',
      website: 'https://hupflow.com',
    },
    showPostsShowcase: true,
    isPublished: true,
    totalViews: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const defaultLinks: BioLink[] = [
    {
      id: `link_${Date.now()}_1`,
      profileId: defaultProfile.id,
      title: '🚀 Conheça Nossos Planos',
      subtitle: 'Comece a publicar carrosséis com IA hoje',
      url: 'https://hupflow.com/pricing',
      icon: 'Rocket',
      isFeatured: true,
      isActive: true,
      sortOrder: 0,
      clickCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: `link_${Date.now()}_2`,
      profileId: defaultProfile.id,
      title: '💬 Fale com Nossos Especialistas no WhatsApp',
      subtitle: 'Atendimento humanizado de seg a sex',
      url: 'https://wa.me/5511999999999',
      icon: 'MessageCircle',
      isFeatured: false,
      isActive: true,
      sortOrder: 1,
      clickCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  return {
    profile: defaultProfile,
    links: defaultLinks,
    stats: { totalViews: 0, totalClicks: 0, ctr: 0 },
  };
}

export async function upsertBioProfile(
  organizationId: string,
  data: {
    handle: string;
    title: string;
    bio?: string | null;
    avatarUrl?: string | null;
    theme: BioThemePreset;
    customThemeConfig?: BioCustomTheme | null;
    socialLinks: BioSocialLinks;
    showPostsShowcase: boolean;
    isPublished: boolean;
    links?: Array<{
      id?: string;
      title: string;
      subtitle?: string | null;
      url: string;
      icon?: string | null;
      isFeatured: boolean;
      isActive: boolean;
      sortOrder: number;
    }>;
  }
): Promise<{ profile: BioProfile; links: BioLink[] }> {
  const sanitized = sanitizeHandle(data.handle);
  if (!isValidHandle(sanitized)) {
    throw new Error('Identificador da bio (handle) inválido. Use entre 3 e 40 caracteres alfanuméricos.');
  }

  const now = new Date();

  try {
    const existing = await db
      .select()
      .from(bioProfiles)
      .where(eq(bioProfiles.organizationId, organizationId))
      .limit(1);

    let profileId: string;
    let currentViews = 0;

    if (existing.length > 0) {
      profileId = existing[0].id;
      currentViews = existing[0].totalViews || 0;
      await db
        .update(bioProfiles)
        .set({
          handle: sanitized,
          title: data.title,
          bio: data.bio || null,
          avatarUrl: data.avatarUrl || null,
          theme: data.theme,
          customThemeConfig: data.customThemeConfig,
          socialLinks: data.socialLinks,
          showPostsShowcase: data.showPostsShowcase,
          isPublished: data.isPublished,
          updatedAt: now,
        })
        .where(eq(bioProfiles.id, profileId));
    } else {
      profileId = `bio_${Date.now()}`;
      await db.insert(bioProfiles).values({
        id: profileId,
        organizationId,
        handle: sanitized,
        title: data.title,
        bio: data.bio || null,
        avatarUrl: data.avatarUrl || null,
        theme: data.theme,
        customThemeConfig: data.customThemeConfig,
        socialLinks: data.socialLinks,
        showPostsShowcase: data.showPostsShowcase,
        isPublished: data.isPublished,
        totalViews: 0,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Atualiza links se fornecidos
    if (data.links && Array.isArray(data.links)) {
      // Deleta links antigos não mais presentes
      const incomingIds = data.links.map((l) => l.id).filter(Boolean) as string[];
      if (incomingIds.length > 0) {
        await db.delete(bioLinks).where(eq(bioLinks.profileId, profileId));
      }

      for (let i = 0; i < data.links.length; i++) {
        const link = data.links[i];
        await db.insert(bioLinks).values({
          id: link.id || `link_${Date.now()}_${i}`,
          profileId,
          title: link.title,
          subtitle: link.subtitle || null,
          url: link.url,
          icon: link.icon || null,
          isFeatured: link.isFeatured ?? false,
          isActive: link.isActive ?? true,
          sortOrder: link.sortOrder ?? i,
          clickCount: 0,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    const updatedProfile: BioProfile = {
      id: profileId,
      workspaceId: organizationId,
      handle: sanitized,
      title: data.title,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      theme: data.theme,
      customThemeConfig: data.customThemeConfig,
      socialLinks: data.socialLinks,
      showPostsShowcase: data.showPostsShowcase,
      isPublished: data.isPublished,
      totalViews: currentViews,
      createdAt: now.getTime(),
      updatedAt: now.getTime(),
    };

    const linkRows = await db
      .select()
      .from(bioLinks)
      .where(eq(bioLinks.profileId, profileId))
      .orderBy(asc(bioLinks.sortOrder));

    const finalLinks: BioLink[] = linkRows.map((l) => ({
      id: l.id,
      profileId: l.profileId,
      title: l.title,
      subtitle: l.subtitle,
      url: l.url,
      icon: l.icon,
      isFeatured: l.isFeatured,
      isActive: l.isActive,
      sortOrder: l.sortOrder,
      clickCount: l.clickCount,
      createdAt: l.createdAt ? new Date(l.createdAt).getTime() : Date.now(),
      updatedAt: l.updatedAt ? new Date(l.updatedAt).getTime() : Date.now(),
    }));

    return { profile: updatedProfile, links: finalLinks };
  } catch (err) {
    console.warn('[BioService] Falha de persistência DB, armazenando em memória:', err);

    const profileId = `bio_${Date.now()}`;
    const p: BioProfile = {
      id: profileId,
      workspaceId: organizationId,
      handle: sanitized,
      title: data.title,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      theme: data.theme,
      customThemeConfig: data.customThemeConfig,
      socialLinks: data.socialLinks,
      showPostsShowcase: data.showPostsShowcase,
      isPublished: data.isPublished,
      totalViews: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    memoryBioProfiles.set(organizationId, p);

    const links: BioLink[] = (data.links || []).map((l, i) => ({
      id: l.id || `link_${Date.now()}_${i}`,
      profileId,
      title: l.title,
      subtitle: l.subtitle,
      url: l.url,
      icon: l.icon,
      isFeatured: l.isFeatured ?? false,
      isActive: l.isActive ?? true,
      sortOrder: l.sortOrder ?? i,
      clickCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));
    memoryBioLinks.set(profileId, links);

    return { profile: p, links };
  }
}

export async function getPublicBioData(handle: string): Promise<BioPublicData | null> {
  const sanitized = sanitizeHandle(handle);

  try {
    const profileRows = await db
      .select()
      .from(bioProfiles)
      .where(and(eq(bioProfiles.handle, sanitized), eq(bioProfiles.isPublished, true)))
      .limit(1);

    if (profileRows.length > 0) {
      const p = profileRows[0];
      const linkRows = await db
        .select()
        .from(bioLinks)
        .where(and(eq(bioLinks.profileId, p.id), eq(bioLinks.isActive, true)))
        .orderBy(asc(bioLinks.sortOrder));

      const links: BioLink[] = linkRows.map((l) => ({
        id: l.id,
        profileId: l.profileId,
        title: l.title,
        subtitle: l.subtitle,
        url: l.url,
        icon: l.icon,
        isFeatured: l.isFeatured,
        isActive: l.isActive,
        sortOrder: l.sortOrder,
        clickCount: l.clickCount,
        createdAt: l.createdAt ? new Date(l.createdAt).getTime() : Date.now(),
        updatedAt: l.updatedAt ? new Date(l.updatedAt).getTime() : Date.now(),
      }));

      // Mock de carrosséis recentes para a vitrine
      const recentPosts: BioShowcasePost[] = p.showPostsShowcase
        ? [
            {
              id: 'showcase_1',
              title: 'Guia Definitivo: Como Criar Carrosséis que Convertem',
              coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
              publishedAt: Date.now() - 1000 * 60 * 60 * 24,
              channels: ['linkedin', 'instagram'],
            },
            {
              id: 'showcase_2',
              title: 'Top 5 Estratégias de Crescimento Orgânico em 2026',
              coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
              publishedAt: Date.now() - 1000 * 60 * 60 * 48,
              channels: ['x', 'threads'],
            },
          ]
        : [];

      return {
        profile: {
          id: p.id,
          workspaceId: p.organizationId,
          handle: p.handle,
          title: p.title,
          bio: p.bio,
          avatarUrl: p.avatarUrl,
          theme: (p.theme as BioThemePreset) || 'midnight',
          customThemeConfig: (p.customThemeConfig as BioCustomTheme) || null,
          socialLinks: (p.socialLinks as BioSocialLinks) || {},
          showPostsShowcase: p.showPostsShowcase,
          isPublished: p.isPublished,
          totalViews: p.totalViews || 0,
          createdAt: p.createdAt ? new Date(p.createdAt).getTime() : Date.now(),
          updatedAt: p.updatedAt ? new Date(p.updatedAt).getTime() : Date.now(),
        },
        links: sortBioLinks(links),
        recentPosts,
      };
    }
  } catch (err) {
    console.warn('[BioService] Falha DB ao buscar public bio, verificando memória:', err);
  }

  // Verifica memória
  for (const [_, p] of memoryBioProfiles.entries()) {
    if (p.handle === sanitized && p.isPublished) {
      const links = (memoryBioLinks.get(p.id) || []).filter((l) => l.isActive);
      return {
        profile: p,
        links: sortBioLinks(links),
        recentPosts: [],
      };
    }
  }

  // Fallback demo caso seja um preview
  if (sanitized === 'demo' || sanitized.startsWith('workspace-')) {
    const demoProfile: BioProfile = {
      id: 'demo_profile',
      workspaceId: 'org_demo',
      handle: sanitized,
      title: 'HupFlow Showcase',
      bio: 'Exemplo de página de links em bio ultra-rápida, moderna e com carrosséis integrados.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      theme: 'midnight',
      socialLinks: {
        instagram: 'hupflow',
        linkedin: 'hupflow-app',
        website: 'https://hupflow.com',
      },
      showPostsShowcase: true,
      isPublished: true,
      totalViews: 420,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const demoLinks: BioLink[] = [
      {
        id: 'demo_link_1',
        profileId: 'demo_profile',
        title: '🎨 Acessar o Estúdio de Carrosséis 2D',
        subtitle: 'Crie slides de alto impacto em minutos',
        url: 'https://hupflow.com/studio',
        icon: 'Palette',
        isFeatured: true,
        isActive: true,
        sortOrder: 0,
        clickCount: 180,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'demo_link_2',
        profileId: 'demo_profile',
        title: '📅 Agendador Inteligente com IA',
        subtitle: 'Planeje sua grade mensal em 1 clique',
        url: 'https://hupflow.com/scheduler',
        icon: 'Calendar',
        isFeatured: false,
        isActive: true,
        sortOrder: 1,
        clickCount: 95,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    return {
      profile: demoProfile,
      links: demoLinks,
      recentPosts: [
        {
          id: 'post_1',
          title: 'Carrossel em Alta: Design Minimalista',
          coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
          publishedAt: Date.now() - 3600000 * 5,
          channels: ['linkedin', 'instagram'],
        },
      ],
    };
  }

  return null;
}

export async function recordBioView(profileId: string): Promise<void> {
  try {
    const profile = await db.select().from(bioProfiles).where(eq(bioProfiles.id, profileId)).limit(1);
    if (profile.length > 0) {
      await db
        .update(bioProfiles)
        .set({ totalViews: (profile[0].totalViews || 0) + 1 })
        .where(eq(bioProfiles.id, profileId));
    }
  } catch (err) {
    // Fallback silencioso
    for (const [_, p] of memoryBioProfiles.entries()) {
      if (p.id === profileId) {
        p.totalViews += 1;
        break;
      }
    }
  }
}

export async function recordBioClick(
  linkId: string,
  profileId: string,
  referrer?: string,
  userAgent?: string
): Promise<void> {
  try {
    const link = await db.select().from(bioLinks).where(eq(bioLinks.id, linkId)).limit(1);
    if (link.length > 0) {
      await db
        .update(bioLinks)
        .set({ clickCount: (link[0].clickCount || 0) + 1 })
        .where(eq(bioLinks.id, linkId));

      await db.insert(bioClicks).values({
        id: `click_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        linkId,
        profileId,
        referrer: referrer || null,
        userAgent: userAgent || null,
      });
    }
  } catch (err) {
    // Fallback silencioso
    const links = memoryBioLinks.get(profileId);
    if (links) {
      const l = links.find((item) => item.id === linkId);
      if (l) l.clickCount += 1;
    }
  }
}
