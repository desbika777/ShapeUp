// Tela informativa: novos acessos sao criados pela conta master Shape Up.
import { ArrowLeft, LogIn, ShieldCheck, UserPlus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LayoutAutenticacao } from '@/pages/autenticacao/layout-autenticacao';

const accessFlow: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: LogIn,
    title: 'Entrada com acesso recebido',
    description: 'O dono da academia entra com o e-mail e a senha provisoria recebida pela equipe Shape Up.',
  },
  {
    icon: UserPlus,
    title: 'Conta criada pelo master',
    description: 'A equipe Shape Up libera uma conta para cada academia cliente, sem auto cadastro publico.',
  },
  {
    icon: ShieldCheck,
    title: 'Operacao protegida',
    description: 'O cliente gerencia planos, alunos, treinos e anexos da propria academia, sem criar outros gestores.',
  },
];

export function CadastroPage() {
  return (
    <LayoutAutenticacao>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Acesso controlado</p>
      <h2 className="mt-4 font-display text-4xl font-semibold text-slateblue">Cadastro liberado pela Shape Up</h2>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        O Shape Up nao permite auto cadastro publico. Novos acessos sao criados pela conta master para donos de academia que contrataram a plataforma.
      </p>

      <div className="mt-8 space-y-5">
        {accessFlow.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-teal/10 text-teal">
              <Icon size={20} />
            </span>
            <div>
              <h3 className="font-semibold text-slateblue">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/entrar" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-teal/50 hover:text-teal">
          <ArrowLeft size={16} />
          Voltar para login
        </Link>
        <Link to="/entrar" className="inline-flex items-center justify-center gap-2 rounded-md bg-slateblue px-5 py-3 text-sm font-semibold text-white transition hover:bg-slateblue/90">
          <LogIn size={17} />
          Entrar com acesso
        </Link>
      </div>
    </LayoutAutenticacao>
  );
}
