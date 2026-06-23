import type { DashboardMetrics, PaginatedResponse, Student, StudentInput } from '@shapeup/shared';
import type { IStudentRepository, StudentListParams } from '../interfaces.js';
import { prisma } from '../../lib/prisma.js';

function meta(totalItems: number, page: number, pageSize: number) {
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
  };
}

function mapStudent(student: {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: Date;
  goal: string;
  status: Student['status'];
  planId: string;
  createdAt: Date;
  updatedAt: Date;
  plan?: { name: string };
}): Student {
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
    planName: student.plan?.name,
    createdAt: student.createdAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
  };
}

export class PrismaStudentRepository implements IStudentRepository {
  async list(params: StudentListParams): Promise<PaginatedResponse<Student>> {
    const rawSearch = params.search?.trim();
    const cpfDigits = rawSearch ? rawSearch.replace(/\D/g, '') : '';

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

    const [items, totalItems] = await Promise.all([
      prisma.student.findMany({
        skip: params.skip,
        take: params.pageSize,
        where,
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.student.count({ where }),
    ]);

    return { data: items.map(mapStudent), meta: meta(totalItems, params.page, params.pageSize) };
  }

  async create(ownerId: string, input: StudentInput) {
    const created = await prisma.student.create({
      data: {
        ownerId,
        ...input,
        birthDate: new Date(input.birthDate),
      },
      include: { plan: true },
    });
    return mapStudent(created);
  }

  async findById(ownerId: string, id: string) {
    const student = await prisma.student.findFirst({ where: { id, ownerId }, include: { plan: true } });
    return student ? mapStudent(student) : null;
  }

  async findByEmail(ownerId: string, email: string) {
    const student = await prisma.student.findUnique({
      where: { ownerId_email: { ownerId, email } },
      include: { plan: true },
    });
    return student ? mapStudent(student) : null;
  }

  async findByCpf(ownerId: string, cpf: string) {
    const student = await prisma.student.findUnique({
      where: { ownerId_cpf: { ownerId, cpf } },
      include: { plan: true },
    });
    return student ? mapStudent(student) : null;
  }

  async update(_ownerId: string, id: string, input: StudentInput) {
    const updated = await prisma.student.update({
      where: { id },
      data: { ...input, birthDate: new Date(input.birthDate) },
      include: { plan: true },
    });
    return mapStudent(updated);
  }

  async delete(_ownerId: string, id: string) {
    await prisma.student.delete({ where: { id } });
  }

  async countAll(ownerId: string) {
    return prisma.student.count({ where: { ownerId } });
  }

  async countByPlan(ownerId: string, planId: string) {
    return prisma.student.count({ where: { ownerId, planId } });
  }

  async countNewInCurrentMonth(ownerId: string) {
    const now = new Date();
    return prisma.student.count({
      where: {
        ownerId,
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      },
    });
  }

  async findRecent(ownerId: string, limit: number): Promise<DashboardMetrics['recentStudents']> {
    const students = await prisma.student.findMany({
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
