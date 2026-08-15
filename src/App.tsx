import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { PageId } from './types';
import { Layout } from './components/navigation/Layout';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { NotesPage } from './pages/NotesPage';
import { TasksPage } from './pages/TasksPage';
import { DatesPage } from './pages/DatesPage';
import { LinksPage } from './pages/LinksPage';
import { SongPage } from './pages/SongPage';
import { ScribblePage } from './pages/ScribblePage';
import { SettingsPage } from './pages/SettingsPage';
import { SunflowerIcon } from './components/ui/SunflowerIcon';

const DashboardContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-darkbg-surface flex flex-col items-center justify-center p-4">
        <div className="p-4 rounded-3xl bg-sunflower-100 dark:bg-sunflower-950/70 border border-sunflower-300 dark:border-sunflower-800 animate-bounce-gentle shadow-warm-sm">
          <SunflowerIcon size={56} animated />
        </div>
        <p className="mt-4 text-xs font-extrabold text-warm-700 dark:text-warm-300 tracking-wider uppercase">
          Loading Keerthika Dashboard 🌻
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'notes':
        return <NotesPage />;
      case 'tasks':
        return <TasksPage />;
      case 'dates':
        return <DatesPage />;
      case 'links':
        return <LinksPage />;
      case 'song':
        return <SongPage />;
      case 'scribble':
        return <ScribblePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <DataProvider>
      <Layout currentPage={currentPage} onSelectPage={setCurrentPage}>
        {renderPage()}
      </Layout>
    </DataProvider>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <DashboardContent />
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
};

export default App;
