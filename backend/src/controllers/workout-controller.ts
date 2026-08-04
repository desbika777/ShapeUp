// Controller dos treinos: expõe as operacoes de prescricao pela API.
import type { Request, Response } from 'express';
import { workoutListSchema, workoutSchema } from '../services/schemas.js';
import { WorkoutService } from '../services/workout-service.js';
import { getPagination } from '../utils/pagination.js';
import type { AuthenticatedRequest } from '../middlewares/auth-middleware.js';

function routeId(request: Request) {
  // Normaliza o id vindo da rota para evitar tratamentos repetidos.
  return Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
}

export class WorkoutController {
  constructor(private readonly service: WorkoutService) {}

  // Lista treinos com filtro por texto, nivel e aluno.
  list = async (request: AuthenticatedRequest, response: Response) => {
    const query = workoutListSchema.parse(request.query);
    const pagination = getPagination(query.page, query.pageSize);
    const result = await this.service.list(request.userId ?? '', pagination.page, pagination.pageSize, pagination.skip, {
      search: query.search,
      level: query.level,
      studentId: query.studentId,
    });
    return response.status(200).json(result);
  };

  // Busca treino especifico pertencente ao usuario logado.
  getById = async (request: AuthenticatedRequest, response: Response) => {
    const result = await this.service.getById(request.userId ?? '', routeId(request));
    return response.status(200).json(result);
  };

  // Cria um treino para um aluno ja cadastrado.
  create = async (request: AuthenticatedRequest, response: Response) => {
    const payload = workoutSchema.parse(request.body);
    const result = await this.service.create(request.userId ?? '', payload);
    return response.status(201).json(result);
  };

  // Atualiza informacoes do treino e periodo de execucao.
  update = async (request: AuthenticatedRequest, response: Response) => {
    const payload = workoutSchema.parse(request.body);
    const result = await this.service.update(request.userId ?? '', routeId(request), payload);
    return response.status(200).json(result);
  };

  // Exclui treino quando o usuario confirma a acao.
  delete = async (request: AuthenticatedRequest, response: Response) => {
    await this.service.delete(request.userId ?? '', routeId(request));
    return response.status(204).send();
  };
}
