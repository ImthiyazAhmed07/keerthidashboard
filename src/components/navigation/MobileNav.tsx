import React from 'react';
import {
  Home,
  FileText,
  CheckSquare,
  Clock,
  Calendar,
  Link2,
  Music,
  PenTool,
  Settings,
} from 'lucide-react';
import { PageId } from '../../types';
import { useData } from '../../context/DataContext';

interface MobileNavProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onSelectPage }) => {
  const { data } = useData();
  const pendingTasksCount = data?.tasks.filter((t) => t.status === 'pending').length || 0;

  const items: { id: PageId; label: string; icon: React.FC<any>; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: 'timer', label: 'Timer', icon: Clock },
    { id: 'dates', label: 'Dates', icon: Calendar },
    { id: 'links', label: 'Links', icon: Link2 },
    { id: 'song', label: 'Song', icon: Music },
    { id: 'scribble', label: 'Scribble', icon: PenTool },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-darkbg-card/90 backdrop-blur-lg border-t border-warm-200 dark:border-darkbg-border px-2 py-1.5 flex items-center justify-around shadow-warm-lg transition-colors overflow-x-auto">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectPage(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl min-w-[50px] relative transition-all active:scale-95 shrink-0 ${
              isActive
                ? 'text-sunflower-600 dark:text-sunflower-400 font-bold'
                : 'text-warm-500 dark:text-warm-400 hover:text-warm-800 dark:hover:text-warm-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 bg-sunflower-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate">{item.label}</span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-sunflower-500 mt-0.5 animate-pulse-gentle" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
