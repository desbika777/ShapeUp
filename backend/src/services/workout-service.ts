// Servico de treinos: valida aluno e periodo antes da persistencia.
import type { EntradaTreino, NivelTreino } from '@shape/shared';
import { AppError } from '../core/app-error.js';
import type { IRepositorioAluno, IRepositorioTreino } from '../repositories/interfaces.js';
import { chaveCache, padraoCacheDono, type IServicoCache, ServicoCacheNulo } from './cache-service.js';
import { ServicoEventosNulo, type IServicoEventos } from './event-bus-service.js';

export class ServicoTreino {
  constructor(
    private readonly workoutRepository: IRepositorioTreino,
    private readonly studentRepository: IRepositorioAluno,
    private readonly cacheService: IServicoCache = new ServicoCacheNulo(),
    private readonly eventBus: IServicoEventos = new ServicoEventosNulo(),
  ) {}

  // Lista treinos usando filtros de busca, nivel e aluno.
  list(
    ownerId: string,
    page: number,
    pageSize: number,
    skip: number,
    filters?: { search?: string; level?: NivelTreino; studentId?: string },
  ) {
    return this.cacheService.remember(
      chaveCache(ownerId, 'treinos:listagem', {
        page,
        pageSize,
        skip,
        search: filters?.search ?? '',
        level: filters?.level ?? '',
        studentId: filters?.studentId ?? '',
      }),
      () => this.workoutRepository.list({ ownerId, page, pageSize, skip, ...filters }),
    );
  }

  // Cria treino somente se o aluno informado existir.
  async create(ownerId: string, input: EntradaTreino) {
    await this.validate(ownerId, input);
    const workout = await this.workoutRepository.create(ownerId, input);
    await this.registrarEscrita(ownerId, 'treino.criado', workout.id);
    return workout;
  }

  // Busca treino do usuario logado.
  async getById(ownerId: string, id: string) {
    return this.ensureExists(ownerId, id);
  }

  // Atualiza treino apos validar propriedade e datas.
  async update(ownerId: string, id: string, input: EntradaTreino) {
    await this.ensureExists(ownerId, id);
    await this.validate(ownerId, input);
    const workout = await this.workoutRepository.update(ownerId, id, input);
    await this.registrarEscrita(ownerId, 'treino.atualizado', workout.id);
    return workout;
  }

  // Exclui treino depois de confirmar existencia.
  async delete(ownerId: string, id: string) {
    await this.ensureExists(ownerId, id);
    await this.workoutRepository.delete(ownerId, id);
    await this.registrarEscrita(ownerId, 'treino.removido', id);
  }

  // Evita que um usuario acesse treino de outro dono.
  async ensureExists(ownerId: string, id: string) {
    const workout = await this.workoutRepository.findById(ownerId, id);
    if (!workout) {
      throw new AppError(404, 'Treino nao encontrado.');
    }
    return workout;
  }

  // Garante aluno valido e data final posterior ou igual a data inicial.
  private async validate(ownerId: string, input: EntradaTreino) {
    const student = await this.studentRepository.findById(ownerId, input.studentId);
    if (!student) {
      throw new AppError(400, 'Selecione um aluno valido para o treino.');
    }

    if (new Date(input.endDate) < new Date(input.startDate)) {
      throw new AppError(400, 'A data final nao pode ser anterior a data inicial.');
    }
  }

  private async registrarEscrita(ownerId: string, type: string, entityId: string) {
    await Promise.all([
      this.cacheService.deleteByPattern(padraoCacheDono(ownerId)),
      this.eventBus.publish({ type, ownerId, actorId: ownerId, entityId }),
    ]);
  }
}
