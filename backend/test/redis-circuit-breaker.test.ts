import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ClienteRedis } from '../src/lib/redis.js';
import { executarComCircuitBreaker } from '../src/lib/redis-circuit-breaker.js';

describe('circuit breaker do Redis', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('abre depois de tres falhas consecutivas e bloqueia novas chamadas', async () => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const redis = {} as ClienteRedis;
    const operacao = vi.fn(async () => {
      throw new Error('redis indisponivel');
    });

    for (let tentativa = 0; tentativa < 3; tentativa += 1) {
      await expect(executarComCircuitBreaker(redis, 'cache.read', operacao)).rejects.toThrow(
        'redis indisponivel',
      );
    }

    await expect(executarComCircuitBreaker(redis, 'cache.read', operacao)).rejects.toThrow(
      'Circuito Redis aberto',
    );
    expect(operacao).toHaveBeenCalledTimes(3);
  });

  it('faz uma sondagem apos dez segundos e fecha quando o Redis responde', async () => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'info').mockImplementation(() => undefined);

    const redis = {} as ClienteRedis;
    const falha = vi.fn(async () => {
      throw new Error('redis indisponivel');
    });

    for (let tentativa = 0; tentativa < 3; tentativa += 1) {
      await expect(executarComCircuitBreaker(redis, 'cache.read', falha)).rejects.toThrow(
        'redis indisponivel',
      );
    }

    await vi.advanceTimersByTimeAsync(10_001);

    const sucesso = vi.fn(async () => 'ok');
    await expect(executarComCircuitBreaker(redis, 'cache.read', sucesso)).resolves.toBe('ok');
    await expect(executarComCircuitBreaker(redis, 'cache.read', sucesso)).resolves.toBe('ok');
    expect(sucesso).toHaveBeenCalledTimes(2);
  });

  it('nao permite que uma chamada antiga feche um circuito ja aberto', async () => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const redis = {} as ClienteRedis;
    let concluirSucesso: ((valor: string) => void) | undefined;
    const chamadaAntiga = executarComCircuitBreaker(
      redis,
      'cache.read',
      () => new Promise<string>((resolve) => {
        concluirSucesso = resolve;
      }),
    );
    const falha = vi.fn(async () => {
      throw new Error('redis indisponivel');
    });

    for (let tentativa = 0; tentativa < 3; tentativa += 1) {
      await expect(executarComCircuitBreaker(redis, 'cache.read', falha)).rejects.toThrow(
        'redis indisponivel',
      );
    }

    concluirSucesso?.('resposta tardia');
    await expect(chamadaAntiga).resolves.toBe('resposta tardia');

    const naoDeveExecutar = vi.fn(async () => 'nao deve executar');
    await expect(executarComCircuitBreaker(redis, 'cache.read', naoDeveExecutar)).rejects.toThrow(
      'Circuito Redis aberto',
    );
    expect(naoDeveExecutar).not.toHaveBeenCalled();
  });
});
