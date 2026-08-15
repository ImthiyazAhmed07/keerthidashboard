import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Music, ExternalLink, Edit3, Disc, Sparkles } from 'lucide-react';
import { SongModal } from '../components/modals/SongModal';
import { SunflowerIcon } from '../components/ui/SunflowerIcon';

export const SongPage: React.FC = () => {
  const { data, updateSong } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const song = data?.favouriteSong;
  const defaultImage =
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/80 dark:bg-darkbg-card/80 p-5 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-warm-900 dark:text-warm-100">
              My Current Favourite Song
            </h2>
            <p className="text-xs text-warm-500 dark:text-warm-400">
              A featured soundtrack for today's thoughts & study sessions 🎧
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 bg-gradient-to-r from-sunflower-500 to-sunflower-600 hover:from-sunflower-600 hover:to-sunflower-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-warm-sm hover:shadow-warm-md transition-all active:scale-95 shrink-0"
        >
          <Edit3 className="w-4 h-4" />
          <span>Update Song</span>
        </button>
      </div>

      {/* Featured Showcase Card */}
      <div className="bg-gradient-to-br from-white via-amber-50/50 to-sunflower-50/60 dark:from-darkbg-card dark:via-darkbg-card dark:to-sunflower-950/30 border border-warm-200/90 dark:border-darkbg-border rounded-[36px] p-6 sm:p-10 shadow-warm-lg flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        {/* Decorative Sunflower */}
        <div className="absolute -right-10 -bottom-10 opacity-10 dark:opacity-5 pointer-events-none transform rotate-45">
          <SunflowerIcon size={260} />
        </div>

        {/* Vinyl & Artwork Display */}
        <div className="relative group shrink-0">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-warm-lg border-2 border-warm-200 dark:border-darkbg-border bg-warm-100 dark:bg-darkbg-surface relative z-10">
            <img
              src={song?.image || defaultImage}
              alt={song?.song || 'Album Art'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />
          </div>

          {/* Vinyl record slipping out effect behind art */}
          <div className="hidden sm:block absolute -top-2 -right-8 w-44 h-44 rounded-full bg-zinc-900 border-4 border-zinc-800 shadow-xl opacity-90 group-hover:-right-12 transition-all duration-500 z-0">
            <div className="w-full h-full rounded-full border border-zinc-700/50 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-sunflower-500 border-2 border-zinc-900 flex items-center justify-center">
                <Disc className="w-8 h-8 text-white animate-spin-slow" />
              </div>
            </div>
          </div>
        </div>

        {/* Song Info & Personal Reflection */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sunflower-100 dark:bg-sunflower-950/80 border border-sunflower-300 dark:border-sunflower-800 text-xs font-extrabold text-sunflower-800 dark:text-sunflower-300 shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Track</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-warm-900 dark:text-warm-100 tracking-tight">
            {song?.song || 'Golden Hour'}
          </h3>

          <p className="text-base sm:text-lg font-bold text-warm-600 dark:text-warm-300 mt-1">
            {song?.artist || 'JVKE'}
          </p>

          {song?.note ? (
            <div className="mt-4 p-4 rounded-2xl bg-white/80 dark:bg-darkbg-surface/80 border border-warm-200/80 dark:border-darkbg-border text-xs text-warm-700 dark:text-warm-300 italic max-w-md shadow-sm leading-relaxed">
              “{song.note}”
            </div>
          ) : (
            <p className="text-xs text-warm-400 dark:text-warm-500 mt-3 italic">
              No personal reflection note added yet.
            </p>
          )}

          {/* Action Links */}
          <div className="mt-6 flex items-center gap-3 w-full sm:w-auto">
            {song?.url ? (
              <a
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-sunflower-500 to-sunflower-600 hover:from-sunflower-600 hover:to-sunflower-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-warm-md hover:shadow-warm-lg transition-all active:scale-95 w-full sm:w-auto"
              >
                <span>▶ Open Song</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-3 px-6 rounded-2xl bg-warm-100 dark:bg-darkbg-surface hover:bg-warm-200 dark:hover:bg-darkbg-cardHover text-sm font-bold text-warm-800 dark:text-warm-200 rounded-2xl transition-colors"
              >
                Attach Streaming Link
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Song Modal */}
      <SongModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={updateSong}
        initialData={data?.favouriteSong}
      />
    </div>
  );
};
