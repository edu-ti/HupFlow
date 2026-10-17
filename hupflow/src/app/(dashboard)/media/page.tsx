'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Plus,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Layers,
  HardDrive,
  Filter,
} from 'lucide-react';
import { MediaAssetItem, MediaFilterType } from '@/lib/storage/types';
import { formatBytes } from '@/lib/storage/validation';
import { MediaUploaderModal } from '@/components/media/MediaUploaderModal';

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaAssetItem[]>([]);
  const [filterType, setFilterType] = useState<MediaFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega lista de mídias da API
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setMediaList(data);
      }
    } catch (err) {
      console.error('Erro ao buscar mídias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUploadSuccess = (newMedia: MediaAssetItem) => {
    setMediaList((prev) => [newMedia, ...prev]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover esta mídia da biblioteca?')) {
      return;
    }

    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Erro ao excluir mídia:', err);
    }
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtragem combinada por tipo e busca por texto
  const filteredMedia = mediaList.filter((item) => {
    const matchesType =
      filterType === 'all'
        ? true
        : filterType === 'image'
        ? item.mediaType === 'image'
        : filterType === 'video'
        ? item.mediaType === 'video'
        : item.mediaType === 'pdf';

    const matchesSearch = item.filename
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim());

    return matchesType && matchesSearch;
  });

  // Cálculos de métricas
  const totalBytes = mediaList.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0);
  const imageCount = mediaList.filter((m) => m.mediaType === 'image').length;
  const videoCount = mediaList.filter((m) => m.mediaType === 'video').length;
  const pdfCount = mediaList.filter((m) => m.mediaType === 'pdf').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <HardDrive className="w-3.5 h-3.5" />
            Armazenamento R2 & S3
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Biblioteca de Mídias
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Catálogo multi-tenant de fotos, vídeos e carrosséis com upload direto de alta velocidade
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs text-slate-400">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              Total: <strong className="text-slate-200">{formatBytes(totalBytes)}</strong> ({mediaList.length} itens)
            </span>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Fazer Upload de Mídia
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Abas de Categoria */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas ({mediaList.length})
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'image'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Imagens ({imageCount})
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'video'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5" />
            Vídeos ({videoCount})
          </button>
          <button
            onClick={() => setFilterType('pdf')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'pdf'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            PDFs ({pdfCount})
          </button>
        </div>

        {/* Input de Busca */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome do arquivo..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid de Cards da Galeria */}
      {filteredMedia.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-3">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Nenhuma mídia encontrada</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? 'Nenhum resultado corresponde à sua busca por texto.'
              : 'Você ainda não enviou imagens, vídeos ou documentos nesta categoria.'}
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Enviar Primeiro Arquivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-slate-800/80 bg-[#0B0E16] hover:border-slate-700/80 hover:bg-[#0E121C] transition-all overflow-hidden flex flex-col justify-between shadow-lg shadow-black/20"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-[4/3] bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800/60">
                {item.mediaType === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : item.mediaType === 'video' ? (
                  <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-2">
                      <VideoIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase text-slate-400">Vídeo MP4</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-2">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase text-slate-400">Carrossel PDF</span>
                  </div>
                )}

                {/* Badge de Tipo no Topo */}
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md border ${
                      item.mediaType === 'image'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : item.mediaType === 'video'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    }`}
                  >
                    {item.mediaType}
                  </span>
                </div>

                {/* Ações Flutuantes no Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                  <button
                    onClick={() => handleCopyUrl(item.id, item.url)}
                    className="p-2 rounded-xl bg-slate-800/90 hover:bg-indigo-600 text-white transition-colors"
                    title="Copiar Link Público"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
                    title="Abrir Mídia em Nova Guia"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-slate-800/90 hover:bg-rose-600 text-white transition-colors"
                    title="Remover Mídia"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Informações do Arquivo */}
              <div className="p-3.5 space-y-2">
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-200 truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{formatBytes(item.sizeBytes)}</span>
                    {item.dimensions && (
                      <span className="font-mono text-slate-400">
                        {item.dimensions.width}×{item.dimensions.height}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                  <span className="font-mono truncate max-w-[120px]">{item.mimeType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Upload com Dropzone */}
      <MediaUploaderModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
