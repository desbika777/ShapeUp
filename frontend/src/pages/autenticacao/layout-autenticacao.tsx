// Layout compartilhado das telas publicas de autenticacao.
import { ShieldCheck } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/brand-logo';

export function LayoutAutenticacao({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      {/* Painel institucional exibido no desktop para reforcar identidade visual. */}
      <section className="hidden bg-slateblue p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="max-w-xl">
          <Link to="/entrar" className="inline-flex">
            <BrandLogo theme="light" size="lg" subtitle="gestao para academias" />
          </Link>
          <p className="mt-14 text-xs font-semibold uppercase tracking-[0.18em] text-mint">Sistema operacional da academia</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight">Controle claro para planos, alunos e treinos.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/72">Acompanhe a rotina da academia em uma central unica, com dados organizados, acesso de gestor e fluxos prontos para a operacao diaria.</p>
        </div>
        <div className="grid gap-4 border-t border-white/12 pt-8">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-white/48">Fluxos principais</p>
            <p className="mt-2 text-lg font-semibold">Planos, alunos, treinos e anexos validados</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-white/48">Seguranca</p>
            <p className="mt-2 text-lg font-semibold">JWT, bcrypt e acesso administrativo</p>
          </div>
        </div>
      </section>
      {/* Area onde cada formulario de autenticacao e renderizado. */}
      <section className="flex items-center justify-center bg-hero-mesh p-5">
        <div className="w-full max-w-lg animate-fade-up rounded-lg border border-slate-200 bg-white p-7 shadow-panel">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/entrar" className="inline-flex">
              <BrandLogo size="sm" theme="dark" />
            </Link>
            <span className="inline-flex items-center gap-2 rounded-md bg-slateblue/10 px-4 py-2 text-sm font-semibold text-slateblue">
              <ShieldCheck size={16} />
              Acesso controlado
            </span>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
