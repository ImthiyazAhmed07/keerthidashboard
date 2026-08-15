import { Router, Request, Response } from 'express';
import {
  readData,
  writeData,
  generateId,
  NoteItem,
  TaskItem,
  ImportantDateItem,
  LinkItem,
  FavouriteSong,
  SettingsData,
  serializeDataFile,
  parseDataFile,
} from './dataStore.js';
import { validateCredentials, generateToken, authenticateUser } from './auth.js';

export const apiRouter = Router();

// ==========================================
// AUTH ROUTES (PUBLIC & AUTH CHECK)
// ==========================================

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!validateCredentials(username, password)) {
    res.status(401).json({
      error: "That doesn't look right. Please try again. 🌻",
    });
    return;
  }

  const payload = { username: 'Keerthika', name: 'Keerthika' };
  const token = generateToken(payload);

  // Set HTTP-Only Session Cookie (clears when browser session ends)
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.json({
    success: true,
    message: 'Welcome back, Keerthika 🌻',
    user: payload,
    token,
  });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('authToken', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully.' });
});

apiRouter.get('/auth/me', authenticateUser, (req: Request, res: Response) => {
  res.json({
    authenticated: true,
    user: (req as any).user,
  });
});

// ==========================================
// PROTECTED DASHBOARD ROUTES
// All routes below require valid session authentication
// ==========================================

apiRouter.use(authenticateUser);

// GET FULL DASHBOARD DATA
apiRouter.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const data = await readData();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: 'Unable to retrieve dashboard data.' });
  }
});

// ------------------------------------------
// NOTES ENDPOINTS
// ------------------------------------------
apiRouter.post('/notes', async (req: Request, res: Response) => {
  try {
    const { title, category, content, pinned, color } = req.body;
    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Note title is required.' });
      return;
    }

    const data = await readData();
    const now = new Date().toISOString();
    const newNote: NoteItem = {
      id: generateId(),
      title: title.trim(),
      category: (category || 'Personal').trim(),
      content: (content || '').trim(),
      createdAt: now,
      updatedAt: now,
      pinned: !!pinned,
      color: color || 'sunflower',
    };

    data.notes.unshift(newNote);
    await writeData(data);
    res.json({ success: true, note: newNote });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note.' });
  }
});

apiRouter.put('/notes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, content, pinned, color } = req.body;

    const data = await readData();
    const idx = data.notes.findIndex((n) => n.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Note not found.' });
      return;
    }

    data.notes[idx] = {
      ...data.notes[idx],
      title: title !== undefined ? title.trim() : data.notes[idx].title,
      category: category !== undefined ? category.trim() : data.notes[idx].category,
      content: content !== undefined ? content.trim() : data.notes[idx].content,
      pinned: pinned !== undefined ? !!pinned : data.notes[idx].pinned,
      color: color !== undefined ? color : data.notes[idx].color,
      updatedAt: new Date().toISOString(),
    };

    await writeData(data);
    res.json({ success: true, note: data.notes[idx] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note.' });
  }
});

apiRouter.patch('/notes/:id/pin', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await readData();
    const note = data.notes.find((n) => n.id === id);
    if (!note) {
      res.status(404).json({ error: 'Note not found.' });
      return;
    }

    note.pinned = !note.pinned;
    note.updatedAt = new Date().toISOString();
    await writeData(data);
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle pin.' });
  }
});

apiRouter.delete('/notes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await readData();
    const initialLen = data.notes.length;
    data.notes = data.notes.filter((n) => n.id !== id);

    if (data.notes.length === initialLen) {
      res.status(404).json({ error: 'Note not found.' });
      return;
    }

    await writeData(data);
    res.json({ success: true, message: 'Note deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note.' });
  }
});

// ------------------------------------------
// TASKS ENDPOINTS
// ------------------------------------------
apiRouter.post('/tasks', async (req: Request, res: Response) => {
  try {
    const { title, priority, dueDate, category } = req.body;
    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Task title is required.' });
      return;
    }

    const data = await readData();
    const now = new Date().toISOString();
    const newTask: TaskItem = {
      id: generateId(),
      title: title.trim(),
      status: 'pending',
      priority: ['high', 'medium', 'low'].includes(priority) ? priority : 'medium',
      dueDate: dueDate ? dueDate.trim() : undefined,
      category: (category || 'Personal').trim(),
      createdAt: now,
    };

    data.tasks.unshift(newTask);
    await writeData(data);
    res.json({ success: true, task: newTask });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add task.' });
  }
});

