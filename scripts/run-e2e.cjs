const { spawnSync } = require('node:child_process');

function dockerBackendEstaRodando() {
  const result = spawnSync('docker', ['ps', '--filter', 'name=shapeup-backend', '--filter', 'status=running', '--format', '{{.Names}}'], {
    shell: process.platform === 'win32',
    encoding: 'utf8',
  });

  return result.status === 0 && result.stdout.includes('shapeup-backend');
}

const command = dockerBackendEstaRodando()
  ? ['run', 'e2e:docker']
  : ['run', 'test:e2e', '--workspace', 'frontend'];

const result = spawnSync('npm', command, {
  env: process.env,
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
