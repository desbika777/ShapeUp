import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PaginatedResponse, Plan, Student, StudentStatus } from '@shapeup/shared';
import { Link } from 'react-router-dom';
import { useDeferredValue, useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';
import { QueryState } from '@/components/ui/query-state';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { formatStudentStatus } from '@/lib/format';

export function StudentsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState<StudentStatus | 'ALL'>('ALL');
  const [planId, setPlanId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  const filters = useMemo(() => ({
    search: deferredSearch.trim(),
    status: status === 'ALL' ? undefined : status,
    planId: planId || undefined,
  }), [deferredSearch, planId, status]);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['students', page, pageSize, filters],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (filters.search) params.set('search', filters.search);
      if (filters.status) params.set('status', filters.status);
      if (filters.planId) params.set('planId', filters.planId);
      return apiRequest<PaginatedResponse<Student>>(`/students?${params.toString()}`, { method: 'GET' }, token ?? undefined);
    },
    placeholderData: keepPreviousData,
  });

  const { data: plansOptions } = useQuery({
    queryKey: ['plans-options'],
    queryFn: () => apiRequest<PaginatedResponse<Plan>>('/plans?page=1&pageSize=100', { method: 'GET' }, token ?? undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest<void>(`/students/${id}`, { method: 'DELETE' }, token ?? undefined),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Alunos" title="Carteira de alunos" description="Centralize dados cadastrais, objetivos, plano atual e situacao operacional dos alunos." action={<Link to="/students/new" className="rounded-full bg-slateblue px-5 py-3 text-sm font-semibold text-white">Novo aluno</Link>} />
      <div className="grid gap-3 rounded-[28px] border border-white/70 bg-white p-4 shadow-panel md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Buscar por nome, e-mail ou CPF..."
          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slateblue"
        />
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as StudentStatus | 'ALL');
            setPage(1);
          }}
          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slateblue"
        >
          <option value="ALL">Status (todos)</option>
          <option value="ACTIVE">Ativos</option>
          <option value="INACTIVE">Inativos</option>
        </select>
        <select
          value={planId}
          onChange={(event) => {
            setPlanId(event.target.value);
            setPage(1);
          }}
          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slateblue"
        >
          <option value="">Plano (todos)</option>
          {plansOptions?.data.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
        </select>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={Boolean(data && data.data.length === 0)}
        loadingFallback={<TableSkeleton columns={6} rows={6} />}
        emptyFallback={<EmptyState title="Nenhum aluno encontrado" description="Ajuste os filtros ou cadastre o primeiro aluno para iniciar a operacao da academia." />}
      >
        <>
          <DataTable columns={[
            { key: 'name', label: 'Aluno' },
            { key: 'email', label: 'E-mail' },
            { key: 'goal', label: 'Objetivo' },
            { key: 'planName', label: 'Plano' },
            { key: 'status', label: 'Status', render: (row) => formatStudentStatus(row.status) },
            {
              key: 'actions',
              label: 'Acoes',
              render: (row) => (
                <div className="flex gap-3">
                  <Link className="font-semibold text-teal" to={`/students/${row.id}/edit`}>Editar</Link>
                  <button className="font-semibold text-rose-500" onClick={() => setDeleteTarget(row)}>Excluir</button>
                </div>
              ),
            },
          ]} rows={data?.data ?? []} />
          {data ? (
            <Pagination
              page={data.meta.page}
              totalPages={data.meta.totalPages}
              totalItems={data.meta.totalItems}
              pageSize={pageSize}
              onPageSizeChange={(next) => {
                setPageSize(next);
                setPage(1);
              }}
              isFetching={isFetching}
              onChange={setPage}
            />
          ) : null}
        </>
      </QueryState>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        tone="danger"
        title="Excluir aluno"
        description={deleteTarget ? `Tem certeza que deseja excluir ${deleteTarget.name}? Essa acao nao pode ser desfeita.` : ''}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await deleteMutation.mutateAsync(deleteTarget.id);
            toast({ variant: 'success', title: 'Aluno excluido', message: 'O aluno foi removido com sucesso.' });
            setDeleteTarget(null);
          } catch (err) {
            toast({ variant: 'error', title: 'Falha ao excluir', message: err instanceof Error ? err.message : 'Nao foi possivel excluir agora.' });
          }
        }}
      />
    </div>
  );
}
