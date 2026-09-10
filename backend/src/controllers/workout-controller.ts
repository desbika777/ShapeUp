// Controlador dos treinos: expoe as operacoes de prescricao pela API.
import type { Response } from 'express';
import { workoutListSchema, workoutSchema } from '../services/schemas.js';
import { ServicoTreino } from '../services/workout-service.js';
import { obterParametroRota } from '../utils/http.js';
import { obterPaginacao } from '../utils/pagination.js';
import type { RequisicaoAutenticada } from '../middlewares/auth-middleware.js';

export class ControladorTreino {
  constructor(private readonly service: ServicoTreino) {}

  // Lista treinos com filtro por texto, nivel e aluno.
  list = async (request: RequisicaoAutenticada, response: Response) => {
    const query = workoutListSchema.parse(request.query);
    const pagination = obterPaginacao(query.page, query.pageSize);
    const result = await this.service.list(request.userId ?? '', pagination.page, pagination.pageSize, pagination.skip, {
      search: query.search,
      level: query.level,
      studentId: query.studentId,
    });
    return response.status(200).json(result);
  };

  // Busca treino especifico pertencente ao usuario logado.
  getById = async (request: RequisicaoAutenticada, response: Response) => {
    const result = await this.service.getById(request.userId ?? '', obterParametroRota(request, 'id'));
    return response.status(200).json(result);
  };

  // Cria um treino para um aluno ja cadastrado.
  create = async (request: RequisicaoAutenticada, response: Response) => {
    const payload = workoutSchema.parse(request.body);
    const result = await this.service.create(request.userId ?? '', payload);
    return response.status(201).json(result);
  };

  // Atualiza informacoes do treino e periodo de execucao.
  update = async (request: RequisicaoAutenticada, response: Response) => {
    const payload = workoutSchema.parse(request.body);
    const result = await this.service.update(request.userId ?? '', obterParametroRota(request, 'id'), payload);
    return response.status(200).json(result);
  };

  // Exclui treino quando o usuario confirma a acao.
  delete = async (request: RequisicaoAutenticada, response: Response) => {
    await this.service.delete(request.userId ?? '', obterParametroRota(request, 'id'));
    return response.status(204).send();
  };
}
