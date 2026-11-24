const { spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const https = require('node:https');
const os = require('node:os');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const projectName = `shapeup-e2e-${process.pid}-${Date.now().toString(36)}`;
const composePath = path.join(projectRoot, `.compose-e2e-${process.pid}.yml`);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'shapeup-e2e-'));
const certificateDir = path.join(tempDir, 'certs');
const envPath = path.join(tempDir, '.env');
const playwrightConfigPath = path.join(tempDir, 'playwright.config.mjs');
const composeEnv = { ...process.env };

for (const key of [
  'MYSQL_DATABASE', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_ROOT_PASSWORD', 'JWT_SECRET', 'APP_HOST',
  'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM',
]) {
  delete composeEnv[key];
}

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 1;
}

function runCompose(args) {
  return run('docker', [
    'compose',
    '--env-file', envPath,
    '--project-name', projectName,
    '--file', composePath,
    ...args,
  ], composeEnv);
}

function createComposeFile() {
  let compose = fs.readFileSync(path.join(projectRoot, 'docker-compose.yml'), 'utf8').replace(/\r\n/g, '\n');
  const containerNames = compose.match(/^\s*container_name:\s*shapeup-[^\n]*\n/gm) ?? [];

  if (containerNames.length < 6) {
    throw new Error('The base Compose file changed; refusing to build an unisolated E2E stack.');
  }

  compose = compose.replace(/^\s*container_name:\s*shapeup-[^\n]*\n/gm, '');

  const defaultPorts = '    ports:\n      - "80:80"\n      - "443:443"';
  if (!compose.includes(defaultPorts)) {
    throw new Error('The Nginx port block changed; refusing to bind the primary project ports.');
  }

  compose = compose.replace(defaultPorts, '    ports:\n      - "127.0.0.1::80"\n      - "127.0.0.1::443"');

  const localCertificateMount = '      - ./docker/nginx/certs:/etc/nginx/certs:ro';
  if (!compose.includes(localCertificateMount)) {
    throw new Error('The Nginx certificate mount changed; refusing to start an incomplete E2E stack.');
  }

  const portableCertificateMount = `      - type: bind\n        source: "${certificateDir.replace(/\\/g, '/')}"\n        target: /etc/nginx/certs\n        read_only: true`;
  compose = compose.replace(localCertificateMount, portableCertificateMount);
  fs.writeFileSync(composePath, compose, 'utf8');
}

