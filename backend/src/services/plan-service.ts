// Servico de planos: aplica regras antes de acessar o repositorio.
import type { EntradaPlano, StatusPlano } from '@shape/shared';
import { AppError } from '../core/app-error.js';
import type { IRepositorioPlano, IRepositorioAluno } from '../repositories/interfaces.js';
import { chaveCache, padraoCacheDono, type IServicoCache, ServicoCacheNulo } from './cache-service.js';
import { ServicoEventosNulo, type IServicoEventos } from './event-bus-service.js';

export class ServicoPlano {
  constructor(
    private readonly repository: IRepositorioPlano,
    private readonly studentRepository: IRepositorioAluno,
    private readonly cacheService: IServicoCache = new ServicoCacheNulo(),
    private readonly eventBus: IServicoEventos = new ServicoEventosNulo(),
  ) {}

  // Lista planos respeitando o dono da conta e os filtros escolhidos.
  list(
    ownerId: string,
    page: number,
    pageSize: number,
    skip: number,
    filters?: { search?: string; status?: StatusPlano },
  ) {
    return this.cacheService.remember(
      chaveCache(ownerId, 'planos:listagem', { page, pageSize, skip, search: filters?.search ?? '', status: filters?.status ?? '' }),
      () => this.repository.list({ ownerId, page, pageSize, skip, ...filters }),
    );
  }

  // Cria plano para o gestor autenticado.
  async create(ownerId: string, input: EntradaPlano) {
    const plan = await this.repository.create(ownerId, input);
    await this.registrarEscrita(ownerId, 'plano.criado', plan.id);
    return plan;
  }

  // Reaproveita a validacao de existencia para consulta direta.
  async getById(ownerId: string, id: string) {
    return this.ensureExists(ownerId, id);
  }

  // Atualiza somente depois de confirmar que o plano pertence ao usuario.
  async update(ownerId: string, id: string, input: EntradaPlano) {
    await this.ensureExists(ownerId, id);
    const plan = await this.repository.update(ownerId, id, input);
    await this.registrarEscrita(ownerId, 'plano.atualizado', plan.id);
    return plan;
  }

  // Evita excluir plano que ainda possui alunos vinculados.
  async delete(ownerId: string, id: string) {
    const resource = await this.ensureExists(ownerId, id);
    const linkedStudents = await this.studentRepository.contarPorPlano(ownerId, resource.id);

    if (linkedStudents > 0) {
      throw new AppError(409, 'Nao e possivel excluir um plano vinculado a alunos.');
    }

    await this.repository.delete(ownerId, id);
    await this.registrarEscrita(ownerId, 'plano.removido', id);
  }

  // Garante que a regra de propriedade seja aplicada em consulta, edicao e exclusao.
  async ensureExists(ownerId: string, id: string) {
    const resource = await this.repository.findById(ownerId, id);
    if (!resource) {
      throw new AppError(404, 'Plano nao encontrado.');
    }
    return resource;
  }

  private async registrarEscrita(ownerId: string, type: string, entityId: string) {
    await Promise.all([
      this.cacheService.deleteByPattern(padraoCacheDono(ownerId)),
      this.eventBus.publish({ type, ownerId, actorId: ownerId, entityId }),
    ]);
  }
}
