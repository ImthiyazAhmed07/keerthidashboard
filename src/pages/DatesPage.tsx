import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ImportantDateItem } from '../types';
import {
  Calendar,
  Plus,
  Search,
  Trash2,
  Edit3,
  Bell,
  Clock,
  CalendarCheck,
} from 'lucide-react';
import { DateModal } from '../components/modals/DateModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { getDaysRemaining } from '../../src/utils/dateUtils';
import { SunflowerIcon } from '../components/ui/SunflowerIcon';

const CATEGORIES = ['All', 'Study', 'Work', 'Personal', 'Exam', 'Submission', 'Holiday'];

export const DatesPage: React.FC = () => {
  const { data, addDate, updateDate, deleteDate } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<ImportantDateItem | null>(null);
  const [deletingDateId, setDeletingDateId] = useState<string | null>(null);

  const dates = data?.dates || [];

  const filteredDates = dates.filter((d) => {
    const matchesCategory =
      selectedCategory === 'All' || d.category?.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      d.title.toLowerCase().includes(query) ||
      (d.description && d.description.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingDate(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dateItem: ImportantDateItem) => {
    setEditingDate(dateItem);
    setIsModalOpen(true);
  };

  const handleSave = async (payload: { title: string; date: string; category?: string; description?: string; reminder?: boolean }) => {
    if (editingDate) {
      await updateDate(editingDate.id, payload);
    } else {
      await addDate(payload);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-darkbg-card/80 p-5 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-warm-900 dark:text-warm-100">
              Important Dates & Deadlines
            </h2>
            <p className="text-xs text-warm-500 dark:text-warm-400">
              Never miss an assignment, event, or memorable milestone 🌻
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-4 bg-gradient-to-r from-sunflower-500 to-sunflower-600 hover:from-sunflower-600 hover:to-sunflower-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-warm-sm hover:shadow-warm-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Date</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-warm-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dates & events..."
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

      {/* Dates Grid / Timeline */}
      {filteredDates.length === 0 ? (
        <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-8 shadow-warm-sm">
          <div className="p-4 rounded-3xl bg-sunflower-50 dark:bg-sunflower-950/60 border border-sunflower-200 dark:border-sunflower-800/60 mb-4 animate-bounce-gentle">
            <SunflowerIcon size={56} />
          </div>
          <h3 className="text-base font-extrabold text-warm-900 dark:text-warm-100">
            No important dates found.
          </h3>
          <p className="text-xs text-warm-500 dark:text-warm-400 mt-1 max-w-xs leading-relaxed">
            Add exam deadlines, assignment submissions, or special occasions to keep track easily.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-5 py-2 px-4 bg-sunflower-500 hover:bg-sunflower-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event 📅</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDates.map((item) => {
            const { days, label, isToday, isPast } = getDaysRemaining(item.date);
            return (
              <div
                key={item.id}
                className="bg-white/90 dark:bg-darkbg-card/90 border border-warm-200 dark:border-darkbg-border rounded-3xl p-5 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-warm-100 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-warm-700 dark:text-warm-300">
                      {item.category || 'General'}
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-extrabold shadow-sm ${
                        isToday
                          ? 'bg-amber-500 text-white animate-pulse-gentle'
                          : isPast
                          ? 'bg-warm-100 dark:bg-darkbg-surface text-warm-500'
                          : 'bg-sunflower-100 dark:bg-sunflower-950/80 text-sunflower-800 dark:text-sunflower-300 border border-sunflower-300 dark:border-sunflower-800'
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-warm-900 dark:text-warm-100 leading-snug flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.reminder && (
                      <Bell className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 shrink-0" />
                    )}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-warm-500 dark:text-warm-400 mt-1 font-medium">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-warm-600 dark:text-warm-300 mt-2.5 font-normal leading-relaxed whitespace-pre-wrap">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-warm-100 dark:border-darkbg-border flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-warm-400 hover:text-sunflower-600 dark:hover:text-sunflower-400 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-lg transition-colors"
                    title="Edit date"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingDateId(item.id)}
                    className="p-1.5 text-warm-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-lg transition-colors"
                    title="Delete date"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Date Modal */}
      <DateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingDate}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingDateId}
        onClose={() => setDeletingDateId(null)}
        onConfirm={() => {
          if (deletingDateId) deleteDate(deletingDateId);
        }}
        title="Delete Date"
        message="Are you sure you want to remove this date from data.txt?"
        confirmLabel="Delete Date"
      />
    </div>
  );
};
