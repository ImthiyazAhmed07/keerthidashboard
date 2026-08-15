import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { NoteItem } from '../types';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit3,
  Calendar,
  Tag,
  Clock,
} from 'lucide-react';
import { NoteModal } from '../components/modals/NoteModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { formatRelativeTime } from '../utils/dateUtils';
import { SunflowerIcon } from '../components/ui/SunflowerIcon';

const CATEGORIES = ['All', 'Personal', 'Study', 'Work', 'Ideas', 'Reminder'];

export const NotesPage: React.FC = () => {
  const { data, addNote, updateNote, togglePinNote, deleteNote } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const notes = data?.notes || [];

  // Filter and search
  const filteredNotes = notes.filter((note) => {
    const matchesCategory =
      selectedCategory === 'All' || note.category?.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      note.title.toLowerCase().includes(query) ||
      (note.content && note.content.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  // Sort pinned to top, then by updatedAt
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  });

  const handleOpenAdd = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note: NoteItem) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSave = async (payload: { title: string; category?: string; content?: string; pinned?: boolean; color?: string }) => {
    if (editingNote) {
      await updateNote(editingNote.id, payload);
    } else {
      await addNote(payload);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-darkbg-card/80 p-5 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-warm-900 dark:text-warm-100">
              Personal Notes
            </h2>
            <p className="text-xs text-warm-500 dark:text-warm-400">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} stored in data.txt
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-4 bg-gradient-to-r from-sunflower-500 to-sunflower-600 hover:from-sunflower-600 hover:to-sunflower-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-warm-sm hover:shadow-warm-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Note</span>
        </button>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-warm-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes..."
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

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-8 shadow-warm-sm">
          <div className="p-4 rounded-3xl bg-sunflower-50 dark:bg-sunflower-950/60 border border-sunflower-200 dark:border-sunflower-800/60 mb-4 animate-bounce-gentle">
            <SunflowerIcon size={56} />
          </div>
          <h3 className="text-base font-extrabold text-warm-900 dark:text-warm-100">
            Nothing here yet.
          </h3>
          <p className="text-xs text-warm-500 dark:text-warm-400 mt-1 max-w-xs leading-relaxed">
            {searchQuery || selectedCategory !== 'All'
              ? 'No notes matched your search query or filter.'
              : 'Add your first note to organize your thoughts and reminders.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-5 py-2 px-4 bg-sunflower-500 hover:bg-sunflower-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Note 🌻</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map((note) => {
            const isSunflower = note.color === 'sunflower' || !note.color;
            const isHoney = note.color === 'honey';
            const isSage = note.color === 'sage';
            const isSky = note.color === 'sky';

            const cardColorClasses = isSunflower
              ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/90 dark:border-amber-900/40'
              : isHoney
              ? 'bg-orange-50/60 dark:bg-orange-950/20 border-orange-200/90 dark:border-orange-900/40'
              : isSage
              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/90 dark:border-emerald-900/40'
              : isSky
              ? 'bg-sky-50/60 dark:bg-sky-950/20 border-sky-200/90 dark:border-sky-900/40'
              : 'bg-white/80 dark:bg-darkbg-card/80 border-warm-200 dark:border-darkbg-border';

            return (
              <div
                key={note.id}
                className={`p-5 rounded-3xl border shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between group ${cardColorClasses}`}
              >
                <div>
                  {/* Top Bar: Pin & Category */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/80 dark:bg-darkbg-card/80 border border-warm-200/60 dark:border-darkbg-border text-warm-700 dark:text-warm-300">
                      {note.category || 'Personal'}
                    </span>

                    <button
                      onClick={() => togglePinNote(note.id)}
                      className={`p-1.5 rounded-xl transition-all ${
                        note.pinned
                          ? 'text-sunflower-600 dark:text-sunflower-400 bg-sunflower-100 dark:bg-sunflower-900/60'
                          : 'text-warm-400 hover:text-warm-700 dark:hover:text-warm-200'
                      }`}
                      title={note.pinned ? 'Unpin note' : 'Pin note to top'}
                      aria-label="Toggle pin"
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-extrabold text-warm-900 dark:text-warm-100 leading-snug">
                    {note.title}
                  </h3>

                  {/* Content */}
                  {note.content && (
                    <p className="text-xs text-warm-700 dark:text-warm-300 mt-2 font-normal leading-relaxed whitespace-pre-wrap line-clamp-6">
                      {note.content}
                    </p>
                  )}
                </div>

                {/* Footer: Date & Actions */}
                <div className="mt-4 pt-3 border-t border-warm-200/60 dark:border-darkbg-border/60 flex items-center justify-between text-[10px] text-warm-400 dark:text-warm-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(note.updatedAt || note.createdAt)}</span>
                  </span>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1.5 text-warm-500 hover:text-sunflower-600 dark:hover:text-sunflower-400 hover:bg-white dark:hover:bg-darkbg-card rounded-lg transition-colors"
                      title="Edit note"
                      aria-label="Edit note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingNoteId(note.id)}
                      className="p-1.5 text-warm-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-darkbg-card rounded-lg transition-colors"
                      title="Delete note"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingNote}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingNoteId}
        onClose={() => setDeletingNoteId(null)}
        onConfirm={() => {
          if (deletingNoteId) deleteNote(deletingNoteId);
        }}
        title="Delete Note"
        message="Are you sure you want to remove this note from data.txt? This cannot be undone."
        confirmLabel="Delete Note"
      />
    </div>
  );
};
