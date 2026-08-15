import React, { useState } from 'react';
import { CheckSquare, Check, Plus, ChevronRight, AlertCircle, Circle } from 'lucide-react';
import { TaskItem, PageId } from '../../types';
import { useData } from '../../context/DataContext';
import { fireSunflowerConfetti } from '../ui/Confetti';

interface TasksWidgetProps {
  onNavigate: (page: PageId) => void;
  onOpenAddModal: () => void;
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({
  onNavigate,
  onOpenAddModal,
}) => {
  const { data, toggleTask, addTask } = useData();
  const [quickTitle, setQuickTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tasks = data?.tasks || [];
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Show up to 5 tasks (pending first)
  const displayTasks = [...tasks]
    .sort((a, b) => (a.status === 'completed' ? 1 : 0) - (b.status === 'completed' ? 1 : 0))
    .slice(0, 5);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addTask({
        title: quickTitle.trim(),
        priority: 'medium',
        category: 'Personal',
      });
      setQuickTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (task: TaskItem) => {
    if (task.status === 'pending') {
      fireSunflowerConfetti();
    }
    await toggleTask(task.id);
  };

  return (
    <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl p-5 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-sunflower-100 dark:bg-sunflower-950/70 border border-sunflower-300 dark:border-sunflower-800 text-sunflower-600 dark:text-sunflower-400">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-warm-900 dark:text-warm-100">Today's Tasks</h3>
          </div>

          <button
            onClick={onOpenAddModal}
            className="p-1.5 bg-sunflower-500 hover:bg-sunflower-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95 px-2.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Task</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-warm-50 dark:bg-darkbg-surface p-3 rounded-2xl border border-warm-200/80 dark:border-darkbg-border mb-3">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-warm-700 dark:text-warm-300">Progress</span>
            <span className="text-sunflower-600 dark:text-sunflower-400 font-mono">
              {completedCount} / {totalCount} completed ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-warm-200 dark:bg-darkbg-border h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sunflower-400 to-sunflower-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Add Input */}
        <form onSubmit={handleQuickAdd} className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Quick task... (press Enter)"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs focus:outline-none focus:ring-2 focus:ring-sunflower-400 dark:focus:ring-sunflower-500"
          />
          <button
            type="submit"
            disabled={!quickTitle.trim() || isSubmitting}
            className="p-2 bg-sunflower-500 hover:bg-sunflower-600 text-white rounded-xl disabled:opacity-40 transition-all"
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {/* Tasks List */}
        {displayTasks.length === 0 ? (
          <div className="py-6 text-center flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">✨</span>
            <p className="text-xs font-bold text-warm-800 dark:text-warm-200">You're all caught up!</p>
            <p className="text-[11px] text-warm-500 dark:text-warm-400 mt-0.5">Enjoy the peace. 🌻</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {displayTasks.map((task) => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  onClick={() => handleToggle(task)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer select-none ${
                    isCompleted
                      ? 'bg-warm-100/50 dark:bg-darkbg-surface/50 border-warm-200/50 dark:border-darkbg-border/50 opacity-60'
                      : 'bg-warm-50/70 dark:bg-darkbg-surface border-warm-200 dark:border-darkbg-border hover:border-sunflower-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(task);
                      }}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white scale-105'
                          : 'border-warm-300 dark:border-warm-600 hover:border-sunflower-500 bg-white dark:bg-darkbg-card'
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <span
                      className={`text-xs font-medium truncate ${
                        isCompleted
                          ? 'line-through text-warm-400 dark:text-warm-500'
                          : 'text-warm-900 dark:text-warm-100'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {task.priority === 'high' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                        High
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-warm-100 dark:bg-darkbg-card text-warm-600 dark:text-warm-400 border border-warm-200 dark:border-darkbg-border">
                      {task.category || 'Personal'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <button
        onClick={() => onNavigate('tasks')}
        className="mt-3 w-full py-2 px-3 rounded-xl bg-warm-100 dark:bg-darkbg-surface hover:bg-warm-200 dark:hover:bg-darkbg-cardHover text-xs font-semibold text-warm-700 dark:text-warm-300 flex items-center justify-center gap-1.5 transition-colors"
      >
        <span>View task manager</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
