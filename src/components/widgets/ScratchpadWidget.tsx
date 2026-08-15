import React, { useState } from 'react';
import { Pen, Copy, Trash2, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ScratchpadWidget: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Copied to clipboard! 📋', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleClear = () => {
    setText('');
    showToast('Scratchpad cleared', 'info');
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl p-5 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-sunflower-100 dark:bg-sunflower-950/70 border border-sunflower-300 dark:border-sunflower-800 text-sunflower-600 dark:text-sunflower-400">
              <Pen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-warm-900 dark:text-warm-100">
                Temporary Scratchpad
              </h3>
              <p className="text-[10px] text-warm-500 dark:text-warm-400">
                In-memory only • Disappears on refresh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              disabled={!text.trim()}
              className="p-1.5 text-warm-400 hover:text-sunflower-600 dark:hover:text-sunflower-400 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-xl transition-colors disabled:opacity-40"
              title="Copy text"
              aria-label="Copy scratchpad text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleClear}
              disabled={!text.trim()}
              className="p-1.5 text-warm-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-xl transition-colors disabled:opacity-40"
              title="Clear scratchpad"
              aria-label="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Quick fleeting thoughts, draft sentences, or temporary pastes... (not saved) 🌻"
          rows={4}
          className="w-full p-3 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200/80 dark:border-darkbg-border text-xs text-warm-800 dark:text-warm-200 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-sunflower-400 resize-none font-sans leading-relaxed"
        />
      </div>

      {/* Footer stats */}
      <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-warm-400 dark:text-warm-500">
        <span>{wordCount} words • {charCount} chars</span>
        <span className="italic">Temporary 🌻</span>
      </div>
    </div>
  );
};
