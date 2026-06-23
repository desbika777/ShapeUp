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

  router.post('/auth/register', controllers.authController.register);
  router.post('/auth/login', controllers.authController.login);
  router.post('/auth/forgot-password', controllers.authController.forgotPassword);
  router.post('/auth/reset-password', controllers.authController.resetPassword);

  router.get('/users/me', authMiddleware, controllers.authController.me);
  router.put('/users/me', authMiddleware, controllers.authController.update);

  router.get('/plans', authMiddleware, controllers.planController.list);
  router.get('/plans/:id', authMiddleware, controllers.planController.getById);
  router.post('/plans', authMiddleware, controllers.planController.create);
  router.put('/plans/:id', authMiddleware, controllers.planController.update);
  router.delete('/plans/:id', authMiddleware, controllers.planController.delete);

  router.get('/students', authMiddleware, controllers.studentController.list);
  router.get('/students/:id', authMiddleware, controllers.studentController.getById);
  router.post('/students', authMiddleware, controllers.studentController.create);
  router.put('/students/:id', authMiddleware, controllers.studentController.update);
  router.delete('/students/:id', authMiddleware, controllers.studentController.delete);

  router.get('/workouts', authMiddleware, controllers.workoutController.list);
  router.get('/workouts/:id', authMiddleware, controllers.workoutController.getById);
  router.post('/workouts', authMiddleware, controllers.workoutController.create);
  router.put('/workouts/:id', authMiddleware, controllers.workoutController.update);
  router.delete('/workouts/:id', authMiddleware, controllers.workoutController.delete);

  router.get('/dashboard/metrics', authMiddleware, controllers.dashboardController.getMetrics);

  return router;
}
