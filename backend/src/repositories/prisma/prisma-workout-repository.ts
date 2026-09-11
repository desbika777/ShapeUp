// Repositorio Prisma dos treinos: consulta e grava prescricoes vinculadas a alunos.
import type { RespostaPaginada, Treino, EntradaTreino } from '@shape/shared';
import type { IRepositorioTreino, ParametrosListagemTreinos } from '../interfaces.js';
import { prisma } from '../../lib/prisma.js';

function meta(totalItems: number, page: number, pageSize: number) {
  // Calcula os metadados usados pelo componente de paginacao.
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
  };
}

function mapearTreino(workout: {
  id: string;
  studentId: string;
  title: string;
  objective: string;
  level: Treino['level'];
  notes: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  aluno?: { name: string };
}): Treino {
  // Inclui nome do aluno quando a consulta traz o relacionamento.
  return {
    id: workout.id,
    studentId: workout.studentId,
    studentName: workout.aluno?.name,
    title: workout.title,
    objective: workout.objective,
    level: workout.level,
    notes: workout.notes,
    startDate: workout.startDate.toISOString(),
    endDate: workout.endDate.toISOString(),
    createdAt: workout.createdAt.toISOString(),
    updatedAt: workout.updatedAt.toISOString(),
  };
}

export class RepositorioPrismaTreino implements IRepositorioTreino {
  async list(params: ParametrosListagemTreinos): Promise<RespostaPaginada<Treino>> {
    const rawSearch = params.search?.trim();

    // Busca por titulo, objetivo ou nome do aluno, alem de filtros por nivel/aluno.
    const where = {
      ownerId: params.ownerId,
      ...(params.level ? { level: params.level } : {}),
      ...(params.studentId ? { studentId: params.studentId } : {}),
      ...(rawSearch ? {
        OR: [
          { title: { contains: rawSearch } },
          { objective: { contains: rawSearch } },
          { aluno: { name: { contains: rawSearch } } },
        ],
      } : {}),
    };

    const [items, totalItems] = await Promise.all([
      prisma.treino.findMany({
        skip: params.skip,
        take: params.pageSize,
        where,
        include: { aluno: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.treino.count({ where }),
    ]);

    return { data: items.map(mapearTreino), meta: meta(totalItems, params.page, params.pageSize) };
  }

  async create(ownerId: string, input: EntradaTreino) {
    // Datas chegam do formulario como string e sao convertidas para Date no Prisma.
    const created = await prisma.treino.create({
      data: {
        ownerId,
        ...input,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
      },
      include: { aluno: true },
    });
    return mapearTreino(created);
  }

  async findById(ownerId: string, id: string) {
    const workout = await prisma.treino.findFirst({ where: { id, ownerId }, include: { aluno: true } });
    return workout ? mapearTreino(workout) : null;
  }

  async update(_ownerId: string, id: string, input: EntradaTreino) {
    const updated = await prisma.treino.update({
      where: { id },
      data: {
        ...input,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
      },
      include: { aluno: true },
    });
    return mapearTreino(updated);
  }

  async delete(_ownerId: string, id: string) {
    await prisma.treino.delete({ where: { id } });
  }

  async contarTodos(ownerId: string) {
    return prisma.treino.count({ where: { ownerId } });
  }

  async contarPorNivel(ownerId: string) {
    // Agrupamento usado no grafico de treinos por nivel.
    const grouped = await prisma.treino.groupBy({
      by: ['level'],
      where: { ownerId },
      _count: { _all: true },
    });
    return grouped.map((item) => ({ level: item.level, workouts: item._count._all }));
  }
}
