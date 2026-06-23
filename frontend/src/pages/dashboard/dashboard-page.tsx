import { useQuery } from '@tanstack/react-query';
import { BarChart3, Sparkles } from 'lucide-react';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { DashboardMetrics } from '@shapeup/shared';
import { Link } from 'react-router-dom';
import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { QueryState } from '@/components/ui/query-state';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { formatDate, formatStudentStatus, formatWorkoutLevel } from '@/lib/format';

const pieColors = ['#0f766e', '#14b8a6', '#7dd3fc', '#1d4ed8'];

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[108px] animate-pulse rounded-[28px] border border-white/70 bg-white p-6 shadow-panel">
            <div className="h-3 w-24 rounded-full bg-slate-100" />
            <div className="mt-4 h-8 w-20 rounded-full bg-slate-100" />
            <div className="mt-4 h-3 w-32 rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-[420px] animate-pulse rounded-[28px] border border-white/70 bg-white p-6 shadow-panel">
            <div className="h-4 w-40 rounded-full bg-slate-100" />
            <div className="mt-3 h-3 w-56 rounded-full bg-slate-100" />
            <div className="mt-10 h-64 rounded-3xl bg-slate-50" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { token } = useAuth();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard', token],
    queryFn: () => apiRequest<DashboardMetrics>('/dashboard/metrics', { method: 'GET' }, token ?? undefined),
    enabled: Boolean(token),
  });
  const isFirstAccess = Boolean(
    data
    && data.totals.students === 0
    && data.totals.activePlans === 0
    && data.totals.workouts === 0
    && data.recentStudents.length === 0,
  );
  const workoutsByLevel = (data?.workoutsByLevel ?? []).map((entry) => ({
    ...entry,
    label: formatWorkoutLevel(entry.level),
  }));

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Visao executiva" title="Painel de desempenho" description="Acompanhe alunos, planos e treinos com indicadores claros e uma leitura rapida da operacao da academia." action={<div className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white"><Sparkles size={16} /> Relatorio especial</div>} />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        loadingFallback={<DashboardSkeleton />}
      >
        <>
          {isFirstAccess ? (
            <div className="grid gap-6 rounded-[28px] border border-teal/15 bg-white p-6 shadow-panel lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal">Primeiros passos</p>
                <h3 className="mt-3 font-display text-3xl font-semibold text-slateblue">Sua academia comecou agora. Vamos estruturar tudo em 3 passos.</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">Cada conta agora tem o proprio ambiente. Comece cadastrando o plano comercial, depois o primeiro aluno e por fim monte o treino inicial para ativar a operacao.</p>
              </div>
              <div className="rounded-[28px] bg-hero-mesh p-5">
                <div className="space-y-3">
                  <Link to="/plans/new" className="block rounded-3xl bg-white px-5 py-4 shadow-panel transition hover:translate-y-[-1px]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">Passo 1</p>
                    <p className="mt-2 font-display text-2xl font-semibold text-slateblue">Criar o primeiro plano</p>
                  </Link>
                  <Link to="/students/new" className="block rounded-3xl bg-white px-5 py-4 shadow-panel transition hover:translate-y-[-1px]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">Passo 2</p>
                    <p className="mt-2 font-display text-2xl font-semibold text-slateblue">Cadastrar o primeiro aluno</p>
                  </Link>
                  <Link to="/workouts/new" className="block rounded-3xl bg-white px-5 py-4 shadow-panel transition hover:translate-y-[-1px]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">Passo 3</p>
                    <p className="mt-2 font-display text-2xl font-semibold text-slateblue">Montar o primeiro treino</p>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total de alunos" value={String(data?.totals.students ?? 0)} trend="Base ativa" />
            <MetricCard label="Planos ativos" value={String(data?.totals.activePlans ?? 0)} trend="Oferta vigente" />
            <MetricCard label="Treinos cadastrados" value={String(data?.totals.workouts ?? 0)} trend="Volume operacional" />
            <MetricCard label="Novos alunos no mes" value={String(data?.totals.newStudentsThisMonth ?? 0)} trend="Aquisicao recente" />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-panel">
              <div className="mb-4 flex items-center gap-3">
                <BarChart3 className="text-teal" />
                <div>
                  <h3 className="font-display text-2xl font-semibold text-slateblue">Alunos por plano</h3>
                  <p className="text-sm text-slate-500">Distribuicao atual da carteira de alunos.</p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer>
                  <BarChart data={data?.studentsByPlan ?? []}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="students" name="Alunos" fill="#0f766e" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-panel">
              <h3 className="font-display text-2xl font-semibold text-slateblue">Treinos por nivel</h3>
              <p className="mt-1 text-sm text-slate-500">Equilibrio entre prescricao basica, intermediaria e avancada.</p>
              <div className="mt-5 h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={workoutsByLevel} dataKey="workouts" nameKey="label" innerRadius={60} outerRadius={95} paddingAngle={3}>
                      {workoutsByLevel.map((entry, index) => <Cell key={entry.level} fill={pieColors[index % pieColors.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-panel">
            <h3 className="font-display text-2xl font-semibold text-slateblue">Alunos recentes</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {(data?.recentStudents ?? []).map((student) => (
                <div key={student.id} className="rounded-3xl bg-slate-50 p-4">
                  <p className="font-semibold text-slateblue">{student.name}</p>
                  <p className="mt-2 text-sm text-slate-500">{student.goal}</p>
                  <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-teal">
                    <span>{formatStudentStatus(student.status)}</span>
                    <span>{formatDate(student.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      </QueryState>
    </div>
  );
}
