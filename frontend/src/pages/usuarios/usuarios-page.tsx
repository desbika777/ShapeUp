// Pagina de usuarios: permite ao administrador criar e acompanhar acessos.
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { EntradaCriacaoUsuario, UsuarioAutenticado } from '@shape/shared';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { QueryState } from '@/components/ui/query-state';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { formatCpf, formatarPerfil } from '@/lib/format';
import { createUserSchema } from '@/lib/schemas';

export function UsuariosPage() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = user?.perfil === 'ADMIN';

  const form = useForm<EntradaCriacaoUsuario>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      password: '',
      confirmPassword: '',
      perfil: 'USUARIO',
    },
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => apiRequest<UsuarioAutenticado[]>('/usuarios', { method: 'GET' }, token ?? undefined),
    enabled: isAdmin,
  });

  const mutation = useMutation({
    mutationFn: (values: EntradaCriacaoUsuario) =>
      apiRequest<UsuarioAutenticado>('/usuarios', {
        method: 'POST',
        body: JSON.stringify({ ...values, cpf: values.cpf.replace(/\D/g, '') }),
      }, token ?? undefined),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      form.reset({ name: '', email: '', cpf: '', password: '', confirmPassword: '', perfil: 'USUARIO' });
      toast({ variant: 'success', title: 'Usuario cadastrado', message: 'O acesso foi criado com o perfil selecionado.' });
    },
  });

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Usuarios" title="Controle de acesso" description="Somente administradores podem cadastrar ou visualizar usuarios internos." />
        <EmptyState title="Acesso restrito" description="Seu perfil permite consultar dados operacionais, mas nao administrar usuarios do sistema." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Usuarios" title="Controle de acesso" description="Crie acessos internos e defina se cada pessoa pode administrar ou apenas consultar a operacao." />

      <form
        className="rounded-[28px] border border-white/70 bg-white p-6 shadow-panel"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await mutation.mutateAsync(values);
          } catch (err) {
            toast({ variant: 'error', title: 'Falha ao cadastrar', message: err instanceof Error ? err.message : 'Nao foi possivel criar o usuario agora.' });
          }
        })}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <FormField label="Nome" error={form.formState.errors.name?.message}>
            <input className={inputClassName(!!form.formState.errors.name)} {...form.register('name')} />
          </FormField>
          <FormField label="E-mail" error={form.formState.errors.email?.message}>
            <input className={inputClassName(!!form.formState.errors.email)} {...form.register('email')} />
          </FormField>
          <FormField label="CPF" error={form.formState.errors.cpf?.message}>
            <input
              className={inputClassName(!!form.formState.errors.cpf)}
              value={form.watch('cpf')}
              onChange={(event) => form.setValue('cpf', formatCpf(event.target.value), { shouldValidate: true })}
            />
          </FormField>
          <FormField label="Perfil" error={form.formState.errors.perfil?.message}>
            <select className={inputClassName(!!form.formState.errors.perfil)} {...form.register('perfil')}>
              <option value="USUARIO">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </FormField>
          <FormField label="Senha" error={form.formState.errors.password?.message}>
            <input type="password" className={inputClassName(!!form.formState.errors.password)} {...form.register('password')} />
          </FormField>
          <FormField label="Confirmar senha" error={form.formState.errors.confirmPassword?.message}>
            <input type="password" className={inputClassName(!!form.formState.errors.confirmPassword)} {...form.register('confirmPassword')} />
          </FormField>
        </div>
        <button disabled={mutation.isPending || form.formState.isSubmitting} className="mt-6 rounded-full bg-slateblue px-5 py-3 font-semibold text-white disabled:opacity-60">
          {mutation.isPending ? 'Cadastrando...' : 'Cadastrar usuario'}
        </button>
      </form>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={Boolean(data && data.length === 0)}
        loadingFallback={<TableSkeleton columns={4} rows={5} />}
        emptyFallback={<EmptyState title="Nenhum usuario encontrado" description="Cadastre o primeiro acesso interno para separar administracao e consulta." />}
      >
        <DataTable
          columns={[
            { key: 'name', label: 'Nome' },
            { key: 'email', label: 'E-mail' },
            { key: 'cpf', label: 'CPF', render: (row) => formatCpf(row.cpf) },
            { key: 'perfil', label: 'Perfil', render: (row) => formatarPerfil(row.perfil) },
          ]}
          rows={data ?? []}
        />
      </QueryState>
    </div>
  );
}
