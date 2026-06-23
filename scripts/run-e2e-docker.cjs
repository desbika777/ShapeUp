const { spawnSync } = require('node:child_process');

const env = {
  ...process.env,
  E2E_BASE_URL: process.env.E2E_BASE_URL || 'https://shapeup.local',
  E2E_API_URL: process.env.E2E_API_URL || 'https://localhost/api',
  E2E_HOST_ALIAS: process.env.E2E_HOST_ALIAS || 'shapeup.local',
  NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED || '0',
};

const result = spawnSync('npm', ['run', 'e2e'], {
  env,
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
