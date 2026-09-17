const { spawn } = require('node:child_process');
const { networkInterfaces } = require('node:os');

function getLocalIPv4() {
  const entries = Object.entries(networkInterfaces())
    .flatMap(([name, addresses]) => (addresses ?? []).map((address) => ({ ...address, name })))
    .filter((address) => address.family === 'IPv4' && !address.internal && !address.address.startsWith('169.254.'));

  const preferred = entries.find((address) => /wi-?fi|wlan|ethernet/i.test(address.name) && !/vEthernet|docker|wsl|virtualbox/i.test(address.name));

  return preferred?.address ?? entries[0]?.address;
}

const ip = getLocalIPv4();

if (!ip) {
  console.error('Nao foi possivel detectar o IP local. Conecte o computador ao Wi-Fi e tente novamente.');
  process.exit(1);
}

const useTunnel = process.argv.includes('--tunnel');
const printOnly = process.argv.includes('--print-only');
const apiUrl = `http://${ip}:3333/api`;

console.log('');
console.log('Shape Mobile - Expo Go');
console.log(`API usada pelo celular: ${apiUrl}`);
console.log(useTunnel ? 'Modo Expo: tunnel' : 'Modo Expo: LAN');
console.log('');
console.log('No app Expo Go, abra o projeto Shape Mobile. Se a tela de login aparecer, confira se o campo URL da API esta igual ao valor acima.');
console.log('');

if (printOnly) {
  process.exit(0);
}

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const args = ['exec', '--workspace', 'mobile', '--', 'expo', 'start'];

if (useTunnel) {
  args.push('--tunnel');
} else {
  args.push('--host', 'lan');
}

args.push('--clear');

const child = spawn(npmCommand, args, {
  env: {
    ...process.env,
    EXPO_PUBLIC_API_URL: apiUrl,
  },
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
