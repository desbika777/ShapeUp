const fs = require('node:fs');

const messageFile = process.argv[2];
const allowedTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'build', 'ci', 'perf', 'revert'];

if (!messageFile || !fs.existsSync(messageFile)) {
  console.error('Arquivo da mensagem de commit nao foi informado.');
  process.exit(1);
}

const firstLine = fs.readFileSync(messageFile, 'utf8').split(/\r?\n/)[0].trim();
const pattern = new RegExp(`^(${allowedTypes.join('|')})(\\([a-z0-9-]+\\))?: .{1,72}$`);

if (!pattern.test(firstLine)) {
  console.error('Mensagem de commit invalida.');
  console.error('Use o formato: tipo: resumo curto');
  console.error(`Tipos aceitos: ${allowedTypes.join(', ')}`);
  console.error('Exemplo: feat: adicionar proxy nginx com https');
  process.exit(1);
}
