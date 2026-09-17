// Centraliza as rotas HTTP da API e conecta cada endpoint ao controller correto.
import { Router } from 'express';
import { ControladorAutenticacao } from '../controllers/auth-controller.js';
import { ControladorPainel } from '../controllers/dashboard-controller.js';
import { ControladorImagem } from '../controllers/image-controller.js';
import { ControladorPlano } from '../controllers/plan-controller.js';
import { ControladorAluno } from '../controllers/student-controller.js';
import { ControladorTreino } from '../controllers/workout-controller.js';
import { exigirPerfil, middlewareAutenticacao } from '../middlewares/auth-middleware.js';
import { uploadImagemUnica } from '../middlewares/image-upload-middleware.js';

export type ControladoresAplicacao = {
  authController: ControladorAutenticacao;
  planController: ControladorPlano;
  studentController: ControladorAluno;
  workoutController: ControladorTreino;
  dashboardController: ControladorPainel;
  imageController: ControladorImagem;
};

export function createRouter(controllers: ControladoresAplicacao) {
  const router = Router();

  // Rotas publicas de login, recuperacao de senha e bloqueio explicito do cadastro publico.
  router.post('/autenticacao/cadastro', controllers.authController.register);
  router.post('/autenticacao/entrar', controllers.authController.login);
  router.post('/autenticacao/esqueci-senha', controllers.authController.forgotPassword);
  router.post('/autenticacao/redefinir-senha', controllers.authController.resetPassword);

  // Rotas do usuario logado; todas exigem token JWT.
  router.get('/usuarios/me', middlewareAutenticacao, controllers.authController.me);
  router.put('/usuarios/me', middlewareAutenticacao, controllers.authController.update);
  router.get('/usuarios', middlewareAutenticacao, exigirPerfil(['MASTER']), controllers.authController.listUsers);
  router.post('/usuarios', middlewareAutenticacao, exigirPerfil(['MASTER']), controllers.authController.createUser);
  router.delete('/usuarios/:id', middlewareAutenticacao, exigirPerfil(['MASTER']), controllers.authController.deleteUser);

  // CRUD de planos comerciais da academia.
  router.get('/planos', middlewareAutenticacao, controllers.planController.list);
  router.get('/planos/:id', middlewareAutenticacao, controllers.planController.getById);
  router.post('/planos', middlewareAutenticacao, exigirPerfil(['MASTER', 'ADMIN']), controllers.planController.create);
  router.put('/planos/:id', middlewareAutenticacao, exigirPerfil(['MASTER', 'ADMIN']), controllers.planController.update);
  router.delete('/planos/:id', middlewareAutenticacao, exigirPerfil(['MASTER', 'ADMIN']), controllers.planController.delete);

  // CRUD de alunos vinculados aos planos.
  router.get('/alunos', middlewareAutenticacao, controllers.studentController.list);
  router.get('/alunos/:id', middlewareAutenticacao, controllers.studentController.getById);
  router.post('/alunos', middlewareAutenticacao, exigirPerfil(['MASTER', 'ADMIN']), controllers.studentController.create);
  router.put('/alunos/:id', middlewareAutenticacao, exigirPerfil(['MASTER', 'ADMIN']), controllers.studentController.update);
  router.delete('/alunos/:id', middlewareAutenticacao, exigirPerfil(['MASTER', 'ADMIN']), controllers.studentController.delete);

  // CRUD de treinos prescritos para os alunos.
  router.get('/treinos', middlewareAutenticacao, controllers.workoutController.list);
  router.get('/treinos/:id', middlewareAutenticacao, controllers.workoutController.getById);
  router.post('/treinos', middlewareAutenticacao, exigirPerfil(['MASTER', 'ADMIN']), controllers.workoutController.create);
  router.put('/treinos/:id', middlewareAutenticacao, exigirPerfil(['MASTER', 'ADMIN']), controllers.workoutController.update);
  router.delete('/treinos/:id', middlewareAutenticacao, exigirPerfil(['MASTER', 'ADMIN']), controllers.workoutController.delete);

  // Indicadores usados no painel inicial.
  router.get('/painel/indicadores', middlewareAutenticacao, controllers.dashboardController.getMetrics);

  // Anexos operacionais enviados com Multer: protegidos e vinculados ao dono logado.
  router.get('/imagens', middlewareAutenticacao, exigirPerfil(['MASTER', 'ADMIN']), controllers.imageController.list);
  router.post('/imagens', middlewareAutenticacao, exigirPerfil(['MASTER', 'ADMIN']), uploadImagemUnica, controllers.imageController.upload);
  router.delete('/imagens/:id', middlewareAutenticacao, exigirPerfil(['MASTER', 'ADMIN']), controllers.imageController.delete);

  return router;
}
