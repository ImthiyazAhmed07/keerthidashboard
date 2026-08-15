import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  FullDashboardData,
  NoteItem,
  TaskItem,
  ImportantDateItem,
  LinkItem,
  FavouriteSong,
  SettingsData,
} from '../types';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { sound } from '../utils/audio';

const STORAGE_CACHE_KEY = 'keerthika_dashboard_persistent_data_v2';

interface DataContextType {
  data: FullDashboardData | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  // Notes
  addNote: (note: { title: string; category?: string; content?: string; pinned?: boolean; color?: string }) => Promise<void>;
  updateNote: (id: string, updates: Partial<NoteItem>) => Promise<void>;
  togglePinNote: (id: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  // Tasks
  addTask: (task: { title: string; priority?: string; dueDate?: string; category?: string }) => Promise<void>;
  updateTask: (id: string, updates: Partial<TaskItem>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  // Dates
  addDate: (dateItem: { title: string; date: string; category?: string; description?: string; reminder?: boolean }) => Promise<void>;
  updateDate: (id: string, updates: Partial<ImportantDateItem>) => Promise<void>;
  deleteDate: (id: string) => Promise<void>;
  // Links
  addLink: (link: { title: string; url: string; category?: string; icon?: string }) => Promise<void>;
  updateLink: (id: string, updates: Partial<LinkItem>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  // Song
  updateSong: (song: { song: string; artist: string; image?: string; url?: string; note?: string }) => Promise<void>;
  // Settings & Profile
  updateSettings: (settings: Partial<SettingsData>) => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FullDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const persistToLocalCache = useCallback((updated: FullDashboardData) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(updated));
      } catch {}
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    if (!isAuthenticated) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getDashboard();
      if (res.success && res.data) {
        const serverData: FullDashboardData = res.data;
        const isServerCleanEmpty =
          serverData.notes.length === 0 &&
          serverData.tasks.length === 0 &&
          serverData.dates.length === 0 &&
          serverData.links.length === 0 &&
          !serverData.favouriteSong?.song;

        // Check if browser has previously saved notes/tasks before a fresh redeploy
        if (typeof window !== 'undefined' && isServerCleanEmpty) {
          const cached = localStorage.getItem(STORAGE_CACHE_KEY);
          if (cached) {
            try {
              const parsedCache: FullDashboardData = JSON.parse(cached);
              const hasCachedContent =
                parsedCache.notes.length > 0 ||
                parsedCache.tasks.length > 0 ||
                parsedCache.dates.length > 0 ||
                parsedCache.links.length > 0 ||
                !!parsedCache.favouriteSong?.song;

              if (hasCachedContent) {
                // Auto-restore previous user data to server seamlessly!
                await api.syncJson(parsedCache);
                setData(parsedCache);
                setIsLoading(false);
                return;
              }
            } catch {}
          }
        }

        setData(serverData);
        persistToLocalCache(serverData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, persistToLocalCache]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboard();
    }
  }, [isAuthenticated, fetchDashboard]);

