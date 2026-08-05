// Service de planos: aplica regras antes de acessar o repositorio.
import type { PlanInput, PlanStatus } from '@shape/shared';
import { AppError } from '../core/app-error.js';
import type { IPlanRepository, IStudentRepository } from '../repositories/interfaces.js';

export class PlanService {
  constructor(
    private readonly repository: IPlanRepository,
    private readonly studentRepository: IStudentRepository,
  ) {}

  // Lista planos respeitando o dono da conta e os filtros escolhidos.
  list(
    ownerId: string,
    page: number,
    pageSize: number,
    skip: number,
    filters?: { search?: string; status?: PlanStatus },
  ) {
    return this.repository.list({ ownerId, page, pageSize, skip, ...filters });
  }

  // Cria plano para o gestor autenticado.
  create(ownerId: string, input: PlanInput) {
    return this.repository.create(ownerId, input);
  }

  // Reaproveita a validacao de existencia para consulta direta.
  async getById(ownerId: string, id: string) {
    return this.ensureExists(ownerId, id);
  }

  // Atualiza somente depois de confirmar que o plano pertence ao usuario.
  async update(ownerId: string, id: string, input: PlanInput) {
    await this.ensureExists(ownerId, id);
    return this.repository.update(ownerId, id, input);
  }

  // Evita excluir plano que ainda possui alunos vinculados.
  async delete(ownerId: string, id: string) {
    const resource = await this.ensureExists(ownerId, id);
    const linkedStudents = await this.studentRepository.countByPlan(ownerId, resource.id);

    if (linkedStudents > 0) {
      throw new AppError(409, 'Nao e possivel excluir um plano vinculado a alunos.');
    }

    await this.repository.delete(ownerId, id);
  }

  // Garante que a regra de propriedade seja aplicada em consulta, edicao e exclusao.
  async ensureExists(ownerId: string, id: string) {
    const resource = await this.repository.findById(ownerId, id);
    if (!resource) {
      throw new AppError(404, 'Plano nao encontrado.');
    }
    return resource;
  }
}
