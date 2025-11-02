import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    roles: string[];
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'No token provided' } });
      return;
    }

    const payload = authService.verifyAccessToken(token);
    const user = await User.findById(payload.userId);
    
    if (!user) {
      res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
  }
};

export const authorize = (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
    return;
  }

  // Case-insensitive role comparison
  const userRoles = req.user.roles.map((r) => r.toLowerCase());
  const allowedRoles = roles.map((r) => r.toLowerCase());
  const hasRole = userRoles.some((role) => allowedRoles.includes(role));
  
  if (!hasRole) {
    res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
    return;
  }

  next();
};
