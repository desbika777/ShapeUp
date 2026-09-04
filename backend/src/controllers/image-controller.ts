// Controlador de imagens: recebe arquivo do Multer e devolve metadados do upload.
import type { Response } from 'express';
import type { RequisicaoAutenticada } from '../middlewares/auth-middleware.js';
import { ServicoImagem } from '../services/image-service.js';

function baseUrlPublica(request: RequisicaoAutenticada) {
  const forwardedProto = request.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const protocol = forwardedProto || request.protocol;
  const host = request.get('host') ?? 'localhost:3333';
  return `${protocol}://${host}`;
}

export class ControladorImagem {
  constructor(private readonly service: ServicoImagem) {}

  upload = async (request: RequisicaoAutenticada, response: Response) => {
    const result = await this.service.registrarUpload(request.file, baseUrlPublica(request));
    return response.status(201).json(result);
  };
}
