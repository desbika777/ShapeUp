import cors from 'cors';
import express from 'express';
import { ZodError } from 'zod';
import { createControllers, type RepositoryDependencies } from './container.js';
import { AppError } from './core/app-error.js';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error-handler.js';
import { createRouter } from './routes/index.js';

export function createApp(overrides?: Partial<RepositoryDependencies>) {
  const app = express();
  const controllers = createControllers(overrides);

  app.use(cors({ origin: env.FRONTEND_URL }));
  app.use(express.json());

  app.get('/health', (_request, response) => response.status(200).json({ status: 'ok' }));
  app.use('/api', createRouter(controllers));

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
