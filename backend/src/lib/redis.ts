import Redis from 'ioredis';
import { env } from '../config/env.js';
import { logError, logInfo, logWarn } from './logger.js';

export type ClienteRedis = Redis;

let clienteCompartilhado: ClienteRedis | null | undefined;

function criarClienteRedis(role: string): ClienteRedis | null {
  if (!env.REDIS_URL) {
    return null;
  }

  const redis = new Redis(env.REDIS_URL, {
    enableOfflineQueue: false,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    connectTimeout: 3000,
    retryStrategy(times) {
      return Math.min(times * 200, 2000);
    },
  });

  redis.on('connect', () => logInfo('redis_conectado', { role }));
  redis.on('error', (error) => logWarn('redis_erro', { role, message: error.message }));
  redis.on('end', () => logWarn('redis_conexao_encerrada', { role }));

  return redis;
}

export function obterClienteRedisCompartilhado() {
  if (clienteCompartilhado !== undefined) {
    return clienteCompartilhado;
  }

  clienteCompartilhado = criarClienteRedis('cache-publisher');
  return clienteCompartilhado;
}

export function criarClienteRedisAssinante() {
  return criarClienteRedis('subscriber');
}

export async function garantirRedisPronto(redis: ClienteRedis) {
  if (redis.status === 'ready') {
    return;
  }

  if (redis.status === 'wait' || redis.status === 'end') {
    await redis.connect();
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Redis nao ficou pronto. Status atual: ${redis.status}`));
    }, 3000);

    const cleanup = () => {
      clearTimeout(timeout);
      redis.off('ready', onReady);
      redis.off('error', onError);
    };

    const onReady = () => {
      cleanup();
      resolve();
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    redis.once('ready', onReady);
    redis.once('error', onError);
  });
}

export async function encerrarRedis() {
  if (!clienteCompartilhado) return;

  try {
    await clienteCompartilhado.quit();
  } catch (error) {
    logError('redis_encerramento_falhou', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  } finally {
    clienteCompartilhado = undefined;
  }
}
