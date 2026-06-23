import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../core/app-error.js';

export function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  console.error(error);
  return response.status(500).json({
    message: 'Ocorreu um erro inesperado no servidor.',
  });
}
