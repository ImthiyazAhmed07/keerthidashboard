# Keerthika Dashboard 🌻

A full-stack, personal digital workspace and dashboard created specifically for **Keerthika**.

Designed with a warm, cheerful **sunflower theme 🌻**, focusing on daily utility, peace of mind, and productivity.

---

## ✨ Features

1. **🔐 Secure Login**:
   - Sunflower-themed login screen with password visibility toggle.
   - Server-side validated credentials (`Keerthika` / `keerthi07`).
   - Protected API routes and HTTP-Only session security.

2. **🏠 Home Dashboard**:
   - Dynamic greeting adapting to the time of day (*"Good morning/afternoon/evening/night, Keerthika 🌻"*).
   - Live date, day of week, and real-time clock.
   - Quick overview counters for tasks, notes, and upcoming milestones.
   - Daily Thought widget with refreshable inspirations.
   - Focus Pomodoro timer (25/5/15 min) with gentle synthesized audio bells.
   - Featured favourite song card.
   - Temporary in-memory scratchpad for fleeting thoughts.
   - Quick links & upcoming deadlines snapshots.

3. **📝 Notes Manager**:
   - Add, edit, delete, and pin notes to the top.
   - Categorization (Personal, Study, Work, Ideas, Reminder).
   - Color accent badges (Sunflower, Honey, Sage, Sky).
   - Search across note titles and content.
   - Creation and update timestamps.

4. **✅ Task Manager**:
   - Add, edit, delete, mark completed, and undo tasks.
   - Progress bar with animated completion count.
   - Priority indicators (🔴 High, 🟡 Medium, 🟢 Low) and due dates.
   - Category filtering (Personal, Study, Work, Other) and status tabs (All, Active, Completed).
   - Gentle audio chime synthesizer + sunflower confetti celebration upon completion.

5. **📅 Important Dates & Deadlines**:
   - Timeline of upcoming events, exams, assignment submissions, and milestones.
   - Automatic countdown calculations (*"Today 🎉"*, *"Tomorrow"*, *"In 5 days"*, *"In 18 days"*).
   - Notification & reminder flags.

6. **🔗 Frequently Used Links**:
   - Customizable bookmark cards with title, URL, category, and custom emoji icon.
   - Fast one-click launch, URL clipboard copy, search, and edit/delete.

7. **🎵 My Current Favourite Song**:
   - Dedicated music showcase card featuring current song, artist, album art, streaming link, and personal reflection notes.
   - Rotating vinyl animation and direct streaming links (Spotify, YouTube, etc.).

8. **✍️ Scribble Board (Temporary Canvas)**:
   - Digital whiteboard optimized for S Pen, Apple Pencil, capacitive styluses, touch fingers, and mouse.
   - Smooth freehand strokes using HTML5 Canvas and Pointer Events.
   - Tools: Smooth Pen, Highlighter, Eraser.
   - 8 curated color palette + custom color picker.
   - 4 brush sizes (Fine, Medium, Bold, Extra Bold).
   - Backgrounds: Blank, Dot Grid, Ruled Lines.
   - Full-screen mode, Undo / Redo in-session, and Clear with confirmation.
   - **Strictly No Save / No Export**: In-memory only (*"Just scribble. Nothing needs to be saved. 🌻"*).

9. **⚙️ Preferences & Settings**:
   - Color Modes: Light Mode, Dark Mode, System Auto.
   - Accent Themes: Sunflower Gold 🌻, Warm Honey 🍯, Terracotta Rose 🌅, Sage Meadow 🌿, Sky Blue ☁️.
   - Toggle Dashboard Widgets (Daily Thought, Focus Timer, Favourite Song, Scratchpad).
   - Personalize greeting name.
   - View text file storage statistics.
   - Download raw `data.txt` backup and restore from backup.
   - Session logout.

10. **💾 Storage — NO DATABASE**:
    - All persistent website data is stored in a single human-readable text file at `data/data.txt`.
    - Protected against direct static access with concurrency-safe atomic writes.

---

## 🚀 How to Run

### Development Mode (with Live Hot-Reloading)
```bash
npm run dev
```
- Backend runs on `http://localhost:3001`
- Vite dev server runs on `http://localhost:5173`

### Production Mode
```bash
# Build frontend bundle
npm run build

# Start server
npm run server
```
- Open `http://localhost:3001` in your browser.

---

## 🔐 Credentials
- **Username:** `Keerthika`
- **Password:** `keerthi07`
