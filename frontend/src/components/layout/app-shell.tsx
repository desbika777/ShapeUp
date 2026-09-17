// Layout principal do painel: sidebar, topo, menu mobile e area de conteudo.
import { BadgeDollarSign, Dumbbell, LayoutDashboard, LogOut, Paperclip, ShieldCheck, UserCircle2, Users } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/brand-logo';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/cn';

const navigation = [
  // Itens usados tanto no menu lateral desktop quanto no menu inferior mobile.
  { label: 'Painel', icon: LayoutDashboard, to: '/' },
  { label: 'Planos', icon: BadgeDollarSign, to: '/planos' },
  { label: 'Alunos', icon: Users, to: '/alunos' },
  { label: 'Treinos', icon: Dumbbell, to: '/treinos' },
  { label: 'Clientes', icon: ShieldCheck, to: '/usuarios', masterOnly: true },
  { label: 'Anexos', icon: Paperclip, to: '/imagens' },
  { label: 'Perfil', icon: UserCircle2, to: '/perfil' },
];

export function AppShell({ children }: PropsWithChildren) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const isMaster = user?.perfil === 'MASTER';
  const navigationItems = navigation.filter((item) => {
    if ('masterOnly' in item && item.masterOnly) return isMaster;
    return true;
  });

  return (
    <div className="min-h-screen bg-hero-mesh font-body text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1440px] gap-5 px-4 py-4 lg:px-6">
        {/* Menu lateral fixo para telas grandes. */}
        <aside className="hidden w-64 shrink-0 flex-col justify-between rounded-lg bg-slateblue px-5 py-6 text-white shadow-panel lg:flex">
          <div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/8 p-4">
              <BrandLogo theme="light" size="md" subtitle="gestao para academias" />
            </div>

            <nav className="mt-8 space-y-1.5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => cn('flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition', isActive ? 'bg-white text-slateblue shadow-lg' : 'text-white/78 hover:bg-white/10')}
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/entrar');
            }}
            className="flex items-center gap-3 rounded-md border border-white/15 px-4 py-3 text-sm text-white/88 hover:bg-white/10"
          >
            <LogOut size={18} /> Sair
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Cabecalho mostra contexto da conta e dados do usuario logado. */}
          <header className="mb-5 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <BrandLogo size="sm" theme="dark" className="lg:hidden" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal">{isMaster ? 'Master Shape Up' : 'Central Shape Up'}</p>
                  <h2 className="mt-1 font-display text-xl font-semibold leading-tight text-slateblue md:text-2xl">
                    <span className="hidden sm:inline">{isMaster ? 'Gestao completa da plataforma e academia' : 'Gestao operacional da academia'}</span>
                    <span className="sm:hidden">{isMaster ? 'Gestao completa' : 'Gestao operacional'}</span>
                  </h2>
                </div>
              </div>
              <div className="flex items-start gap-3 md:items-center">
                <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slateblue md:min-w-[240px]">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Sessao ativa</p>
                  <p className="mt-1 truncate font-display text-lg font-semibold">{user?.name}</p>
                  <p className="truncate text-sm text-slate-500">{user?.email}</p>
                  <p className="mt-2 inline-flex rounded-md bg-teal/10 px-2.5 py-1 text-xs font-semibold text-teal">{isMaster ? 'Master Shape Up' : 'Dono da academia'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/entrar');
                  }}
                  className="rounded-md border border-slate-200 bg-white px-4 py-4 text-slateblue shadow-sm lg:hidden"
                  aria-label="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </header>
          {/* Menu horizontal para celular, sem sobrepor conteudo do painel. */}
          <nav className="mb-5 rounded-lg border border-slate-200 bg-white p-2 shadow-sm lg:hidden">
            <div className="grid grid-cols-4 gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-md px-1.5 py-2 text-[10px] font-semibold',
                        isActive ? 'bg-slateblue text-white' : 'text-slateblue hover:bg-slate-100',
                      )
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </nav>
          <main className="pb-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

