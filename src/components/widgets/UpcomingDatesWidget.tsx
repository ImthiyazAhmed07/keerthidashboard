import React from 'react';
import { Calendar, Plus, ChevronRight, Bell } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageId } from '../../types';
import { getDaysRemaining } from '../../utils/dateUtils';

interface UpcomingDatesWidgetProps {
  onNavigate: (page: PageId) => void;
  onOpenAddModal: () => void;
}

export const UpcomingDatesWidget: React.FC<UpcomingDatesWidgetProps> = ({
  onNavigate,
  onOpenAddModal,
}) => {
  const { data } = useData();
  const dates = data?.dates || [];

  // Filter upcoming or today
  const upcomingDates = [...dates]
    .filter((d) => {
      const { days } = getDaysRemaining(d.date);
      return days >= 0;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl p-5 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-sunflower-100 dark:bg-sunflower-950/70 border border-sunflower-300 dark:border-sunflower-800 text-sunflower-600 dark:text-sunflower-400">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-warm-900 dark:text-warm-100">Upcoming Dates</h3>
          </div>

          <button
            onClick={onOpenAddModal}
            className="p-1.5 bg-sunflower-500 hover:bg-sunflower-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95 px-2.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Date</span>
          </button>
        </div>

        {/* Dates List */}
        {upcomingDates.length === 0 ? (
          <div className="py-6 text-center">
            <span className="text-2xl">📅</span>
            <p className="text-xs font-bold text-warm-800 dark:text-warm-200 mt-1">No upcoming dates.</p>
            <p className="text-[11px] text-warm-500 dark:text-warm-400">Add an assignment or event.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 my-2">
            {upcomingDates.map((item) => {
              const { label, isToday } = getDaysRemaining(item.date);
              return (
                <div
                  key={item.id}
                  className="p-2.5 rounded-2xl bg-warm-50/70 dark:bg-darkbg-surface border border-warm-200/80 dark:border-darkbg-border flex items-center justify-between gap-3 shadow-sm hover:border-sunflower-300 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-warm-900 dark:text-warm-100 truncate">
                        {item.title}
                      </h4>
                      {item.reminder && (
                        <Bell className="w-3 h-3 text-amber-500 shrink-0 fill-amber-500/30" />
                      )}
                    </div>
                    <p className="text-[10px] text-warm-500 dark:text-warm-400 font-medium">
                      {item.date} • {item.category || 'General'}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold shrink-0 ${
                      isToday
                        ? 'bg-amber-500 text-white animate-pulse-gentle'
                        : 'bg-sunflower-100 dark:bg-sunflower-950/80 text-sunflower-800 dark:text-sunflower-300 border border-sunflower-300 dark:border-sunflower-800'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={() => onNavigate('dates')}
        className="mt-3 w-full py-2 px-3 rounded-xl bg-warm-100 dark:bg-darkbg-surface hover:bg-warm-200 dark:hover:bg-darkbg-cardHover text-xs font-semibold text-warm-700 dark:text-warm-300 flex items-center justify-center gap-1.5 transition-colors"
      >
        <span>View calendar & events</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
