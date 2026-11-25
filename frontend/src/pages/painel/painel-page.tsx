// Pagina inicial autenticada: mostra indicadores e graficos da academia.
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Users } from 'lucide-react';
import type { IndicadoresPainel } from '@shape/shared';
import { Link } from 'react-router-dom';
import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { QueryState } from '@/components/ui/query-state';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { formatDate, formatarStatusAluno, formatarNivelTreino } from '@/lib/format';

const levelColors = ['#0f766e', '#2563eb', '#7c3aed', '#c2410c'];

function DashboardSkeleton() {
  // Mantem a estrutura visual enquanto os indicadores carregam.
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[108px] animate-pulse rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-3 w-24 rounded-full bg-slate-100" />
            <div className="mt-4 h-8 w-20 rounded-full bg-slate-100" />
            <div className="mt-4 h-3 w-32 rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-[420px] animate-pulse rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-4 w-40 rounded-full bg-slate-100" />
            <div className="mt-3 h-3 w-56 rounded-full bg-slate-100" />
            <div className="mt-10 h-64 rounded-lg bg-slate-50" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PainelPage() {
  const { token } = useAuth();
  // Busca metricas consolidadas no backend com React Query.
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard', token],
    queryFn: () => apiRequest<IndicadoresPainel>('/painel/indicadores', { method: 'GET' }, token ?? undefined),
    enabled: Boolean(token),
  });

  // Quando a conta ainda nao tem dados, exibimos um roteiro de primeiros passos.
  const isFirstAccess = Boolean(
    data
    && data.totals.students === 0
    && data.totals.activePlans === 0
    && data.totals.workouts === 0
    && data.recentStudents.length === 0,
  );
  // Adiciona labels em portugues aos dados do grafico de treinos.
  const workoutsByLevel = (data?.workoutsByLevel ?? []).map((entry) => ({
    ...entry,
    label: formatarNivelTreino(entry.level),
  }));
  const maxWorkoutsByLevel = Math.max(...workoutsByLevel.map((entry) => entry.workouts), 1);
  const studentsByPlan = data?.studentsByPlan ?? [];
  const maxStudentsByPlan = Math.max(...studentsByPlan.map((entry) => entry.students), 1);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Visao executiva"
        title="Painel de desempenho"
        description="Acompanhe alunos, planos e treinos com indicadores claros e uma leitura rapida da operacao da academia."
        action={<Link to="/alunos" className="inline-flex items-center gap-2 rounded-md bg-slateblue px-4 py-2.5 text-sm font-semibold text-white"><Users size={16} /> Ver alunos</Link>}
      />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        loadingFallback={<DashboardSkeleton />}
      >
        <>
          {/* Bloco de onboarding para contas novas. */}
          {isFirstAccess ? (
            <div className="grid gap-6 rounded-lg border border-teal/15 bg-white p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Primeiros passos</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-slateblue">Sua academia comecou agora. Vamos estruturar tudo em 3 passos.</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">Cada conta agora tem o proprio ambiente. Comece cadastrando o plano comercial, depois o primeiro aluno e por fim monte o treino inicial para ativar a operacao.</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="space-y-3">
                  <Link to="/planos/novo" className="block rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-teal/50">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Passo 1</p>
                    <p className="mt-2 font-display text-xl font-semibold text-slateblue">Criar o primeiro plano</p>
                  </Link>
                  <Link to="/alunos/novo" className="block rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-teal/50">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Passo 2</p>
                    <p className="mt-2 font-display text-xl font-semibold text-slateblue">Cadastrar o primeiro aluno</p>
                  </Link>
                  <Link to="/treinos/novo" className="block rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-teal/50">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Passo 3</p>
                    <p className="mt-2 font-display text-xl font-semibold text-slateblue">Montar o primeiro treino</p>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {/* Cards resumem os numeros mais importantes da operacao. */}
            <MetricCard label="Total de alunos" value={String(data?.totals.students ?? 0)} trend="Base ativa" />
            <MetricCard label="Planos ativos" value={String(data?.totals.activePlans ?? 0)} trend="Oferta vigente" />
            <MetricCard label="Treinos cadastrados" value={String(data?.totals.workouts ?? 0)} trend="Volume operacional" />
            <MetricCard label="Novos alunos no mes" value={String(data?.totals.newStudentsThisMonth ?? 0)} trend="Aquisicao recente" />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            {/* Barras proporcionais mostram distribuicao de alunos por plano sem depender de canvas. */}
            <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <BarChart3 className="text-teal" />
                <div>
                  <h3 className="font-display text-xl font-semibold text-slateblue">Alunos por plano</h3>
                  <p className="text-sm text-slate-500">Distribuicao atual da carteira de alunos.</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {studentsByPlan.length > 0 ? studentsByPlan.map((entry) => (
                  <div key={entry.name}>
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="truncate font-medium text-slateblue">{entry.name}</span>
                      <span className="font-semibold text-slateblue">{entry.students}</span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-slate-100">
                      <div
                        className="h-3 rounded-full bg-teal"
                        style={{ width: `${Math.max((entry.students / maxStudentsByPlan) * 100, 8)}%` }}
                      />
                    </div>
                  </div>
                )) : (
                  <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Nenhum aluno vinculado a plano por enquanto.</p>
                )}
              </div>
            </div>
            {/* Lista proporcional evita que a distribuicao fique ilegivel quando ha poucos dados. */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-xl font-semibold text-slateblue">Treinos por nivel</h3>
              <p className="mt-1 text-sm text-slate-500">Equilibrio entre prescricao basica, intermediaria e avancada.</p>
              <div className="mt-6 space-y-4">
                {workoutsByLevel.length > 0 ? workoutsByLevel.map((entry, index) => (
                  <div key={entry.level}>
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-medium text-slateblue">{entry.label}</span>
                      <span className="font-semibold text-slateblue">{entry.workouts}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${Math.max((entry.workouts / maxWorkoutsByLevel) * 100, 8)}%`,
                          backgroundColor: levelColors[index % levelColors.length],
                        }}
                      />
                    </div>
                  </div>
                )) : (
                  <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Nenhum treino cadastrado por enquanto.</p>
                )}
              </div>
            </div>
          </div>
          {/* Lista curta ajuda a acompanhar os cadastros mais recentes. */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-display text-xl font-semibold text-slateblue">Alunos recentes</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {(data?.recentStudents ?? []).map((student) => (
                <div key={student.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <p className="font-semibold text-slateblue">{student.name}</p>
                  <p className="mt-2 text-sm text-slate-500">{student.goal}</p>
                  <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.12em] text-teal">
                    <span>{formatarStatusAluno(student.status)}</span>
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
