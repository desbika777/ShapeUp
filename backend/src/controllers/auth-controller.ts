import type { Request, Response } from 'express';
import { AuthService } from '../services/auth-service.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateUserSchema,
} from '../services/schemas.js';
import type { AuthenticatedRequest } from '../middlewares/auth-middleware.js';

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = async (request: Request, response: Response) => {
    const payload = registerSchema.parse(request.body);
    const result = await this.service.register(payload);
    return response.status(201).json(result);
  };

  login = async (request: Request, response: Response) => {
    const payload = loginSchema.parse(request.body);
    const result = await this.service.login(payload);
    return response.status(200).json(result);
  };

  forgotPassword = async (request: Request, response: Response) => {
    const payload = forgotPasswordSchema.parse(request.body);
    const result = await this.service.requestPasswordReset(payload);
    return response.status(200).json(result);
  };

  resetPassword = async (request: Request, response: Response) => {
    const payload = resetPasswordSchema.parse(request.body);
    const result = await this.service.resetPassword(payload);
    return response.status(200).json(result);
  };

  me = async (request: AuthenticatedRequest, response: Response) => {
    const result = await this.service.getCurrentUser(request.userId ?? '');
    return response.status(200).json(result);
  };

  update = async (request: AuthenticatedRequest, response: Response) => {
    const payload = updateUserSchema.parse(request.body);
    const result = await this.service.updateProfile(request.userId ?? '', payload);
    return response.status(200).json(result);
  };
}
