'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { MediaAssetItem } from '@/lib/storage/types';
import {
  validateMediaFile,
  formatBytes,
  MAX_IMAGE_SIZE_BYTES,
  MAX_PDF_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
} from '@/lib/storage/validation';

interface MediaUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (media: MediaAssetItem) => void;
}

export function MediaUploaderModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: MediaUploaderModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'presigning' | 'uploading' | 'confirming' | 'done' | 'error'
  >('idle');
  const [progressPercent, setProgressPercent] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setSelectedFile(null);
    setValidationError(null);
    setUploadStatus('idle');
    setProgressPercent(0);
  };

  const handleClose = () => {
    if (uploadStatus === 'uploading' || uploadStatus === 'confirming') {
      if (!confirm('O upload está em andamento. Deseja realmente cancelar?')) {
        return;
      }
    }
    resetState();
    onClose();
  };

  const handleFileSelection = (file: File) => {
    setValidationError(null);
    const validation = validateMediaFile(file.name, file.type, file.size);

    if (!validation.valid) {
      setValidationError(validation.error || 'Arquivo inválido.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const executeUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadStatus('presigning');
      setProgressPercent(10);

      // 1. Solicita Presigned URL
      const presignRes = await fetch('/api/media/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: selectedFile.name,
          mimeType: selectedFile.type,
          sizeBytes: selectedFile.size,
        }),
      });

      if (!presignRes.ok) {
        const errorData = await presignRes.json();
        throw new Error(errorData.error || 'Falha ao solicitar autorização de upload.');
      }

      const { uploadUrl, fileKey, publicUrl } = await presignRes.json();

      // 2. Upload Direto (PUT) com acompanhamento de progresso
      setUploadStatus('uploading');

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl, true);
        xhr.setRequestHeader('Content-Type', selectedFile.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round(10 + (event.loaded / event.total) * 75);
            setProgressPercent(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setProgressPercent(88);
            resolve();
          } else {
            reject(new Error(`Falha no envio do arquivo para o storage (HTTP ${xhr.status}).`));
          }
        };

        xhr.onerror = () => reject(new Error('Erro de conexão ao enviar arquivo.'));
        xhr.send(selectedFile);
      });

      // 3. Confirmar e registrar no banco
      setUploadStatus('confirming');
      setProgressPercent(95);

      const confirmRes = await fetch('/api/media/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileKey,
          filename: selectedFile.name,
          mimeType: selectedFile.type,
          sizeBytes: selectedFile.size,
          publicUrl,
        }),
      });

      if (!confirmRes.ok) {
        throw new Error('Falha ao registrar metadados da mídia no banco de dados.');
      }

      const confirmData = await confirmRes.json();
      setProgressPercent(100);
      setUploadStatus('done');

      setTimeout(() => {
        onUploadSuccess(confirmData.media);
        handleClose();
      }, 800);
    } catch (err: any) {
      console.error('Erro durante o upload:', err);
      setUploadStatus('error');
      setValidationError(err?.message || 'Falha inesperada durante o upload.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-[#0C0F17] shadow-2xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Upload de Mídia</h2>
              <p className="text-xs text-slate-400">
                Imagens, carrosséis em PDF ou vídeos para suas publicações
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => uploadStatus === 'idle' && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,video/mp4,video/quicktime"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelection(e.target.files[0]);
              }
            }}
          />

          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>

          <p className="text-sm font-medium text-slate-200 mb-1">
            {isDragging ? 'Solte o arquivo para carregar' : 'Arraste e solte o arquivo aqui'}
          </p>
          <p className="text-xs text-slate-500 mb-4">ou clique para selecionar do computador</p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
              Imagens: até {formatBytes(MAX_IMAGE_SIZE_BYTES)}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
              PDFs: até {formatBytes(MAX_PDF_SIZE_BYTES)}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
              Vídeos: até {formatBytes(MAX_VIDEO_SIZE_BYTES)}
            </span>
          </div>
        </div>

        {/* Selected File Details & Preview */}
        {selectedFile && (
          <div className="mt-4 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                {selectedFile.type.startsWith('image/') ? (
                  <ImageIcon className="w-4 h-4" />
                ) : selectedFile.type === 'application/pdf' ? (
                  <FileText className="w-4 h-4" />
                ) : (
                  <VideoIcon className="w-4 h-4" />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-slate-200 truncate">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-500">{formatBytes(selectedFile.size)}</p>
              </div>
            </div>

            {uploadStatus === 'idle' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="text-slate-400 hover:text-rose-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Validation Error Message */}
        {validationError && (
          <div className="mt-4 p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 flex items-center gap-2.5 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Progress Bar & Status */}
        {uploadStatus !== 'idle' && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                {uploadStatus === 'done' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Upload Concluído!
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    {uploadStatus === 'presigning' && 'Autorizando URL pré-assinada...'}
                    {uploadStatus === 'uploading' && `Enviando binário (${progressPercent}%)...`}
                    {uploadStatus === 'confirming' && 'Registrando no catálogo...'}
                  </>
                )}
              </span>
              <span className="font-mono text-slate-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  uploadStatus === 'done'
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
          <button
            onClick={handleClose}
            disabled={uploadStatus === 'uploading' || uploadStatus === 'confirming'}
            className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-850 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={executeUpload}
            disabled={!selectedFile || uploadStatus !== 'idle'}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-medium shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {uploadStatus === 'idle' ? (
              <>
                <UploadCloud className="w-4 h-4" />
                Iniciar Upload Direto
              </>
            ) : (
              'Processando...'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
