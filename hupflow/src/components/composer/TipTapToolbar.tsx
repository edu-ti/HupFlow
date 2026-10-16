'use client';

import { useState } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Smile,
  Sparkles,
  Undo,
  Redo,
} from 'lucide-react';

interface TipTapToolbarProps {
  onFormat: (command: 'bold' | 'italic' | 'bullet' | 'ordered' | 'quote' | 'undo' | 'redo') => void;
  onInsertEmoji: (emoji: string) => void;
  activeFormats?: {
    bold?: boolean;
    italic?: boolean;
    bullet?: boolean;
    quote?: boolean;
  };
}

const COMMON_EMOJIS = ['✨', '🚀', '💡', '📌', '🎯', '🔥', '📈', '💬', '👉', '✅', '❤️', '👏'];

export function TipTapToolbar({ onFormat, onInsertEmoji, activeFormats = {} }: TipTapToolbarProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
      {/* Botões de Formatação */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onFormat('bold')}
          title="Negrito (Ctrl+B)"
          className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeFormats.bold
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onFormat('italic')}
          title="Itálico (Ctrl+I)"
          className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeFormats.italic
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={() => onFormat('bullet')}
          title="Lista com Marcadores"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onFormat('ordered')}
          title="Lista Numerada"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onFormat('quote')}
          title="Citação em Bloco"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        {/* Emojis Rápidos */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Inserir Emoji"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 flex items-center gap-1 text-xs"
          >
            <Smile className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {showEmojiPicker && (
            <div className="absolute top-8 left-0 z-50 p-2 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl grid grid-cols-4 gap-1 w-44 backdrop-blur-xl">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onInsertEmoji(emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-base text-center transition-all"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Undo / Redo */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onFormat('undo')}
          title="Desfazer"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onFormat('redo')}
          title="Refazer"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
