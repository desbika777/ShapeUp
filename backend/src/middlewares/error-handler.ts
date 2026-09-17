// Traduz erros da aplicacao em respostas HTTP padronizadas.
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { IMAGEM_TAMANHO_MAXIMO_BYTES } from '@shape/shared';
import { AppError } from '../core/app-error.js';

function formatarMegabytes(bytes: number) {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

export function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return response.status(400).json({
        message: `A imagem deve ter no maximo ${formatarMegabytes(IMAGEM_TAMANHO_MAXIMO_BYTES)}.`,
      });
    }

    return response.status(400).json({
      message: 'Nao foi possivel processar o upload da imagem.',
    });
  }

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
