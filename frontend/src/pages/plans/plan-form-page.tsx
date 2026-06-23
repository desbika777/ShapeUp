import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Plan, PlanInput } from '@shapeup/shared';
import { useNavigate, useParams } from 'react-router-dom';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { QueryState } from '@/components/ui/query-state';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { planSchema } from '@/lib/schemas';

export function PlanFormPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useForm<PlanInput>({
    resolver: zodResolver(planSchema),
    defaultValues: { name: '', description: '', price: 0, durationMonths: 1, status: 'ACTIVE' },
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['plan', id],
    queryFn: () => apiRequest<Plan>(`/plans/${id}`, { method: 'GET' }, token ?? undefined),
    enabled: isEdit,
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: (values: PlanInput) =>
      apiRequest<Plan>(isEdit ? `/plans/${id}` : '/plans', {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(values),
      }, token ?? undefined),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['plans'] }),
        queryClient.invalidateQueries({ queryKey: ['plans-options'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        isEdit ? queryClient.invalidateQueries({ queryKey: ['plan', id] }) : Promise.resolve(),
      ]);
      toast({ variant: 'success', title: 'Plano salvo', message: 'Alteracoes aplicadas com sucesso.' });
      navigate('/plans');
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Plano" title={isEdit ? 'Editar plano' : 'Novo plano'} description="Configure nome, descricao, ticket medio e status comercial do plano." />
      <QueryState
        isLoading={isEdit && isLoading}
        isError={isEdit && isError}
        error={error}
        onRetry={() => void refetch()}
        loadingFallback={<div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-panel">Carregando plano...</div>}
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
            <div className="md:col-span-2"><FormField label="Nome" error={form.formState.errors.name?.message}><input className={inputClassName(!!form.formState.errors.name)} {...form.register('name')} /></FormField></div>
            <div className="md:col-span-2"><FormField label="Descricao" error={form.formState.errors.description?.message}><textarea className={inputClassName(!!form.formState.errors.description)} rows={4} {...form.register('description')} /></FormField></div>
            <FormField label="Valor" error={form.formState.errors.price?.message}><input type="number" step="0.01" className={inputClassName(!!form.formState.errors.price)} {...form.register('price', { valueAsNumber: true })} /></FormField>
            <FormField label="Duracao (meses)" error={form.formState.errors.durationMonths?.message}><input type="number" className={inputClassName(!!form.formState.errors.durationMonths)} {...form.register('durationMonths', { valueAsNumber: true })} /></FormField>
            <FormField label="Status" error={form.formState.errors.status?.message}><select className={inputClassName(!!form.formState.errors.status)} {...form.register('status')}><option value="ACTIVE">Ativo</option><option value="INACTIVE">Inativo</option></select></FormField>
          </div>
          <button disabled={mutation.isPending || form.formState.isSubmitting} className="mt-6 rounded-full bg-slateblue px-5 py-3 font-semibold text-white disabled:opacity-60">
            {mutation.isPending ? 'Salvando...' : 'Salvar plano'}
          </button>
        </form>
      </QueryState>
    </div>
  );
}
