// Middleware Multer para receber imagens com validacao antes de persistir no disco.
import { existsSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import multer from 'multer';
import {
  IMAGEM_EXTENSOES_PERMITIDAS,
  IMAGEM_MIME_TYPES_PERMITIDOS,
  IMAGEM_TAMANHO_MAXIMO_BYTES,
} from '@shape/shared';
import { AppError } from '../core/app-error.js';
import { diretorioUploadImagens, garantirDiretoriosUpload } from '../config/uploads.js';

function valorPermitido(lista: readonly string[], valor: string) {
  return lista.includes(valor);
}

function normalizarExtensao(fileName: string) {
  return path.extname(fileName).toLowerCase();
}

function baseSegura(fileName: string, extension: string) {
  const base = path.basename(fileName, extension)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);

  return base || 'imagem';
}

function gerarNomeUnico(file: Express.Multer.File) {
  const extension = normalizarExtensao(file.originalname);
  const base = baseSegura(file.originalname, extension);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = `${Date.now()}-${randomUUID()}-${base}${extension}`;
    if (!existsSync(path.join(diretorioUploadImagens, candidate))) {
      return candidate;
    }
  }

  throw new AppError(409, 'Nao foi possivel gerar um nome unico para a imagem.');
}

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    garantirDiretoriosUpload();
    callback(null, diretorioUploadImagens);
  },
  filename: (_request, file, callback) => {
    try {
      callback(null, gerarNomeUnico(file));
    } catch (error) {
      callback(error as Error, '');
    }
  },
});

export const uploadImagemUnica = multer({
  storage,
  limits: {
    fileSize: IMAGEM_TAMANHO_MAXIMO_BYTES,
    files: 1,
  },
  fileFilter: (_request, file, callback) => {
    const extension = normalizarExtensao(file.originalname);
    const hasAllowedExtension = valorPermitido(IMAGEM_EXTENSOES_PERMITIDAS, extension);
    const hasAllowedMimeType = valorPermitido(IMAGEM_MIME_TYPES_PERMITIDOS, file.mimetype);

    if (!hasAllowedExtension || !hasAllowedMimeType) {
      callback(new AppError(400, 'Envie uma imagem valida nos formatos PNG, JPG, JPEG ou WEBP.'));
      return;
    }

    callback(null, true);
  },
}).single('imagem');
