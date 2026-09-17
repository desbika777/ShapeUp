import type { Aluno, IndicadoresPainel, Plano, RespostaAutenticacao, Treino } from '@shape/shared';

export type DashboardData = {
  indicators: IndicadoresPainel;
  plans: Plano[];
  students: Aluno[];
  workouts: Treino[];
};

export type DashboardTab = 'painel' | 'clientes' | 'planos' | 'alunos' | 'treinos' | 'conta';

export type DashboardTabProps = {
  apiUrl: string;
  session: RespostaAutenticacao;
  data: DashboardData;
  isAdmin: boolean;
  onRefresh: () => Promise<void>;
};
