// Cliente Prisma compartilhado pelos repositorios.
import { createPrismaClient } from './create-prisma-client.js';

export const prisma = createPrismaClient();
