import type { Request } from 'express';

export function obterParametroRota(request: Request, name: string) {
  const value = request.params[name];
  return Array.isArray(value) ? value[0] : value;
}
