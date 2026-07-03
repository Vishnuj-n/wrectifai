import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env';

export interface UserTokenPayload {
  userId: string;
  email?: string;
  roles: string[];
}

export interface RefreshTokenPayload {
  userId: string;
}

export function generateAccessToken(payload: UserTokenPayload): string {
  const { jwtSecret } = getEnv();
  return jwt.sign(payload, jwtSecret, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  const { jwtRefreshSecret } = getEnv();
  return jwt.sign(payload, jwtRefreshSecret, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): UserTokenPayload {
  const { jwtSecret } = getEnv();
  return jwt.verify(token, jwtSecret) as UserTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const { jwtRefreshSecret } = getEnv();
  return jwt.verify(token, jwtRefreshSecret) as RefreshTokenPayload;
}
