// Middleware que protege rotas privadas usando token JWT.
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { PerfilAcesso } from '@shape/shared';
import { env } from '../config/env.js';

export type RequisicaoAutenticada = Request & {
  userId?: string;
  perfil?: PerfilAcesso;
};

export function middlewareAutenticacao(request: RequisicaoAutenticada, response: Response, next: NextFunction) {
  const authorization = request.headers.authorization;

  // Sem cabecalho Authorization, a requisicao nao pode acessar dados privados.
  if (!authorization?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Token de autenticacao ausente.' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    // O subject do token guarda o id do usuario autenticado.
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; perfil?: PerfilAcesso };
    request.userId = payload.sub;
    request.perfil = payload.perfil ?? 'USUARIO';
    return next();
  } catch {
    return response.status(401).json({ message: 'Token invalido ou expirado.' });
  }
}

export function exigirPerfil(perfisPermitidos: PerfilAcesso[]) {
  return (request: RequisicaoAutenticada, response: Response, next: NextFunction) => {
    if (!request.perfil || !perfisPermitidos.includes(request.perfil)) {
      return response.status(403).json({ message: 'Seu perfil nao permite executar esta acao.' });
    }

    return next();
  };
}
