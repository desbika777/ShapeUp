// Monta as dependencias da aplicacao em um unico lugar.
// Isso facilita testes, porque podemos trocar repositorios reais por repositorios em memoria.
import type { IRepositorioPlano, IRepositorioAluno, IRepositorioUsuario, IRepositorioTreino } from './repositories/interfaces.js';
import { RepositorioPrismaPlano } from './repositories/prisma/prisma-plan-repository.js';
import { RepositorioPrismaAluno } from './repositories/prisma/prisma-student-repository.js';
import { RepositorioPrismaUsuario } from './repositories/prisma/prisma-user-repository.js';
import { RepositorioPrismaTreino } from './repositories/prisma/prisma-workout-repository.js';
import { ControladorAutenticacao } from './controllers/auth-controller.js';
import { ControladorPainel } from './controllers/dashboard-controller.js';
import { ControladorPlano } from './controllers/plan-controller.js';
import { ControladorAluno } from './controllers/student-controller.js';
import { ControladorTreino } from './controllers/workout-controller.js';
import { ServicoAutenticacao } from './services/auth-service.js';
import { ServicoPainel } from './services/dashboard-service.js';
import type { IServicoEmail } from './services/mail-service.js';
import { ServicoPlano } from './services/plan-service.js';
import { ServicoEmailSmtp } from './services/smtp-mail-service.js';
import { ServicoAluno } from './services/student-service.js';
import { ServicoTreino } from './services/workout-service.js';

export type DependenciasRepositorios = {
  userRepository: IRepositorioUsuario;
  planRepository: IRepositorioPlano;
  studentRepository: IRepositorioAluno;
  workoutRepository: IRepositorioTreino;
  mailService: IServicoEmail;
};

export function createControllers(overrides?: Partial<DependenciasRepositorios>) {
  // Usa implementacoes Prisma por padrao, mas aceita substituicoes nos testes.
  const userRepository = overrides?.userRepository ?? new RepositorioPrismaUsuario();
  const planRepository = overrides?.planRepository ?? new RepositorioPrismaPlano();
  const studentRepository = overrides?.studentRepository ?? new RepositorioPrismaAluno();
  const workoutRepository = overrides?.workoutRepository ?? new RepositorioPrismaTreino();
  const mailService = overrides?.mailService ?? new ServicoEmailSmtp();

  const authService = new ServicoAutenticacao(userRepository, mailService);
  const planService = new ServicoPlano(planRepository, studentRepository);
  const studentService = new ServicoAluno(studentRepository, planRepository);
  const workoutService = new ServicoTreino(workoutRepository, studentRepository);
  const dashboardService = new ServicoPainel(studentRepository, planRepository, workoutRepository);

  // Controladores recebem servicos prontos e ficam responsaveis apenas pelo fluxo HTTP.
  return {
    authController: new ControladorAutenticacao(authService),
    planController: new ControladorPlano(planService),
    studentController: new ControladorAluno(studentService),
    workoutController: new ControladorTreino(workoutService),
    dashboardController: new ControladorPainel(dashboardService),
  };
}
