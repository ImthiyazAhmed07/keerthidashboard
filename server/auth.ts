import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'keerthika_sunflower_dashboard_super_secret_key_2026';
const EXPECTED_USERNAME = process.env.LOGIN_USERNAME || 'Keerthika';
const EXPECTED_PASSWORD = process.env.LOGIN_PASSWORD || 'keerthi07';

export interface AuthPayload {
  username: string;
  name: string;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function authenticateUser(req: Request, res: Response, next: NextFunction): void {
  // Check cookie or Authorization header
  let token = req.cookies?.authToken;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ error: 'Unauthorized. Please log in to continue. 🌻' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Session expired or invalid. Please log in again. 🌻' });
    return;
  }

  (req as any).user = payload;
  next();
}

export function validateCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;
  // Case-insensitive username match, exact password match
  const userMatches = username.trim().toLowerCase() === EXPECTED_USERNAME.toLowerCase();
  const passMatches = password === EXPECTED_PASSWORD;
  return userMatches && passMatches;
}
