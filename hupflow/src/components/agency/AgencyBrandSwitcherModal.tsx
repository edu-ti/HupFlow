'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AgencyBrandProfile } from '@/lib/agency/types';
import {
  Search,
  Star,
  Building2,
  Share2,
  Calendar,
  Check,
  Zap,
  ArrowRight,
  X,
  Plus,
} from 'lucide-react';

interface AgencyBrandSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBrandSwitched?: (brand: AgencyBrandProfile) => void;
}

export function AgencyBrandSwitcherModal({
  isOpen,
  onClose,
  onBrandSwitched,
}: AgencyBrandSwitcherModalProps) {
  const [brands, setBrands] = useState<AgencyBrandProfile[]>([]);
  const [query, setQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (selectedNiche !== 'all') params.set('niche', selectedNiche);
      if (favoritesOnly) params.set('favoritesOnly', 'true');

      const res = await fetch(`/api/agency/brands?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBrands(data.brands || []);
        setSelectedIndex(0);
      }
    } catch (err) {
      console.error('Falha ao buscar marcas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBrands();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, query, selectedNiche, favoritesOnly]);

  // Global Cmd+K / Ctrl+K listener is usually on document, or handled by parent.
  // Here we handle keyboard navigation within modal:
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < brands.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (brands[selectedIndex]) {
        handleSelectBrand(brands[selectedIndex]);
      }
    }
  };

  const handleSelectBrand = async (brand: AgencyBrandProfile) => {
    try {
      setSwitchingId(brand.id);
      const res = await fetch('/api/agency/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetBrandId: brand.id }),
      });

      if (res.ok) {
        onBrandSwitched?.(brand);
        setTimeout(() => {
          onClose();
          // Reload page to reflect new context across all widgets
          window.location.reload();
        }, 400);
      }
    } catch (err) {
      console.error('Falha ao alternar marca:', err);
    } finally {
      setSwitchingId(null);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, brandId: string) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/agency/brands', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: brandId, action: 'toggle_favorite' }),
      });
      if (res.ok) {
        setBrands(prev =>
          prev.map(b => (b.id === brandId ? { ...b, isFavorite: !b.isFavorite } : b))
        );
      }
    } catch (err) {
      console.error('Falha ao favoritar:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col space-y-0 text-white animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="relative border-b border-zinc-800 flex items-center px-4 py-3.5 bg-zinc-950/60">
          <Search className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Alternar marca cliente... (digite nome, nicho ou tag)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700 rounded shadow-sm">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 text-zinc-500 hover:text-zinc-300 rounded-md transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 border-b border-zinc-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => {
              setSelectedNiche('all');
              setFavoritesOnly(false);
            }}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              selectedNiche === 'all' && !favoritesOnly
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            Todas ({brands.length})
          </button>

          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1 ${
              favoritesOnly
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            Favoritas
          </button>
        </div>

        {/* Brand Results List */}
        <div
          ref={listRef}
          className="max-h-[380px] overflow-y-auto divide-y divide-zinc-800/50 p-2 space-y-1"
        >
          {loading && brands.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              Buscando marcas clientes...
            </div>
          ) : brands.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Building2 className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm text-zinc-400">Nenhuma marca encontrada com estes termos.</p>
            </div>
          ) : (
            brands.map((brand, index) => {
              const isSelected = selectedIndex === index;
              const isSwitching = switchingId === brand.id;

              return (
                <div
                  key={brand.id}
                  onClick={() => handleSelectBrand(brand)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-600/15 border border-indigo-500/30'
                      : 'hover:bg-zinc-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Brand Color Initials Circle */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: brand.colorHex }}
                    >
                      {brand.brandName.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">
                          {brand.brandName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-zinc-800 text-zinc-400">
                          {brand.slug}
                        </span>
                        {brand.tier === 'enterprise_vip' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            VIP
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                        <span className="text-zinc-300">{brand.niche}</span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3 h-3 text-sky-400" />
                          {brand.connectedChannelsCount} canais
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          {brand.scheduledPostsCount} agendados
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Shortcut Indicator */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => handleToggleFavorite(e, brand.id)}
                      className="p-1.5 text-zinc-500 hover:text-amber-400 transition"
                      title={brand.isFavorite ? 'Remover dos favoritos' : 'Marcar como favorito'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          brand.isFavorite
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      />
                    </button>

                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
                        Enter <ArrowRight className="w-3 h-3" />
                      </span>
                    )}

                    {isSwitching && (
                      <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer / Shortcut Tips */}
        <div className="border-t border-zinc-800/80 px-4 py-2.5 bg-zinc-950/80 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="font-mono bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">↑</kbd>
              <kbd className="font-mono bg-zinc-800 px-1 py-0.5 rounded text-zinc-300 ml-1">↓</kbd> Navegar
            </span>
            <span>
              <kbd className="font-mono bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">Enter</kbd> Alternar
            </span>
          </div>
          <span className="text-indigo-400 font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" /> Troca instantânea sem relogin
          </span>
        </div>
      </div>
    </div>
  );
}
