import { BadgeDollarSign, Dumbbell, LayoutDashboard, LogOut, UserCircle2, Users } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/brand-logo';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/cn';

const navigation = [
  { label: 'Painel', icon: LayoutDashboard, to: '/' },
  { label: 'Planos', icon: BadgeDollarSign, to: '/plans' },
  { label: 'Alunos', icon: Users, to: '/students' },
  { label: 'Treinos', icon: Dumbbell, to: '/workouts' },
  { label: 'Perfil', icon: UserCircle2, to: '/profile' },
];

export function AppShell({ children }: PropsWithChildren) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-hero-mesh font-body text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-[290px] flex-col justify-between rounded-[36px] bg-slateblue px-6 py-8 text-white shadow-panel lg:flex">
          <div>
            <div className="flex items-center gap-3 rounded-3xl bg-white/10 p-4 backdrop-blur">
              <BrandLogo theme="light" size="md" subtitle="gestao para academias" />
            </div>

            <nav className="mt-10 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition', isActive ? 'bg-white text-slateblue shadow-lg' : 'text-white/78 hover:bg-white/10')}
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
              navigate('/login');
            }}
            className="flex items-center gap-3 rounded-2xl border border-white/15 px-4 py-3 text-sm text-white/88 hover:bg-white/10"
          >
            <LogOut size={18} /> Sair
          </button>
        </aside>

        <div className="flex-1">
          <header className="mb-6 rounded-[32px] border border-white/60 bg-white/80 px-6 py-5 shadow-panel backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <BrandLogo size="sm" theme="dark" className="lg:hidden" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal">Central de desempenho</p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-slateblue">Gestao completa para a sua academia de alta performance</h2>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-1 rounded-3xl bg-gradient-to-br from-slateblue to-teal px-5 py-4 text-white">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/65">Sessao ativa</p>
                  <p className="mt-1 font-display text-xl font-semibold">{user?.name}</p>
                  <p className="text-sm text-white/70">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="lg:hidden rounded-3xl border border-white/60 bg-white/80 px-4 py-4 text-slateblue shadow-sm"
                  aria-label="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </header>
          <main className="pb-28 lg:pb-8">{children}</main>
        </div>
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-40 rounded-[28px] border border-white/60 bg-white/85 p-2 shadow-panel backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold',
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
    </div>
  );
}

