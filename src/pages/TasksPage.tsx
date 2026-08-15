import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { TaskItem } from '../types';
import {
  CheckSquare,
  Check,
  Plus,
  Search,
  Trash2,
  Edit3,
  Calendar,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { TaskModal } from '../components/modals/TaskModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { fireSunflowerConfetti } from '../components/ui/Confetti';
import { sound } from '../utils/audio';

const CATEGORIES = ['All', 'Personal', 'Study', 'Work', 'Other'];
const STATUS_FILTERS = ['All', 'Active', 'Completed'];

export const TasksPage: React.FC = () => {
  const { data, addTask, updateTask, toggleTask, deleteTask } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [quickTitle, setQuickTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const tasks = data?.tasks || [];
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesCategory =
      selectedCategory === 'All' || task.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Active' && task.status === 'pending') ||
      (selectedStatus === 'Completed' && task.status === 'completed');
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || task.title.toLowerCase().includes(query);
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    await addTask({
      title: quickTitle.trim(),
      priority: 'medium',
      category: selectedCategory !== 'All' ? selectedCategory : 'Personal',
      dueDate: new Date().toISOString().split('T')[0],
    });
    setQuickTitle('');
  };

  const handleToggle = async (task: TaskItem) => {
    if (task.status === 'pending') {
      fireSunflowerConfetti();
    }
    await toggleTask(task.id);
  };

  const handleOpenAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: TaskItem) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSave = async (payload: { title: string; priority?: string; dueDate?: string; category?: string; status?: 'pending' | 'completed' }) => {
    if (editingTask) {
      await updateTask(editingTask.id, payload);
    } else {
      await addTask(payload);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Progress Card */}
      <div className="bg-white/80 dark:bg-darkbg-card/80 p-6 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-sunflower-100 dark:bg-sunflower-950/70 border border-sunflower-300 dark:border-sunflower-800 text-sunflower-600 dark:text-sunflower-400">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-warm-900 dark:text-warm-100">
              Task Manager
            </h2>
            <p className="text-xs text-warm-500 dark:text-warm-400 mt-0.5">
              Stay organized, focused, and steady every day 🌻
            </p>
          </div>
        </div>

        {/* Progress bar info */}
        <div className="w-full md:w-80 bg-warm-50 dark:bg-darkbg-surface p-4 rounded-2xl border border-warm-200/80 dark:border-darkbg-border">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-warm-700 dark:text-warm-300">Today's Progress</span>
            <span className="text-sunflower-600 dark:text-sunflower-400 font-mono">
              {completedCount} / {totalCount} completed ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-warm-200 dark:bg-darkbg-border h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sunflower-400 to-sunflower-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Add Bar */}
      <form
        onSubmit={handleQuickAdd}
        className="flex gap-2 p-2 bg-white/80 dark:bg-darkbg-card/80 rounded-2xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm"
      >
        <input
          type="text"
          placeholder="What do you want to accomplish today? (Type and press Enter)..."
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-medium"
        />
        <button
          type="submit"
          disabled={!quickTitle.trim()}
          className="px-4 py-2.5 bg-gradient-to-r from-sunflower-500 to-sunflower-600 hover:from-sunflower-600 hover:to-sunflower-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-warm-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-darkbg-card border border-warm-200 dark:border-darkbg-border text-xs focus:outline-none focus:ring-2 focus:ring-sunflower-400 shadow-sm"
          />
        </div>

        {/* Status and Category Filters */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Status Tabs */}
          <div className="flex bg-white dark:bg-darkbg-card p-1 rounded-2xl border border-warm-200 dark:border-darkbg-border shadow-sm text-xs font-bold">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedStatus === s
                    ? 'bg-sunflower-500 text-white shadow-sm'
                    : 'text-warm-600 dark:text-warm-400 hover:text-warm-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-white dark:bg-darkbg-card border border-warm-200 dark:border-darkbg-border text-xs font-bold text-warm-700 dark:text-warm-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sunflower-400"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-8 shadow-warm-sm">
          <span className="text-5xl mb-4">✨</span>
          <h3 className="text-base font-extrabold text-warm-900 dark:text-warm-100">
            You're all caught up!
          </h3>
          <p className="text-xs text-warm-500 dark:text-warm-400 mt-1 max-w-xs leading-relaxed">
            {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All'
              ? 'No tasks found for the selected filter.'
              : 'Enjoy the peace. You have no pending tasks right now. 🌻'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-5 py-2 px-4 bg-sunflower-500 hover:bg-sunflower-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Task</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isHigh = task.priority === 'high';
            const isMedium = task.priority === 'medium';

            return (
              <div
                key={task.id}
                onClick={() => handleToggle(task)}
                className={`p-4 rounded-3xl border transition-all flex items-center justify-between gap-4 cursor-pointer select-none group shadow-warm-sm ${
                  isCompleted
                    ? 'bg-warm-100/40 dark:bg-darkbg-surface/40 border-warm-200/60 dark:border-darkbg-border/60 opacity-60'
                    : 'bg-white/90 dark:bg-darkbg-card/90 border-warm-200 dark:border-darkbg-border hover:border-sunflower-300 dark:hover:border-sunflower-800'
                }`}
              >
                {/* Left: Checkbox & Info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(task);
                    }}
                    className={`w-6 h-6 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white scale-105'
                        : 'border-warm-300 dark:border-warm-600 hover:border-sunflower-500 bg-white dark:bg-darkbg-card'
                    }`}
                  >
                    {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="min-w-0">
                    <h3
                      className={`text-sm font-bold truncate ${
                        isCompleted
                          ? 'line-through text-warm-400 dark:text-warm-500'
                          : 'text-warm-900 dark:text-warm-100'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-warm-500 dark:text-warm-400">
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-warm-400" />
                          <span>Due: {task.dueDate}</span>
                        </span>
                      )}
                      <span>•</span>
                      <span>{task.category || 'Personal'}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Badges & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {isHigh && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                      High
                    </span>
                  )}
                  {isMedium && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                      Medium
                    </span>
                  )}

                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(task);
                      }}
                      className="p-1.5 text-warm-400 hover:text-sunflower-600 dark:hover:text-sunflower-400 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-lg transition-colors"
                      title="Edit task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingTaskId(task.id);
                      }}
                      className="p-1.5 text-warm-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingTask}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={() => {
          if (deletingTaskId) deleteTask(deletingTaskId);
        }}
        title="Delete Task"
        message="Are you sure you want to remove this task from data.txt?"
        confirmLabel="Delete Task"
      />
    </div>
  );
};
