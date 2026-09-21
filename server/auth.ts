import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { AdminUser } from './types';

const SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'jsg_real_estate_admin_secure_secret_token_key_2026';

// Brute force tracking: IP -> { count: number; lockedUntil?: number }
const loginAttempts = new Map<string, { count: number; lockedUntil?: number }>();

export function sanitizeInput(str: any): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, chosenSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: chosenSalt };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const computedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    const bufA = Buffer.from(computedHash, 'hex');
    const bufB = Buffer.from(storedHash, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (err) {
    return false;
  }
}

export function createToken(user: AdminUser): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 hours
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): { sub: string; email: string; role: string; name: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return null;
    }

    return decoded;
  } catch (err) {
    return null;
  }
}

// Brute-force checking
export function checkBruteForce(ip: string): { allowed: boolean; remainingLockSeconds?: number } {
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingSecs = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingLockSeconds: remainingSecs };
  }

  // If lock expired, reset
  if (record.lockedUntil && record.lockedUntil <= now) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): { locked: boolean; remainingLockSeconds?: number } {
  const record = loginAttempts.get(ip) || { count: 0 };
  record.count += 1;

  if (record.count >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minute lockout
    loginAttempts.set(ip, record);
    return { locked: true, remainingLockSeconds: 900 };
  }

  loginAttempts.set(ip, record);
  return { locked: false };
}

export function recordSuccessfulLogin(ip: string) {
  loginAttempts.delete(ip);
}

export function getLoginAttemptsStatus(): Array<{ ip: string; count: number; lockedUntil?: number; remainingSeconds?: number }> {
  const list: Array<{ ip: string; count: number; lockedUntil?: number; remainingSeconds?: number }> = [];
  const now = Date.now();
  loginAttempts.forEach((record, ip) => {
    const remaining = record.lockedUntil && record.lockedUntil > now 
      ? Math.ceil((record.lockedUntil - now) / 1000) 
      : 0;
    list.push({
      ip,
      count: record.count,
      lockedUntil: record.lockedUntil,
      remainingSeconds: remaining
    });
  });
  return list;
}

export function resetIpLock(ip?: string): void {
  if (ip) {
    loginAttempts.delete(ip);
  } else {
    loginAttempts.clear();
  }
}

// Express Auth Middleware
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }

  req.user = {
    id: decoded.sub,
    email: decoded.email,
    role: decoded.role,
    name: decoded.name
  };

  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient administrative privileges' });
    }
    next();
  };
}
