// Controller dos planos: transforma parametros HTTP em chamadas de service.
import type { Request, Response } from 'express';
import { planListSchema, planSchema } from '../services/schemas.js';
import { getPagination } from '../utils/pagination.js';
import { PlanService } from '../services/plan-service.js';
import type { AuthenticatedRequest } from '../middlewares/auth-middleware.js';

function routeId(request: Request) {
  // Garante que o id da URL chegue como string mesmo se o Express entregar array.
  return Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
}

export class PlanController {
  constructor(private readonly service: PlanService) {}

  // Lista planos com filtros e paginacao.
  list = async (request: AuthenticatedRequest, response: Response) => {
    const query = planListSchema.parse(request.query);
    const pagination = getPagination(query.page, query.pageSize);
    const result = await this.service.list(request.userId ?? '', pagination.page, pagination.pageSize, pagination.skip, {
      search: query.search,
      status: query.status,
    });
    return response.status(200).json(result);
  };

  // Busca um plano especifico do usuario logado.
  getById = async (request: AuthenticatedRequest, response: Response) => {
    const result = await this.service.getById(request.userId ?? '', routeId(request));
    return response.status(200).json(result);
  };

  // Cria um novo plano comercial.
  create = async (request: AuthenticatedRequest, response: Response) => {
    const payload = planSchema.parse(request.body);
    const result = await this.service.create(request.userId ?? '', payload);
    return response.status(201).json(result);
  };

  // Atualiza plano existente.
  update = async (request: AuthenticatedRequest, response: Response) => {
    const payload = planSchema.parse(request.body);
    const result = await this.service.update(request.userId ?? '', routeId(request), payload);
    return response.status(200).json(result);
  };

  // Remove plano quando nao ha alunos vinculados.
  delete = async (request: AuthenticatedRequest, response: Response) => {
    await this.service.delete(request.userId ?? '', routeId(request));
    return response.status(204).send();
  };
}
