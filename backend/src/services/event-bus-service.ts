import { env } from '../config/env.js';
import type { ClienteRedis } from '../lib/redis.js';
import {
  criarClienteRedisAssinante,
  garantirRedisPronto,
  obterClienteRedisCompartilhado,
} from '../lib/redis.js';
import { logError, logInfo, logWarn } from '../lib/logger.js';
import { executarComCircuitBreaker } from '../lib/redis-circuit-breaker.js';

export type EventoDominio = {
  type: string;
  ownerId?: string;
  actorId?: string;
  entityId?: string;
  payload?: Record<string, unknown>;
};

export interface IServicoEventos {
  publish(event: EventoDominio): Promise<void>;
}

export class ServicoEventosNulo implements IServicoEventos {
  async publish(event: EventoDominio) {
    logInfo('evento_local_sem_redis', {
      type: event.type,
      ownerId: event.ownerId,
      actorId: event.actorId,
      entityId: event.entityId,
    });
  }
}

export class ServicoEventosRedis implements IServicoEventos {
  constructor(
    private readonly redis: ClienteRedis,
    private readonly channel = env.REDIS_EVENT_CHANNEL,
  ) {}

  async publish(event: EventoDominio) {
    const message = {
      ...event,
      occurredAt: new Date().toISOString(),
    };

    try {
      await executarComCircuitBreaker(this.redis, 'event.publish', async () => {
        await garantirRedisPronto(this.redis);
        await this.redis.publish(this.channel, JSON.stringify(message));
      });
      logInfo('evento_publicado', {
        channel: this.channel,
        type: event.type,
        ownerId: event.ownerId,
        entityId: event.entityId,
      });
    } catch (error) {
      logWarn('evento_publicacao_falhou', {
        channel: this.channel,
        type: event.type,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
}

export function criarServicoEventos(): IServicoEventos {
  const redis = obterClienteRedisCompartilhado();

  if (!redis) {
    return new ServicoEventosNulo();
  }

  return new ServicoEventosRedis(redis);
}

export async function iniciarAssinanteEventos() {
  const subscriber = criarClienteRedisAssinante();

  if (!subscriber) {
    logInfo('eventos_assinante_desabilitado', { reason: 'REDIS_URL ausente' });
    return async () => undefined;
  }

  subscriber.on('message', (channel, message) => {
    try {
      const parsed = JSON.parse(message) as EventoDominio & { occurredAt?: string };
      logInfo('evento_consumido', {
        channel,
        type: parsed.type,
        ownerId: parsed.ownerId,
        entityId: parsed.entityId,
        occurredAt: parsed.occurredAt,
      });
    } catch (error) {
      logError('evento_consumo_invalido', {
        channel,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  });

  try {
    await executarComCircuitBreaker(subscriber, 'event.subscribe', async () => {
      await garantirRedisPronto(subscriber);
      await subscriber.subscribe(env.REDIS_EVENT_CHANNEL);
    });
    logInfo('eventos_assinante_iniciado', { channel: env.REDIS_EVENT_CHANNEL });
  } catch (error) {
    logWarn('eventos_assinante_falhou', {
      channel: env.REDIS_EVENT_CHANNEL,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }

  return async () => {
    try {
      await subscriber.quit();
    } catch (error) {
      logWarn('eventos_assinante_encerramento_falhou', {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };
}