apiRouter.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, priority, dueDate, category, status } = req.body;

    const data = await readData();
    const idx = data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Task not found.' });
      return;
    }

    const current = data.tasks[idx];
    const newStatus = status || current.status;
    const completedAt =
      newStatus === 'completed' && current.status !== 'completed'
        ? new Date().toISOString()
        : newStatus === 'pending'
        ? undefined
        : current.completedAt;

    data.tasks[idx] = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      priority: priority !== undefined ? priority : current.priority,
      dueDate: dueDate !== undefined ? dueDate : current.dueDate,
      category: category !== undefined ? category.trim() : current.category,
      status: newStatus,
      completedAt,
    };

    await writeData(data);
    res.json({ success: true, task: data.tasks[idx] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

apiRouter.patch('/tasks/:id/toggle', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await readData();
    const task = data.tasks.find((t) => t.id === id);
    if (!task) {
      res.status(404).json({ error: 'Task not found.' });
      return;
    }

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    task.completedAt = task.status === 'completed' ? new Date().toISOString() : undefined;

    await writeData(data);
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle task.' });
  }
});

apiRouter.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await readData();
    const initialLen = data.tasks.length;
    data.tasks = data.tasks.filter((t) => t.id !== id);

    if (data.tasks.length === initialLen) {
      res.status(404).json({ error: 'Task not found.' });
      return;
    }

    await writeData(data);
    res.json({ success: true, message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

// ------------------------------------------
// IMPORTANT DATES ENDPOINTS
// ------------------------------------------
apiRouter.post('/dates', async (req: Request, res: Response) => {
  try {
    const { title, date, category, description, reminder } = req.body;
    if (!title || !title.trim() || !date) {
      res.status(400).json({ error: 'Event title and date are required.' });
      return;
    }

    const data = await readData();
    const newDate: ImportantDateItem = {
      id: generateId(),
      title: title.trim(),
      date: date.trim(),
      category: (category || 'General').trim(),
      description: description ? description.trim() : undefined,
      reminder: !!reminder,
      createdAt: new Date().toISOString(),
    };

    data.dates.push(newDate);
    // Sort dates chronologically
    data.dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    await writeData(data);
    res.json({ success: true, date: newDate });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create important date.' });
  }
});

apiRouter.put('/dates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, date, category, description, reminder } = req.body;

    const data = await readData();
    const idx = data.dates.findIndex((d) => d.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Date entry not found.' });
      return;
    }

    data.dates[idx] = {
      ...data.dates[idx],
      title: title !== undefined ? title.trim() : data.dates[idx].title,
      date: date !== undefined ? date.trim() : data.dates[idx].date,
      category: category !== undefined ? category.trim() : data.dates[idx].category,
      description: description !== undefined ? description.trim() : data.dates[idx].description,
      reminder: reminder !== undefined ? !!reminder : data.dates[idx].reminder,
    };

    data.dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    await writeData(data);
    res.json({ success: true, date: data.dates[idx] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update date.' });
  }
});

apiRouter.delete('/dates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await readData();
    data.dates = data.dates.filter((d) => d.id !== id);
    await writeData(data);
    res.json({ success: true, message: 'Date entry deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete date.' });
  }
});

// ------------------------------------------
// LINKS ENDPOINTS
// ------------------------------------------
apiRouter.post('/links', async (req: Request, res: Response) => {
  try {
    const { title, url, category, icon } = req.body;
    if (!title || !title.trim() || !url || !url.trim()) {
      res.status(400).json({ error: 'Link title and URL are required.' });
      return;
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const data = await readData();
    const newLink: LinkItem = {
      id: generateId(),
      title: title.trim(),
      url: formattedUrl,
      category: (category || 'General').trim(),
      icon: icon || '🔗',
      createdAt: new Date().toISOString(),
    };

    data.links.push(newLink);
    await writeData(data);
    res.json({ success: true, link: newLink });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add link.' });
  }
});

apiRouter.put('/links/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, url, category, icon } = req.body;

    const data = await readData();
    const idx = data.links.findIndex((l) => l.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Link not found.' });
      return;
    }

    let formattedUrl = url !== undefined ? url.trim() : data.links[idx].url;
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    data.links[idx] = {
      ...data.links[idx],
      title: title !== undefined ? title.trim() : data.links[idx].title,
      url: formattedUrl,
      category: category !== undefined ? category.trim() : data.links[idx].category,
      icon: icon !== undefined ? icon : data.links[idx].icon,
    };

    await writeData(data);
    res.json({ success: true, link: data.links[idx] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update link.' });
  }
});

apiRouter.delete('/links/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await readData();
    data.links = data.links.filter((l) => l.id !== id);
    await writeData(data);
    res.json({ success: true, message: 'Link deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete link.' });
  }
});

