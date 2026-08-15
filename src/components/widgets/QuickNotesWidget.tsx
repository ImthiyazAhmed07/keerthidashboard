import React, { useState } from 'react';
import { FileText, Plus, Pin, Trash2, ChevronRight, ExternalLink } from 'lucide-react';
import { NoteItem, PageId } from '../../types';
import { useData } from '../../context/DataContext';
import { formatRelativeTime } from '../../utils/dateUtils';

interface QuickNotesWidgetProps {
  onNavigate: (page: PageId) => void;
  onOpenAddModal: () => void;
}

export const QuickNotesWidget: React.FC<QuickNotesWidgetProps> = ({
  onNavigate,
  onOpenAddModal,
}) => {
  const { data, togglePinNote, deleteNote } = useData();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const notes = data?.notes || [];
  // Sort pinned first, then by updatedAt
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  }).slice(0, 4);

  return (
    <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl p-5 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-warm-900 dark:text-warm-100">Quick Notes</h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenAddModal}
              className="p-1.5 bg-sunflower-500 hover:bg-sunflower-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95 px-2.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Note</span>
            </button>
          </div>
        </div>

        {/* Notes List */}
        {sortedNotes.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">🌻</span>
            <p className="text-xs font-bold text-warm-800 dark:text-warm-200">Nothing here yet.</p>
            <p className="text-[11px] text-warm-500 dark:text-warm-400 mt-0.5">Add your first note.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 my-2">
            {sortedNotes.map((note) => {
              const isExpanded = expandedId === note.id;
              return (
                <div
                  key={note.id}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    note.pinned
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                      : 'bg-warm-50/60 dark:bg-darkbg-surface border-warm-200/70 dark:border-darkbg-border'
                  } hover:border-sunflower-300 dark:hover:border-sunflower-800/80`}
                  onClick={() => setExpandedId(isExpanded ? null : note.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {note.pinned && (
                        <Pin className="w-3.5 h-3.5 text-sunflower-600 dark:text-sunflower-400 fill-current shrink-0" />
                      )}
                      <h4 className="text-xs font-bold text-warm-900 dark:text-warm-100 truncate">
                        {note.title}
                      </h4>
                    </div>

                    <span className="text-[10px] text-warm-400 dark:text-warm-500 shrink-0">
                      {formatRelativeTime(note.updatedAt || note.createdAt)}
                    </span>
                  </div>

                  {note.content && (
                    <p
                      className={`text-xs text-warm-600 dark:text-warm-300 mt-1.5 font-normal leading-relaxed ${
                        isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-2'
                      }`}
                    >
                      {note.content}
                    </p>
                  )}

                  {isExpanded && (
                    <div className="mt-3 pt-2 border-t border-warm-200/60 dark:border-darkbg-border flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-darkbg-card border border-warm-200 dark:border-darkbg-border text-warm-500 font-medium">
                        {note.category || 'Personal'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinNote(note.id);
                          }}
                          className="p-1 text-warm-400 hover:text-sunflower-600 rounded-md"
                          title={note.pinned ? 'Unpin' : 'Pin'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="p-1 text-warm-400 hover:text-rose-600 rounded-md"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <button
        onClick={() => onNavigate('notes')}
        className="mt-3 w-full py-2 px-3 rounded-xl bg-warm-100 dark:bg-darkbg-surface hover:bg-warm-200 dark:hover:bg-darkbg-cardHover text-xs font-semibold text-warm-700 dark:text-warm-300 flex items-center justify-center gap-1.5 transition-colors"
      >
        <span>View all notes</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
