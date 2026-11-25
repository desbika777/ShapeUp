import type { ClienteRedis } from './redis.js';
import { logInfo, logWarn } from './logger.js';

const FALHAS_PARA_ABRIR = 3;
const TEMPO_RECUPERACAO_MS = 10_000;

type EstadoCircuito = 'fechado' | 'aberto' | 'meio-aberto';

class CircuitoRedis {
  private estado: EstadoCircuito = 'fechado';
  private falhasConsecutivas = 0;
  private abertoDesde = 0;
  private probeEmAndamento = false;
  private versaoEstado = 0;

  async executar<T>(operacao: string, acao: () => Promise<T>): Promise<T> {
    const probe = this.prepararTentativa(operacao);
    const versaoInicial = this.versaoEstado;

    try {
      const resultado = await acao();
      const probeBemSucedido = probe && this.estado === 'meio-aberto';
      const recuperacaoNoEstadoFechado = !probe && this.estado === 'fechado' && this.falhasConsecutivas > 0;

      if (
        versaoInicial === this.versaoEstado &&
        (probeBemSucedido || recuperacaoNoEstadoFechado)
      ) {
        this.estado = 'fechado';
        this.falhasConsecutivas = 0;
        this.abertoDesde = 0;
        this.probeEmAndamento = false;
        this.versaoEstado += 1;
        logInfo('redis_circuito_fechado', { operacao });
      }

      return resultado;
    } catch (error) {
      if (versaoInicial === this.versaoEstado) {
        this.falhasConsecutivas += 1;
        this.probeEmAndamento = false;

        if (probe || (this.estado === 'fechado' && this.falhasConsecutivas >= FALHAS_PARA_ABRIR)) {
          this.abrir(operacao, error);
        }
      }

      throw error;
    }
  }

  private prepararTentativa(operacao: string) {
    if (this.estado === 'aberto') {
      const tempoAberto = Date.now() - this.abertoDesde;
      if (tempoAberto < TEMPO_RECUPERACAO_MS) {
        throw new Error(
          'Circuito Redis aberto; tentativa bloqueada por ' + (TEMPO_RECUPERACAO_MS - tempoAberto) + ' ms.',
        );
      }

      this.estado = 'meio-aberto';
      this.probeEmAndamento = false;
      this.versaoEstado += 1;
      logInfo('redis_circuito_meio_aberto', { operacao });
    }

    if (this.estado === 'meio-aberto') {
      if (this.probeEmAndamento) {
        throw new Error('Circuito Redis em verificacao; tentativa bloqueada.');
      }

      this.probeEmAndamento = true;
      return true;
    }

    return false;
  }

  private abrir(operacao: string, error: unknown) {
    this.estado = 'aberto';
    this.abertoDesde = Date.now();
    this.probeEmAndamento = false;
    this.versaoEstado += 1;
    logWarn('redis_circuito_aberto', {
      operacao,
      falhasConsecutivas: this.falhasConsecutivas,
      tempoRecuperacaoMs: TEMPO_RECUPERACAO_MS,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
}

const circuitosPorCliente = new WeakMap<ClienteRedis, CircuitoRedis>();

export function executarComCircuitBreaker<T>(
  redis: ClienteRedis,
  operacao: string,
  acao: () => Promise<T>,
) {
  let circuito = circuitosPorCliente.get(redis);
  if (!circuito) {
    circuito = new CircuitoRedis();
    circuitosPorCliente.set(redis, circuito);
  }

  return circuito.executar(operacao, acao);
}
