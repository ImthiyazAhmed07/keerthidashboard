import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { NoteItem } from '../../types';
import { Pin } from 'lucide-react';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; category?: string; content?: string; pinned?: boolean; color?: string }) => Promise<void>;
  initialData?: NoteItem | null;
}

const CATEGORIES = ['Personal', 'Study', 'Work', 'Ideas', 'Reminder'];
const COLORS = [
  { id: 'sunflower', label: 'Sunflower', bg: 'bg-amber-100 dark:bg-amber-950/70 border-amber-300' },
  { id: 'honey', label: 'Warm Honey', bg: 'bg-orange-100 dark:bg-orange-950/70 border-orange-300' },
  { id: 'sage', label: 'Sage', bg: 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-300' },
  { id: 'sky', label: 'Sky', bg: 'bg-sky-100 dark:bg-sky-950/70 border-sky-300' },
];

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(false);
  const [color, setColor] = useState('sunflower');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category || 'Personal');
      setContent(initialData.content || '');
      setPinned(!!initialData.pinned);
      setColor(initialData.color || 'sunflower');
    } else {
      setTitle('');
      setCategory('Personal');
      setContent('');
      setPinned(false);
      setColor('sunflower');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onSave({
        title: title.trim(),
        category,
        content: content.trim(),
        pinned,
        color,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<span>{initialData ? 'Edit Note' : 'Add New Note 📝'}</span>}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
            Note Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Study goals for this week..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-sm focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-medium"
            autoFocus
          />
        </div>

        {/* Category & Pin */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sunflower-400"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
              Pin to Top
            </label>
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`w-full py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                pinned
                  ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 text-amber-900 dark:text-amber-300'
                  : 'bg-warm-50 dark:bg-darkbg-surface border-warm-200 dark:border-darkbg-border text-warm-600'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${pinned ? 'fill-current' : ''}`} />
              <span>{pinned ? 'Pinned 📌' : 'Normal'}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
            Note Content
          </label>
          <textarea
            rows={5}
            placeholder="Write your thoughts, checklist items, or detailed notes..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs focus:outline-none focus:ring-2 focus:ring-sunflower-400 resize-none font-normal leading-relaxed"
          />
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1.5">
            Card Accent
          </label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                  c.bg
                } ${
                  color === c.id
                    ? 'ring-2 ring-sunflower-500 scale-105 shadow-sm'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 mt-3 pt-3 border-t border-warm-100 dark:border-darkbg-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {initialData ? 'Save Changes' : 'Create Note 🌻'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
