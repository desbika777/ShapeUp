// Service de alunos: valida dados cadastrais e vinculo com plano.
import type { StudentInput, StudentStatus } from '@shapeup/shared';
import { AppError } from '../core/app-error.js';
import type { IPlanRepository, IStudentRepository } from '../repositories/interfaces.js';
import { isValidCpf, isValidEmail, normalizeCpf } from '../utils/validators.js';

export class StudentService {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly planRepository: IPlanRepository,
  ) {}

  // Lista alunos do gestor com filtros combinados.
  list(
    ownerId: string,
    page: number,
    pageSize: number,
    skip: number,
    filters?: { search?: string; status?: StudentStatus; planId?: string },
  ) {
    return this.studentRepository.list({ ownerId, page, pageSize, skip, ...filters });
  }

  // Cadastra aluno apos normalizar CPF/e-mail e confirmar plano valido.
  async create(ownerId: string, input: StudentInput) {
    await this.validate(ownerId, input);
    return this.studentRepository.create(ownerId, { ...input, email: input.email.toLowerCase(), cpf: normalizeCpf(input.cpf) });
  }

  // Busca aluno respeitando o dono da conta.
  async getById(ownerId: string, id: string) {
    return this.ensureExists(ownerId, id);
  }

  // Atualiza aluno sem permitir duplicidade de CPF/e-mail.
  async update(ownerId: string, id: string, input: StudentInput) {
    await this.ensureExists(ownerId, id);
    await this.validate(ownerId, input, id);
    return this.studentRepository.update(ownerId, id, { ...input, email: input.email.toLowerCase(), cpf: normalizeCpf(input.cpf) });
  }

  // Remove aluno depois de confirmar que ele existe para o usuario.
  async delete(ownerId: string, id: string) {
    await this.ensureExists(ownerId, id);
    await this.studentRepository.delete(ownerId, id);
  }

  // Centraliza a verificacao de existencia e propriedade do aluno.
  async ensureExists(ownerId: string, id: string) {
    const student = await this.studentRepository.findById(ownerId, id);
    if (!student) {
      throw new AppError(404, 'Aluno nao encontrado.');
    }
    return student;
  }

  // Regras de negocio do cadastro de aluno: e-mail, CPF, plano e duplicidades.
  private async validate(ownerId: string, input: StudentInput, currentId?: string) {
    if (!isValidEmail(input.email)) {
      throw new AppError(400, 'Informe um e-mail valido para o aluno.');
    }

    if (!isValidCpf(input.cpf)) {
      throw new AppError(400, 'Informe um CPF valido para o aluno.');
    }

    const plan = await this.planRepository.findById(ownerId, input.planId);
    if (!plan) {
      throw new AppError(400, 'Selecione um plano valido para o aluno.');
    }

    const normalizedCpf = normalizeCpf(input.cpf);
    const [emailOwner, cpfOwner] = await Promise.all([
      this.studentRepository.findByEmail(ownerId, input.email.toLowerCase()),
      this.studentRepository.findByCpf(ownerId, normalizedCpf),
    ]);

    if (emailOwner && emailOwner.id !== currentId) {
      throw new AppError(409, 'Ja existe um aluno com este e-mail.');
    }

    if (cpfOwner && cpfOwner.id !== currentId) {
      throw new AppError(409, 'Ja existe um aluno com este CPF.');
    }
  }
}
