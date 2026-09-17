const { spawnSync } = require('node:child_process');

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    env,
    shell: process.platform === 'win32',
    stdio: 'inherit',
    ...options,
  });
}

const env = {
  ...process.env,
  E2E_BASE_URL: process.env.E2E_BASE_URL || 'https://shapeup.local',
  E2E_API_URL: process.env.E2E_API_URL || 'https://localhost/api',
  E2E_HOST_ALIAS: process.env.E2E_HOST_ALIAS || 'shapeup.local',
  NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED || '0',
};

const cleanupBefore = run('npm', ['run', 'prisma:cleanup-e2e', '--workspace', 'backend']);
if (cleanupBefore.status !== 0) {
  process.exit(cleanupBefore.status ?? 1);
}

const result = run('npm', ['run', 'test:e2e', '--workspace', 'frontend']);
const cleanupAfter = run('npm', ['run', 'prisma:cleanup-e2e', '--workspace', 'backend']);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

if (cleanupAfter.status !== 0) {
  process.exit(cleanupAfter.status ?? 1);
}

process.exit(0);
