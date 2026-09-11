// Servico de imagens: valida o arquivo salvo pelo Multer e monta metadados publicos.
import { open, unlink } from 'node:fs/promises';
import path from 'node:path';
import type { ImagemEnviada } from '@shape/shared';
import { AppError } from '../core/app-error.js';

const ASSINATURA_PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

async function lerInicioArquivo(filePath: string, length: number) {
  const file = await open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(length);
    await file.read(buffer, 0, length, 0);
    return buffer;
  } finally {
    await file.close();
  }
}

function assinaturaPng(buffer: Buffer) {
  return ASSINATURA_PNG.every((byte, index) => buffer[index] === byte);
}

function assinaturaJpeg(buffer: Buffer) {
  return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}

function assinaturaWebp(buffer: Buffer) {
  return buffer.subarray(0, 4).toString('ascii') === 'RIFF'
    && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
}

async function assinaturaImagemValida(file: Express.Multer.File) {
  const buffer = await lerInicioArquivo(file.path, 12);

  if (file.mimetype === 'image/png') return assinaturaPng(buffer);
  if (file.mimetype === 'image/jpeg') return assinaturaJpeg(buffer);
  if (file.mimetype === 'image/webp') return assinaturaWebp(buffer);

  return false;
}

function montarUrl(baseUrl: string, relativePath: string) {
  return new URL(relativePath, `${baseUrl}/`).toString();
}

export class ServicoImagem {
  async registrarUpload(file: Express.Multer.File | undefined, baseUrl: string): Promise<ImagemEnviada> {
    if (!file) {
      throw new AppError(400, 'Envie uma imagem no campo imagem.');
    }

    const isValidSignature = await assinaturaImagemValida(file);

    if (!isValidSignature) {
      await unlink(file.path).catch(() => undefined);
      throw new AppError(400, 'O conteudo do arquivo nao corresponde a uma imagem valida.');
    }

    const extension = path.extname(file.filename).toLowerCase();
    const relativePath = `/uploads/imagens/${file.filename}`;

    return {
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      extension,
      relativePath,
      url: montarUrl(baseUrl, relativePath),
      uploadedAt: new Date().toISOString(),
    };
  }
}
