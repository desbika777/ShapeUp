import { env } from '../config/env.js';
import type { ClienteRedis } from '../lib/redis.js';
import { garantirRedisPronto, obterClienteRedisCompartilhado } from '../lib/redis.js';
import { logInfo, logWarn } from '../lib/logger.js';
import { executarComCircuitBreaker } from '../lib/redis-circuit-breaker.js';

export interface IServicoCache {
  remember<T>(key: string, loader: () => Promise<T>, ttlSeconds?: number): Promise<T>;
  deleteByPattern(pattern: string): Promise<void>;
  isEnabled(): boolean;
}

export class ServicoCacheNulo implements IServicoCache {
  async remember<T>(_key: string, loader: () => Promise<T>) {
    return loader();
  }

  async deleteByPattern(_pattern: string) {
    return undefined;
  }

  isEnabled() {
    return false;
  }
}

export class ServicoCacheRedis implements IServicoCache {
  constructor(
    private readonly redis: ClienteRedis,
    private readonly namespace = env.CACHE_NAMESPACE,
  ) {}

  async remember<T>(key: string, loader: () => Promise<T>, ttlSeconds = env.CACHE_TTL_SECONDS) {
    const redisKey = this.formatKey(key);

    try {
      const cached = await executarComCircuitBreaker(this.redis, 'cache.read', async () => {
        await garantirRedisPronto(this.redis);
        return this.redis.get(redisKey);
      });

      if (cached) {
        logInfo('cache_hit', { key: redisKey });
        return JSON.parse(cached) as T;
      }

      logInfo('cache_miss', { key: redisKey });
    } catch (error) {
      logWarn('cache_leitura_falhou', {
        key: redisKey,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      });
      return loader();
    }

    const data = await loader();

    try {
      await executarComCircuitBreaker(this.redis, 'cache.write', () =>
        this.redis.set(redisKey, JSON.stringify(data), 'EX', ttlSeconds),
      );
      logInfo('cache_set', { key: redisKey, ttlSeconds });
    } catch (error) {
      logWarn('cache_gravacao_falhou', {
        key: redisKey,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }

    return data;
  }

  async deleteByPattern(pattern: string) {
    const redisPattern = this.formatKey(pattern);

    try {
      const removed = await executarComCircuitBreaker(this.redis, 'cache.invalidate', async () => {
        await garantirRedisPronto(this.redis);
        let cursor = '0';
        let totalRemovido = 0;

        do {
          const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', redisPattern, 'COUNT', 100);
          cursor = nextCursor;

          if (keys.length > 0) {
            totalRemovido += keys.length;
            await this.redis.del(...keys);
          }
        } while (cursor !== '0');

        return totalRemovido;
      });

      logInfo('cache_invalidation', { pattern: redisPattern, removed });
    } catch (error) {
      logWarn('cache_invalidacao_falhou', {
        pattern: redisPattern,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  isEnabled() {
    return true;
  }

  private formatKey(key: string) {
    return `${this.namespace}:${key}`;
  }
}

export function criarServicoCache(): IServicoCache {
  const redis = obterClienteRedisCompartilhado();

  if (!redis) {
    return new ServicoCacheNulo();
  }

  return new ServicoCacheRedis(redis);
}

export function chaveCache(ownerId: string, scope: string, params?: Record<string, unknown>) {
  return `owner:${ownerId}:${scope}:${params ? JSON.stringify(params) : 'default'}`;
}

export function padraoCacheDono(ownerId: string) {
  return `owner:${ownerId}:*`;
}
