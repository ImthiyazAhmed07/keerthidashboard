import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FavouriteSong } from '../../types';

interface SongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { song: string; artist: string; image?: string; url?: string; note?: string }) => Promise<void>;
  initialData?: FavouriteSong | null;
}

export const SongModal: React.FC<SongModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSong(initialData.song || '');
      setArtist(initialData.artist || '');
      setImage(initialData.image || '');
      setUrl(initialData.url || '');
      setNote(initialData.note || '');
    } else {
      setSong('');
      setArtist('');
      setImage('');
      setUrl('');
      setNote('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!song.trim() || !artist.trim()) return;

    setIsLoading(true);
    try {
      await onSave({
        song: song.trim(),
        artist: artist.trim(),
        image: image.trim() || undefined,
        url: url.trim() || undefined,
        note: note.trim() || undefined,
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
      title={<span>Update Current Favourite Song 🎵</span>}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Song Name */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
            Song Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Golden Hour, Daylight, Sunflower..."
            value={song}
            onChange={(e) => setSong(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-sm focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-medium"
            autoFocus
          />
        </div>

        {/* Artist */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
            Artist Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. JVKE, Taylor Swift, Post Malone..."
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-sm focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-medium"
          />
        </div>

        {/* Music URL */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
            Music Link (Spotify, YouTube, Apple Music)
          </label>
          <input
            type="text"
            placeholder="e.g. https://open.spotify.com/track/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-mono"
          />
        </div>

        {/* Album Art Image URL */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
            Cover / Album Image URL (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. https://images.unsplash.com/..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-mono"
          />
        </div>

        {/* Personal Note */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
            Why do you like this song right now? (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Uplifting study vibes, makes me feel calm 🌻"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs focus:outline-none focus:ring-2 focus:ring-sunflower-400"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 mt-3 pt-3 border-t border-warm-100 dark:border-darkbg-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            Save Song 🌻
          </Button>
        </div>
      </form>
    </Modal>
  );
};
