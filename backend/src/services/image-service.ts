// Servico de anexos: valida o arquivo salvo pelo Multer e monta metadados publicos.
import { open, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import type { AnexoAcademia, EntradaAnexo } from '@shape/shared';
import { diretorioUploadImagens } from '../config/uploads.js';
import { AppError } from '../core/app-error.js';
import type { IRepositorioAnexo } from '../repositories/interfaces.js';
import { padraoCacheDono, type IServicoCache, ServicoCacheNulo } from './cache-service.js';
import { ServicoEventosNulo, type IServicoEventos } from './event-bus-service.js';

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
  const relativePath = `/api/imagens/arquivo/${encodeURIComponent(attachment.fileName)}`;
  return {
    ...attachment,
    relativePath,
    url: montarUrl(baseUrl, relativePath),
  };
}

export class ServicoImagem {
  constructor(
    private readonly repository: IRepositorioAnexo,
    private readonly cacheService: IServicoCache = new ServicoCacheNulo(),
    private readonly eventBus: IServicoEventos = new ServicoEventosNulo(),
  ) {}

  async listar(ownerId: string, baseUrl: string) {
    const attachments = await this.repository.list(ownerId);
    return attachments.map((attachment) => publicarUrl(baseUrl, attachment));
  }

  async obterArquivo(ownerId: string, fileName: string) {
    if (!fileName || path.basename(fileName) !== fileName) {
      throw new AppError(404, 'Anexo nao encontrado.');
    }

    const attachment = await this.repository.findByFileName(ownerId, fileName);
    if (!attachment) {
      throw new AppError(404, 'Anexo nao encontrado.');
    }

    const diretorioSeguro = path.resolve(diretorioUploadImagens);
    const caminhoArquivo = path.resolve(diretorioSeguro, attachment.fileName);
    if (!caminhoArquivo.startsWith(`${diretorioSeguro}${path.sep}`)) {
      throw new AppError(404, 'Anexo nao encontrado.');
    }

    try {
      const detalhes = await stat(caminhoArquivo);
      if (!detalhes.isFile()) throw new Error('Not a file');
    } catch {
      throw new AppError(404, 'Arquivo do anexo nao encontrado.');
    }

    return { caminhoArquivo, mimeType: attachment.mimeType };
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
    const relativePath = `/api/imagens/arquivo/${encodeURIComponent(file.filename)}`;

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

    await this.registrarEscrita(ownerId, 'anexo.registrado', attachment.id);
    return publicarUrl(baseUrl, attachment);
  }

  async remover(ownerId: string, id: string) {
    const attachment = await this.repository.findById(ownerId, id);

    if (!attachment) {
      throw new AppError(404, 'Anexo nao encontrado.');
    }

    await this.repository.delete(ownerId, id);
    await unlink(path.join(diretorioUploadImagens, attachment.fileName)).catch(() => undefined);
    await this.registrarEscrita(ownerId, 'anexo.removido', id);
  }

  private async registrarEscrita(ownerId: string, type: string, entityId: string) {
    await Promise.all([
      this.cacheService.deleteByPattern(padraoCacheDono(ownerId)),
      this.eventBus.publish({ type, ownerId, actorId: ownerId, entityId }),
    ]);
  }
}
