// Controlador de imagens: recebe arquivo do Multer e devolve metadados do upload.
import type { Response } from 'express';
import { attachmentSchema } from '../services/schemas.js';
import { obterParametroRota } from '../utils/http.js';
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

  list = async (request: RequisicaoAutenticada, response: Response) => {
    const result = await this.service.listar(request.userId ?? '', baseUrlPublica(request));
    return response.status(200).json(result);
  };

  upload = async (request: RequisicaoAutenticada, response: Response) => {
    const payload = attachmentSchema.parse(request.body);
    const result = await this.service.registrarUpload(request.userId ?? '', request.file, baseUrlPublica(request), payload);
    return response.status(201).json(result);
  };

  delete = async (request: RequisicaoAutenticada, response: Response) => {
    await this.service.remover(request.userId ?? '', obterParametroRota(request, 'id'));
    return response.status(204).send();
  };
}
