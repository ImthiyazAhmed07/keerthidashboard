import React, { useState } from 'react';
import { PageId } from '../types';
import { useData } from '../context/DataContext';
import { GreetingBanner } from '../components/widgets/GreetingBanner';
import { TasksWidget } from '../components/widgets/TasksWidget';
import { QuickNotesWidget } from '../components/widgets/QuickNotesWidget';
import { FocusTimerWidget } from '../components/widgets/FocusTimerWidget';
import { DailyThoughtWidget } from '../components/widgets/DailyThoughtWidget';
import { FavouriteSongWidget } from '../components/widgets/FavouriteSongWidget';
import { QuickLinksWidget } from '../components/widgets/QuickLinksWidget';
import { UpcomingDatesWidget } from '../components/widgets/UpcomingDatesWidget';

import { NoteModal } from '../components/modals/NoteModal';
import { TaskModal } from '../components/modals/TaskModal';
import { DateModal } from '../components/modals/DateModal';
import { LinkModal } from '../components/modals/LinkModal';
import { SongModal } from '../components/modals/SongModal';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { data, addNote, addTask, addDate, addLink, updateSong } = useData();

  // Modals state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);

  const settings = data?.settings;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Dynamic Greeting Banner with Live Stats */}
      <GreetingBanner data={data} />

      {/* 2. Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1: Tasks & Upcoming Dates */}
        <div className="flex flex-col gap-6">
          <TasksWidget
            onNavigate={onNavigate}
            onOpenAddModal={() => setIsTaskModalOpen(true)}
          />
          <UpcomingDatesWidget
            onNavigate={onNavigate}
            onOpenAddModal={() => setIsDateModalOpen(true)}
          />
        </div>

        {/* Column 2: Quick Notes & Quick Links */}
        <div className="flex flex-col gap-6">
          <QuickNotesWidget
            onNavigate={onNavigate}
            onOpenAddModal={() => setIsNoteModalOpen(true)}
          />
          <QuickLinksWidget
            onNavigate={onNavigate}
            onOpenAddModal={() => setIsLinkModalOpen(true)}
          />
        </div>

        {/* Column 3: Daily Thought, Focus Timer, Favourite Song */}
        <div className="flex flex-col gap-6">
          {settings?.showDailyThought !== false && <DailyThoughtWidget />}
          {settings?.showFocusTimer !== false && <FocusTimerWidget onNavigate={onNavigate} />}
          {settings?.showFavouriteSong !== false && (
            <FavouriteSongWidget onOpenEditModal={() => setIsSongModalOpen(true)} />
          )}
        </div>
      </div>

      {/* Modals */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={addNote}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={addTask}
      />
      <DateModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onSave={addDate}
      />
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSave={addLink}
      />
      <SongModal
        isOpen={isSongModalOpen}
        onClose={() => setIsSongModalOpen(false)}
        onSave={updateSong}
        initialData={data?.favouriteSong}
      />
    </div>
  );
};
