import React from 'react';
import { notFound } from 'next/navigation';
import { getPublicBioData, recordBioView, getThemeConfig } from '@/lib/bio/service';
import {
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Metadata } from 'next';

interface BioPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: BioPageProps): Promise<Metadata> {
  const { handle } = await params;
  const data = await getPublicBioData(handle);

  if (!data) {
    return {
      title: 'Página não encontrada | HupFlow Bio',
    };
  }

  return {
    title: `${data.profile.title} | Link na Bio`,
    description: data.profile.bio || `Confira todos os links e novidades de ${data.profile.title}`,
    openGraph: {
      title: data.profile.title,
      description: data.profile.bio || undefined,
      images: data.profile.avatarUrl ? [data.profile.avatarUrl] : [],
    },
  };
}

export default async function PublicBioPage({ params }: BioPageProps) {
  const { handle } = await params;
  const data = await getPublicBioData(handle);

  if (!data) {
    notFound();
  }

  const { profile, links, recentPosts = [] } = data;
  const theme = getThemeConfig(profile.theme);
  const activeLinks = links.filter((l) => l.isActive);

  // Registra visualização de página no servidor
  recordBioView(profile.id).catch(() => {});

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 transition-colors duration-300 ${theme.bg}`}
    >
      {/* Container Centralizado para Mobile e Desktop */}
      <main className="w-full max-w-md mx-auto flex flex-col items-center py-6 flex-1">
        {/* Avatar e Informações da Marca */}
        <div className="flex flex-col items-center text-center">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.title}
              className="w-24 h-24 rounded-full object-cover shadow-xl border-4 border-white/20 ring-4 ring-white/10"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white/20">
              {profile.title.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-2">
            <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight leading-tight">
              {profile.title}
            </h1>
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              ✓
            </div>
          </div>

          <p className="text-sm opacity-75 font-mono mt-1">@{profile.handle}</p>

          {profile.bio && (
            <p className="text-sm leading-relaxed opacity-90 mt-2.5 max-w-xs sm:max-w-sm">
              {profile.bio}
            </p>
          )}

          {/* Barra de Redes Sociais */}
          {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
            <div className="flex items-center justify-center gap-2.5 mt-4 flex-wrap">
              {profile.socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${profile.socialLinks.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 shadow-sm"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 shadow-sm"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={`https://x.com/${profile.socialLinks.twitter}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 shadow-sm"
                  aria-label="X Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.youtube && (
                <a
                  href={`https://youtube.com/@${profile.socialLinks.youtube}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 shadow-sm"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.whatsapp && (
                <a
                  href={`https://wa.me/${profile.socialLinks.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 shadow-sm"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 shadow-sm"
                  aria-label="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Lista de Botões de Links */}
        <div className="w-full flex flex-col gap-3 mt-6">
          {activeLinks.length === 0 ? (
            <div className="text-center py-10 text-sm opacity-60">
              Nenhum link disponível no momento.
            </div>
          ) : (
            activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`relative group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 text-left hover:scale-[1.01] ${
                  theme.card
                } ${
                  link.isFeatured
                    ? 'ring-2 ring-violet-500/60 shadow-violet-500/10 shadow-xl'
                    : ''
                }`}
              >
                {link.isFeatured && (
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> Destaque
                  </span>
                )}

                <div className="flex-1 pr-3">
                  <div className="font-bold text-sm sm:text-base leading-snug">
                    {link.title}
                  </div>
                  {link.subtitle && (
                    <div className="text-xs opacity-75 leading-snug mt-0.5">
                      {link.subtitle}
                    </div>
                  )}
                </div>

                <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
              </a>
            ))
          )}

          {/* Vitrine de Carrosséis & Posts Recentes */}
          {profile.showPostsShowcase && recentPosts.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/15 w-full">
              <div className="flex items-center gap-2 mb-3.5 text-sm font-bold opacity-90">
                <Layers className="w-4 h-4 text-violet-400" />
                <span>Últimos Carrosséis & Posts</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors"
                  >
                    {post.coverUrl ? (
                      <img
                        src={post.coverUrl}
                        alt={post.title}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                        PDF
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-snug line-clamp-2">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] opacity-60">
                        {post.channels.map((c) => (
                          <span key={c} className="capitalize">
                            #{c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Powered by HupFlow */}
      <footer className="w-full text-center py-4 text-xs opacity-60 flex items-center justify-center gap-1.5">
        <span>Criado com</span>
        <a
          href="https://hupflow.com"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-violet-400 hover:underline"
        >
          HupFlow
        </a>
      </footer>
    </div>
  );
}
