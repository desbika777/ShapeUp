import type { WorkoutInput, WorkoutLevel } from '@shapeup/shared';
import { AppError } from '../core/app-error.js';
import type { IStudentRepository, IWorkoutRepository } from '../repositories/interfaces.js';

export class WorkoutService {
  constructor(
    private readonly workoutRepository: IWorkoutRepository,
    private readonly studentRepository: IStudentRepository,
  ) {}

  list(
    ownerId: string,
    page: number,
    pageSize: number,
    skip: number,
    filters?: { search?: string; level?: WorkoutLevel; studentId?: string },
  ) {
    return this.workoutRepository.list({ ownerId, page, pageSize, skip, ...filters });
  }

  async create(ownerId: string, input: WorkoutInput) {
    await this.validate(ownerId, input);
    return this.workoutRepository.create(ownerId, input);
  }

  async getById(ownerId: string, id: string) {
    return this.ensureExists(ownerId, id);
  }

  async update(ownerId: string, id: string, input: WorkoutInput) {
    await this.ensureExists(ownerId, id);
    await this.validate(ownerId, input);
    return this.workoutRepository.update(ownerId, id, input);
  }

  async delete(ownerId: string, id: string) {
    await this.ensureExists(ownerId, id);
    await this.workoutRepository.delete(ownerId, id);
  }

  async ensureExists(ownerId: string, id: string) {
    const workout = await this.workoutRepository.findById(ownerId, id);
    if (!workout) {
      throw new AppError(404, 'Treino nao encontrado.');
    }
    return workout;
  }

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
