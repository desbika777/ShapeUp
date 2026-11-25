/* eslint-disable no-console */
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

const backendDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(backendDir, '..');
const schemaPath = path.join(rootDir, 'backend', 'prisma', 'schema.prisma');
const configPath = path.join(rootDir, 'backend', 'prisma.config.ts');

const prismaExecutable = process.platform === 'win32' ? 'prisma.cmd' : 'prisma';
const prismaBinCandidates = [
  path.join(backendDir, 'node_modules', '.bin', prismaExecutable),
  path.join(rootDir, 'node_modules', '.bin', prismaExecutable),
];
const prismaBin = prismaBinCandidates.find((candidate) => fs.existsSync(candidate));

if (!prismaBin) {
  console.error(`Prisma CLI nao encontrado. Locais verificados: ${prismaBinCandidates.join(', ')}`);
  process.exit(1);
}

if (!fs.existsSync(schemaPath)) {
  console.error(`Schema do Prisma nao encontrado em ${schemaPath}.`);
  process.exit(1);
}

if (!fs.existsSync(configPath)) {
  console.error(`Configuracao do Prisma nao encontrada em ${configPath}.`);
  process.exit(1);
}

const result = spawnSync(
  prismaBin,
  ['generate', '--schema', schemaPath, '--config', configPath],
  {
    cwd: rootDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: (() => {
      const childEnv = { ...process.env };
      delete childEnv.PRISMA_GENERATE_NO_ENGINE;
      childEnv.DATABASE_URL ??= 'mysql://shapeup:shapeup@127.0.0.1:3306/shapeup';
      return childEnv;
    })(),
  },
);

process.exit(result.status ?? 1);
