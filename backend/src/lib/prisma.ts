// Cliente Prisma compartilhado pelos repositories.
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
