// Monta a aplicacao Express com middlewares, rotas e tratamento de erro.
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { ZodError } from 'zod';
import { createControllers, type DependenciasRepositorios } from './container.js';
import { AppError } from './core/app-error.js';
import { env } from './config/env.js';
import { garantirDiretoriosUpload } from './config/uploads.js';
import { openApiDocument } from './docs/openapi.js';
import { errorHandler } from './middlewares/error-handler.js';
import { middlewareObservabilidade } from './middlewares/request-observability-middleware.js';
import { createRouter } from './routes/index.js';

export function createApp(overrides?: Partial<DependenciasRepositorios>) {
  const app = express();
  const controllers = createControllers(overrides);

  garantirDiretoriosUpload();

  app.set('trust proxy', 1);

  // Libera o frontend configurado e permite que a API receba JSON.
  app.use(cors({ origin: env.FRONTEND_URL }));
  app.use(express.json());
  app.use(middlewareObservabilidade);
  // Rota simples para conferir se a API esta ativa.
  app.get('/health', (_request, response) => response.status(200).json({ status: 'ok' }));
  app.get('/api/openapi.json', (_request, response) => response.status(200).json(openApiDocument));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, { explorer: true }));
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