function createDisposableCertificate() {
  fs.mkdirSync(certificateDir, { recursive: true });
  const certificatePath = path.join(certificateDir, 'shapeup.local.crt');
  const privateKeyPath = path.join(certificateDir, 'shapeup.local.key');
  const localCertificateDir = path.join(projectRoot, 'docker', 'nginx', 'certs');
  const localCertificatePath = path.join(localCertificateDir, 'shapeup.local.crt');
  const localPrivateKeyPath = path.join(localCertificateDir, 'shapeup.local.key');

  if (fs.existsSync(localCertificatePath) && fs.existsSync(localPrivateKeyPath)) {
    fs.copyFileSync(localCertificatePath, certificatePath);
    fs.copyFileSync(localPrivateKeyPath, privateKeyPath);
    return;
  }

  const result = spawnSync('openssl', [
    'req', '-x509', '-newkey', 'rsa:2048', '-nodes',
    '-keyout', privateKeyPath,
    '-out', certificatePath,
    '-days', '1',
    '-subj', '/CN=shapeup.local',
    '-addext', 'subjectAltName=DNS:shapeup.local,DNS:localhost,IP:127.0.0.1',
  ], {
    cwd: projectRoot,
    env: composeEnv,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error('Could not create a disposable TLS certificate for the E2E stack.');
  }
}

function createDisposableEnv() {
  const secret = crypto.randomBytes(24).toString('hex');
  const env = [
    'MYSQL_DATABASE=shapeup_e2e',
    'MYSQL_USER=shapeup_e2e',
    `MYSQL_PASSWORD=${secret}`,
    `MYSQL_ROOT_PASSWORD=${crypto.randomBytes(24).toString('hex')}`,
    `JWT_SECRET=${crypto.randomBytes(32).toString('hex')}`,
    'APP_HOST=shapeup.local',
  ].join('\n') + '\n';

  fs.writeFileSync(envPath, env, { encoding: 'utf8', mode: 0o600 });
}

function getPublishedPort(servicePort) {
  const output = spawnSync('docker', [
    'compose',
    '--env-file', envPath,
    '--project-name', projectName,
    '--file', composePath,
    'port',
    'nginx',
    String(servicePort),
  ], { cwd: projectRoot, env: composeEnv, encoding: 'utf8', shell: process.platform === 'win32' });

  if (output.status !== 0 || output.error) {
    throw output.error ?? new Error(`Could not resolve the isolated Nginx port ${servicePort}.`);
  }

  const match = output.stdout.trim().match(/:(\d+)$/);
  if (!match) {
    throw new Error(`Docker Compose returned an unexpected port for Nginx ${servicePort}.`);
  }

  return Number(match[1]);
}

function requestStatus(url) {
  return new Promise((resolve) => {
    const request = https.get(url, { rejectUnauthorized: false, timeout: 3000 }, (response) => {
      response.resume();
      resolve(response.statusCode ?? 0);
    });

    request.on('timeout', () => request.destroy());
    request.on('error', () => resolve(0));
  });
}

async function waitForHealth(url) {
  const deadline = Date.now() + 120_000;

  while (Date.now() < deadline) {
    if (await requestStatus(url) === 200) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.error('Recent backend and Nginx logs from the isolated stack:');
  runCompose(['logs', '--tail=120', 'backend', 'nginx']);
  throw new Error('The isolated Shape Up stack did not become healthy within 120 seconds.');
}

function writePlaywrightConfig(baseUrl) {
  const testDir = path.join(projectRoot, 'frontend', 'e2e').replace(/\\/g, '/');
  const config = `export default {
  testDir: ${JSON.stringify(testDir)},
  timeout: 60000,
  workers: 1,
  use: {
    baseURL: ${JSON.stringify(baseUrl)},
    headless: true,
    ignoreHTTPSErrors: true,
    launchOptions: { args: ['--host-resolver-rules=MAP shapeup.local 127.0.0.1'] }
  },
  reporter: 'list'
};
`;

  fs.writeFileSync(playwrightConfigPath, config, 'utf8');
}

function removeTempDirSafely() {
  const root = path.resolve(os.tmpdir());
  const target = path.resolve(tempDir);
  const allowedPrefix = `${root}${path.sep}shapeup-e2e-`;

  if (!target.startsWith(allowedPrefix)) {
    throw new Error('Refusing to remove a temporary path outside the generated E2E directory.');
  }

  fs.rmSync(target, { recursive: true, force: true });
}

async function main() {
  let exitCode = 1;

  try {
    createDisposableCertificate();
    createComposeFile();
    createDisposableEnv();

    if (runCompose(['up', '--detach', '--build']) !== 0) {
      throw new Error('Could not start the disposable E2E Compose project.');
    }

    const httpsPort = getPublishedPort(443);
    await waitForHealth(`https://127.0.0.1:${httpsPort}/health`);

    if (runCompose(['run', '--rm', '--no-deps', 'migrate', 'npm', 'run', 'prisma:seed', '--workspace', 'backend']) !== 0) {
      throw new Error('Could not seed the disposable E2E database.');
    }

    const baseUrl = `https://shapeup.local:${httpsPort}`;
    writePlaywrightConfig(baseUrl);

    const playwrightEnv = {
      ...process.env,
      E2E_BASE_URL: baseUrl,
      E2E_API_URL: `https://127.0.0.1:${httpsPort}/api`,
      E2E_HOST_ALIAS: 'shapeup.local',
      E2E_ADMIN_EMAIL: 'admin@shape.com.br',
      E2E_ADMIN_PASSWORD: 'Shape@123',
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
    };

    exitCode = run('npm', [
      'exec', '--workspace', 'frontend', '--', 'playwright', 'test',
      `--config=${playwrightConfigPath}`,
    ], playwrightEnv);
  } catch (error) {
    console.error(error.message);
    exitCode = 1;
  } finally {
    if (fs.existsSync(composePath) && fs.existsSync(envPath)) {
      try {
        const downCode = runCompose(['down', '--volumes', '--remove-orphans']);
        if (downCode !== 0) {
          console.error('Could not fully remove the disposable E2E Compose project.');
          exitCode = 1;
        }
      } catch (error) {
        console.error(`E2E cleanup failed: ${error.message}`);
        exitCode = 1;
      }
    }

    if (fs.existsSync(composePath)) {
      fs.unlinkSync(composePath);
    }

    removeTempDirSafely();
  }

  process.exitCode = exitCode;
}

main();
