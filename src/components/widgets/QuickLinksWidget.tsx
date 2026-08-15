import React from 'react';
import { Link2, ExternalLink, Plus, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageId } from '../../types';

interface QuickLinksWidgetProps {
  onNavigate: (page: PageId) => void;
  onOpenAddModal: () => void;
}

export const QuickLinksWidget: React.FC<QuickLinksWidgetProps> = ({
  onNavigate,
  onOpenAddModal,
}) => {
  const { data } = useData();
  const links = data?.links || [];
  const displayLinks = links.slice(0, 6);

  return (
    <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl p-5 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-sunflower-100 dark:bg-sunflower-950/70 border border-sunflower-300 dark:border-sunflower-800 text-sunflower-600 dark:text-sunflower-400">
              <Link2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-warm-900 dark:text-warm-100">Quick Links</h3>
          </div>

          <button
            onClick={onOpenAddModal}
            className="p-1.5 bg-sunflower-500 hover:bg-sunflower-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95 px-2.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Link</span>
          </button>
        </div>

        {/* Links Grid */}
        {displayLinks.length === 0 ? (
          <div className="py-6 text-center">
            <span className="text-2xl">🔗</span>
            <p className="text-xs font-bold text-warm-800 dark:text-warm-200 mt-1">No links added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-2">
            {displayLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200/80 dark:border-darkbg-border hover:border-sunflower-300 dark:hover:border-sunflower-800 flex items-center justify-between gap-2 transition-all hover:scale-[1.02] shadow-sm group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">{link.icon || '🔗'}</span>
                  <span className="text-xs font-bold text-warm-900 dark:text-warm-100 truncate">
                    {link.title}
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-warm-400 group-hover:text-sunflower-600 shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onNavigate('links')}
        className="mt-3 w-full py-2 px-3 rounded-xl bg-warm-100 dark:bg-darkbg-surface hover:bg-warm-200 dark:hover:bg-darkbg-cardHover text-xs font-semibold text-warm-700 dark:text-warm-300 flex items-center justify-center gap-1.5 transition-colors"
      >
        <span>View all bookmarks</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
