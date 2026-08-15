import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { apiRouter } from './routes.js';
import { readData } from './dataStore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const DIST_DIR = path.resolve(__dirname, '../dist');

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Keerthika Dashboard 🌻',
    time: new Date().toISOString(),
  });
});

// Mount Dashboard API Routes
app.use('/api', apiRouter);

// Prevent direct static access to /data directory
app.use('/data', (req, res) => {
  res.status(403).json({ error: 'Access forbidden. Direct file access is blocked. 🌻' });
});

// Serve frontend build if dist exists
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
  });
}

// Initialize data file on startup
readData().then(() => {
  console.log('🌻 Keerthika Dashboard: data/data.txt loaded and verified.');
}).catch((err) => {
  console.error('Failed to initialize data.txt:', err);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌻 Keerthika Dashboard Server running at http://localhost:${PORT}`);
});
