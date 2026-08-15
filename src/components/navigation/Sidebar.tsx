import React from 'react';
import {
  Home,
  FileText,
  CheckSquare,
  Calendar,
  Link2,
  Music,
  PenTool,
  Clock,
  Settings,
  LogOut,
} from 'lucide-react';
import { PageId } from '../../types';
import { SunflowerIcon } from '../ui/SunflowerIcon';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onSelectPage }) => {
  const { logout } = useAuth();
  const { data } = useData();

  const pendingTasksCount = data?.tasks.filter((t) => t.status === 'pending').length || 0;
  const notesCount = data?.notes.length || 0;

  const navItems: { id: PageId; label: string; icon: React.FC<any>; badge?: number | string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'notes', label: 'Notes', icon: FileText, badge: notesCount > 0 ? notesCount : undefined },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: 'timer', label: 'Focus Timer', icon: Clock },
    { id: 'dates', label: 'Important Dates', icon: Calendar },
    { id: 'links', label: 'Links', icon: Link2 },
    { id: 'song', label: 'Favourite Song', icon: Music },
    { id: 'scribble', label: 'Scribble Board', icon: PenTool },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white/80 dark:bg-darkbg-card/80 backdrop-blur-md border-r border-warm-200 dark:border-darkbg-border p-4 justify-between z-30 select-none">
      {/* Brand Header */}
      <div>
        <div
          onClick={() => onSelectPage('home')}
          className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-warm-100 dark:hover:bg-darkbg-cardHover cursor-pointer transition-colors"
        >
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-sunflower-100 to-sunflower-200 dark:from-sunflower-950 dark:to-sunflower-900 border border-sunflower-300 dark:border-sunflower-800/60 shadow-warm-sm">
            <SunflowerIcon size={26} animated />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-warm-900 dark:text-warm-100 flex items-center gap-1.5">
              Keerthika <span className="text-sunflower-600 dark:text-sunflower-400 font-semibold">Dashboard</span>
            </h1>
            <p className="text-xs text-warm-500 dark:text-warm-400 font-medium">Personal Workspace 🌻</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-sunflower-500 text-white shadow-warm-sm font-bold scale-[1.02]'
                    : 'text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover hover:text-warm-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-warm-500 dark:text-warm-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-warm-100 dark:bg-darkbg-border text-warm-700 dark:text-warm-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Section & Logout */}
      <div className="pt-4 border-t border-warm-200 dark:border-darkbg-border">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-sunflower-200 dark:bg-sunflower-900/60 flex items-center justify-center font-bold text-sunflower-800 dark:text-sunflower-200 text-sm">
              K
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-warm-900 dark:text-warm-100 truncate">
                {data?.user?.name || 'Keerthika'}
              </p>
              <p className="text-[10px] text-warm-500 dark:text-warm-400">Personal Space 🌻</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="p-1.5 text-warm-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-warm-200/60 dark:hover:bg-darkbg-cardHover rounded-xl transition-colors"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
