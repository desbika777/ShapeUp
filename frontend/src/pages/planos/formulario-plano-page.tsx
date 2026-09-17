// Formulario de plano: usado tanto para criar quanto para editar.
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Plano, EntradaPlano } from '@shape/shared';
import { BadgeDollarSign, CalendarClock, CircleCheck, ClipboardList } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormActions, FormCard, GuidanceCard } from '@/components/ui/form-layout';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { QueryState } from '@/components/ui/query-state';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { planSchema } from '@/lib/schemas';

export function FormularioPlanoPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEdit = Boolean(id);
  // Um unico formulario atende cadastro e edicao; o id da URL define o modo.
  const form = useForm<EntradaPlano>({
    resolver: zodResolver(planSchema),
    defaultValues: { name: '', description: '', price: undefined as unknown as number, durationMonths: 1, status: 'ATIVO' },
  });

  // Em modo edicao, carrega os dados atuais do plano.
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['plan', id],
    queryFn: () => apiRequest<Plano>(`/planos/${id}`, { method: 'GET' }, token ?? undefined),
    enabled: isEdit,
  });

  useEffect(() => {
    // Quando os dados chegam, preenche o formulario com os valores salvos.
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  // Salva via POST no cadastro e via PUT na edicao.
  const mutation = useMutation({
    mutationFn: (values: EntradaPlano) =>
      apiRequest<Plano>(isEdit ? `/planos/${id}` : '/planos', {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(values),
      }, token ?? undefined),
    onSuccess: async () => {
      // Atualiza caches que dependem de planos.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['plans'] }),
        queryClient.invalidateQueries({ queryKey: ['plans-options'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        isEdit ? queryClient.invalidateQueries({ queryKey: ['plan', id] }) : Promise.resolve(),
      ]);
      toast({ variant: 'success', title: 'Plano salvo', message: 'Alteracoes aplicadas com sucesso.' });
      navigate('/planos');
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
        loadingFallback={<div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">Carregando plano...</div>}
      >
        {/* Formulario validado pelo planSchema antes de enviar para a API. */}
        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <GuidanceCard
            icon={ClipboardList}
            eyebrow="Controle comercial"
            title="Planos coerentes facilitam venda e matricula"
            description="O plano e a base para vincular alunos, calcular indicadores e demonstrar a regra de negocio entre cadastro, status e operacao."
            items={[
              'Use uma descricao objetiva para que a recepcao entenda o beneficio do plano.',
              'Mantenha valores e duracao coerentes com a demonstracao da banca.',
              'Inative planos antigos em vez de apagar dados usados por alunos.',
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
              <div className="md:col-span-2"><FormField label="Nome do plano" error={form.formState.errors.name?.message}><input className={inputClassName(!!form.formState.errors.name)} placeholder="Ex.: Plano Trimestral" {...form.register('name')} /></FormField></div>
              <div className="md:col-span-2"><FormField label="Descricao comercial" error={form.formState.errors.description?.message}><textarea className={inputClassName(!!form.formState.errors.description)} rows={4} placeholder="Explique o que este plano oferece ao aluno." {...form.register('description')} /></FormField></div>
              <FormField label="Valor" error={form.formState.errors.price?.message}><div className="relative"><BadgeDollarSign className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input type="number" step="0.01" min="0" className={`${inputClassName(!!form.formState.errors.price)} pl-10`} {...form.register('price', { valueAsNumber: true })} /></div></FormField>
              <FormField label="Duracao em meses" error={form.formState.errors.durationMonths?.message}><div className="relative"><CalendarClock className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input type="number" min="1" className={`${inputClassName(!!form.formState.errors.durationMonths)} pl-10`} {...form.register('durationMonths', { valueAsNumber: true })} /></div></FormField>
              <FormField label="Status operacional" error={form.formState.errors.status?.message}><div className="relative"><CircleCheck className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><select className={`${inputClassName(!!form.formState.errors.status)} pl-10`} {...form.register('status')}><option value="ATIVO">Ativo</option><option value="INATIVO">Inativo</option></select></div></FormField>
            </div>
            <FormActions backTo="/planos" isSubmitting={mutation.isPending || form.formState.isSubmitting} submitLabel="Salvar plano" />
          </FormCard>
        </div>
      </QueryState>
    </div>
  );
}