// ------------------------------------------
// FAVOURITE SONG ENDPOINTS
// ------------------------------------------
apiRouter.put('/song', async (req: Request, res: Response) => {
  try {
    const { song, artist, image, url, note } = req.body;
    if (!song || !song.trim() || !artist || !artist.trim()) {
      res.status(400).json({ error: 'Song title and artist name are required.' });
      return;
    }

    const data = await readData();
    data.favouriteSong = {
      song: song.trim(),
      artist: artist.trim(),
      image: image ? image.trim() : undefined,
      url: url ? url.trim() : undefined,
      note: note ? note.trim() : undefined,
      updatedAt: new Date().toISOString(),
    };

    await writeData(data);
    res.json({ success: true, favouriteSong: data.favouriteSong });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update favourite song.' });
  }
});

// ------------------------------------------
// SETTINGS & USER PROFILE ENDPOINTS
// ------------------------------------------
apiRouter.put('/settings', async (req: Request, res: Response) => {
  try {
    const { theme, accent, showDailyThought, showFocusTimer, showFavouriteSong, showScratchpad, greetingStyle } = req.body;

    const data = await readData();
    data.settings = {
      ...data.settings,
      theme: theme || data.settings.theme,
      accent: accent || data.settings.accent,
      showDailyThought: showDailyThought !== undefined ? !!showDailyThought : data.settings.showDailyThought,
      showFocusTimer: showFocusTimer !== undefined ? !!showFocusTimer : data.settings.showFocusTimer,
      showFavouriteSong: showFavouriteSong !== undefined ? !!showFavouriteSong : data.settings.showFavouriteSong,
      showScratchpad: showScratchpad !== undefined ? !!showScratchpad : data.settings.showScratchpad,
      greetingStyle: greetingStyle || data.settings.greetingStyle,
    };

    await writeData(data);
    res.json({ success: true, settings: data.settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

apiRouter.put('/user/profile', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      res.status(400).json({ error: 'Name cannot be empty.' });
      return;
    }

    const data = await readData();
    data.user.name = name.trim();
    await writeData(data);
    res.json({ success: true, user: data.user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user profile.' });
  }
});

// ------------------------------------------
// BACKUP & DATA STATS
// ------------------------------------------
apiRouter.get('/backup/raw', async (req: Request, res: Response) => {
  try {
    const data = await readData();
    const rawContent = serializeDataFile(data);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="keerthika_dashboard_data.txt"');
    res.send(rawContent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export data.' });
  }
});

apiRouter.post('/backup/sync-json', async (req: Request, res: Response) => {
  try {
    const { fullData } = req.body;
    if (!fullData || typeof fullData !== 'object') {
      res.status(400).json({ error: 'Valid dashboard data required.' });
      return;
    }
    await writeData(fullData);
    res.json({ success: true, message: 'Data synchronized successfully.', data: fullData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync data.' });
  }
});

apiRouter.post('/backup/restore', async (req: Request, res: Response) => {
  try {
    const { rawContent } = req.body;
    if (!rawContent || typeof rawContent !== 'string') {
      res.status(400).json({ error: 'Raw text content is required for restore.' });
      return;
    }

    const parsed = parseDataFile(rawContent);
    await writeData(parsed);
    res.json({ success: true, message: 'Data restored successfully from text file.', data: parsed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to restore data. Check formatting.' });
  }
});

apiRouter.get('/backup/stats', async (req: Request, res: Response) => {
  try {
    const data = await readData();
    const serialized = serializeDataFile(data);
    res.json({
      success: true,
      stats: {
        notesCount: data.notes.length,
        tasksCount: data.tasks.length,
        completedTasksCount: data.tasks.filter((t) => t.status === 'completed').length,
        datesCount: data.dates.length,
        linksCount: data.links.length,
        rawSizeBytes: Buffer.byteLength(serialized, 'utf8'),
        storageType: 'Plain text file (data/data.txt)',
        databaseUsed: 'None (Zero databases)',
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute stats.' });
  }
});
