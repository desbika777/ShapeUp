// Monta a aplicacao Express com middlewares, rotas e tratamento de erro.
import cors from 'cors';
import express from 'express';
import { ZodError } from 'zod';
import { createControllers, type DependenciasRepositorios } from './container.js';
import { AppError } from './core/app-error.js';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error-handler.js';
import { createRouter } from './routes/index.js';

export function createApp(overrides?: Partial<DependenciasRepositorios>) {
  const app = express();
  const controllers = createControllers(overrides);

  // Libera o frontend configurado e permite que a API receba JSON.
  app.use(cors({ origin: env.FRONTEND_URL }));
  app.use(express.json());

  // Rota simples para conferir se a API esta ativa.
  app.get('/health', (_request, response) => response.status(200).json({ status: 'ok' }));
  app.use('/api', createRouter(controllers));

  // Converte erros de validacao do Zod em resposta padronizada para o frontend.
  app.use((error: Error, _request: express.Request, _response: express.Response, next: express.NextFunction) => {
    if (error instanceof ZodError) {
      next(new AppError(400, 'Campos invalidos enviados para a requisicao.', error.issues.map((issue) => issue.message)));
      return;
    }

    next(error);
  });

  app.use(errorHandler);
  return app;
}
