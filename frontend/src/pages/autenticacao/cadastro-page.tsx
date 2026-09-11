// Pagina de cadastro: cria a primeira conta de gestor da academia.
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { EntradaCadastroUsuario } from '@shape/shared';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutAutenticacao } from '@/pages/autenticacao/layout-autenticacao';
import { registerSchema } from '@/lib/schemas';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { formatCpf } from '@/lib/format';

export function CadastroPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const form = useForm<EntradaCadastroUsuario>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', cpf: '' },
  });

  async function onSubmit(values: EntradaCadastroUsuario) {
    try {
      // Envia CPF sem mascara para o backend validar e salvar padronizado.
      await register({ ...values, cpf: values.cpf.replace(/\D/g, '') });
      navigate('/');
    } catch (error) {
      toast({ variant: 'error', title: 'Falha no cadastro', message: error instanceof Error ? error.message : 'Nao foi possivel concluir o cadastro.' });
    }
  }

  return (
    <LayoutAutenticacao>
      {/* Formulario de primeiro acesso com validacao de senha forte e CPF. */}
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal">Cadastro de usuario</p>
      <h2 className="mt-4 font-display text-4xl font-semibold text-slateblue">Criar conta de gestao</h2>
      <p className="mt-3 text-sm text-slate-500">Cadastre o gestor principal da academia com uma senha forte e acesso imediato ao painel.</p>
      <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="md:col-span-2"><FormField label="Nome completo" error={form.formState.errors.name?.message}><input className={inputClassName(!!form.formState.errors.name)} {...form.register('name')} /></FormField></div>
        <FormField label="E-mail" error={form.formState.errors.email?.message}><input className={inputClassName(!!form.formState.errors.email)} {...form.register('email')} /></FormField>
        <FormField label="CPF" error={form.formState.errors.cpf?.message}><input className={inputClassName(!!form.formState.errors.cpf)} value={form.watch('cpf')} onChange={(event) => form.setValue('cpf', formatCpf(event.target.value), { shouldValidate: true })} /></FormField>
        <FormField label="Senha" error={form.formState.errors.password?.message}><input type="password" className={inputClassName(!!form.formState.errors.password)} {...form.register('password')} /></FormField>
        <FormField label="Confirmar senha" error={form.formState.errors.confirmPassword?.message}><input type="password" className={inputClassName(!!form.formState.errors.confirmPassword)} {...form.register('confirmPassword')} /></FormField>
        <button disabled={form.formState.isSubmitting} className="md:col-span-2 w-full rounded-full bg-slateblue px-5 py-3 font-semibold text-white disabled:opacity-60">
          {form.formState.isSubmitting ? 'Cadastrando...' : 'Cadastrar e entrar'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">Ja possui cadastro? <Link className="font-semibold text-teal" to="/entrar">Voltar para login</Link>.</p>
    </LayoutAutenticacao>
  );
}
