// Pagina de perfil: atualiza dados do gestor e permite troca de senha.
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { EntradaAtualizacaoUsuario } from '@shape/shared';
import { IdCard, KeyRound, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormActions, FormCard, GuidanceCard } from '@/components/ui/form-layout';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { updateUserSchema } from '@/lib/schemas';
import { formatCpf } from '@/lib/format';

export function PerfilPage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const mustChangePassword = Boolean(user?.mustChangePassword);
  const form = useForm<EntradaAtualizacaoUsuario>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name ?? '',
      cpf: formatCpf(user?.cpf ?? ''),
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: EntradaAtualizacaoUsuario) {
    try {
      // Campos de senha vazios significam que o usuario quer alterar apenas dados pessoais.
      const trimmedCurrentPassword = values.currentPassword?.trim();
      const trimmedPassword = values.password?.trim();
      const trimmedConfirmPassword = values.confirmPassword?.trim();

      if (mustChangePassword && (!trimmedCurrentPassword || !trimmedPassword || !trimmedConfirmPassword)) {
        if (!trimmedCurrentPassword) form.setError('currentPassword', { message: 'Informe a senha provisoria recebida.' });
        if (!trimmedPassword) form.setError('password', { message: 'Informe sua nova senha.' });
        if (!trimmedConfirmPassword) form.setError('confirmPassword', { message: 'Confirme sua nova senha.' });
        return;
      }

      await updateProfile({
        // CPF vai sem mascara para manter o mesmo padrao do banco.
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
      toast({
        variant: 'success',
        title: mustChangePassword ? 'Senha definida' : 'Perfil atualizado',
        message: mustChangePassword ? 'Seu acesso esta pronto para usar.' : 'Seus dados foram salvos com sucesso.',
      });

      if (mustChangePassword) {
        navigate('/painel', { replace: true });
      }
    } catch (error) {
      toast({ variant: 'error', title: 'Falha ao atualizar', message: error instanceof Error ? error.message : 'Nao foi possivel atualizar agora.' });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={mustChangePassword ? 'Primeiro acesso' : 'Perfil do gestor'}
        title={mustChangePassword ? 'Defina sua senha de acesso' : 'Minha conta'}
        description={mustChangePassword ? 'Sua conta foi criada com uma senha provisoria. Troque por uma senha propria para liberar o painel da academia.' : 'Atualize seus dados pessoais, redefina a senha e mantenha seu acesso sempre seguro. O e-mail permanece fixo para preservar a identidade da conta.'}
      />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Resumo lateral mostra a identidade da conta autenticada. */}
        <GuidanceCard
          icon={ShieldCheck}
          eyebrow={mustChangePassword ? 'Senha provisoria' : 'Identidade'}
          title={user?.name ?? 'Gestor autenticado'}
          description={mustChangePassword ? 'Informe a senha provisoria recebida e escolha uma senha definitiva para sua academia.' : user?.email ?? 'Conta conectada ao Shape Up.'}
          items={mustChangePassword ? [
            'Use a senha provisoria no campo de senha atual.',
            'Escolha uma senha forte que so voce conheca.',
            'Depois de salvar, voce sera levado ao painel para criar planos, alunos e treinos.',
          ] : [
            'O e-mail permanece fixo para preservar a integridade da autenticacao.',
            'Para alterar senha, informe a senha atual e confirme a nova senha.',
            'Os dados de perfil usam as mesmas regras de CPF e senha forte do cadastro.',
          ]}
        />
        {/* Formulario de atualizacao envia dados para /usuarios/me. */}
        <FormCard onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2"><FormField label="Nome" error={form.formState.errors.name?.message}><div className="relative"><UserRound className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input className={`${inputClassName(!!form.formState.errors.name)} pl-10`} {...form.register('name')} /></div></FormField></div>
            <FormField label="CPF" error={form.formState.errors.cpf?.message}><div className="relative"><IdCard className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input className={`${inputClassName(!!form.formState.errors.cpf)} pl-10`} placeholder="000.000.000-00" value={form.watch('cpf')} onChange={(event) => form.setValue('cpf', formatCpf(event.target.value), { shouldValidate: true })} /></div></FormField>
            <FormField label="E-mail" error={undefined}><div className="relative"><Mail className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input disabled value={user?.email ?? ''} className="w-full rounded-md border border-slate-200 bg-slate-100 px-4 py-3 pl-10 text-sm text-slate-500" /></div></FormField>
            <div className="md:col-span-2"><FormField label={mustChangePassword ? 'Senha provisoria atual' : 'Senha atual'} error={form.formState.errors.currentPassword?.message}><div className="relative"><KeyRound className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input type="password" className={`${inputClassName(!!form.formState.errors.currentPassword)} pl-10`} {...form.register('currentPassword')} /></div></FormField></div>
            <FormField label="Nova senha" error={form.formState.errors.password?.message}><input type="password" className={inputClassName(!!form.formState.errors.password)} {...form.register('password')} /></FormField>
            <FormField label="Confirmar nova senha" error={form.formState.errors.confirmPassword?.message}><input type="password" className={inputClassName(!!form.formState.errors.confirmPassword)} {...form.register('confirmPassword')} /></FormField>
          </div>
          <FormActions backTo={mustChangePassword ? undefined : '/painel'} isSubmitting={form.formState.isSubmitting} submitLabel={mustChangePassword ? 'Definir senha e continuar' : 'Salvar alteracoes'} />
        </FormCard>
      </div>
    </div>
  );
}
