'use client';

import React from 'react';
import {
  BioLink,
  BioProfile,
  BioShowcasePost,
} from '@/lib/bio/types';
import { getThemeConfig } from '@/lib/bio/bio-utils';
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
  Send,
} from 'lucide-react';

interface BioPhonePreviewProps {
  profile: BioProfile;
  links: BioLink[];
  recentPosts?: BioShowcasePost[];
  interactive?: boolean;
}

export function BioPhonePreview({
  profile,
  links,
  recentPosts = [],
  interactive = false,
}: BioPhonePreviewProps) {
  const theme = getThemeConfig(profile.theme);
  const activeLinks = links.filter((l) => l.isActive);

  const handleLinkClick = (link: BioLink, e: React.MouseEvent) => {
    if (!interactive) {
      e.preventDefault();
      return;
    }
    // Dispara telemetria não-bloqueante
    if (typeof window !== 'undefined' && profile.id) {
      try {
        fetch('/api/bio/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            linkId: link.id,
            profileId: profile.id,
            referrer: document.referrer || window.location.href,
          }),
          keepalive: true,
        }).catch(() => {});
      } catch (err) {}
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[360px] aspect-[9/19] rounded-[44px] p-3 bg-zinc-950 border-[6px] border-zinc-800 shadow-2xl ring-1 ring-white/10 flex flex-col overflow-hidden select-none">
      {/* Notch / Dynamic Island */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700/60" />
      </div>

      {/* Screen Container com Scroll Suave */}
      <div
        className={`w-full h-full rounded-[34px] overflow-y-auto no-scrollbar flex flex-col p-4 pt-10 transition-colors duration-300 ${theme.bg}`}
      >
        {/* Header: Avatar, Título, Bio */}
        <div className="flex flex-col items-center text-center mt-2">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.title}
              className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white/20 ring-2 ring-white/10"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white/20">
              {profile.title.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="mt-3 flex items-center justify-center gap-1.5">
            <h2 className="font-bold text-lg leading-tight tracking-tight">
              {profile.title}
            </h2>
            <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
          </div>

          <p className="text-xs opacity-75 font-mono mt-0.5">@{profile.handle}</p>

          {profile.bio && (
            <p className="text-xs leading-relaxed opacity-90 mt-2 max-w-[260px]">
              {profile.bio}
            </p>
          )}

          {/* Social Icons Bar */}
          {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-3.5 flex-wrap">
              {profile.socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${profile.socialLinks.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={`https://x.com/${profile.socialLinks.twitter}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.youtube && (
                <a
                  href={`https://youtube.com/@${profile.socialLinks.youtube}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.whatsapp && (
                <a
                  href={`https://wa.me/${profile.socialLinks.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Links List */}
        <div className="flex flex-col gap-2.5 mt-5 flex-1">
          {activeLinks.length === 0 ? (
            <div className="text-center py-8 text-xs opacity-60">
              Nenhum link ativo cadastrado.
            </div>
          ) : (
            activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => handleLinkClick(link, e)}
                className={`relative group flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 text-left ${
                  theme.card
                } ${
                  link.isFeatured
                    ? 'ring-2 ring-violet-500/50 shadow-violet-500/10 shadow-lg scale-[1.01]'
                    : ''
                }`}
              >
                {link.isFeatured && (
                  <span className="absolute -top-2 right-3 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-0.5 shadow-sm">
                    <Sparkles className="w-2.5 h-2.5" /> Destaque
                  </span>
                )}

                <div className="flex-1 pr-2">
                  <div className="font-semibold text-xs leading-snug line-clamp-1">
                    {link.title}
                  </div>
                  {link.subtitle && (
                    <div className="text-[10px] opacity-70 leading-snug line-clamp-1 mt-0.5">
                      {link.subtitle}
                    </div>
                  )}
                </div>

                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
              </a>
            ))
          )}

          {/* Showcase Section (Carrosséis & Posts Recentes) */}
          {profile.showPostsShowcase && recentPosts.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold opacity-90">
                <Layers className="w-3.5 h-3.5 text-violet-400" />
                <span>Carrosséis em Destaque</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 hover:bg-white/10 transition-colors"
                  >
                    {post.coverUrl ? (
                      <img
                        src={post.coverUrl}
                        alt={post.title}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                        PDF
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium leading-tight line-clamp-2">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[9px] opacity-60">
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

        {/* Footer Brand */}
        <div className="mt-6 pt-3 pb-2 text-center text-[10px] opacity-50 flex items-center justify-center gap-1">
          <span>Criado com</span>
          <span className="font-bold text-violet-400">HupFlow</span>
        </div>
      </div>
    </div>
  );
}
