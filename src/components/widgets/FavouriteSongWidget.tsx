import React from 'react';
import { Music, ExternalLink, Edit3, Disc3 } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface FavouriteSongWidgetProps {
  onOpenEditModal: () => void;
}

export const FavouriteSongWidget: React.FC<FavouriteSongWidgetProps> = ({
  onOpenEditModal,
}) => {
  const { data } = useData();
  const song = data?.favouriteSong;

  const defaultImage =
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl p-5 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between relative overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-sunflower-100 dark:bg-sunflower-950/70 border border-sunflower-300 dark:border-sunflower-800 text-sunflower-600 dark:text-sunflower-400">
              <Music className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-warm-900 dark:text-warm-100">
              My Current Favourite Song 🎵
            </h3>
          </div>

          <button
            onClick={onOpenEditModal}
            className="p-1.5 text-warm-400 hover:text-sunflower-600 dark:hover:text-sunflower-400 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-xl transition-colors"
            title="Edit favourite song"
            aria-label="Edit song"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Music Display Card */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-amber-500/10 via-sunflower-500/10 to-warm-100/40 dark:from-sunflower-950/40 dark:via-darkbg-surface dark:to-darkbg-surface p-3.5 rounded-2xl border border-sunflower-200/70 dark:border-sunflower-900/40">
          {/* Album Cover / Vinyl */}
          <div className="relative shrink-0 w-16 h-16 rounded-2xl overflow-hidden shadow-warm-sm border border-warm-200 dark:border-darkbg-border group">
            <img
              src={song?.image || defaultImage}
              alt={song?.song || 'Album Art'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Disc3 className="w-6 h-6 text-white animate-spin-slow" />
            </div>
          </div>

          {/* Song Meta */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sunflower-500 animate-pulse-gentle" />
              <span className="text-[10px] font-bold text-sunflower-700 dark:text-sunflower-400 uppercase tracking-wider">
                Now Vibing
              </span>
            </div>

            <h4 className="text-sm font-extrabold text-warm-900 dark:text-warm-100 truncate mt-0.5">
              {song?.song || 'Golden Hour'}
            </h4>
            <p className="text-xs font-semibold text-warm-600 dark:text-warm-400 truncate">
              {song?.artist || 'JVKE'}
            </p>

            {song?.note && (
              <p className="text-[11px] text-warm-500 dark:text-warm-400 italic truncate mt-1">
                “{song.note}”
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-3 flex items-center gap-2">
        {song?.url ? (
          <a
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-xl bg-sunflower-500 hover:bg-sunflower-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <span>▶ Open Song</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            onClick={onOpenEditModal}
            className="flex-1 py-2 px-3 rounded-xl bg-warm-100 dark:bg-darkbg-surface hover:bg-warm-200 dark:hover:bg-darkbg-cardHover text-xs font-semibold text-warm-700 dark:text-warm-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Set Song Link</span>
          </button>
        )}
      </div>
    </div>
  );
};
