const { spawnSync } = require('node:child_process');
const path = require('node:path');

const result = spawnSync(process.execPath, [path.join(__dirname, 'run-e2e-isolated.cjs')], {
  cwd: path.resolve(__dirname, '..'),
  env: process.env,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
