import type { PayloadErroApi } from '@shape/shared';

type ApiOptions = RequestInit & {
  token?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function isErrorPayload(payload: unknown): payload is PayloadErroApi {
  return typeof payload === 'object' && payload !== null && 'message' in payload && typeof payload.message === 'string';
}

export async function apiRequest<T>(apiUrl: string, path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  const normalizedBaseUrl = apiUrl.replace(/\/$/, '');
  const response = await fetch(`${normalizedBaseUrl}${path}`, {
    ...requestOptions,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  }).catch(() => {
    throw new ApiError('Nao foi possivel conectar a API. No celular, use o IP do computador na rede Wi-Fi, por exemplo http://192.168.x.x:3333/api.', 0);
  });

  const payload = (await response.json().catch(() => null)) as PayloadErroApi | T | null;

  if (!response.ok) {
    const message = isErrorPayload(payload) ? payload.message : 'Nao foi possivel conectar ao Shape Up.';
    throw new ApiError(message, response.status);
  }

  return payload as T;
}
