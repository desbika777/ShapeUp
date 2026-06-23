import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { PaginatedResponse, Student, Workout, WorkoutInput } from '@shapeup/shared';
import { useNavigate, useParams } from 'react-router-dom';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { QueryState } from '@/components/ui/query-state';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { workoutSchema } from '@/lib/schemas';

export function WorkoutFormPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useForm<WorkoutInput>({
    resolver: zodResolver(workoutSchema),
    defaultValues: { studentId: '', title: '', objective: '', level: 'BEGINNER', notes: '', startDate: '', endDate: '' },
  });

  const { data: students } = useQuery({
    queryKey: ['students-options'],
    queryFn: () => apiRequest<PaginatedResponse<Student>>('/students?page=1&pageSize=100', { method: 'GET' }, token ?? undefined),
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['workout', id],
    queryFn: () => apiRequest<Workout>(`/workouts/${id}`, { method: 'GET' }, token ?? undefined),
    enabled: isEdit,
  });

  useEffect(() => {
    if (data) {
      form.reset({ ...data, startDate: data.startDate.slice(0, 10), endDate: data.endDate.slice(0, 10) });
    }
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: (values: WorkoutInput) => apiRequest<Workout>(isEdit ? `/workouts/${id}` : '/workouts', {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(values),
    }, token ?? undefined),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['workouts'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        isEdit ? queryClient.invalidateQueries({ queryKey: ['workout', id] }) : Promise.resolve(),
      ]);
      toast({ variant: 'success', title: 'Treino salvo', message: 'Alteracoes aplicadas com sucesso.' });
      navigate('/workouts');
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Treino" title={isEdit ? 'Editar treino' : 'Novo treino'} description="Defina objetivo, nivel, periodo de execucao e observacoes do plano de treino." />
      <QueryState
        isLoading={isEdit && isLoading}
        isError={isEdit && isError}
        error={error}
        onRetry={() => void refetch()}
        loadingFallback={<div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-panel">Carregando treino...</div>}
      >
        <form
          className="rounded-[28px] border border-white/70 bg-white p-6 shadow-panel"
          onSubmit={form.handleSubmit(async (values) => {
            try {
              await mutation.mutateAsync(values);
            } catch (err) {
              toast({ variant: 'error', title: 'Falha ao salvar', message: err instanceof Error ? err.message : 'Nao foi possivel salvar agora.' });
            }
          })}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Aluno" error={form.formState.errors.studentId?.message}><select className={inputClassName(!!form.formState.errors.studentId)} {...form.register('studentId')}><option value="">Selecione</option>{students?.data.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select></FormField>
            <FormField label="Nivel" error={form.formState.errors.level?.message}><select className={inputClassName(!!form.formState.errors.level)} {...form.register('level')}><option value="BEGINNER">Iniciante</option><option value="INTERMEDIATE">Intermediario</option><option value="ADVANCED">Avancado</option></select></FormField>
            <div className="md:col-span-2"><FormField label="Titulo" error={form.formState.errors.title?.message}><input className={inputClassName(!!form.formState.errors.title)} {...form.register('title')} /></FormField></div>
            <div className="md:col-span-2"><FormField label="Objetivo" error={form.formState.errors.objective?.message}><textarea rows={3} className={inputClassName(!!form.formState.errors.objective)} {...form.register('objective')} /></FormField></div>
            <FormField label="Inicio" error={form.formState.errors.startDate?.message}><input type="date" className={inputClassName(!!form.formState.errors.startDate)} {...form.register('startDate')} /></FormField>
            <FormField label="Fim" error={form.formState.errors.endDate?.message}><input type="date" className={inputClassName(!!form.formState.errors.endDate)} {...form.register('endDate')} /></FormField>
            <div className="md:col-span-2"><FormField label="Observacoes" error={form.formState.errors.notes?.message}><textarea rows={4} className={inputClassName(!!form.formState.errors.notes)} {...form.register('notes')} /></FormField></div>
          </div>
          <button disabled={mutation.isPending || form.formState.isSubmitting} className="mt-6 rounded-full bg-slateblue px-5 py-3 font-semibold text-white disabled:opacity-60">
            {mutation.isPending ? 'Salvando...' : 'Salvar treino'}
          </button>
        </form>
      </QueryState>
    </div>
  );
}
