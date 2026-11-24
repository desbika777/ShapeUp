import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import type { NextFunction, Request, Response } from 'express';
import { logInfo } from '../lib/logger.js';

export function middlewareObservabilidade(request: Request, response: Response, next: NextFunction) {
  const startedAt = performance.now();
  const requestId = request.header('x-request-id') ?? randomUUID();

  response.setHeader('X-Request-Id', requestId);

  response.on('finish', () => {
    const durationMs = Math.round((performance.now() - startedAt) * 100) / 100;

    logInfo('http_request', {
      requestId,
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      durationMs,
      userAgent: request.header('user-agent'),
    });
  });

  next();
}
