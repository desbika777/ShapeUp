import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, Copy, KeyRound, PlusCircle, RefreshCw, Search, ShieldCheck, Trash2, UsersRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { EntradaCriacaoUsuario, UsuarioAutenticado } from '@shape/shared';
import { Link } from 'react-router-dom';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';
import { QueryState } from '@/components/ui/query-state';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { formatCpf, formatDate, formatarPerfil } from '@/lib/format';
import { createUserSchema } from '@/lib/schemas';

const clientAccessNotes = [
  'Cada cliente representa uma academia que comprou o Shape Up para organizar a propria operacao.',
  'O dono da academia recebe uma senha provisoria e define a senha propria no primeiro acesso.',
  'Clientes nao criam novas contas; eles gerenciam planos, alunos, treinos e anexos da propria academia.',
];

function randomIndex(length: number) {
  if (globalThis.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    globalThis.crypto.getRandomValues(array);
    return array[0] % length;
  }

  return Math.floor(Math.random() * length);
}

function pickCharacter(chars: string) {
  return chars[randomIndex(chars.length)];
}

function gerarSenhaInicial() {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '@#$%';
  const all = `${upper}${lower}${numbers}${symbols}`;
  const password = [
    pickCharacter(upper),
    pickCharacter(lower),
    pickCharacter(numbers),
    pickCharacter(symbols),
    ...Array.from({ length: 6 }, () => pickCharacter(all)),
  ];

  return password
    .map((char) => ({ char, sort: randomIndex(1000) }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.char)
    .join('');
}

function createClientFormDefaults(): EntradaCriacaoUsuario {
  const password = gerarSenhaInicial();
  return {
    name: '',
    email: '',
    cpf: '',
    password,
    confirmPassword: password,
    perfil: 'ADMIN',
  };
}

export function UsuariosPage() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMaster = user?.perfil === 'MASTER';
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [deleteTarget, setDeleteTarget] = useState<UsuarioAutenticado | null>(null);
  const initialFormDefaults = useMemo(() => createClientFormDefaults(), []);

  const form = useForm<EntradaCriacaoUsuario>({
    resolver: zodResolver(createUserSchema),
    defaultValues: initialFormDefaults,
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => apiRequest<UsuarioAutenticado[]>('/usuarios', { method: 'GET' }, token ?? undefined),
    enabled: isMaster,
  });

  const resumoClientes = useMemo(() => ({
    total: data?.filter((item) => item.perfil === 'ADMIN').length ?? 0,
  }), [data]);

  const clientesFiltrados = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const clientes = (data ?? []).filter((item) => item.perfil === 'ADMIN');
    if (!term) return clientes;
    const numericTerm = term.replace(/\D/g, '');

    return clientes.filter((item) => {
      const cpf = item.cpf.replace(/\D/g, '');
      return item.name.toLowerCase().includes(term)
        || item.email.toLowerCase().includes(term)
        || (numericTerm.length > 0 && cpf.includes(numericTerm))
        || formatarPerfil(item.perfil).toLowerCase().includes(term);
    });
  }, [data, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(clientesFiltrados.length / pageSize));
  const clientesPaginados = useMemo(() => {
    const start = (page - 1) * pageSize;
    return clientesFiltrados.slice(start, start + pageSize);
  }, [page, pageSize, clientesFiltrados]);

  useEffect(() => {
    setPage(1);
  }, [pageSize, searchTerm]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const mutation = useMutation({
    mutationFn: (values: EntradaCriacaoUsuario) =>
      apiRequest<UsuarioAutenticado>('/usuarios', {
        method: 'POST',
        body: JSON.stringify({ ...values, cpf: values.cpf.replace(/\D/g, ''), perfil: 'ADMIN' }),
      }, token ?? undefined),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      form.reset(createClientFormDefaults());
      toast({ variant: 'success', title: 'Cliente cadastrado', message: 'O dono da academia entra com a senha provisoria e define a senha propria no primeiro acesso.' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest<void>(`/usuarios/${id}`, { method: 'DELETE' }, token ?? undefined),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  function applyGeneratedPassword() {
    const password = gerarSenhaInicial();
    form.setValue('password', password, { shouldValidate: true });
    form.setValue('confirmPassword', password, { shouldValidate: true });
    toast({ variant: 'success', title: 'Senha gerada', message: 'Senha provisoria pronta para enviar ao cliente.' });
  }

  async function copyGeneratedPassword() {
    const password = form.getValues('password');

    try {
      await navigator.clipboard.writeText(password);
      toast({ variant: 'success', title: 'Senha copiada', message: 'Envie esta senha provisoria para o cliente.' });
    } catch {
      toast({ variant: 'error', title: 'Nao foi possivel copiar', message: 'Copie a senha manualmente pelo campo.' });
    }
  }

  if (!isMaster) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Clientes" title="Area master" description="Clientes Shape Up gerenciam apenas a propria academia." />
        <EmptyState title="Conta de cliente" description="Use a conta master Shape Up para criar novos clientes da plataforma." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Clientes"
        title="Academias clientes"
        description="Crie o acesso inicial para o dono da academia que contratou o Shape Up."
        action={(
          <Link to="/painel" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slateblue transition hover:border-teal/50 hover:text-teal">
            <ArrowLeft size={16} />
            Voltar ao painel
          </Link>
        )}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={UsersRound} label="Clientes ativos" value={resumoClientes.total} />
        <SummaryCard icon={ShieldCheck} label="Conta master" value="Shape Up" />
        <SummaryCard icon={CheckCircle2} label="Fluxo do cliente" value="Gerir academia" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          onSubmit={form.handleSubmit(async (values) => {
            try {
              await mutation.mutateAsync({ ...values, perfil: 'ADMIN' });
            } catch (err) {
              toast({ variant: 'error', title: 'Falha ao cadastrar', message: err instanceof Error ? err.message : 'Nao foi possivel criar o cliente agora.' });
            }
          })}
        >
          <div className="mb-6 flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slateblue/10 text-slateblue">
              <PlusCircle size={22} />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-slateblue">Novo cliente</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">Cadastre o dono da academia que vai acessar o Shape Up e gerir a propria operacao.</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Nome" error={form.formState.errors.name?.message}>
              <input className={inputClassName(!!form.formState.errors.name)} autoComplete="name" {...form.register('name')} />
            </FormField>
            <FormField label="E-mail" error={form.formState.errors.email?.message}>
              <input className={inputClassName(!!form.formState.errors.email)} autoComplete="email" {...form.register('email')} />
            </FormField>
            <FormField label="CPF" error={form.formState.errors.cpf?.message}>
              <input
                className={inputClassName(!!form.formState.errors.cpf)}
                inputMode="numeric"
                value={form.watch('cpf')}
                onChange={(event) => form.setValue('cpf', formatCpf(event.target.value), { shouldValidate: true })}
              />
            </FormField>
            <FormField label="Tipo de acesso" error={undefined}>
              <input disabled value="Dono da academia" className="w-full rounded-md border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slateblue" />
            </FormField>
            <FormField label="Senha provisoria" error={form.formState.errors.password?.message ?? form.formState.errors.confirmPassword?.message}>
              <input type="hidden" {...form.register('password')} />
              <input type="hidden" {...form.register('confirmPassword')} />
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                <input
                  type="text"
                  className={inputClassName(Boolean(form.formState.errors.password ?? form.formState.errors.confirmPassword))}
                  autoComplete="off"
                  value={form.watch('password')}
                  onChange={(event) => {
                    form.setValue('password', event.target.value, { shouldValidate: true });
                    form.setValue('confirmPassword', event.target.value, { shouldValidate: true });
                  }}
                />
                <button type="button" onClick={applyGeneratedPassword} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-3 text-sm font-semibold text-slateblue transition hover:border-teal/50 hover:text-teal">
                  <RefreshCw size={16} />
                  Gerar
                </button>
                <button type="button" onClick={() => void copyGeneratedPassword()} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-3 text-sm font-semibold text-slateblue transition hover:border-teal/50 hover:text-teal">
                  <Copy size={16} />
                  Copiar
                </button>
              </div>
            </FormField>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <KeyRound className="mt-0.5 shrink-0 text-teal" size={18} />
            <span>Use a senha provisoria gerada para liberar o primeiro acesso. Ao entrar, o cliente define a senha propria antes de usar o painel.</span>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/painel" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-teal/50 hover:text-teal">
              <ArrowLeft size={16} />
              Voltar
            </Link>
            <button disabled={mutation.isPending || form.formState.isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-md bg-slateblue px-5 py-3 text-sm font-semibold text-white transition hover:bg-slateblue/90 disabled:cursor-not-allowed disabled:opacity-60">
              <PlusCircle size={18} />
              {mutation.isPending ? 'Cadastrando...' : 'Cadastrar cliente'}
            </button>
          </div>
        </form>

        <aside className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-display text-lg font-semibold text-slateblue">Fluxo comercial</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">O master Shape Up cria a conta do cliente; depois o dono da academia entra e administra somente a propria base.</p>
          </div>

          <div className="space-y-3">
            {clientAccessNotes.map((note) => (
              <div key={note} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                <CheckCircle2 className="mt-0.5 shrink-0 text-teal" size={16} />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-slateblue">Clientes cadastrados</h2>
            <p className="mt-1 text-sm text-slate-500">A lista abaixo mostra os donos de academia que receberam acesso ao Shape Up.</p>
          </div>
          <label className="relative block w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm text-slateblue outline-none transition placeholder:text-slate-400 focus:border-teal focus:ring-2 focus:ring-teal/15"
              placeholder="Buscar cliente"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
        </div>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => void refetch()}
          isEmpty={Boolean(data && clientesFiltrados.length === 0)}
          loadingFallback={<TableSkeleton columns={4} rows={5} />}
          emptyFallback={searchTerm ? <EmptyState title="Nenhum cliente encontrado" description="Ajuste a busca para visualizar outro dono de academia." /> : <EmptyState title="Nenhum cliente encontrado" description="Cadastre o primeiro cliente da plataforma." />}
        >
          <div className="space-y-4">
            <DataTable
              columns={[
                {
                  key: 'name',
                  label: 'Cliente',
                  render: (row) => (
                    <div className="min-w-[220px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slateblue">{row.name}</span>
                        {row.id === user?.id ? <span className="rounded-md bg-teal/10 px-2 py-0.5 text-xs font-semibold text-teal">Voce</span> : null}
                      </div>
                      <p className="mt-1 break-all text-sm text-slate-500">{row.email}</p>
                    </div>
                  ),
                },
                { key: 'cpf', label: 'CPF', render: (row) => formatCpf(row.cpf) },
                {
                  key: 'perfil',
                  label: 'Perfil',
                  render: (row) => (
                    <span className="inline-flex rounded-md bg-slateblue/10 px-2.5 py-1 text-xs font-semibold text-slateblue">
                      {formatarPerfil(row.perfil)}
                    </span>
                  ),
                },
                { key: 'createdAt', label: 'Criado em', render: (row) => formatDate(row.createdAt) },
                {
                  key: 'actions',
                  label: 'Acoes',
                  render: (row) => (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(row)}
                      className="inline-flex items-center gap-2 font-semibold text-rose-600 transition hover:text-rose-700"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  ),
                },
              ]}
              rows={clientesPaginados}
            />

            {totalPages > 1 ? (
              <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={clientesFiltrados.length}
                pageSize={pageSize}
                onChange={setPage}
                onPageSizeChange={setPageSize}
              />
            ) : null}
          </div>
        </QueryState>
      </section>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        tone="danger"
        title="Excluir cliente"
        description={deleteTarget ? `Tem certeza que deseja excluir ${deleteTarget.name}? A conta e os dados operacionais vinculados a este cliente serao removidos.` : ''}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!deleteTarget) return;

          try {
            await deleteMutation.mutateAsync(deleteTarget.id);
            toast({ variant: 'success', title: 'Cliente excluido', message: 'O acesso do dono da academia foi removido.' });
            setDeleteTarget(null);
          } catch (err) {
            toast({ variant: 'error', title: 'Falha ao excluir', message: err instanceof Error ? err.message : 'Nao foi possivel excluir o cliente agora.' });
          }
        }}
      />
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 font-display text-2xl font-semibold text-slateblue md:text-3xl">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-teal">
          <Icon size={20} />
        </span>
      </div>
    </div>
  );
}
