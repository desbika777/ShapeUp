// Formulario de aluno: cadastra e edita dados pessoais, plano e objetivo.
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { RespostaPaginada, Plano, Aluno, EntradaAluno } from '@shape/shared';
import { AtSign, CalendarDays, IdCard, Phone, Target, UserRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormActions, FormCard, GuidanceCard } from '@/components/ui/form-layout';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { QueryState } from '@/components/ui/query-state';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { formatCpf } from '@/lib/format';
import { studentSchema } from '@/lib/schemas';

export function FormularioAlunoPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEdit = Boolean(id);
  // Valores iniciais mantem o formulario controlado desde o primeiro render.
  const form = useForm<EntradaAluno>({
    resolver: zodResolver(studentSchema),
    defaultValues: { name: '', email: '', cpf: '', phone: '', birthDate: '', goal: '', status: 'ATIVO', planId: '' },
  });

  // Planos ativos/opcoes aparecem no select de vinculo do aluno.
  const { data: plans } = useQuery({
    queryKey: ['plans-options'],
    queryFn: () => apiRequest<RespostaPaginada<Plano>>('/planos?page=1&pageSize=100', { method: 'GET' }, token ?? undefined),
  });

  // Em modo edicao, carrega o aluno atual.
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['student', id],
    queryFn: () => apiRequest<Aluno>(`/alunos/${id}`, { method: 'GET' }, token ?? undefined),
    enabled: isEdit,
  });

  useEffect(() => {
    // Ajusta CPF e data para o formato visual do formulario.
    if (data) {
      form.reset({ ...data, cpf: formatCpf(data.cpf), birthDate: data.birthDate.slice(0, 10) });
    }
  }, [data, form]);

  // Envia POST para novo aluno e PUT para edicao.
  const mutation = useMutation({
    mutationFn: (values: EntradaAluno) => apiRequest<Aluno>(isEdit ? `/alunos/${id}` : '/alunos', {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify({ ...values, cpf: values.cpf.replace(/\D/g, '') }),
    }, token ?? undefined),
    onSuccess: async () => {
      // Recarrega listas e indicadores impactados por alunos.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['students'] }),
        queryClient.invalidateQueries({ queryKey: ['students-options'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        isEdit ? queryClient.invalidateQueries({ queryKey: ['student', id] }) : Promise.resolve(),
      ]);
      toast({ variant: 'success', title: 'Aluno salvo', message: 'Alteracoes aplicadas com sucesso.' });
      navigate('/alunos');
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Aluno" title={isEdit ? 'Editar aluno' : 'Novo aluno'} description="Cadastre informacoes completas do aluno, seu plano atual e objetivo principal." />
      <QueryState
        isLoading={isEdit && isLoading}
        isError={isEdit && isError}
        error={error}
        onRetry={() => void refetch()}
        loadingFallback={<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">Carregando aluno...</div>}
      >
        {/* Formulario validado por Zod antes do envio para /alunos. */}
        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <GuidanceCard
            icon={UserRound}
            eyebrow="Cadastro do aluno"
            title="Dados completos melhoram atendimento e acompanhamento"
            description="Este fluxo comprova o CRUD principal do projeto e o vinculo entre aluno, plano, status e objetivo."
            items={[
              'CPF e e-mail sao validados antes da gravacao.',
              'O aluno precisa estar vinculado a um plano para alimentar indicadores reais.',
              'O objetivo ajuda a contextualizar treinos e demonstrar valor para a persona da academia.',
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
              <div className="md:col-span-2"><FormField label="Nome completo" error={form.formState.errors.name?.message}><div className="relative"><UserRound className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input className={`${inputClassName(!!form.formState.errors.name)} pl-10`} placeholder="Ex.: Mariana Alves" {...form.register('name')} /></div></FormField></div>
              <FormField label="E-mail" error={form.formState.errors.email?.message}><div className="relative"><AtSign className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input className={`${inputClassName(!!form.formState.errors.email)} pl-10`} placeholder="aluno@email.com" {...form.register('email')} /></div></FormField>
              <FormField label="CPF" error={form.formState.errors.cpf?.message}><div className="relative"><IdCard className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input className={`${inputClassName(!!form.formState.errors.cpf)} pl-10`} placeholder="000.000.000-00" value={form.watch('cpf')} onChange={(event) => form.setValue('cpf', formatCpf(event.target.value), { shouldValidate: true })} /></div></FormField>
              <FormField label="Telefone" error={form.formState.errors.phone?.message}><div className="relative"><Phone className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input className={`${inputClassName(!!form.formState.errors.phone)} pl-10`} placeholder="11999998888" {...form.register('phone')} /></div></FormField>
              <FormField label="Nascimento" error={form.formState.errors.birthDate?.message}><div className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input type="date" className={`${inputClassName(!!form.formState.errors.birthDate)} pl-10`} {...form.register('birthDate')} /></div></FormField>
              <div className="md:col-span-2"><FormField label="Objetivo principal" error={form.formState.errors.goal?.message}><div className="relative"><Target className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><textarea rows={4} className={`${inputClassName(!!form.formState.errors.goal)} pl-10`} placeholder="Ex.: Ganho de massa, condicionamento ou emagrecimento." {...form.register('goal')} /></div></FormField></div>
              <FormField label="Plano vinculado" error={form.formState.errors.planId?.message}><select className={inputClassName(!!form.formState.errors.planId)} {...form.register('planId')}><option value="">Selecione um plano</option>{plans?.data.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</select></FormField>
              <FormField label="Status" error={form.formState.errors.status?.message}><select className={inputClassName(!!form.formState.errors.status)} {...form.register('status')}><option value="ATIVO">Ativo</option><option value="INATIVO">Inativo</option></select></FormField>
            </div>
            <FormActions backTo="/alunos" isSubmitting={mutation.isPending || form.formState.isSubmitting} submitLabel="Salvar aluno" />
          </FormCard>
        </div>
      </QueryState>
    </div>
  );
}
