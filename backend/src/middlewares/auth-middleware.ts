import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AuthenticatedRequest = Request & {
  userId?: string;
};

export function authMiddleware(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Token de autenticacao ausente.' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
    request.userId = payload.sub;
    return next();
  } catch {
    return response.status(401).json({ message: 'Token invalido ou expirado.' });
  }
}
