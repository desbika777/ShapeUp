// Controlador dos alunos: entrada HTTP para cadastro, consulta, edicao e exclusao.
import type { Request, Response } from 'express';
import { studentListSchema, studentSchema } from '../services/schemas.js';
import { ServicoAluno } from '../services/student-service.js';
import { obterPaginacao } from '../utils/pagination.js';
import type { RequisicaoAutenticada } from '../middlewares/auth-middleware.js';

function routeId(request: Request) {
  // Normaliza o parametro id para simplificar as chamadas do service.
  return Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
}

export class ControladorAluno {
  constructor(private readonly service: ServicoAluno) {}

  // Lista alunos com busca por nome, e-mail, CPF, status e plano.
  list = async (request: RequisicaoAutenticada, response: Response) => {
    const query = studentListSchema.parse(request.query);
    const pagination = obterPaginacao(query.page, query.pageSize);
    const result = await this.service.list(request.userId ?? '', pagination.page, pagination.pageSize, pagination.skip, {
      search: query.search,
      status: query.status,
      planId: query.planId,
    });
    return response.status(200).json(result);
  };

  // Busca os dados completos de um aluno.
  getById = async (request: RequisicaoAutenticada, response: Response) => {
    const result = await this.service.getById(request.userId ?? '', routeId(request));
    return response.status(200).json(result);
  };

  // Cadastra aluno vinculado a um plano valido.
  create = async (request: RequisicaoAutenticada, response: Response) => {
    const payload = studentSchema.parse(request.body);
    const result = await this.service.create(request.userId ?? '', payload);
    return response.status(201).json(result);
  };

  // Atualiza cadastro do aluno mantendo as regras de CPF/e-mail.
  update = async (request: RequisicaoAutenticada, response: Response) => {
    const payload = studentSchema.parse(request.body);
    const result = await this.service.update(request.userId ?? '', routeId(request), payload);
    return response.status(200).json(result);
  };

  // Remove aluno da carteira do gestor.
  delete = async (request: RequisicaoAutenticada, response: Response) => {
    await this.service.delete(request.userId ?? '', routeId(request));
    return response.status(204).send();
  };
}
