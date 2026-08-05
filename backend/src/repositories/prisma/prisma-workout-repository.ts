// Repositorio Prisma dos treinos: consulta e grava prescricoes vinculadas a alunos.
import type { PaginatedResponse, Workout, WorkoutInput } from '@shape/shared';
import type { IWorkoutRepository, WorkoutListParams } from '../interfaces.js';
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

function mapWorkout(workout: {
  id: string;
  studentId: string;
  title: string;
  objective: string;
  level: Workout['level'];
  notes: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  student?: { name: string };
}): Workout {
  // Inclui nome do aluno quando a consulta traz o relacionamento.
  return {
    id: workout.id,
    studentId: workout.studentId,
    studentName: workout.student?.name,
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

export class PrismaWorkoutRepository implements IWorkoutRepository {
  async list(params: WorkoutListParams): Promise<PaginatedResponse<Workout>> {
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
          { student: { name: { contains: rawSearch } } },
        ],
      } : {}),
    };

    const [items, totalItems] = await Promise.all([
      prisma.workout.findMany({
        skip: params.skip,
        take: params.pageSize,
        where,
        include: { student: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.workout.count({ where }),
    ]);

    return { data: items.map(mapWorkout), meta: meta(totalItems, params.page, params.pageSize) };
  }

  async create(ownerId: string, input: WorkoutInput) {
    // Datas chegam do formulario como string e sao convertidas para Date no Prisma.
    const created = await prisma.workout.create({
      data: {
        ownerId,
        ...input,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
      },
      include: { student: true },
    });
    return mapWorkout(created);
  }

  async findById(ownerId: string, id: string) {
    const workout = await prisma.workout.findFirst({ where: { id, ownerId }, include: { student: true } });
    return workout ? mapWorkout(workout) : null;
  }

  async update(_ownerId: string, id: string, input: WorkoutInput) {
    const updated = await prisma.workout.update({
      where: { id },
      data: {
        ...input,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
      },
      include: { student: true },
    });
    return mapWorkout(updated);
  }

  async delete(_ownerId: string, id: string) {
    await prisma.workout.delete({ where: { id } });
  }

  async countAll(ownerId: string) {
    return prisma.workout.count({ where: { ownerId } });
  }

  async countByLevel(ownerId: string) {
    // Agrupamento usado no grafico de treinos por nivel.
    const grouped = await prisma.workout.groupBy({
      by: ['level'],
      where: { ownerId },
      _count: { _all: true },
    });
    return grouped.map((item) => ({ level: item.level, workouts: item._count._all }));
  }
}
