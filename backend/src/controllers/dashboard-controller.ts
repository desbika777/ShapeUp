// Controller do dashboard: entrega indicadores consolidados para a tela inicial.
import type { Response } from 'express';
import { DashboardService } from '../services/dashboard-service.js';
import type { AuthenticatedRequest } from '../middlewares/auth-middleware.js';

export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  // Retorna metricas calculadas a partir de alunos, planos e treinos.
  getMetrics = async (request: AuthenticatedRequest, response: Response) => {
    const result = await this.service.getMetrics(request.userId ?? '');
    return response.status(200).json(result);
  };
}
