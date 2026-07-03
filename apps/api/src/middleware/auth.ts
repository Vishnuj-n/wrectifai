import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type UserTokenPayload } from '../services/jwt.service';
import { error } from '../utils/response';

// Extend Request interface to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Authentication token missing or invalid format', 'UNAUTHORIZED', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid token';
    return error(res, `Authentication failed: ${message}`, 'UNAUTHORIZED', 401);
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return error(res, 'Unauthorized', 'UNAUTHORIZED', 401);
    }

    const hasRole = user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return error(res, 'Forbidden: Insufficient permissions', 'FORBIDDEN', 403);
    }

    next();
  };
}
