import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ApiMessageResponse, ForgotPasswordInput } from '@shapeup/shared';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/pages/auth/auth-layout';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { useToast } from '@/components/ui/toast';
import { apiRequest } from '@/lib/api';
import { forgotPasswordSchema } from '@/lib/schemas';

export function ForgotPasswordPage() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    try {
      const response = await apiRequest<ApiMessageResponse>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: values.email.trim().toLowerCase() }),
      });

      setHasSubmitted(true);
      form.reset();
      toast({ variant: 'success', title: 'Verifique seu e-mail', message: response.message });
    } catch (error) {
      toast({ variant: 'error', title: 'Falha ao enviar link', message: error instanceof Error ? error.message : 'Nao foi possivel enviar o link de redefinicao.' });
    }
  }

  return (
    <AuthLayout>
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal">Recuperacao de acesso</p>
      <h2 className="mt-4 font-display text-4xl font-semibold text-slateblue">Redefinir senha</h2>
      <p className="mt-3 text-sm text-slate-500">Informe o e-mail da conta para receber o link seguro de redefinicao.</p>
      <form className="mt-8 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField label="E-mail" error={form.formState.errors.email?.message}>
          <input className={inputClassName(!!form.formState.errors.email)} {...form.register('email')} />
        </FormField>
        <button disabled={form.formState.isSubmitting} className="w-full rounded-full bg-slateblue px-5 py-3 font-semibold text-white transition hover:translate-y-[-1px] disabled:opacity-60">
          {form.formState.isSubmitting ? 'Enviando link...' : 'Enviar link de redefinicao'}
        </button>
      </form>
      {hasSubmitted ? (
        <div className="mt-6 rounded-3xl border border-teal/20 bg-teal/5 p-4 text-sm text-slate-500">
          Se o e-mail estiver cadastrado, o link chegara em instantes na sua caixa de entrada.
        </div>
      ) : null}
      <p className="mt-6 text-sm text-slate-500">Lembrou a senha? <Link className="font-semibold text-teal" to="/login">Voltar para login</Link>.</p>
    </AuthLayout>
  );
}
