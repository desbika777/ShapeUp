// Servico do dashboard: consolida dados de diferentes modulos para os graficos.
import type { IndicadoresPainel } from '@shape/shared';
import type { IRepositorioPlano, IRepositorioAluno, IRepositorioTreino } from '../repositories/interfaces.js';
import { chaveCache, type IServicoCache, ServicoCacheNulo } from './cache-service.js';

export class ServicoPainel {
  constructor(
    private readonly studentRepository: IRepositorioAluno,
    private readonly planRepository: IRepositorioPlano,
    private readonly workoutRepository: IRepositorioTreino,
    private readonly cacheService: IServicoCache = new ServicoCacheNulo(),
  ) {}

  // Executa consultas em paralelo para montar a visao executiva rapidamente.
  async getMetrics(ownerId: string): Promise<IndicadoresPainel> {
    return this.cacheService.remember(chaveCache(ownerId, 'painel:indicadores'), () => this.calcularMetricas(ownerId));
  }

  private async calcularMetricas(ownerId: string): Promise<IndicadoresPainel> {
    const [students, activePlans, workouts, newStudentsThisMonth, studentsByPlan, workoutsByLevel, recentStudents] = await Promise.all([
      this.studentRepository.contarTodos(ownerId),
      this.planRepository.contarAtivos(ownerId),
      this.workoutRepository.contarTodos(ownerId),
      this.studentRepository.contarNovosNoMesAtual(ownerId),
      this.planRepository.contarAlunosPorPlano(ownerId),
      this.workoutRepository.contarPorNivel(ownerId),
      this.studentRepository.buscarRecentes(ownerId, 5),
    ]);

    return {
      totals: { students, activePlans, workouts, newStudentsThisMonth },
      studentsByPlan,
      workoutsByLevel,
      recentStudents,
    };
  }
}
