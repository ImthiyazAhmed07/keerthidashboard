import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-warm-lg backdrop-blur-md border animate-slide-up transition-all ${
              toast.type === 'success'
                ? 'bg-amber-50/95 dark:bg-zinc-900/95 border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                : toast.type === 'error'
                ? 'bg-rose-50/95 dark:bg-zinc-900/95 border-rose-300 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                : 'bg-warm-50/95 dark:bg-zinc-900/95 border-warm-300 dark:border-warm-700 text-warm-900 dark:text-warm-100'
            }`}
          >
            <div className="shrink-0">
              {toast.type === 'success' && <span className="text-xl">🌻</span>}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sunflower-600 dark:text-sunflower-400" />}
            </div>
            <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 text-warm-400 hover:text-warm-700 dark:hover:text-warm-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
