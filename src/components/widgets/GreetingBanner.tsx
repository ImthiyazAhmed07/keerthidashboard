import React from 'react';
import { getGreeting, formatFullDate } from '../../utils/dateUtils';
import { SunflowerIcon } from '../ui/SunflowerIcon';
import { CheckCircle, FileText, Calendar } from 'lucide-react';
import { FullDashboardData } from '../../types';

interface GreetingBannerProps {
  data: FullDashboardData | null;
}

export const GreetingBanner: React.FC<GreetingBannerProps> = ({ data }) => {
  const userName = data?.user?.name || 'Keerthika';
  const { greeting, period } = getGreeting(userName);
  const fullDate = formatFullDate();

  const pendingTasks = data?.tasks.filter((t) => t.status === 'pending').length || 0;
  const completedTasks = data?.tasks.filter((t) => t.status === 'completed').length || 0;
  const totalTasks = (data?.tasks.length || 0);
  const notesCount = data?.notes.length || 0;

  // Find nearest upcoming date
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const nextDate = data?.dates
    ?.filter((d) => new Date(d.date) >= now)
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const periodBackgrounds = {
    morning: 'from-amber-100/90 via-sunflower-100/60 to-orange-100/70 dark:from-amber-950/40 dark:via-zinc-900 dark:to-orange-950/30 border-amber-300/80 dark:border-amber-900/60',
    afternoon: 'from-sunflower-100/90 via-amber-100/60 to-yellow-100/70 dark:from-sunflower-950/40 dark:via-zinc-900 dark:to-yellow-950/30 border-sunflower-300/80 dark:border-sunflower-900/60',
    evening: 'from-orange-100/90 via-rose-100/50 to-amber-100/60 dark:from-orange-950/40 dark:via-zinc-900 dark:to-rose-950/30 border-orange-300/80 dark:border-orange-900/60',
    night: 'from-warm-100/90 via-slate-100/60 to-amber-100/50 dark:from-slate-950/40 dark:via-zinc-900 dark:to-amber-950/30 border-warm-300/80 dark:border-slate-800/60',
  }[period];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${periodBackgrounds} border backdrop-blur-md shadow-warm-md transition-all`}
    >
      {/* Decorative Sunflower Watermark in Background */}
      <div className="absolute -right-8 -bottom-10 opacity-10 dark:opacity-5 pointer-events-none transform rotate-12">
        <SunflowerIcon size={240} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-darkbg-card/70 border border-warm-200/80 dark:border-darkbg-border text-xs font-bold text-warm-700 dark:text-warm-300 shadow-sm mb-3">
            <SunflowerIcon size={16} animated />
            <span>{fullDate}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-warm-900 dark:text-warm-100 tracking-tight flex items-center gap-3">
            <span>{greeting}</span>
          </h1>

          <p className="mt-2 text-sm sm:text-base text-warm-700 dark:text-warm-300 max-w-xl leading-relaxed">
            Welcome to your digital garden. Today is a brand new opportunity to learn, create, and make steady progress.
          </p>
        </div>

        {/* Quick snapshot pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
          <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200/80 dark:border-darkbg-border rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-warm-500 dark:text-warm-400">
              <CheckCircle className="w-3.5 h-3.5 text-sunflower-600 dark:text-sunflower-400" />
              <span>Tasks</span>
            </div>
            <p className="text-lg font-extrabold text-warm-900 dark:text-warm-100 mt-1">
              {completedTasks}/{totalTasks}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200/80 dark:border-darkbg-border rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-warm-500 dark:text-warm-400">
              <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Notes</span>
            </div>
            <p className="text-lg font-extrabold text-warm-900 dark:text-warm-100 mt-1">
              {notesCount}
            </p>
          </div>

          {nextDate ? (
            <div className="col-span-2 sm:col-span-1 bg-white/80 dark:bg-darkbg-card/80 border border-warm-200/80 dark:border-darkbg-border rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-warm-500 dark:text-warm-400">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Next Event</span>
              </div>
              <p className="text-xs font-extrabold text-warm-900 dark:text-warm-100 mt-1 truncate max-w-[120px]">
                {nextDate.title}
              </p>
            </div>
          ) : (
            <div className="col-span-2 sm:col-span-1 bg-white/80 dark:bg-darkbg-card/80 border border-warm-200/80 dark:border-darkbg-border rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-warm-500 dark:text-warm-400">
                <Calendar className="w-3.5 h-3.5 text-sunflower-600 dark:text-sunflower-400" />
                <span>Status</span>
              </div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                All Clear 🌻
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
