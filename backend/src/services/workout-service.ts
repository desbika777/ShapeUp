// Service de treinos: valida aluno e periodo antes da persistencia.
import type { WorkoutInput, WorkoutLevel } from '@shape/shared';
import { AppError } from '../core/app-error.js';
import type { IStudentRepository, IWorkoutRepository } from '../repositories/interfaces.js';

export class WorkoutService {
  constructor(
    private readonly workoutRepository: IWorkoutRepository,
    private readonly studentRepository: IStudentRepository,
  ) {}

  // Lista treinos usando filtros de busca, nivel e aluno.
  list(
    ownerId: string,
    page: number,
    pageSize: number,
    skip: number,
    filters?: { search?: string; level?: WorkoutLevel; studentId?: string },
  ) {
    return this.workoutRepository.list({ ownerId, page, pageSize, skip, ...filters });
  }

  // Cria treino somente se o aluno informado existir.
  async create(ownerId: string, input: WorkoutInput) {
    await this.validate(ownerId, input);
    return this.workoutRepository.create(ownerId, input);
  }

  // Busca treino do usuario logado.
  async getById(ownerId: string, id: string) {
    return this.ensureExists(ownerId, id);
  }

  // Atualiza treino apos validar propriedade e datas.
  async update(ownerId: string, id: string, input: WorkoutInput) {
    await this.ensureExists(ownerId, id);
    await this.validate(ownerId, input);
    return this.workoutRepository.update(ownerId, id, input);
  }

  // Exclui treino depois de confirmar existencia.
  async delete(ownerId: string, id: string) {
    await this.ensureExists(ownerId, id);
    await this.workoutRepository.delete(ownerId, id);
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
  private async validate(ownerId: string, input: WorkoutInput) {
    const student = await this.studentRepository.findById(ownerId, input.studentId);
    if (!student) {
      throw new AppError(400, 'Selecione um aluno valido para o treino.');
    }

    if (new Date(input.endDate) < new Date(input.startDate)) {
      throw new AppError(400, 'A data final nao pode ser anterior a data inicial.');
    }
  }
}