  // Notes operations
  const addNote = async (payload: { title: string; category?: string; content?: string; pinned?: boolean; color?: string }) => {
    try {
      const res = await api.createNote(payload);
      if (res.success && res.note) {
        setData((prev) => {
          if (!prev) return null;
          const next = { ...prev, notes: [res.note, ...prev.notes] };
          persistToLocalCache(next);
          return next;
        });
        showToast('Note created! 📝', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to create note', 'error');
      throw err;
    }
  };

  const updateNote = async (id: string, updates: Partial<NoteItem>) => {
    try {
      const res = await api.updateNote(id, updates);
      if (res.success && res.note) {
        setData((prev) => {
          if (!prev) return null;
          const next = {
            ...prev,
            notes: prev.notes.map((n) => (n.id === id ? res.note : n)),
          };
          persistToLocalCache(next);
          return next;
        });
        showToast('Note updated! 🌻', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update note', 'error');
      throw err;
    }
  };

  const togglePinNote = async (id: string) => {
    try {
      const res = await api.togglePinNote(id);
      if (res.success && res.note) {
        setData((prev) => {
          if (!prev) return null;
          const next = {
            ...prev,
            notes: prev.notes.map((n) => (n.id === id ? res.note : n)),
          };
          persistToLocalCache(next);
          return next;
        });
        showToast(res.note.pinned ? 'Note pinned 📌' : 'Note unpinned', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle pin', 'error');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await api.deleteNote(id);
      setData((prev) => {
        if (!prev) return null;
        const next = {
          ...prev,
          notes: prev.notes.filter((n) => n.id !== id),
        };
        persistToLocalCache(next);
        return next;
      });
      showToast('Note deleted 🗑️', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete note', 'error');
      throw err;
    }
  };

  // Tasks operations
  const addTask = async (payload: { title: string; priority?: string; dueDate?: string; category?: string }) => {
    try {
      const res = await api.createTask(payload);
      if (res.success && res.task) {
        setData((prev) => {
          if (!prev) return null;
          const next = { ...prev, tasks: [res.task, ...prev.tasks] };
          persistToLocalCache(next);
          return next;
        });
        showToast('Task added! ✅', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add task', 'error');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<TaskItem>) => {
    try {
      const res = await api.updateTask(id, updates);
      if (res.success && res.task) {
        setData((prev) => {
          if (!prev) return null;
          const next = {
            ...prev,
            tasks: prev.tasks.map((t) => (t.id === id ? res.task : t)),
          };
          persistToLocalCache(next);
          return next;
        });
        showToast('Task updated! 🌻', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update task', 'error');
      throw err;
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const task = data?.tasks.find((t) => t.id === id);
      const willBeCompleted = task?.status !== 'completed';

      if (willBeCompleted) {
        sound.playTaskComplete();
      }

      const res = await api.toggleTask(id);
      if (res.success && res.task) {
        setData((prev) => {
          if (!prev) return null;
          const next = {
            ...prev,
            tasks: prev.tasks.map((t) => (t.id === id ? res.task : t)),
          };
          persistToLocalCache(next);
          return next;
        });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      setData((prev) => {
        if (!prev) return null;
        const next = {
          ...prev,
          tasks: prev.tasks.filter((t) => t.id !== id),
        };
        persistToLocalCache(next);
        return next;
      });
      showToast('Task removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete task', 'error');
      throw err;
    }
  };

  // Dates operations
  const addDate = async (payload: { title: string; date: string; category?: string; description?: string; reminder?: boolean }) => {
    try {
      const res = await api.createDate(payload);
      if (res.success && res.date) {
        setData((prev) => {
          if (!prev) return null;
          const next = {
            ...prev,
            dates: [...prev.dates, res.date].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            ),
          };
          persistToLocalCache(next);
          return next;
        });
        showToast('Important date added! 📅', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add date', 'error');
      throw err;
    }
  };

  const updateDate = async (id: string, updates: Partial<ImportantDateItem>) => {
    try {
      const res = await api.updateDate(id, updates);
      if (res.success && res.date) {
        setData((prev) => {
          if (!prev) return null;
          const next = {
            ...prev,
            dates: prev.dates
              .map((d) => (d.id === id ? res.date : d))
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
          };
          persistToLocalCache(next);
          return next;
        });
        showToast('Date updated! 🌻', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update date', 'error');
      throw err;
    }
  };

  const deleteDate = async (id: string) => {
    try {
      await api.deleteDate(id);
      setData((prev) => {
        if (!prev) return null;
        const next = {
          ...prev,
          dates: prev.dates.filter((d) => d.id !== id),
        };
        persistToLocalCache(next);
        return next;
      });
      showToast('Event removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete event', 'error');
      throw err;
    }
  };

  // Links operations
  const addLink = async (payload: { title: string; url: string; category?: string; icon?: string }) => {
    try {
      const res = await api.createLink(payload);
      if (res.success && res.link) {
        setData((prev) => {
          if (!prev) return null;
          const next = { ...prev, links: [...prev.links, res.link] };
          persistToLocalCache(next);
          return next;
        });
        showToast('Link added! 🔗', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add link', 'error');
      throw err;
    }
  };

  const updateLink = async (id: string, updates: Partial<LinkItem>) => {
    try {
      const res = await api.updateLink(id, updates);
      if (res.success && res.link) {
        setData((prev) => {
          if (!prev) return null;
          const next = {
            ...prev,
            links: prev.links.map((l) => (l.id === id ? res.link : l)),
          };
          persistToLocalCache(next);
          return next;
        });
        showToast('Link updated! 🌻', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update link', 'error');
      throw err;
    }
  };

  const deleteLink = async (id: string) => {
    try {
      await api.deleteLink(id);
      setData((prev) => {
        if (!prev) return null;
        const next = {
          ...prev,
          links: prev.links.filter((l) => l.id !== id),
        };
        persistToLocalCache(next);
        return next;
      });
      showToast('Link removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete link', 'error');
      throw err;
    }
  };

  // Favourite Song
  const updateSong = async (payload: { song: string; artist: string; image?: string; url?: string; note?: string }) => {
    try {
      const res = await api.updateSong(payload);
      if (res.success && res.favouriteSong) {
        setData((prev) => {
          if (!prev) return null;
          const next = { ...prev, favouriteSong: res.favouriteSong };
          persistToLocalCache(next);
          return next;
        });
        showToast('Favourite song updated! 🎵', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update song', 'error');
      throw err;
    }
  };

  // Settings & Profile
  const updateSettings = async (settings: Partial<SettingsData>) => {
    try {
      const res = await api.updateSettings(settings);
      if (res.success && res.settings) {
        setData((prev) => {
          if (!prev) return null;
          const next = { ...prev, settings: res.settings };
          persistToLocalCache(next);
          return next;
        });
        showToast('Preferences saved! 🌻', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
      throw err;
    }
  };

  const updateProfile = async (name: string) => {
    try {
      const res = await api.updateProfile(name);
      if (res.success && res.user) {
        setData((prev) => {
          if (!prev) return null;
          const next = { ...prev, user: res.user };
          persistToLocalCache(next);
          return next;
        });
        showToast('Name updated! 🌻', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update name', 'error');
      throw err;
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        isLoading,
        error,
        refreshData: fetchDashboard,
        addNote,
        updateNote,
        togglePinNote,
        deleteNote,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        addDate,
        updateDate,
        deleteDate,
        addLink,
        updateLink,
        deleteLink,
        updateSong,
        updateSettings,
        updateProfile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
