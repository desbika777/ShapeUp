// Middleware que protege rotas privadas usando token JWT.
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AuthenticatedRequest = Request & {
  userId?: string;
};

export function authMiddleware(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const authorization = request.headers.authorization;

  // Sem cabecalho Authorization, a requisicao nao pode acessar dados privados.
  if (!authorization?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Token de autenticacao ausente.' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    // O subject do token guarda o id do usuario autenticado.
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
    request.userId = payload.sub;
    return next();
  } catch {
    return response.status(401).json({ message: 'Token invalido ou expirado.' });
  }
}
