import type { PlanInput, PlanStatus } from '@shapeup/shared';
import { AppError } from '../core/app-error.js';
import type { IPlanRepository, IStudentRepository } from '../repositories/interfaces.js';

export class PlanService {
  constructor(
    private readonly repository: IPlanRepository,
    private readonly studentRepository: IStudentRepository,
  ) {}

  list(
    ownerId: string,
    page: number,
    pageSize: number,
    skip: number,
    filters?: { search?: string; status?: PlanStatus },
  ) {
    return this.repository.list({ ownerId, page, pageSize, skip, ...filters });
  }

  create(ownerId: string, input: PlanInput) {
    return this.repository.create(ownerId, input);
  }

  async getById(ownerId: string, id: string) {
    return this.ensureExists(ownerId, id);
  }

  async update(ownerId: string, id: string, input: PlanInput) {
    await this.ensureExists(ownerId, id);
    return this.repository.update(ownerId, id, input);
  }

  async delete(ownerId: string, id: string) {
    const resource = await this.ensureExists(ownerId, id);
    const linkedStudents = await this.studentRepository.countByPlan(ownerId, resource.id);

    if (linkedStudents > 0) {
      throw new AppError(409, 'Nao e possivel excluir um plano vinculado a alunos.');
    }

    await this.repository.delete(ownerId, id);
  }

  async ensureExists(ownerId: string, id: string) {
    const resource = await this.repository.findById(ownerId, id);
    if (!resource) {
      throw new AppError(404, 'Plano nao encontrado.');
    }
    return resource;
  }
}
