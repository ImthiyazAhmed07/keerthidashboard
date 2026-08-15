import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LinkItem } from '../../types';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; url: string; category?: string; icon?: string }) => Promise<void>;
  initialData?: LinkItem | null;
}

const EMOJI_OPTIONS = ['🔗', '🔍', '▶️', '📁', '🎵', '📚', '💼', '💻', '💡', '🎓', '🎨', '📝', '✨', '🌻'];
const CATEGORIES = ['Study', 'Work', 'Entertainment', 'Social', 'Search', 'Music', 'Tools', 'Other'];

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Study');
  const [icon, setIcon] = useState('🔗');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setUrl(initialData.url);
      setCategory(initialData.category || 'Study');
      setIcon(initialData.icon || '🔗');
    } else {
      setTitle('');
      setUrl('');
      setCategory('Study');
      setIcon('🔗');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    setIsLoading(true);
    try {
      await onSave({
        title: title.trim(),
        url: url.trim(),
        category,
        icon,
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
      title={<span>{initialData ? 'Edit Bookmark' : 'Add Frequent Link 🔗'}</span>}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
            Website Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Google Scholar, Spotify..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-sm focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-medium"
            autoFocus
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
            Web Address (URL) *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. https://google.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-sm focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-medium font-mono text-xs"
          />
        </div>

        {/* Category & Icon Picker */}
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
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1.5">
            Choose Icon
          </label>
          <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setIcon(e)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                  icon === e
                    ? 'bg-sunflower-100 dark:bg-sunflower-900 border-2 border-sunflower-500 scale-110'
                    : 'hover:bg-warm-200/60 dark:hover:bg-darkbg-card'
                }`}
              >
                {e}
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
            {initialData ? 'Save Changes' : 'Add Link 🔗'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
