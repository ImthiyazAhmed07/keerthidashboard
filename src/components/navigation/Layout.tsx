import React from 'react';
import { PageId } from '../../types';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentPage,
  onSelectPage,
  children,
}) => {
  return (
    <div className="min-h-screen flex bg-warm-50 dark:bg-darkbg-surface text-warm-900 dark:text-warm-100 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar currentPage={currentPage} onSelectPage={onSelectPage} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Navbar currentPage={currentPage} onSelectPage={onSelectPage} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentPage={currentPage} onSelectPage={onSelectPage} />
    </div>
  );
};
