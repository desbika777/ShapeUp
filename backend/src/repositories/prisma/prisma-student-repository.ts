// Repositorio Prisma dos alunos: concentra consultas e gravacoes da carteira de alunos.
import type { IndicadoresPainel, RespostaPaginada, Aluno, EntradaAluno } from '@shape/shared';
import type { IRepositorioAluno, ParametrosListagemAlunos } from '../interfaces.js';
import { prisma } from '../../lib/prisma.js';

function meta(totalItems: number, page: number, pageSize: number) {
  // Mantem o formato de paginacao igual ao restante da API.
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
  };
}

function mapearAluno(student: {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: Date;
  goal: string;
  status: Aluno['status'];
  planId: string;
  createdAt: Date;
  updatedAt: Date;
  plano?: { name: string };
}): Aluno {
  // Adapta datas e relacionamento do plano para o contrato compartilhado com o frontend.
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    cpf: student.cpf,
    phone: student.phone,
    birthDate: student.birthDate.toISOString(),
    goal: student.goal,
    status: student.status,
    planId: student.planId,
    planName: student.plano?.name,
    createdAt: student.createdAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
  };
}

export class RepositorioPrismaAluno implements IRepositorioAluno {
  async list(params: ParametrosListagemAlunos): Promise<RespostaPaginada<Aluno>> {
    const rawSearch = params.search?.trim();
    const cpfDigits = rawSearch ? rawSearch.replace(/\D/g, '') : '';

    // Permite buscar aluno por nome, e-mail ou CPF digitado com/sem pontuacao.
    const where = {
      ownerId: params.ownerId,
      ...(params.status ? { status: params.status } : {}),
      ...(params.planId ? { planId: params.planId } : {}),
      ...(rawSearch ? {
        OR: [
          { name: { contains: rawSearch } },
          { email: { contains: rawSearch } },
          ...(cpfDigits ? [{ cpf: { contains: cpfDigits } }] : []),
        ],
      } : {}),
    };

    // Carrega o plano junto para exibir o nome na tabela de alunos.
    const [items, totalItems] = await Promise.all([
      prisma.aluno.findMany({
        skip: params.skip,
        take: params.pageSize,
        where,
        include: { plano: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.aluno.count({ where }),
    ]);

    return { data: items.map(mapearAluno), meta: meta(totalItems, params.page, params.pageSize) };
  }

  async create(ownerId: string, input: EntradaAluno) {
    const created = await prisma.aluno.create({
      data: {
        ownerId,
        ...input,
        birthDate: new Date(input.birthDate),
      },
      include: { plano: true },
    });
    return mapearAluno(created);
  }

  async findById(ownerId: string, id: string) {
    const student = await prisma.aluno.findFirst({ where: { id, ownerId }, include: { plano: true } });
    return student ? mapearAluno(student) : null;
  }

  async findByEmail(ownerId: string, email: string) {
    const student = await prisma.aluno.findUnique({
      where: { ownerId_email: { ownerId, email } },
      include: { plano: true },
    });
    return student ? mapearAluno(student) : null;
  }

  async findByCpf(ownerId: string, cpf: string) {
    const student = await prisma.aluno.findUnique({
      where: { ownerId_cpf: { ownerId, cpf } },
      include: { plano: true },
    });
    return student ? mapearAluno(student) : null;
  }

  async update(_ownerId: string, id: string, input: EntradaAluno) {
    const updated = await prisma.aluno.update({
      where: { id },
      data: { ...input, birthDate: new Date(input.birthDate) },
      include: { plano: true },
    });
    return mapearAluno(updated);
  }

  async delete(_ownerId: string, id: string) {
    await prisma.aluno.delete({ where: { id } });
  }

  async contarTodos(ownerId: string) {
    return prisma.aluno.count({ where: { ownerId } });
  }

  async contarPorPlano(ownerId: string, planId: string) {
    return prisma.aluno.count({ where: { ownerId, planId } });
  }

  async contarNovosNoMesAtual(ownerId: string) {
    // Indicador do dashboard para acompanhar entrada de alunos no mes atual.
    const now = new Date();
    return prisma.aluno.count({
      where: {
        ownerId,
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      },
    });
  }

  async buscarRecentes(ownerId: string, limit: number): Promise<IndicadoresPainel['recentStudents']> {
    // Lista os alunos mais recentes para o painel inicial.
    const students = await prisma.aluno.findMany({
      where: { ownerId },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return students.map((student) => ({
      id: student.id,
      name: student.name,
      goal: student.goal,
      status: student.status,
      createdAt: student.createdAt.toISOString(),
    }));
  }
}
