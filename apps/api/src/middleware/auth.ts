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

import { query } from '../config/database';

export function requireRole(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return error(res, 'Unauthorized', 'UNAUTHORIZED', 401);
    }

    try {
      const rolesResult = await query(
        'SELECT r.code FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1',
        [user.userId]
      );
      const dbRoles = rolesResult.rows.map((row) => row.code);
      const hasRole = dbRoles.some((role) => allowedRoles.includes(role));
      if (!hasRole) {
        return error(res, 'Forbidden: Insufficient permissions', 'FORBIDDEN', 403);
      }

      next();
    } catch (err) {
      return error(res, 'Internal server error during authorization', 'INTERNAL_SERVER_ERROR', 500);
    }
  };
}
