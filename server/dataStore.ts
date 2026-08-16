import fs from 'fs';
import path from 'path';

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

const DATA_FILE = process.env.DATA_FILE_PATH
  ? path.resolve(process.cwd(), process.env.DATA_FILE_PATH)
  : path.resolve(process.cwd(), 'data/data.txt');
const DATA_DIR = path.dirname(DATA_FILE);

// Simple async queue mutex to serialize writes and prevent file corruption
let writeQueue = Promise.resolve();

function enqueueWrite<T>(task: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(task, task);
  writeQueue = result.then(() => {}, () => {});
  return result;
}

// Helpers to escape and unescape string fields in pipe-separated lines
function escapeField(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, '\\n');
}

function unescapeField(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/\\n/g, '\n')
    .replace(/\\\|/g, '|')
    .replace(/\\\\/g, '\\');
}

function getDefaultData(): FullDashboardData {
  const now = new Date().toISOString();
  return {
    user: {
      name: 'Keerthika',
    },
    notes: [],
    tasks: [],
    dates: [],
    links: [],
    favouriteSong: {
      song: '',
      artist: '',
      image: '',
      url: '',
      note: '',
      updatedAt: now,
    },
    settings: {
      theme: 'light',
      accent: 'sunflower',
      showDailyThought: true,
      showFocusTimer: true,
      showFavouriteSong: true,
      showScratchpad: false,
      greetingStyle: 'warm',
    },
  };
}

export function parseDataFile(content: string): FullDashboardData {
  const data = getDefaultData();
  data.notes = [];
  data.tasks = [];
  data.dates = [];
  data.links = [];

  const lines = content.split(/\r?\n/);
  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    if (line.startsWith('[') && line.endsWith(']')) {
      currentSection = line.slice(1, -1).toUpperCase();
      continue;
    }

    if (currentSection === 'USER') {
      const eqIdx = line.indexOf('=');
      if (eqIdx !== -1) {
        const key = line.slice(0, eqIdx).trim();
        const val = unescapeField(line.slice(eqIdx + 1).trim());
        if (key === 'name') data.user.name = val;
      }
    } else if (currentSection === 'FAVOURITE_SONG') {
      const eqIdx = line.indexOf('=');
      if (eqIdx !== -1) {
        const key = line.slice(0, eqIdx).trim();
        const val = unescapeField(line.slice(eqIdx + 1).trim());
        if (key === 'song') data.favouriteSong.song = val;
        else if (key === 'artist') data.favouriteSong.artist = val;
        else if (key === 'image') data.favouriteSong.image = val;
        else if (key === 'url') data.favouriteSong.url = val;
        else if (key === 'note') data.favouriteSong.note = val;
        else if (key === 'updatedAt') data.favouriteSong.updatedAt = val;
      }
    } else if (currentSection === 'SETTINGS') {
      const eqIdx = line.indexOf('=');
      if (eqIdx !== -1) {
        const key = line.slice(0, eqIdx).trim();
        const val = line.slice(eqIdx + 1).trim();
        if (key === 'theme') data.settings.theme = val as any;
        else if (key === 'accent') data.settings.accent = val as any;
        else if (key === 'showDailyThought') data.settings.showDailyThought = val !== 'false';
        else if (key === 'showFocusTimer') data.settings.showFocusTimer = val !== 'false';
        else if (key === 'showFavouriteSong') data.settings.showFavouriteSong = val !== 'false';
        else if (key === 'showScratchpad') data.settings.showScratchpad = val !== 'false';
        else if (key === 'greetingStyle') data.settings.greetingStyle = val;
      }
    } else if (currentSection === 'NOTES') {
      // id|title|category|createdAt|updatedAt|pinned|color|content
      // Custom split taking escapes into account
      const parts = splitEscaped(rawLine);
      if (parts.length >= 2) {
        const id = parts[0];
        const title = unescapeField(parts[1]);
        const category = unescapeField(parts[2] || 'Personal');
        const createdAt = unescapeField(parts[3] || new Date().toISOString());
        const updatedAt = unescapeField(parts[4] || createdAt);
        const pinned = parts[5] === 'true';
        const color = unescapeField(parts[6] || 'sunflower');
        const content = unescapeField(parts[7] || '');
        data.notes.push({
          id,
          title,
          category,
          createdAt,
          updatedAt,
          pinned,
          color,
          content,
        });
      }
    } else if (currentSection === 'TASKS') {
      // id|title|status|priority|dueDate|category|completedAt|createdAt
      const parts = splitEscaped(rawLine);
      if (parts.length >= 2) {
        const id = parts[0];
        const title = unescapeField(parts[1]);
        const status = (parts[2] === 'completed' ? 'completed' : 'pending') as 'completed' | 'pending';
        const priority = (['high', 'medium', 'low'].includes(parts[3]) ? parts[3] : 'medium') as any;
        const dueDate = unescapeField(parts[4] || '');
        const category = unescapeField(parts[5] || 'Personal');
        const completedAt = unescapeField(parts[6] || '');
        const createdAt = unescapeField(parts[7] || new Date().toISOString());
        data.tasks.push({
          id,
          title,
          status,
          priority,
          dueDate: dueDate || undefined,
          category,
          completedAt: completedAt || undefined,
          createdAt,
        });
      }
    } else if (currentSection === 'DATES') {
      // id|title|date|category|description|reminder|createdAt
      const parts = splitEscaped(rawLine);
      if (parts.length >= 3) {
        const id = parts[0];
        const title = unescapeField(parts[1]);
        const date = unescapeField(parts[2]);
        const category = unescapeField(parts[3] || 'General');
        const description = unescapeField(parts[4] || '');
        const reminder = parts[5] === 'true';
        const createdAt = unescapeField(parts[6] || new Date().toISOString());
        data.dates.push({
          id,
          title,
          date,
          category,
          description: description || undefined,
          reminder,
          createdAt,
        });
      }
    } else if (currentSection === 'LINKS') {
      // id|title|url|category|icon|createdAt
      const parts = splitEscaped(rawLine);
      if (parts.length >= 3) {
        const id = parts[0];
        const title = unescapeField(parts[1]);
        const url = unescapeField(parts[2]);
        const category = unescapeField(parts[3] || 'General');
        const icon = unescapeField(parts[4] || '🔗');
        const createdAt = unescapeField(parts[5] || new Date().toISOString());
        data.links.push({
          id,
          title,
          url,
          category,
          icon,
          createdAt,
        });
      }
    } else if (currentSection === 'BOUQUET') {
      if (!data.bouquet) {
        data.bouquet = {
          wrapperStyleId: 'kraft',
          greetingTag: 'For Keerthika 🌻',
          stems: [],
          updatedAt: new Date().toISOString(),
        };
      }

      if (line.includes('=')) {
        const eqIdx = line.indexOf('=');
        const key = line.slice(0, eqIdx).trim();
        const val = unescapeField(line.slice(eqIdx + 1).trim());
        if (key === 'wrapper' || key === 'wrapperStyleId') data.bouquet.wrapperStyleId = val;
        else if (key === 'tag' || key === 'greetingTag') data.bouquet.greetingTag = val;
        else if (key === 'updatedAt') data.bouquet.updatedAt = val;
      } else {
        // stem: id|typeId|color|x|y|rotation|scale|inFront
        const parts = splitEscaped(rawLine);
        if (parts.length >= 7) {
          data.bouquet.stems.push({
            id: parts[0],
            typeId: unescapeField(parts[1]),
            color: unescapeField(parts[2]),
            x: parseFloat(parts[3]) || 50,
            y: parseFloat(parts[4]) || 40,
            rotation: parseFloat(parts[5]) || 0,
            scale: parseFloat(parts[6]) || 1.0,
            inFront: parts[7] === 'true',
          });
        }
      }
    }
  }

  return data;
}

