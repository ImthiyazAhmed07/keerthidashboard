import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TaskItem } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; priority?: string; dueDate?: string; category?: string; status?: 'pending' | 'completed' }) => Promise<void>;
  initialData?: TaskItem | null;
}

const CATEGORIES = ['Personal', 'Study', 'Work', 'Other'];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Personal');
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setPriority(initialData.priority || 'medium');
      setDueDate(initialData.dueDate || '');
      setCategory(initialData.category || 'Personal');
      setStatus(initialData.status || 'pending');
    } else {
      setTitle('');
      setPriority('medium');
      setDueDate(new Date().toISOString().split('T')[0]);
      setCategory('Personal');
      setStatus('pending');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onSave({
        title: title.trim(),
        priority,
        dueDate: dueDate || undefined,
        category,
        status,
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
      title={<span>{initialData ? 'Edit Task' : 'Add New Task ✅'}</span>}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
            Task Description *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Finish reading Chapter 4..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-sm focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-medium"
            autoFocus
          />
        </div>

        {/* Priority & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3 py-2 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sunflower-400"
            >
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
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

        {/* Due Date & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sunflower-400"
            />
          </div>

          {initialData && (
            <div>
              <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sunflower-400"
              >
                <option value="pending">⏳ Pending</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 mt-3 pt-3 border-t border-warm-100 dark:border-darkbg-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {initialData ? 'Save Changes' : 'Add Task 🌻'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
