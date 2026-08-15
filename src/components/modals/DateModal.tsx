import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ImportantDateItem } from '../../types';
import { Bell } from 'lucide-react';

interface DateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; date: string; category?: string; description?: string; reminder?: boolean }) => Promise<void>;
  initialData?: ImportantDateItem | null;
}

const CATEGORIES = ['Study', 'Work', 'Personal', 'Exam', 'Submission', 'Holiday', 'Other'];

export const DateModal: React.FC<DateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Study');
  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.date);
      setCategory(initialData.category || 'Study');
      setDescription(initialData.description || '');
      setReminder(!!initialData.reminder);
    } else {
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('Study');
      setDescription('');
      setReminder(true);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    setIsLoading(true);
    try {
      await onSave({
        title: title.trim(),
        date,
        category,
        description: description.trim() || undefined,
        reminder,
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
      title={<span>{initialData ? 'Edit Event' : 'Add Important Date 📅'}</span>}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
            Event Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Final Project Submission, Midterm Exam..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-sm focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-medium"
            autoFocus
          />
        </div>

        {/* Date & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
              Event Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sunflower-400"
            />
          </div>

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
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
            Optional Notes / Description
          </label>
          <textarea
            rows={3}
            placeholder="Key details, checklist or room location..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs focus:outline-none focus:ring-2 focus:ring-sunflower-400 resize-none font-normal leading-relaxed"
          />
        </div>

        {/* Reminder Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200/80 dark:border-darkbg-border">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-warm-800 dark:text-warm-200">
              Highlight in Upcoming Deadlines
            </span>
          </div>
          <input
            type="checkbox"
            checked={reminder}
            onChange={(e) => setReminder(e.target.checked)}
            className="w-4 h-4 text-sunflower-500 rounded focus:ring-sunflower-400"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 mt-3 pt-3 border-t border-warm-100 dark:border-darkbg-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {initialData ? 'Save Changes' : 'Add Event 🌻'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
