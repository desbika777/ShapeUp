import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PaginatedResponse, Student, Workout, WorkoutLevel } from '@shapeup/shared';
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
import { formatDate, formatWorkoutLevel } from '@/lib/format';

export function WorkoutsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [level, setLevel] = useState<WorkoutLevel | 'ALL'>('ALL');
  const [studentId, setStudentId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Workout | null>(null);

  const filters = useMemo(() => ({
    search: deferredSearch.trim(),
    level: level === 'ALL' ? undefined : level,
    studentId: studentId || undefined,
  }), [deferredSearch, level, studentId]);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['workouts', page, pageSize, filters],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (filters.search) params.set('search', filters.search);
      if (filters.level) params.set('level', filters.level);
      if (filters.studentId) params.set('studentId', filters.studentId);
      return apiRequest<PaginatedResponse<Workout>>(`/workouts?${params.toString()}`, { method: 'GET' }, token ?? undefined);
    },
    placeholderData: keepPreviousData,
  });

  const { data: studentsOptions } = useQuery({
    queryKey: ['students-options'],
    queryFn: () => apiRequest<PaginatedResponse<Student>>('/students?page=1&pageSize=100', { method: 'GET' }, token ?? undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest<void>(`/workouts/${id}`, { method: 'DELETE' }, token ?? undefined),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workouts'] }),
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Treinos" title="Prescricao de treinos" description="Organize treinos por aluno, nivel, periodo e objetivo, com historico claro e operacao padronizada." action={<Link to="/workouts/new" className="rounded-full bg-slateblue px-5 py-3 text-sm font-semibold text-white">Novo treino</Link>} />
      <div className="grid gap-3 rounded-[28px] border border-white/70 bg-white p-4 shadow-panel md:grid-cols-[1.2fr_0.7fr_1.1fr]">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Buscar por treino, objetivo ou aluno..."
          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slateblue"
        />
        <select
          value={level}
          onChange={(event) => {
            setLevel(event.target.value as WorkoutLevel | 'ALL');
            setPage(1);
          }}
          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slateblue"
        >
          <option value="ALL">Nivel (todos)</option>
          <option value="BEGINNER">Iniciante</option>
          <option value="INTERMEDIATE">Intermediario</option>
          <option value="ADVANCED">Avancado</option>
        </select>
        <select
          value={studentId}
          onChange={(event) => {
            setStudentId(event.target.value);
            setPage(1);
          }}
          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slateblue"
        >
          <option value="">Aluno (todos)</option>
          {studentsOptions?.data.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
        </select>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={Boolean(data && data.data.length === 0)}
        loadingFallback={<TableSkeleton columns={6} rows={6} />}
        emptyFallback={<EmptyState title="Nenhum treino encontrado" description="Ajuste os filtros ou cadastre o primeiro treino para iniciar a prescricao estruturada." />}
      >
        <>
          <DataTable columns={[
            { key: 'title', label: 'Treino' },
            { key: 'studentName', label: 'Aluno' },
            { key: 'level', label: 'Nivel', render: (row) => formatWorkoutLevel(row.level) },
            { key: 'startDate', label: 'Inicio', render: (row) => formatDate(row.startDate) },
            { key: 'endDate', label: 'Fim', render: (row) => formatDate(row.endDate) },
            {
              key: 'actions',
              label: 'Acoes',
              render: (row) => (
                <div className="flex gap-3">
                  <Link className="font-semibold text-teal" to={`/workouts/${row.id}/edit`}>Editar</Link>
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
        title="Excluir treino"
        description={deleteTarget ? `Tem certeza que deseja excluir ${deleteTarget.title}? Essa acao nao pode ser desfeita.` : ''}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await deleteMutation.mutateAsync(deleteTarget.id);
            toast({ variant: 'success', title: 'Treino excluido', message: 'O treino foi removido com sucesso.' });
            setDeleteTarget(null);
          } catch (err) {
            toast({ variant: 'error', title: 'Falha ao excluir', message: err instanceof Error ? err.message : 'Nao foi possivel excluir agora.' });
          }
        }}
      />
    </div>
  );
}
