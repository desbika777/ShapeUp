// Controlador do dashboard: entrega indicadores consolidados para a tela inicial.
import type { Response } from 'express';
import { ServicoPainel } from '../services/dashboard-service.js';
import type { RequisicaoAutenticada } from '../middlewares/auth-middleware.js';

export class ControladorPainel {
  constructor(private readonly service: ServicoPainel) {}

  // Retorna metricas calculadas a partir de alunos, planos e treinos.
  getMetrics = async (request: RequisicaoAutenticada, response: Response) => {
    const result = await this.service.getMetrics(request.userId ?? '');
    return response.status(200).json(result);
  };
}
