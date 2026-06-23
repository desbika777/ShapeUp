import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  isFetching?: boolean;
};

function buildWindow(page: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1) as Array<number | 'ellipsis'>;
  }

  const items: Array<number | 'ellipsis'> = [1];

  if (page <= 3) {
    items.push(2, 3, 4, 'ellipsis', totalPages);
    return items;
  }

  if (page >= totalPages - 2) {
    items.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    return items;
  }

  items.push('ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages);
  return items;
}

export function Pagination({ page, totalPages, onChange, totalItems, pageSize, onPageSizeChange, isFetching }: PaginationProps) {
  const pages = buildWindow(page, totalPages);
  const showPageSize = Boolean(pageSize && onPageSizeChange);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
      <button className="flex items-center gap-2 text-sm text-slate-600 disabled:opacity-40" onClick={() => onChange(page - 1)} disabled={page <= 1}>
        <ChevronLeft size={16} /> Anterior
      </button>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {pages.map((item, index) => {
          if (item === 'ellipsis') {
            return <span key={`ellipsis-${index}`} className="px-2 text-sm text-slate-500">...</span>;
          }

          return (
            <button
              key={item}
              onClick={() => onChange(item)}
              className={cn('h-9 w-9 rounded-full text-sm font-semibold', item === page ? 'bg-teal text-white' : 'bg-slate-100 text-slateblue')}
            >
              {item}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-3 md:justify-end">
        {typeof totalItems === 'number' ? (
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Pagina {page} de {totalPages}{isFetching ? ' (atualizando...)' : ''} | Total {totalItems}
          </p>
        ) : (
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Pagina {page} de {totalPages}{isFetching ? ' (atualizando...)' : ''}
          </p>
        )}
        {showPageSize ? (
          <select
            className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm text-slateblue"
            value={pageSize}
            onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
          >
            {[6, 12, 24].map((value) => <option key={value} value={value}>{value}/pag</option>)}
          </select>
        ) : null}
        <button className="flex items-center gap-2 text-sm text-slate-600 disabled:opacity-40" onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
          Proxima <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
