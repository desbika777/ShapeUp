import type { DashboardMetrics } from '@shapeup/shared';
import type { IPlanRepository, IStudentRepository, IWorkoutRepository } from '../repositories/interfaces.js';

export class DashboardService {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly planRepository: IPlanRepository,
    private readonly workoutRepository: IWorkoutRepository,
  ) {}

  async getMetrics(ownerId: string): Promise<DashboardMetrics> {
    const [students, activePlans, workouts, newStudentsThisMonth, studentsByPlan, workoutsByLevel, recentStudents] = await Promise.all([
      this.studentRepository.countAll(ownerId),
      this.planRepository.countActive(ownerId),
      this.workoutRepository.countAll(ownerId),
      this.studentRepository.countNewInCurrentMonth(ownerId),
      this.planRepository.countStudentsByPlan(ownerId),
      this.workoutRepository.countByLevel(ownerId),
      this.studentRepository.findRecent(ownerId, 5),
    ]);

    return {
      totals: { students, activePlans, workouts, newStudentsThisMonth },
      studentsByPlan,
      workoutsByLevel,
      recentStudents,
    };
  }
}
