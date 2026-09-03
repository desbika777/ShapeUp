// Traduz erros da aplicacao em respostas HTTP padronizadas.
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../core/app-error.js';

export function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction) {
  // Erros conhecidos retornam codigo e mensagem pensados para o usuario.
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  // Erros inesperados ficam registrados no servidor e nao vazam detalhes internos.
  console.error(error);
  return response.status(500).json({
    message: 'Ocorreu um erro inesperado no servidor.',
  });
}
