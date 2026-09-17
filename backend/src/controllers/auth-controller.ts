// Controlador de autenticacao: recebe requisicoes HTTP e aciona o ServicoAutenticacao.
import type { Request, Response } from 'express';
import { ServicoAutenticacao } from '../services/auth-service.js';
import {
  forgotPasswordSchema,
  loginSchema,
  createUserSchema,
  resetPasswordSchema,
  updateUserSchema,
} from '../services/schemas.js';
import type { RequisicaoAutenticada } from '../middlewares/auth-middleware.js';

export class ControladorAutenticacao {
  constructor(private readonly service: ServicoAutenticacao) {}

  // Cadastro publico fica fechado; novos clientes sao criados pela conta master.
  register = async (_request: Request, response: Response) => {
    return response.status(403).json({
      message: 'Cadastro publico desativado. O master Shape Up deve criar o acesso do cliente.',
    });
  };

  // Login valida credenciais e devolve usuario autenticado.
  login = async (request: Request, response: Response) => {
    const payload = loginSchema.parse(request.body);
    const result = await this.service.login(payload);
    return response.status(200).json(result);
  };

  // Solicita o fluxo de recuperacao de senha por e-mail.
  forgotPassword = async (request: Request, response: Response) => {
    const payload = forgotPasswordSchema.parse(request.body);
    const result = await this.service.requestPasswordReset(payload);
    return response.status(200).json(result);
  };

  // Recebe o token do link e grava a nova senha.
  resetPassword = async (request: Request, response: Response) => {
    const payload = resetPasswordSchema.parse(request.body);
    const result = await this.service.resetPassword(payload);
    return response.status(200).json(result);
  };

  // Retorna os dados do usuario dono do token.
  me = async (request: RequisicaoAutenticada, response: Response) => {
    const result = await this.service.getCurrentUser(request.userId ?? '');
    return response.status(200).json(result);
  };

  // Atualiza dados do perfil e permite troca de senha com senha atual.
  update = async (request: RequisicaoAutenticada, response: Response) => {
    const payload = updateUserSchema.parse(request.body);
    const result = await this.service.updateProfile(request.userId ?? '', payload);
    return response.status(200).json(result);
  };

  // Lista clientes cadastrados pelo master Shape Up.
  listUsers = async (_request: RequisicaoAutenticada, response: Response) => {
    const result = await this.service.listUsers();
    return response.status(200).json(result);
  };

  // Cria uma conta de cliente para o dono da academia.
  createUser = async (request: RequisicaoAutenticada, response: Response) => {
    const payload = createUserSchema.parse(request.body);
    const result = await this.service.createUser({ ...payload, perfil: 'ADMIN' });
    return response.status(201).json(result);
  };

  // Remove um cliente da plataforma.
  deleteUser = async (request: RequisicaoAutenticada, response: Response) => {
    await this.service.deleteUser(request.userId ?? '', String(request.params.id));
    return response.status(204).send();
  };
}
