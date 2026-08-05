// Cliente Prisma compartilhado pelos repositorios.
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
