import type { ApiErrorPayload } from '@shapeup/shared';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

export class ApiError extends Error {
  details?: string[];
  statusCode?: number;

  constructor(message: string, details?: string[], statusCode?: number) {
    super(message);
    this.details = details;
    this.statusCode = statusCode;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('Falha de conexao com a API.');
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;

    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('shapeup:unauthorized'));
    }

    throw new ApiError(payload?.message ?? 'Erro inesperado na API.', payload?.details, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
