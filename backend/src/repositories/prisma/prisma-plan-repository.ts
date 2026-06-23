import type { PaginatedResponse, Plan, PlanInput } from '@shapeup/shared';
import type { IPlanRepository, PlanListParams } from '../interfaces.js';
import { prisma } from '../../lib/prisma.js';

function meta(totalItems: number, page: number, pageSize: number) {
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
  };
}

function mapPlan(plan: {
  id: string;
  name: string;
  description: string;
  price: { toNumber(): number };
  durationMonths: number;
  status: Plan['status'];
  createdAt: Date;
  updatedAt: Date;
}): Plan {
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price: plan.price.toNumber(),
    durationMonths: plan.durationMonths,
    status: plan.status,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
  };
}

export class PrismaPlanRepository implements IPlanRepository {
  async list(params: PlanListParams): Promise<PaginatedResponse<Plan>> {
    const where = {
      ownerId: params.ownerId,
      ...(params.status ? { status: params.status } : {}),
      ...(params.search ? {
        OR: [
          { name: { contains: params.search } },
          { description: { contains: params.search } },
        ],
      } : {}),
    };

    const [items, totalItems] = await Promise.all([
      prisma.plan.findMany({
        skip: params.skip,
        take: params.pageSize,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.plan.count({ where }),
    ]);

    return { data: items.map(mapPlan), meta: meta(totalItems, params.page, params.pageSize) };
  }

  async create(ownerId: string, input: PlanInput) {
    const created = await prisma.plan.create({ data: { ownerId, ...input } });
    return mapPlan(created);
  }

  async findById(ownerId: string, id: string) {
    const plan = await prisma.plan.findFirst({ where: { id, ownerId } });
    return plan ? mapPlan(plan) : null;
  }

  async update(_ownerId: string, id: string, input: PlanInput) {
    const updated = await prisma.plan.update({ where: { id }, data: input });
    return mapPlan(updated);
  }

  async delete(_ownerId: string, id: string) {
    await prisma.plan.delete({ where: { id } });
  }

  async countActive(ownerId: string) {
    return prisma.plan.count({ where: { ownerId, status: 'ACTIVE' } });
  }

  async countStudentsByPlan(ownerId: string) {
    const plans = await prisma.plan.findMany({
      where: { ownerId },
      include: { _count: { select: { students: true } } },
    });
    return plans.map((plan) => ({ name: plan.name, students: plan._count.students }));
  }
}
