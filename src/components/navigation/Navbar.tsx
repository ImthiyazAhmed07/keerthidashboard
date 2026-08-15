import React, { useState, useEffect } from 'react';
import { PageId } from '../../types';
import { SunflowerIcon } from '../ui/SunflowerIcon';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';

interface NavbarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onSelectPage }) => {
  const { theme, setTheme, isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState(formatTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
    home: { title: 'Home Dashboard', subtitle: 'Overview of your personal space' },
    notes: { title: 'Personal Notes', subtitle: 'Thoughts, reminders, and study notes' },
    tasks: { title: 'Task Manager', subtitle: 'Keep track of what needs to get done' },
    dates: { title: 'Important Dates', subtitle: 'Upcoming events, deadlines, and milestones' },
    links: { title: 'Quick Links', subtitle: 'Your favorite and frequently used bookmarks' },
    song: { title: 'My Current Favourite Song', subtitle: 'The soundtrack to your day 🎧' },
    scribble: { title: 'Scribble Board', subtitle: 'Just scribble. Nothing needs to be saved. 🌻' },
    settings: { title: 'Preferences & Settings', subtitle: 'Customize themes, widgets, and backups' },
  };

  const currentMeta = pageTitles[currentPage] || pageTitles.home;

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-darkbg-card/80 backdrop-blur-md border-b border-warm-200 dark:border-darkbg-border px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
      {/* Mobile Logo & Page Info */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => onSelectPage('home')}
          className="lg:hidden flex items-center gap-2 cursor-pointer"
        >
          <div className="p-1.5 rounded-xl bg-sunflower-100 dark:bg-sunflower-950 border border-sunflower-300 dark:border-sunflower-800">
            <SunflowerIcon size={20} animated />
          </div>
          <span className="font-bold text-sm text-warm-900 dark:text-warm-100">Keerthika</span>
        </div>

        {/* Desktop Page Title */}
        <div className="hidden lg:block">
          <h2 className="text-lg font-bold text-warm-900 dark:text-warm-100 flex items-center gap-2">
            {currentMeta.title}
          </h2>
          <p className="text-xs text-warm-500 dark:text-warm-400 font-medium">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right controls: Live time badge & Theme switch */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-100 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs font-semibold text-warm-700 dark:text-warm-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentTime}</span>
        </div>

        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-warm-100 dark:bg-darkbg-surface hover:bg-warm-200 dark:hover:bg-darkbg-cardHover border border-warm-200 dark:border-darkbg-border text-warm-700 dark:text-warm-300 transition-all shadow-sm active:scale-95"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-sunflower-400 animate-fade-in" />
          ) : (
            <Moon className="w-4 h-4 text-warm-600 animate-fade-in" />
          )}
        </button>
      </div>
    </header>
  );
};
