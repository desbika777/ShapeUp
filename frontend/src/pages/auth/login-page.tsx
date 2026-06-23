import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { UserLoginInput } from '@shapeup/shared';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/pages/auth/auth-layout';
import { loginFormSchema } from '@/lib/schemas';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';

type LoginFormInput = UserLoginInput & {
  rememberAccess: boolean;
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const form = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '', rememberAccess: true },
  });

  async function onSubmit(values: LoginFormInput) {
    const { rememberAccess, ...credentials } = values;

    try {
      await login(credentials, { rememberAccess });
      navigate(location.state?.from?.pathname ?? '/');
    } catch (error) {
      toast({ variant: 'error', title: 'Falha no login', message: error instanceof Error ? error.message : 'Nao foi possivel autenticar agora.' });
    }
  }

  return (
    <AuthLayout>
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal">Acesso seguro</p>
      <h2 className="mt-4 font-display text-4xl font-semibold text-slateblue">Entrar na central ShapeUp</h2>
      <p className="mt-3 text-sm text-slate-500">Use seu e-mail e senha para acessar o painel de gestao da academia.</p>
      <form className="mt-8 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField label="E-mail" error={form.formState.errors.email?.message}>
          <input className={inputClassName(!!form.formState.errors.email)} {...form.register('email')} />
        </FormField>
        <FormField label="Senha" error={form.formState.errors.password?.message}>
          <input type="password" className={inputClassName(!!form.formState.errors.password)} {...form.register('password')} />
        </FormField>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slateblue">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-teal accent-teal"
              {...form.register('rememberAccess')}
            />
            Lembrar meu acesso
          </label>
          <Link className="text-sm font-semibold text-teal" to="/forgot-password">Esqueci minha senha</Link>
        </div>
        <button disabled={form.formState.isSubmitting} className="w-full rounded-full bg-slateblue px-5 py-3 font-semibold text-white transition hover:translate-y-[-1px] disabled:opacity-60">
          {form.formState.isSubmitting ? 'Entrando...' : 'Entrar agora'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">Primeiro acesso? <Link className="font-semibold text-teal" to="/register">Crie sua conta</Link>.</p>
    </AuthLayout>
  );
}
