const fs = require('node:fs');

const messageFile = process.argv[2];
const allowedTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'build', 'ci', 'perf', 'revert'];

if (!messageFile || !fs.existsSync(messageFile)) {
  console.error('Arquivo da mensagem de commit nao foi informado.');
  process.exit(1);
}

const firstLine = fs.readFileSync(messageFile, 'utf8').split(/\r?\n/)[0].trim();
const conventionalPattern = new RegExp(`^(${allowedTypes.join('|')})(\\([a-z0-9-]+\\))?: .{1,72}$`);
const simplePattern = /^.{1,72}$/;

if (!conventionalPattern.test(firstLine) && !simplePattern.test(firstLine)) {
  console.error('Mensagem de commit invalida.');
  console.error('Use uma mensagem curta.');
  console.error(`Tipos aceitos: ${allowedTypes.join(', ')}`);
  console.error('Exemplos: pontos finais shape up | docs: ajustar roteiro final');
  process.exit(1);
}
