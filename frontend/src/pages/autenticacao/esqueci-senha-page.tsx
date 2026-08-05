// Pagina de recuperacao: solicita link seguro de redefinicao de senha.
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ApiMessageResponse, ForgotPasswordInput } from '@shape/shared';
import { Link } from 'react-router-dom';
import { LayoutAutenticacao } from '@/pages/autenticacao/layout-autenticacao';
import { FormField, inputClassName } from '@/components/ui/form-field';
import { useToast } from '@/components/ui/toast';
import { apiRequest } from '@/lib/api';
import { forgotPasswordSchema } from '@/lib/schemas';

export function EsqueciSenhaPage() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    try {
      // Normaliza o e-mail antes de enviar para a API.
      const response = await apiRequest<ApiMessageResponse>('/autenticacao/esqueci-senha', {
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
    <LayoutAutenticacao>
      {/* Mensagem generica evita revelar se o e-mail existe no sistema. */}
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
      <p className="mt-6 text-sm text-slate-500">Lembrou a senha? <Link className="font-semibold text-teal" to="/entrar">Voltar para login</Link>.</p>
    </LayoutAutenticacao>
  );
}
