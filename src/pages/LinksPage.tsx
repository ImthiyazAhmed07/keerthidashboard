import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { LinkItem } from '../types';
import {
  Link2,
  Plus,
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { LinkModal } from '../components/modals/LinkModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { useToast } from '../context/ToastContext';
import { SunflowerIcon } from '../components/ui/SunflowerIcon';

const CATEGORIES = ['All', 'Study', 'Work', 'Entertainment', 'Social', 'Search', 'Music', 'Tools', 'Other'];

export const LinksPage: React.FC = () => {
  const { data, addLink, updateLink, deleteLink } = useData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const links = data?.links || [];

  const filteredLinks = links.filter((link) => {
    const matchesCategory =
      selectedCategory === 'All' || link.category?.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      link.title.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (link: LinkItem) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleCopy = async (link: LinkItem) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedId(link.id);
      showToast('Link copied to clipboard! 📋', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const handleSave = async (payload: { title: string; url: string; category?: string; icon?: string }) => {
    if (editingLink) {
      await updateLink(editingLink.id, payload);
    } else {
      await addLink(payload);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-darkbg-card/80 p-5 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-warm-900 dark:text-warm-100">
              Frequently Used Links
            </h2>
            <p className="text-xs text-warm-500 dark:text-warm-400">
              Quick access to your most important tools and portals 🌻
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-4 bg-gradient-to-r from-sunflower-500 to-sunflower-600 hover:from-sunflower-600 hover:to-sunflower-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-warm-sm hover:shadow-warm-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Link</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-warm-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search links & portals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-darkbg-card border border-warm-200 dark:border-darkbg-border text-xs focus:outline-none focus:ring-2 focus:ring-sunflower-400 shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-sunflower-500 text-white shadow-sm'
                  : 'bg-white dark:bg-darkbg-card border border-warm-200 dark:border-darkbg-border text-warm-600 dark:text-warm-300 hover:bg-warm-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Links Grid */}
      {filteredLinks.length === 0 ? (
        <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-8 shadow-warm-sm">
          <div className="p-4 rounded-3xl bg-sunflower-50 dark:bg-sunflower-950/60 border border-sunflower-200 dark:border-sunflower-800/60 mb-4 animate-bounce-gentle">
            <SunflowerIcon size={56} />
          </div>
          <h3 className="text-base font-extrabold text-warm-900 dark:text-warm-100">
            No bookmarks found.
          </h3>
          <p className="text-xs text-warm-500 dark:text-warm-400 mt-1 max-w-xs leading-relaxed">
            Add frequent college portals, tools, research libraries, or study resources.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-5 py-2 px-4 bg-sunflower-500 hover:bg-sunflower-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link 🔗</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLinks.map((link) => (
            <div
              key={link.id}
              className="bg-white/90 dark:bg-darkbg-card/90 border border-warm-200 dark:border-darkbg-border rounded-3xl p-4 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-warm-100 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border flex items-center justify-center text-xl shrink-0 shadow-sm">
                    {link.icon || '🔗'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-warm-900 dark:text-warm-100 truncate">
                      {link.title}
                    </h3>
                    <p className="text-[11px] text-warm-400 dark:text-warm-500 font-mono truncate max-w-[180px]">
                      {link.url}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-warm-100 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-warm-600 dark:text-warm-400 shrink-0">
                  {link.category || 'General'}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-warm-100 dark:border-darkbg-border flex items-center justify-between">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-xl bg-sunflower-500 hover:bg-sunflower-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(link)}
                    className="p-1.5 text-warm-400 hover:text-sunflower-600 dark:hover:text-sunflower-400 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-lg transition-colors"
                    title="Copy URL"
                    aria-label="Copy URL"
                  >
                    {copiedId === link.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(link)}
                    className="p-1.5 text-warm-400 hover:text-sunflower-600 dark:hover:text-sunflower-400 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-lg transition-colors"
                    title="Edit bookmark"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingLinkId(link.id)}
                    className="p-1.5 text-warm-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-lg transition-colors"
                    title="Delete bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link Modal */}
      <LinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingLink}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingLinkId}
        onClose={() => setDeletingLinkId(null)}
        onConfirm={() => {
          if (deletingLinkId) deleteLink(deletingLinkId);
        }}
        title="Delete Link"
        message="Are you sure you want to remove this bookmark from data.txt?"
        confirmLabel="Delete Link"
      />
    </div>
  );
};
