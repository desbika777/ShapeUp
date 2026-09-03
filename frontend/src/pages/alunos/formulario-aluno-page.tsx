// Formulario de aluno: cadastra e edita dados pessoais, plano e objetivo.
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { RespostaPaginada, Plano, Aluno, EntradaAluno } from '@shape/shared';
import { useNavigate, useParams } from 'react-router-dom';
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
        loadingFallback={<div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-panel">Carregando aluno...</div>}
      >
        {/* Formulario validado por Zod antes do envio para /alunos. */}
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
            <div className="md:col-span-2"><FormField label="Nome" error={form.formState.errors.name?.message}><input className={inputClassName(!!form.formState.errors.name)} {...form.register('name')} /></FormField></div>
            <FormField label="E-mail" error={form.formState.errors.email?.message}><input className={inputClassName(!!form.formState.errors.email)} {...form.register('email')} /></FormField>
            <FormField label="CPF" error={form.formState.errors.cpf?.message}><input className={inputClassName(!!form.formState.errors.cpf)} value={form.watch('cpf')} onChange={(event) => form.setValue('cpf', formatCpf(event.target.value), { shouldValidate: true })} /></FormField>
            <FormField label="Telefone" error={form.formState.errors.phone?.message}><input className={inputClassName(!!form.formState.errors.phone)} {...form.register('phone')} /></FormField>
            <FormField label="Nascimento" error={form.formState.errors.birthDate?.message}><input type="date" className={inputClassName(!!form.formState.errors.birthDate)} {...form.register('birthDate')} /></FormField>
            <div className="md:col-span-2"><FormField label="Objetivo" error={form.formState.errors.goal?.message}><textarea rows={4} className={inputClassName(!!form.formState.errors.goal)} {...form.register('goal')} /></FormField></div>
            <FormField label="Plano" error={form.formState.errors.planId?.message}><select className={inputClassName(!!form.formState.errors.planId)} {...form.register('planId')}><option value="">Selecione</option>{plans?.data.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</select></FormField>
            <FormField label="Status" error={form.formState.errors.status?.message}><select className={inputClassName(!!form.formState.errors.status)} {...form.register('status')}><option value="ATIVO">Ativo</option><option value="INATIVO">Inativo</option></select></FormField>
          </div>
          <button disabled={mutation.isPending || form.formState.isSubmitting} className="mt-6 rounded-full bg-slateblue px-5 py-3 font-semibold text-white disabled:opacity-60">
            {mutation.isPending ? 'Salvando...' : 'Salvar aluno'}
          </button>
        </form>
      </QueryState>
    </div>
  );
}
