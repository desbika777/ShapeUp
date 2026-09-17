// Repositorio Prisma dos planos: traduz chamadas do service para consultas MySQL.
import type { RespostaPaginada, Plano, EntradaPlano } from '@shape/shared';
import type { IRepositorioPlano, ParametrosListagemPlanos } from '../interfaces.js';
import { prisma } from '../../lib/prisma.js';

function meta(totalItems: number, page: number, pageSize: number) {
  // Monta informacoes de paginacao devolvidas junto com a lista.
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
  };
}

function mapearPlano(plan: {
  id: string;
  name: string;
  description: string;
  price: { toNumber(): number };
  durationMonths: number;
  status: Plano['status'];
  createdAt: Date;
  updatedAt: Date;
}): Plano {
  // Converte Decimal/Data do Prisma para tipos simples usados no frontend.
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

export class RepositorioPrismaPlano implements IRepositorioPlano {
  async list(params: ParametrosListagemPlanos): Promise<RespostaPaginada<Plano>> {
    // Filtro dinamico: adiciona status e busca textual apenas quando vierem na URL.
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

    // Busca pagina e total em paralelo para montar resposta paginada.
    const [items, totalItems] = await Promise.all([
      prisma.plano.findMany({
        skip: params.skip,
        take: params.pageSize,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.plano.count({ where }),
    ]);

    return { data: items.map(mapearPlano), meta: meta(totalItems, params.page, params.pageSize) };
  }

  async create(ownerId: string, input: EntradaPlano) {
    const created = await prisma.plano.create({ data: { ownerId, ...input } });
    return mapearPlano(created);
  }

  async findById(ownerId: string, id: string) {
    const plan = await prisma.plano.findFirst({ where: { id, ownerId } });
    return plan ? mapearPlano(plan) : null;
  }

  async update(_ownerId: string, id: string, input: EntradaPlano) {
    const updated = await prisma.plano.update({ where: { id }, data: input });
    return mapearPlano(updated);
  }

  async delete(_ownerId: string, id: string) {
    await prisma.plano.delete({ where: { id } });
  }

  async contarAtivos(ownerId: string) {
    return prisma.plano.count({ where: { ownerId, status: 'ATIVO' } });
  }

  async contarAlunosPorPlano(ownerId: string) {
    // Usado no dashboard para mostrar quantos alunos existem em cada plano.
    const plans = await prisma.plano.findMany({
      where: { ownerId },
      include: { _count: { select: { alunos: true } } },
    });
    return plans.map((plan) => ({ name: plan.name, students: plan._count.alunos }));
  }
}
