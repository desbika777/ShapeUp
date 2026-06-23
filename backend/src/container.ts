import type { IPlanRepository, IStudentRepository, IUserRepository, IWorkoutRepository } from './repositories/interfaces.js';
import { PrismaPlanRepository } from './repositories/prisma/prisma-plan-repository.js';
import { PrismaStudentRepository } from './repositories/prisma/prisma-student-repository.js';
import { PrismaUserRepository } from './repositories/prisma/prisma-user-repository.js';
import { PrismaWorkoutRepository } from './repositories/prisma/prisma-workout-repository.js';
import { AuthController } from './controllers/auth-controller.js';
import { DashboardController } from './controllers/dashboard-controller.js';
import { PlanController } from './controllers/plan-controller.js';
import { StudentController } from './controllers/student-controller.js';
import { WorkoutController } from './controllers/workout-controller.js';
import { AuthService } from './services/auth-service.js';
import { DashboardService } from './services/dashboard-service.js';
import type { IMailService } from './services/mail-service.js';
import { PlanService } from './services/plan-service.js';
import { SmtpMailService } from './services/smtp-mail-service.js';
import { StudentService } from './services/student-service.js';
import { WorkoutService } from './services/workout-service.js';

export type RepositoryDependencies = {
  userRepository: IUserRepository;
  planRepository: IPlanRepository;
  studentRepository: IStudentRepository;
  workoutRepository: IWorkoutRepository;
  mailService: IMailService;
};

export function createControllers(overrides?: Partial<RepositoryDependencies>) {
  const userRepository = overrides?.userRepository ?? new PrismaUserRepository();
  const planRepository = overrides?.planRepository ?? new PrismaPlanRepository();
  const studentRepository = overrides?.studentRepository ?? new PrismaStudentRepository();
  const workoutRepository = overrides?.workoutRepository ?? new PrismaWorkoutRepository();
  const mailService = overrides?.mailService ?? new SmtpMailService();

  const authService = new AuthService(userRepository, mailService);
  const planService = new PlanService(planRepository, studentRepository);
  const studentService = new StudentService(studentRepository, planRepository);
  const workoutService = new WorkoutService(workoutRepository, studentRepository);
  const dashboardService = new DashboardService(studentRepository, planRepository, workoutRepository);

  return {
    authController: new AuthController(authService),
    planController: new PlanController(planService),
    studentController: new StudentController(studentService),
    workoutController: new WorkoutController(workoutService),
    dashboardController: new DashboardController(dashboardService),
  };
}
