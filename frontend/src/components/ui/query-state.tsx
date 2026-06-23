import type { PropsWithChildren, ReactNode } from 'react';
import { ApiError } from '@/lib/api';

type QueryStateProps = PropsWithChildren<{
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  isEmpty?: boolean;
  onRetry?: () => void;
  loadingFallback?: ReactNode;
  emptyFallback?: ReactNode;
}>;

export function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  onRetry,
  loadingFallback,
  emptyFallback,
  children,
}: QueryStateProps) {
  if (isLoading) {
    return <>{loadingFallback ?? <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-panel">Carregando...</div>}</>;
  }

  if (isError) {
    const message = error instanceof ApiError ? error.message : 'Nao foi possivel carregar os dados agora.';

    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-panel">
        <p className="font-semibold">Algo deu errado</p>
        <p className="mt-2 text-sm">{message}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Tentar novamente
          </button>
        ) : null}
      </div>
    );
  }

  if (isEmpty) {
    return <>{emptyFallback ?? null}</>;
  }

  return <>{children}</>;
}

