// Centraliza as rotas HTTP da API e conecta cada endpoint ao controller correto.
import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller.js';
import { DashboardController } from '../controllers/dashboard-controller.js';
import { PlanController } from '../controllers/plan-controller.js';
import { StudentController } from '../controllers/student-controller.js';
import { WorkoutController } from '../controllers/workout-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

export type AppControllers = {
  authController: AuthController;
  planController: PlanController;
  studentController: StudentController;
  workoutController: WorkoutController;
  dashboardController: DashboardController;
};

export function createRouter(controllers: AppControllers) {
  const router = Router();

  // Rotas publicas de autenticacao e recuperacao de senha.
  router.post('/autenticacao/cadastro', controllers.authController.register);
  router.post('/autenticacao/entrar', controllers.authController.login);
  router.post('/autenticacao/esqueci-senha', controllers.authController.forgotPassword);
  router.post('/autenticacao/redefinir-senha', controllers.authController.resetPassword);

  // Rotas do usuario logado; todas exigem token JWT.
  router.get('/usuarios/me', authMiddleware, controllers.authController.me);
  router.put('/usuarios/me', authMiddleware, controllers.authController.update);

  // CRUD de planos comerciais da academia.
  router.get('/planos', authMiddleware, controllers.planController.list);
  router.get('/planos/:id', authMiddleware, controllers.planController.getById);
  router.post('/planos', authMiddleware, controllers.planController.create);
  router.put('/planos/:id', authMiddleware, controllers.planController.update);
  router.delete('/planos/:id', authMiddleware, controllers.planController.delete);

  // CRUD de alunos vinculados aos planos.
  router.get('/alunos', authMiddleware, controllers.studentController.list);
  router.get('/alunos/:id', authMiddleware, controllers.studentController.getById);
  router.post('/alunos', authMiddleware, controllers.studentController.create);
  router.put('/alunos/:id', authMiddleware, controllers.studentController.update);
  router.delete('/alunos/:id', authMiddleware, controllers.studentController.delete);

  // CRUD de treinos prescritos para os alunos.
  router.get('/treinos', authMiddleware, controllers.workoutController.list);
  router.get('/treinos/:id', authMiddleware, controllers.workoutController.getById);
  router.post('/treinos', authMiddleware, controllers.workoutController.create);
  router.put('/treinos/:id', authMiddleware, controllers.workoutController.update);
  router.delete('/treinos/:id', authMiddleware, controllers.workoutController.delete);

  // Indicadores usados no painel inicial.
  router.get('/painel/indicadores', authMiddleware, controllers.dashboardController.getMetrics);

  return router;
}
