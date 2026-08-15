import React, { useState, useEffect } from 'react';
import { useTheme, ThemeMode, AccentColor } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../utils/api';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Palette,
  Layout,
  Database,
  Download,
  Upload,
  User,
  LogOut,
  Check,
  FileText,
  Clock,
  Sparkles,
  Music,
  Pen,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, accent, setAccent } = useTheme();
  const { data, updateSettings, updateProfile, refreshData } = useData();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(data?.user?.name || 'Keerthika');
  const [isSavingName, setIsSavingName] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Restore Modal State
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [rawRestoreContent, setRawRestoreContent] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (data?.user?.name) {
      setName(data.user.name);
    }
  }, [data?.user?.name]);

  const loadStats = async () => {
    try {
      const res = await api.getStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch {}
  };

  useEffect(() => {
    loadStats();
  }, [data]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSavingName(true);
    try {
      await updateProfile(name.trim());
    } finally {
      setIsSavingName(false);
    }
  };

  const handleToggleWidget = async (key: string, currentValue: boolean) => {
    await updateSettings({ [key]: !currentValue });
  };

  const handleDownloadBackup = () => {
    window.open('/api/backup/raw', '_blank');
    showToast('Downloading data.txt backup file 🌻', 'info');
  };

  const handleRestoreBackup = async () => {
    if (!rawRestoreContent.trim()) return;
    setIsRestoring(true);
    try {
      await api.restoreBackup(rawRestoreContent);
      await refreshData();
      setIsRestoreModalOpen(false);
      setRawRestoreContent('');
      showToast('Dashboard restored successfully from data.txt! 🌻', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to restore backup.', 'error');
    } finally {
      setIsRestoring(false);
    }
  };

  const accents: { id: AccentColor; label: string; bg: string; border: string }[] = [
    { id: 'sunflower', label: 'Sunflower Gold 🌻', bg: 'bg-amber-500', border: 'border-amber-600' },
    { id: 'honey', label: 'Warm Honey 🍯', bg: 'bg-orange-500', border: 'border-orange-600' },
    { id: 'sunset', label: 'Terracotta Rose 🌅', bg: 'bg-rose-500', border: 'border-rose-600' },
    { id: 'sage', label: 'Sage Meadow 🌿', bg: 'bg-emerald-600', border: 'border-emerald-700' },
    { id: 'sky', label: 'Sky Blue ☁️', bg: 'bg-sky-500', border: 'border-sky-600' },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center gap-3 bg-white/80 dark:bg-darkbg-card/80 p-5 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm">
        <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-warm-900 dark:text-warm-100">
            Website Preferences & Settings
          </h2>
          <p className="text-xs text-warm-500 dark:text-warm-400">
            Personalize your theme, dashboard widgets, and storage backups 🌻
          </p>
        </div>
      </div>

      {/* 1. Appearance & Theme */}
      <section className="bg-white/80 dark:bg-darkbg-card/80 p-6 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm flex flex-col gap-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-warm-100 dark:border-darkbg-border">
          <Palette className="w-5 h-5 text-sunflower-600 dark:text-sunflower-400" />
          <h3 className="text-sm font-extrabold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
            Appearance & Colors
          </h3>
        </div>

        {/* Mode selection */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-2">
            Color Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun },
              { id: 'dark', label: 'Dark Mode', icon: Moon },
              { id: 'system', label: 'System Auto', icon: Laptop },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = theme === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setTheme(m.id as ThemeMode);
                    updateSettings({ theme: m.id as ThemeMode });
                  }}
                  className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-sunflower-50 dark:bg-sunflower-950/70 border-sunflower-500 text-sunflower-900 dark:text-sunflower-200 shadow-sm scale-[1.02]'
                      : 'bg-warm-50 dark:bg-darkbg-surface border-warm-200 dark:border-darkbg-border text-warm-700 dark:text-warm-300 hover:bg-warm-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent selection */}
        <div>
          <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-2">
            Accent Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {accents.map((acc) => {
              const isSelected = accent === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => {
                    setAccent(acc.id);
                    updateSettings({ accent: acc.id });
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'ring-2 ring-sunflower-500 border-sunflower-500 bg-warm-100 dark:bg-darkbg-surface scale-105 shadow-sm'
                      : 'border-warm-200 dark:border-darkbg-border bg-warm-50 dark:bg-darkbg-surface text-warm-700 dark:text-warm-300 hover:bg-warm-100'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full ${acc.bg} shadow-sm`} />
                  <span className="text-[11px] truncate">{acc.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Personal Profile */}
      <section className="bg-white/80 dark:bg-darkbg-card/80 p-6 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm flex flex-col gap-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-warm-100 dark:border-darkbg-border">
          <User className="w-5 h-5 text-sunflower-600 dark:text-sunflower-400" />
          <h3 className="text-sm font-extrabold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
            Personalization
          </h3>
        </div>

        <form onSubmit={handleUpdateName} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-warm-700 dark:text-warm-300 mb-1">
              Your Name (for greeting)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-sm focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-medium"
            />
          </div>
          <div className="sm:self-end">
            <Button type="submit" variant="primary" size="md" isLoading={isSavingName}>
              Save Name
            </Button>
          </div>
        </form>
      </section>

      {/* 3. Dashboard Widgets Toggle */}
      <section className="bg-white/80 dark:bg-darkbg-card/80 p-6 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm flex flex-col gap-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-warm-100 dark:border-darkbg-border">
          <Layout className="w-5 h-5 text-sunflower-600 dark:text-sunflower-400" />
          <h3 className="text-sm font-extrabold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
            Home Dashboard Widgets
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              key: 'showDailyThought',
              label: 'Daily Thought',
              desc: 'Displays an uplifting inspirational quote each day',
              icon: Sparkles,
              enabled: data?.settings?.showDailyThought !== false,
            },
            {
              key: 'showFocusTimer',
              label: 'Focus Timer',
              desc: 'Pomodoro timer with 25/5/15 minute focus intervals',
              icon: Clock,
              enabled: data?.settings?.showFocusTimer !== false,
            },
            {
              key: 'showFavouriteSong',
              label: 'Favourite Song',
              desc: 'Featured card showcasing your current favorite track',
              icon: Music,
              enabled: data?.settings?.showFavouriteSong !== false,
            },
            {
              key: 'showScratchpad',
              label: 'Temporary Scratchpad',
              desc: 'In-memory scratchpad for quick typing and draft notes',
              icon: Pen,
              enabled: data?.settings?.showScratchpad !== false,
            },
          ].map((widget) => {
            const Icon = widget.icon;
            return (
              <div
                key={widget.key}
                onClick={() => handleToggleWidget(widget.key, widget.enabled)}
                className="p-4 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200/80 dark:border-darkbg-border flex items-center justify-between gap-3 cursor-pointer hover:border-sunflower-300 transition-all select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-darkbg-card border border-warm-200 dark:border-darkbg-border text-sunflower-600 dark:text-sunflower-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-warm-900 dark:text-warm-100">
                      {widget.label}
                    </h4>
                    <p className="text-[10px] text-warm-500 dark:text-warm-400">{widget.desc}</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={widget.enabled}
                  onChange={() => {}}
                  className="w-4 h-4 text-sunflower-500 rounded focus:ring-sunflower-400"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Data Storage & Backup Verification */}
      <section className="bg-white/80 dark:bg-darkbg-card/80 p-6 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm flex flex-col gap-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-warm-100 dark:border-darkbg-border">
          <Database className="w-5 h-5 text-sunflower-600 dark:text-sunflower-400" />
          <h3 className="text-sm font-extrabold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
            File Storage & Backup (data/data.txt)
          </h3>
        </div>

        <p className="text-xs text-warm-600 dark:text-warm-400 leading-relaxed">
          All persistent notes, tasks, dates, bookmarks, and preferences are stored inside a single human-readable text file (<code className="px-1.5 py-0.5 rounded bg-warm-100 dark:bg-darkbg-surface font-mono font-bold text-sunflower-700 dark:text-sunflower-400">data/data.txt</code>). Zero third-party databases are used.
        </p>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-warm-50 dark:bg-darkbg-surface p-4 rounded-2xl border border-warm-200 dark:border-darkbg-border text-center">
            <div>
              <p className="text-[10px] font-bold text-warm-400 uppercase">Notes</p>
              <p className="text-base font-extrabold text-warm-900 dark:text-warm-100 mt-0.5">
                {stats.notesCount}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-warm-400 uppercase">Tasks</p>
              <p className="text-base font-extrabold text-warm-900 dark:text-warm-100 mt-0.5">
                {stats.tasksCount}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-warm-400 uppercase">Important Dates</p>
              <p className="text-base font-extrabold text-warm-900 dark:text-warm-100 mt-0.5">
                {stats.datesCount}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-warm-400 uppercase">File Size</p>
              <p className="text-base font-extrabold text-sunflower-600 dark:text-sunflower-400 mt-0.5 font-mono">
                {stats.rawSizeBytes} B
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleDownloadBackup}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download data.txt
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsRestoreModalOpen(true)}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Restore / Import Text File
          </Button>
        </div>
      </section>

      {/* 5. Session Logout */}
      <section className="bg-white/80 dark:bg-darkbg-card/80 p-6 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-warm-900 dark:text-warm-100">
            End Session
          </h4>
          <p className="text-xs text-warm-500 dark:text-warm-400">
            Log out of Keerthika Dashboard on this device.
          </p>
        </div>

        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => logout()}
          leftIcon={<LogOut className="w-4 h-4" />}
        >
          Log Out
        </Button>
      </section>

      {/* Restore Modal */}
      <Modal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        title={<span>Restore data.txt Backup 🌻</span>}
        maxWidth="lg"
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-warm-600 dark:text-warm-400 leading-relaxed">
            Paste the raw contents of your <code className="font-mono font-bold">data.txt</code> file below. It will safely replace the current data file and update your dashboard.
          </p>

          <textarea
            rows={10}
            value={rawRestoreContent}
            onChange={(e) => setRawRestoreContent(e.target.value)}
            placeholder="[USER]&#10;name=Keerthika&#10;&#10;[NOTES]&#10;..."
            className="w-full p-3 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sunflower-400"
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-warm-100 dark:border-darkbg-border">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsRestoreModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isRestoring}
              disabled={!rawRestoreContent.trim()}
              onClick={handleRestoreBackup}
            >
              Restore Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
