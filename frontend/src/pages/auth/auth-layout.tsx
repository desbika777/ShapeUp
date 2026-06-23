import { ArrowRight } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/brand-logo';

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-slateblue p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0">
          <div className="absolute left-[-4rem] top-[-5rem] h-56 w-56 rounded-full bg-mint/25 blur-3xl" />
          <div className="absolute bottom-16 right-12 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />
          <div className="absolute inset-8 rounded-[40px] border border-white/10" />
        </div>
        <div className="relative rounded-3xl bg-white/10 p-8 backdrop-blur">
          <Link to="/login" className="inline-flex">
            <BrandLogo theme="light" size="lg" subtitle="gestao premium para academias" />
          </Link>
          <h1 className="mt-10 max-w-lg font-display text-5xl font-semibold leading-tight">Uma identidade premium para academias que querem crescer com autoridade.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/72">Um visual mais forte, memoravel e confiavel para valorizar a marca desde o primeiro contato com o cliente.</p>
        </div>
        <div className="relative flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
          <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-5 py-3 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-mint/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-mint/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-mint/90" />
          </div>
          <span className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
        </div>
      </section>
      <section className="flex items-center justify-center bg-hero-mesh p-5">
        <div className="w-full max-w-xl animate-fade-up rounded-[36px] border border-white/65 bg-white/88 p-8 shadow-panel backdrop-blur">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/login" className="inline-flex">
              <BrandLogo size="sm" theme="dark" />
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-slateblue px-4 py-2 text-sm font-semibold text-white">
              Criar acesso <ArrowRight size={16} />
            </Link>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
