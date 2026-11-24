// Ponto de entrada da API em ambiente local/producao.
import { env } from './config/env.js';
import { createApp } from './app.js';
import { encerrarRedis } from './lib/redis.js';
import { logInfo } from './lib/logger.js';
import { iniciarAssinanteEventos } from './services/event-bus-service.js';

const app = createApp();
const encerrarAssinanteEventos = await iniciarAssinanteEventos();

// Inicia o servidor usando a porta validada em config/env.ts.
const server = app.listen(env.PORT, () => {
  logInfo('api_iniciada', { port: env.PORT });
});

async function shutdown(signal: string) {
  logInfo('api_encerrando', { signal });
  await encerrarAssinanteEventos();
  await encerrarRedis();
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
