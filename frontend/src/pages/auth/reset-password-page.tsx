import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { ApiMessageResponse, ResetPasswordInput } from '@shapeup/shared';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '@/pages/auth/auth-layout';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { useToast } from '@/components/ui/toast';
import { apiRequest } from '@/lib/api';
import { resetPasswordSchema } from '@/lib/schemas';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get('token') ?? '';
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    form.setValue('token', token, { shouldValidate: true });
  }, [form, token]);

  async function onSubmit(values: ResetPasswordInput) {
    try {
      const response = await apiRequest<ApiMessageResponse>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token: values.token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      toast({ variant: 'success', title: 'Senha redefinida', message: response.message });
      navigate('/login', { replace: true });
    } catch (error) {
      toast({ variant: 'error', title: 'Falha ao redefinir', message: error instanceof Error ? error.message : 'Nao foi possivel redefinir a senha.' });
    }
  }

  if (!token) {
    return (
      <AuthLayout>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal">Link invalido</p>
        <h2 className="mt-4 font-display text-4xl font-semibold text-slateblue">Solicite um novo acesso</h2>
        <p className="mt-3 text-sm text-slate-500">O link de redefinicao esta incompleto ou expirou. Gere um novo e-mail para continuar com seguranca.</p>
        <Link className="mt-8 inline-flex rounded-full bg-slateblue px-5 py-3 font-semibold text-white" to="/forgot-password">
          Solicitar novo link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal">Nova senha</p>
      <h2 className="mt-4 font-display text-4xl font-semibold text-slateblue">Crie uma nova senha</h2>
      <p className="mt-3 text-sm text-slate-500">Defina uma senha forte para retomar o acesso com seguranca.</p>
      <form className="mt-8 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField label="Nova senha" error={form.formState.errors.password?.message}>
          <input type="password" className={inputClassName(!!form.formState.errors.password)} {...form.register('password')} />
        </FormField>
        <FormField label="Confirmar nova senha" error={form.formState.errors.confirmPassword?.message}>
          <input type="password" className={inputClassName(!!form.formState.errors.confirmPassword)} {...form.register('confirmPassword')} />
        </FormField>
        <button disabled={form.formState.isSubmitting} className="w-full rounded-full bg-slateblue px-5 py-3 font-semibold text-white transition hover:translate-y-[-1px] disabled:opacity-60">
          {form.formState.isSubmitting ? 'Salvando nova senha...' : 'Salvar nova senha'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">Voltar para <Link className="font-semibold text-teal" to="/login">login</Link>.</p>
    </AuthLayout>
  );
}
