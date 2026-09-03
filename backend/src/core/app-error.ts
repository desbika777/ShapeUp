// Erro de negocio usado pelos services para indicar status HTTP e detalhes.
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: string[],
  ) {
    super(message);
  }
}
