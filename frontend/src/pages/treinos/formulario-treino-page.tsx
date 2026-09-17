// Formulario de treino: cria ou edita prescricoes vinculadas a alunos.
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { RespostaPaginada, Aluno, Treino, EntradaTreino } from '@shape/shared';
import { CalendarDays, Dumbbell, FileText, Target } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormActions, FormCard, GuidanceCard } from '@/components/ui/form-layout';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { QueryState } from '@/components/ui/query-state';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { workoutSchema } from '@/lib/schemas';

export function FormularioTreinoPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEdit = Boolean(id);
  // O mesmo componente atende cadastro e edicao conforme id da rota.
  const form = useForm<EntradaTreino>({
    resolver: zodResolver(workoutSchema),
    defaultValues: { studentId: '', title: '', objective: '', level: 'INICIANTE', notes: '', startDate: '', endDate: '' },
  });

  // Alunos cadastrados alimentam o select de destino do treino.
  const { data: students } = useQuery({
    queryKey: ['students-options'],
    queryFn: () => apiRequest<RespostaPaginada<Aluno>>('/alunos?page=1&pageSize=100', { method: 'GET' }, token ?? undefined),
  });

  // Em edicao, busca o treino atual para preencher os campos.
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['workout', id],
    queryFn: () => apiRequest<Treino>(`/treinos/${id}`, { method: 'GET' }, token ?? undefined),
    enabled: isEdit,
  });

  useEffect(() => {
    // Datas ISO vindas da API sao cortadas para o formato aceito pelo input date.
    if (data) {
      form.reset({ ...data, startDate: data.startDate.slice(0, 10), endDate: data.endDate.slice(0, 10) });
    }
  }, [data, form]);

  // Envia POST para criar e PUT para atualizar.
  const mutation = useMutation({
    mutationFn: (values: EntradaTreino) => apiRequest<Treino>(isEdit ? `/treinos/${id}` : '/treinos', {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(values),
    }, token ?? undefined),
    onSuccess: async () => {
      // Treinos afetam a lista e os indicadores do dashboard.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['workouts'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        isEdit ? queryClient.invalidateQueries({ queryKey: ['workout', id] }) : Promise.resolve(),
      ]);
      toast({ variant: 'success', title: 'Treino salvo', message: 'Alteracoes aplicadas com sucesso.' });
      navigate('/treinos');
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
        loadingFallback={<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">Carregando treino...</div>}
      >
        {/* Formulario validado pelo workoutSchema antes da chamada na API. */}
        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <GuidanceCard
            icon={Dumbbell}
            eyebrow="Prescricao"
            title="Treinos conectam objetivo, aluno e periodo"
            description="Esta tela demonstra regra de negocio: treino precisa estar vinculado a aluno, ter periodo valido e guardar orientacoes claras."
            items={[
              'Escolha um aluno cadastrado para manter rastreabilidade.',
              'A data final nao pode ser anterior ao inicio.',
              'Observacoes ajudam a justificar a prescricao durante a apresentacao.',
            ]}
          />
          <FormCard
            onSubmit={form.handleSubmit(async (values) => {
              try {
                await mutation.mutateAsync(values);
              } catch (err) {
                toast({ variant: 'error', title: 'Falha ao salvar', message: err instanceof Error ? err.message : 'Nao foi possivel salvar agora.' });
              }
            })}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Aluno" error={form.formState.errors.studentId?.message}><select className={inputClassName(!!form.formState.errors.studentId)} {...form.register('studentId')}><option value="">Selecione um aluno</option>{students?.data.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select></FormField>
              <FormField label="Nivel" error={form.formState.errors.level?.message}><select className={inputClassName(!!form.formState.errors.level)} {...form.register('level')}><option value="INICIANTE">Iniciante</option><option value="INTERMEDIARIO">Intermediario</option><option value="AVANCADO">Avancado</option></select></FormField>
              <div className="md:col-span-2"><FormField label="Titulo do treino" error={form.formState.errors.title?.message}><div className="relative"><Dumbbell className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input className={`${inputClassName(!!form.formState.errors.title)} pl-10`} placeholder="Ex.: Hipertrofia inicial" {...form.register('title')} /></div></FormField></div>
              <div className="md:col-span-2"><FormField label="Objetivo" error={form.formState.errors.objective?.message}><div className="relative"><Target className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><textarea rows={3} className={`${inputClassName(!!form.formState.errors.objective)} pl-10`} placeholder="Descreva o foco do treino." {...form.register('objective')} /></div></FormField></div>
              <FormField label="Inicio" error={form.formState.errors.startDate?.message}><div className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input type="date" className={`${inputClassName(!!form.formState.errors.startDate)} pl-10`} {...form.register('startDate')} /></div></FormField>
              <FormField label="Fim" error={form.formState.errors.endDate?.message}><div className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input type="date" className={`${inputClassName(!!form.formState.errors.endDate)} pl-10`} {...form.register('endDate')} /></div></FormField>
              <div className="md:col-span-2"><FormField label="Observacoes" error={form.formState.errors.notes?.message}><div className="relative"><FileText className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><textarea rows={4} className={`${inputClassName(!!form.formState.errors.notes)} pl-10`} placeholder="Inclua restricoes, cuidado tecnico ou orientacoes ao professor." {...form.register('notes')} /></div></FormField></div>
            </div>
            <FormActions backTo="/treinos" isSubmitting={mutation.isPending || form.formState.isSubmitting} submitLabel="Salvar treino" />
          </FormCard>
        </div>
      </QueryState>
    </div>
  );
}
