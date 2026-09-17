// Servico de anexos: valida o arquivo salvo pelo Multer e monta metadados publicos.
import { open, unlink } from 'node:fs/promises';
import path from 'node:path';
import type { AnexoAcademia, EntradaAnexo } from '@shape/shared';
import { diretorioUploadImagens } from '../config/uploads.js';
import { AppError } from '../core/app-error.js';
import type { IRepositorioAnexo } from '../repositories/interfaces.js';

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

function assinaturaPdf(buffer: Buffer) {
  return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
}

function tipoArquivo(file: Express.Multer.File) {
  const extension = path.extname(file.originalname || file.filename).toLowerCase();

  if (extension === '.pdf' || file.mimetype === 'application/pdf') return 'application/pdf';
  return file.mimetype;
}

async function assinaturaArquivoValida(file: Express.Multer.File) {
  const buffer = await lerInicioArquivo(file.path, 12);
  const expectedType = tipoArquivo(file);

  if (expectedType === 'image/png') return assinaturaPng(buffer);
  if (expectedType === 'image/jpeg') return assinaturaJpeg(buffer);
  if (expectedType === 'image/webp') return assinaturaWebp(buffer);
  if (expectedType === 'application/pdf') return assinaturaPdf(buffer);

  return false;
}

function montarUrl(baseUrl: string, relativePath: string) {
  return new URL(relativePath, `${baseUrl}/`).toString();
}

function publicarUrl(baseUrl: string, attachment: AnexoAcademia): AnexoAcademia {
  return {
    ...attachment,
    url: montarUrl(baseUrl, attachment.relativePath),
  };
}

export class ServicoImagem {
  constructor(private readonly repository: IRepositorioAnexo) {}

  async listar(ownerId: string, baseUrl: string) {
    const attachments = await this.repository.list(ownerId);
    return attachments.map((attachment) => publicarUrl(baseUrl, attachment));
  }

  async registrarUpload(ownerId: string, file: Express.Multer.File | undefined, baseUrl: string, input: EntradaAnexo): Promise<AnexoAcademia> {
    if (!file) {
      throw new AppError(400, 'Envie um anexo no campo imagem.');
    }

    const isValidSignature = await assinaturaArquivoValida(file);

    if (!isValidSignature) {
      await unlink(file.path).catch(() => undefined);
      throw new AppError(400, 'O conteudo do arquivo nao corresponde a um anexo valido.');
    }

    const extension = path.extname(file.filename).toLowerCase();
    const relativePath = `/uploads/imagens/${file.filename}`;

    const attachment = await this.repository.create(ownerId, {
      category: input.category,
      description: input.description,
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: tipoArquivo(file),
      size: file.size,
      extension,
      relativePath,
    });

    return publicarUrl(baseUrl, attachment);
  }

  async remover(ownerId: string, id: string) {
    const attachment = await this.repository.findById(ownerId, id);

    if (!attachment) {
      throw new AppError(404, 'Anexo nao encontrado.');
    }

    await this.repository.delete(ownerId, id);
    await unlink(path.join(diretorioUploadImagens, attachment.fileName)).catch(() => undefined);
  }
}
