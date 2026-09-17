// Repositorio Prisma dos anexos: registra metadados dos arquivos salvos pelo Multer.
import type { AnexoAcademia, CategoriaAnexo, EntradaAnexo } from '@shape/shared';
import type { IRepositorioAnexo } from '../interfaces.js';
import { prisma } from '../../lib/prisma.js';

type RegistroAnexoPrisma = {
  id: string;
  category: CategoriaAnexo;
  description: string | null;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  extension: string;
  relativePath: string;
  createdAt: Date;
  updatedAt: Date;
};

function mapearAnexo(record: RegistroAnexoPrisma): AnexoAcademia {
  return {
    id: record.id,
    category: record.category,
    description: record.description,
    originalName: record.originalName,
    fileName: record.fileName,
    mimeType: record.mimeType,
    size: record.size,
    extension: record.extension,
    relativePath: record.relativePath,
    url: record.relativePath,
    uploadedAt: record.createdAt.toISOString(),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export class RepositorioPrismaAnexo implements IRepositorioAnexo {
  async list(ownerId: string) {
    const attachments = await prisma.anexoAcademia.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
    return attachments.map(mapearAnexo);
  }

  async create(ownerId: string, input: EntradaAnexo & Omit<AnexoAcademia, 'id' | 'category' | 'description' | 'url' | 'uploadedAt' | 'createdAt' | 'updatedAt'>) {
    const created = await prisma.anexoAcademia.create({
      data: {
        ownerId,
        category: input.category,
        description: input.description?.trim() || null,
        originalName: input.originalName,
        fileName: input.fileName,
        mimeType: input.mimeType,
        size: input.size,
        extension: input.extension,
        relativePath: input.relativePath,
      },
    });
    return mapearAnexo(created);
  }

  async findById(ownerId: string, id: string) {
    const attachment = await prisma.anexoAcademia.findFirst({ where: { id, ownerId } });
    return attachment ? mapearAnexo(attachment) : null;
  }

  async delete(ownerId: string, id: string) {
    await prisma.anexoAcademia.deleteMany({ where: { id, ownerId } });
  }
}
