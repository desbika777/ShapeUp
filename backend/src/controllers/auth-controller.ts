// Controlador de autenticacao: recebe requisicoes HTTP e aciona o ServicoAutenticacao.
import type { Request, Response } from 'express';
import { ServicoAutenticacao } from '../services/auth-service.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateUserSchema,
} from '../services/schemas.js';
import type { RequisicaoAutenticada } from '../middlewares/auth-middleware.js';

export class ControladorAutenticacao {
  constructor(private readonly service: ServicoAutenticacao) {}

  // Cadastro cria o gestor e ja retorna token para entrar no sistema.
  register = async (request: Request, response: Response) => {
    const payload = registerSchema.parse(request.body);
    const result = await this.service.register(payload);
    return response.status(201).json(result);
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
}
