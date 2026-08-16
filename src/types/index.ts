export type PageId =
  | 'home'
  | 'notes'
  | 'tasks'
  | 'dates'
  | 'links'
  | 'song'
  | 'scribble'
  | 'timer'
  | 'bouquet'
  | 'settings';

export interface UserProfile {
  name: string;
}

export interface NoteItem {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  color?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category: string;
  completedAt?: string;
  createdAt: string;
}

export interface ImportantDateItem {
  id: string;
  title: string;
  date: string;
  category: string;
  description?: string;
  reminder?: boolean;
  createdAt: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  category: string;
  icon?: string;
  createdAt: string;
}

export interface FavouriteSong {
  song: string;
  artist: string;
  image?: string;
  url?: string;
  note?: string;
  updatedAt?: string;
}

export interface SettingsData {
  theme: 'light' | 'dark' | 'system';
  accent: 'sunflower' | 'honey' | 'sunset' | 'sage' | 'sky';
  showDailyThought: boolean;
  showFocusTimer: boolean;
  showFavouriteSong: boolean;
  showScratchpad: boolean;
  greetingStyle: string;
}

export interface BouquetStem {
  id: string;
  typeId: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  inFront?: boolean;
}

export interface BouquetData {
  wrapperStyleId: string;
  greetingTag: string;
  stems: BouquetStem[];
  updatedAt?: string;
}

export interface FullDashboardData {
  user: UserProfile;
  notes: NoteItem[];
  tasks: TaskItem[];
  dates: ImportantDateItem[];
  links: LinkItem[];
  favouriteSong: FavouriteSong;
  settings: SettingsData;
  bouquet?: BouquetData;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}
