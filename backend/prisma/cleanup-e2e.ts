import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { readdir, unlink } from 'node:fs/promises';

config({ path: new URL('../.env', import.meta.url) });

if (process.env.DATABASE_URL?.includes('@localhost:')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('@localhost:', '@127.0.0.1:');
}

const prisma = new PrismaClient();

async function limparUploadsE2E() {
  const uploadDir = new URL('../uploads/imagens/', import.meta.url);
  const entries = await readdir(uploadDir, { withFileTypes: true }).catch(() => []);
  let deleted = 0;

  await Promise.all(entries.map(async (entry) => {
    if (!entry.isFile() || !entry.name.endsWith('-evidencia-rubrica.png')) {
      return;
    }

    await unlink(new URL(entry.name, uploadDir));
    deleted += 1;
  }));

  return deleted;
}

async function main() {
  const testUsers = await prisma.usuario.findMany({
    where: { email: { endsWith: '@shape.test' } },
    select: { id: true },
  });
  const testUserIds = testUsers.map((user) => user.id);

  const deletedStudents = await prisma.aluno.deleteMany({
    where: {
      OR: [
        { email: { endsWith: '@shape.test' } },
        { name: { startsWith: 'Aluno E2E' } },
        { name: { startsWith: 'Aluno Apoio' } },
        ...(testUserIds.length ? [{ ownerId: { in: testUserIds } }] : []),
      ],
    },
  });

  const deletedPlans = await prisma.plano.deleteMany({
    where: {
      OR: [
        { name: { startsWith: 'Plano E2E' } },
        { name: { startsWith: 'Plano Alunos' } },
        ...(testUserIds.length ? [{ ownerId: { in: testUserIds } }] : []),
      ],
    },
  });

  const deletedUsers = await prisma.usuario.deleteMany({
    where: { id: { in: testUserIds } },
  });
  const deletedUploads = await limparUploadsE2E();

  console.log(`Limpeza E2E concluida: ${deletedUsers.count} usuarios, ${deletedPlans.count} planos, ${deletedStudents.count} alunos e ${deletedUploads} uploads removidos.`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error('Falha ao limpar dados E2E.');
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