function splitEscaped(line: string): string[] {
  const parts: string[] = [];
  let current = '';
  let escaped = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (escaped) {
      current += char;
      escaped = false;
    } else if (char === '\\') {
      current += char;
      escaped = true;
    } else if (char === '|') {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts;
}

export function serializeDataFile(data: FullDashboardData): string {
  const lines: string[] = [];

  lines.push('# ==========================================');
  lines.push('# 🌻 KEERTHIKA DASHBOARD - DATA STORAGE 🌻');
  lines.push('# Human-readable plain text file storage');
  lines.push('# Last updated: ' + new Date().toISOString());
  lines.push('# ==========================================');
  lines.push('');

  // USER
  lines.push('[USER]');
  lines.push(`name=${escapeField(data.user.name || 'Keerthika')}`);
  lines.push('');

  // FAVOURITE SONG
  lines.push('[FAVOURITE_SONG]');
  lines.push(`song=${escapeField(data.favouriteSong.song || '')}`);
  lines.push(`artist=${escapeField(data.favouriteSong.artist || '')}`);
  lines.push(`image=${escapeField(data.favouriteSong.image || '')}`);
  lines.push(`url=${escapeField(data.favouriteSong.url || '')}`);
  lines.push(`note=${escapeField(data.favouriteSong.note || '')}`);
  lines.push(`updatedAt=${escapeField(data.favouriteSong.updatedAt || new Date().toISOString())}`);
  lines.push('');

  // SETTINGS
  lines.push('[SETTINGS]');
  lines.push(`theme=${data.settings.theme || 'light'}`);
  lines.push(`accent=${data.settings.accent || 'sunflower'}`);
  lines.push(`showDailyThought=${data.settings.showDailyThought !== false}`);
  lines.push(`showFocusTimer=${data.settings.showFocusTimer !== false}`);
  lines.push(`showFavouriteSong=${data.settings.showFavouriteSong !== false}`);
  lines.push(`showScratchpad=${data.settings.showScratchpad !== false}`);
  lines.push(`greetingStyle=${data.settings.greetingStyle || 'warm'}`);
  lines.push('');

  // NOTES
  lines.push('[NOTES]');
  for (const n of data.notes) {
    // id|title|category|createdAt|updatedAt|pinned|color|content
    const row = [
      n.id,
      escapeField(n.title),
      escapeField(n.category || 'Personal'),
      escapeField(n.createdAt),
      escapeField(n.updatedAt),
      n.pinned ? 'true' : 'false',
      escapeField(n.color || 'sunflower'),
      escapeField(n.content),
    ].join('|');
    lines.push(row);
  }
  lines.push('');

  // TASKS
  lines.push('[TASKS]');
  for (const t of data.tasks) {
    // id|title|status|priority|dueDate|category|completedAt|createdAt
    const row = [
      t.id,
      escapeField(t.title),
      t.status || 'pending',
      t.priority || 'medium',
      escapeField(t.dueDate || ''),
      escapeField(t.category || 'Personal'),
      escapeField(t.completedAt || ''),
      escapeField(t.createdAt || new Date().toISOString()),
    ].join('|');
    lines.push(row);
  }
  lines.push('');

  // DATES
  lines.push('[DATES]');
  for (const d of data.dates) {
    // id|title|date|category|description|reminder|createdAt
    const row = [
      d.id,
      escapeField(d.title),
      escapeField(d.date),
      escapeField(d.category || 'General'),
      escapeField(d.description || ''),
      d.reminder ? 'true' : 'false',
      escapeField(d.createdAt || new Date().toISOString()),
    ].join('|');
    lines.push(row);
  }
  lines.push('');

  // LINKS
  lines.push('[LINKS]');
  for (const l of data.links) {
    // id|title|url|category|icon|createdAt
    const row = [
      l.id,
      escapeField(l.title),
      escapeField(l.url),
      escapeField(l.category || 'General'),
      escapeField(l.icon || '🔗'),
      escapeField(l.createdAt || new Date().toISOString()),
    ].join('|');
    lines.push(row);
  }
  lines.push('');

  // BOUQUET
  if (data.bouquet) {
    lines.push('[BOUQUET]');
    lines.push(`wrapperStyleId=${escapeField(data.bouquet.wrapperStyleId || 'kraft')}`);
    lines.push(`greetingTag=${escapeField(data.bouquet.greetingTag || 'For Keerthika 🌻')}`);
    lines.push(`updatedAt=${escapeField(data.bouquet.updatedAt || new Date().toISOString())}`);
    for (const s of data.bouquet.stems || []) {
      // id|typeId|color|x|y|rotation|scale|inFront
      const row = [
        s.id,
        escapeField(s.typeId),
        escapeField(s.color),
        s.x,
        s.y,
        s.rotation,
        s.scale,
        s.inFront ? 'true' : 'false',
      ].join('|');
      lines.push(row);
    }
    lines.push('');
  }

  return lines.join('\n');
}

export async function readData(): Promise<FullDashboardData> {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialData = getDefaultData();
    await writeData(initialData);
    return initialData;
  }

  try {
    const raw = await fs.promises.readFile(DATA_FILE, 'utf-8');
    if (!raw.trim()) {
      const initialData = getDefaultData();
      await writeData(initialData);
      return initialData;
    }
    return parseDataFile(raw);
  } catch (err) {
    console.error('Error reading data.txt, fallback to default:', err);
    return getDefaultData();
  }
}

export async function writeData(data: FullDashboardData): Promise<void> {
  return enqueueWrite(async () => {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const content = serializeDataFile(data);
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;

    try {
      await fs.promises.writeFile(tempFile, content, 'utf-8');
      // Atomic rename
      await fs.promises.rename(tempFile, DATA_FILE);
    } catch (err) {
      // Fallback direct write on Windows if rename fails
      try {
        await fs.promises.writeFile(DATA_FILE, content, 'utf-8');
      } finally {
        if (fs.existsSync(tempFile)) {
          try {
            await fs.promises.unlink(tempFile);
          } catch {}
        }
      }
    }
  });
}

// Generate unique ID helper
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
