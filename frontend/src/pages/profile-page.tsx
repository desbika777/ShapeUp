import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { UserUpdateInput } from '@shapeup/shared';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { updateUserSchema } from '@/lib/schemas';
import { formatCpf } from '@/lib/format';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const form = useForm<UserUpdateInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name ?? '',
      cpf: user?.cpf ?? '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: UserUpdateInput) {
    try {
      const trimmedCurrentPassword = values.currentPassword?.trim();
      const trimmedPassword = values.password?.trim();
      const trimmedConfirmPassword = values.confirmPassword?.trim();

      await updateProfile({
        name: values.name,
        cpf: values.cpf.replace(/\D/g, ''),
        currentPassword: trimmedCurrentPassword || undefined,
        password: trimmedPassword || undefined,
        confirmPassword: trimmedConfirmPassword || undefined,
      });

      form.reset({
        name: values.name,
        cpf: formatCpf(values.cpf),
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
      toast({ variant: 'success', title: 'Perfil atualizado', message: 'Seus dados foram salvos com sucesso.' });
    } catch (error) {
      toast({ variant: 'error', title: 'Falha ao atualizar', message: error instanceof Error ? error.message : 'Nao foi possivel atualizar agora.' });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Perfil do gestor" title="Minha conta" description="Atualize seus dados pessoais, redefina a senha e mantenha seu acesso sempre seguro. O e-mail permanece fixo conforme a regra da rubrica." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-panel">
          <p className="text-sm uppercase tracking-[0.25em] text-teal">Identidade</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-slateblue">{user?.name}</h3>
          <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
          <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm text-slate-500">
            <p>Seu e-mail nao pode ser alterado nesta versao para preservar a integridade da autenticacao.</p>
          </div>
        </div>
        <form className="rounded-[28px] border border-white/70 bg-white p-6 shadow-panel" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2"><FormField label="Nome" error={form.formState.errors.name?.message}><input className={inputClassName(!!form.formState.errors.name)} {...form.register('name')} /></FormField></div>
            <FormField label="CPF" error={form.formState.errors.cpf?.message}><input className={inputClassName(!!form.formState.errors.cpf)} value={form.watch('cpf')} onChange={(event) => form.setValue('cpf', formatCpf(event.target.value), { shouldValidate: true })} /></FormField>
            <FormField label="E-mail" error={undefined}><input disabled value={user?.email ?? ''} className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500" /></FormField>
            <div className="md:col-span-2"><FormField label="Senha atual" error={form.formState.errors.currentPassword?.message}><input type="password" className={inputClassName(!!form.formState.errors.currentPassword)} {...form.register('currentPassword')} /></FormField></div>
            <FormField label="Nova senha" error={form.formState.errors.password?.message}><input type="password" className={inputClassName(!!form.formState.errors.password)} {...form.register('password')} /></FormField>
            <FormField label="Confirmar nova senha" error={form.formState.errors.confirmPassword?.message}><input type="password" className={inputClassName(!!form.formState.errors.confirmPassword)} {...form.register('confirmPassword')} /></FormField>
          </div>
          <button disabled={form.formState.isSubmitting} className="mt-6 rounded-full bg-slateblue px-5 py-3 font-semibold text-white disabled:opacity-60">
            {form.formState.isSubmitting ? 'Salvando...' : 'Salvar alteracoes'}
          </button>
        </form>
      </div>
    </div>
  );
}
