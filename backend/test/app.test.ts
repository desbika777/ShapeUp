// Testes da API com repositorios em memoria.
// Validam regras de negocio sem depender do MySQL.
import { existsSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcrypt';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { IMAGEM_TAMANHO_MAXIMO_BYTES } from '@shape/shared';
import type { IndicadoresPainel, RespostaPaginada, Plano, EntradaPlano, Aluno, EntradaAluno, Treino, EntradaTreino, PerfilAcesso, AnexoAcademia, EntradaAnexo } from '@shape/shared';
import { createApp } from '../src/app.js';
import type {
  IRepositorioPlano,
  IRepositorioAluno,
  IRepositorioUsuario,
  IRepositorioTreino,
  IRepositorioAnexo,
  ParametrosPaginacao,
  RegistroTokenRecuperacaoSenha,
  ParametrosListagemPlanos,
  ParametrosListagemAlunos,
  ParametrosListagemTreinos,
  RegistroUsuario,
} from '../src/repositories/interfaces.js';
import type { IServicoEmail, MensagemEmail } from '../src/services/mail-service.js';

function paginate<T>(items: T[], params: ParametrosPaginacao): RespostaPaginada<T> {
  // Simula a paginacao usada nos repositorios reais.
  const sliced = items.slice(params.skip, params.skip + params.pageSize);
  return {
    data: sliced,
    meta: {
      page: params.page,
      pageSize: params.pageSize,
      totalItems: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / params.pageSize)),
    },
  };
}

type PlanoComDono = Plano & { ownerId: string };
type AlunoComDono = Aluno & { ownerId: string };
type TreinoComDono = Treino & { ownerId: string };
type AnexoComDono = AnexoAcademia & { ownerId: string };

const PNG_1X1_TRANSPARENTE = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64',
);

function removerImagemTeste(fileName?: string) {
  if (!fileName) return;
  const filePath = path.join(process.cwd(), 'uploads', 'imagens', fileName);
  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }
}

class RepositorioMemoriaUsuario implements IRepositorioUsuario {
  // Repositorio fake para cadastro, login, perfil e recuperacao de senha.
  users: RegistroUsuario[] = [];
  passwordResetTokens: RegistroTokenRecuperacaoSenha[] = [];

  async create(input: { name: string; email: string; passwordHash: string; cpf: string; perfil: PerfilAcesso; mustChangePassword?: boolean }) {
    const user = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), mustChangePassword: false, ...input };
    this.users.push(user);
    return user;
  }
  async list() {
    return this.users.map(({ passwordHash: _passwordHash, ...user }) => user);
  }
  async findByEmail(email: string) { return this.users.find((user) => user.email === email) ?? null; }
  async findByCpf(cpf: string) { return this.users.find((user) => user.cpf === cpf) ?? null; }
  async findById(id: string) { return this.users.find((user) => user.id === id) ?? null; }
  async update(id: string, input: { name: string; passwordHash: string; cpf: string; mustChangePassword?: boolean }) {
    const user = this.users.find((item) => item.id === id)!;
    user.name = input.name;
    user.passwordHash = input.passwordHash;
    user.cpf = input.cpf;
    user.mustChangePassword = input.mustChangePassword ?? user.mustChangePassword;
    user.updatedAt = new Date().toISOString();
    return user;
  }
  async delete(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
    this.passwordResetTokens = this.passwordResetTokens.filter((token) => token.userId !== id);
  }
  async criarTokenRecuperacaoSenha(input: { userId: string; tokenHash: string; expiresAt: Date }) {
    const token = {
      id: crypto.randomUUID(),
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt.toISOString(),
      usedAt: null,
      createdAt: new Date().toISOString(),
    };
    this.passwordResetTokens.push(token);
    return token;
  }
  async buscarTokenRecuperacaoSenhaPorHash(tokenHash: string) {
    return this.passwordResetTokens.find((token) => token.tokenHash === tokenHash) ?? null;
  }
  async marcarTokenRecuperacaoSenhaUsado(id: string) {
    const token = this.passwordResetTokens.find((item) => item.id === id);
    if (token) {
      token.usedAt = new Date().toISOString();
    }
  }
  async excluirTokensRecuperacaoSenhaPorUsuario(userId: string) {
    this.passwordResetTokens = this.passwordResetTokens.filter((token) => token.userId !== userId);
  }
}

class ServicoEmailMemoria implements IServicoEmail {
  // Guarda mensagens enviadas para validar o fluxo de reset.
  messages: MensagemEmail[] = [];

  async send(message: MensagemEmail) {
    this.messages.push(message);
  }
}

class RepositorioMemoriaAnexo implements IRepositorioAnexo {
  // Simula anexos salvos pelo Multer e vinculados ao dono autenticado.
  attachments: AnexoComDono[] = [];

  async list(ownerId: string) {
    return this.attachments.filter((attachment) => attachment.ownerId === ownerId);
  }

  async create(ownerId: string, input: EntradaAnexo & Omit<AnexoAcademia, 'id' | 'category' | 'description' | 'url' | 'uploadedAt' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const attachment: AnexoComDono = {
      id: crypto.randomUUID(),
      ownerId,
      category: input.category,
      description: input.description?.trim() || null,
      originalName: input.originalName,
      fileName: input.fileName,
      mimeType: input.mimeType,
      size: input.size,
      extension: input.extension,
      relativePath: input.relativePath,
      url: input.relativePath,
      uploadedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    this.attachments.unshift(attachment);
    return attachment;
  }

  async findById(ownerId: string, id: string) {
    return this.attachments.find((attachment) => attachment.ownerId === ownerId && attachment.id === id) ?? null;
  }

  async delete(ownerId: string, id: string) {
    this.attachments = this.attachments.filter((attachment) => attachment.ownerId !== ownerId || attachment.id !== id);
  }
}

class RepositorioMemoriaPlano implements IRepositorioPlano {
  // Simula planos em memoria para testar cadastro, edicao e regras de exclusao.
  plans: PlanoComDono[] = [];
  async list(params: ParametrosListagemPlanos) {
    const search = params.search?.trim().toLowerCase();
    const filtered = this.plans.filter((plan) => {
      if (plan.ownerId !== params.ownerId) return false;
      if (params.status && plan.status !== params.status) return false;
      if (search) {
        const haystack = `${plan.name} ${plan.description}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
    return paginate(filtered, params);
  }
  async create(ownerId: string, input: EntradaPlano) {
    const plan = { id: crypto.randomUUID(), ownerId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...input };
    this.plans.unshift(plan);
    return plan;
  }
  async findById(ownerId: string, id: string) { return this.plans.find((plan) => plan.id === id && plan.ownerId === ownerId) ?? null; }
  async update(_ownerId: string, id: string, input: EntradaPlano) {
    const plan = this.plans.find((item) => item.id === id)!;
    Object.assign(plan, input, { updatedAt: new Date().toISOString() });
    return plan;
  }
  async delete(_ownerId: string, id: string) { this.plans = this.plans.filter((plan) => plan.id !== id); }
  async contarAtivos(ownerId: string) { return this.plans.filter((plan) => plan.ownerId === ownerId && plan.status === 'ATIVO').length; }
  async contarAlunosPorPlano(ownerId: string) {
    return this.plans
      .filter((plan) => plan.ownerId === ownerId)
      .map((plan) => ({ name: plan.name, students: 0 }));
  }
}

class RepositorioMemoriaAluno implements IRepositorioAluno {
  // Simula alunos, incluindo buscas por CPF/e-mail e contadores.
  students: AlunoComDono[] = [];
  async list(params: ParametrosListagemAlunos) {
    const rawSearch = params.search?.trim().toLowerCase();
    const digits = rawSearch ? rawSearch.replace(/\D/g, '') : '';
    const filtered = this.students.filter((student) => {
      if (student.ownerId !== params.ownerId) return false;
      if (params.status && student.status !== params.status) return false;
      if (params.planId && student.planId !== params.planId) return false;
      if (rawSearch) {
        const haystack = `${student.name} ${student.email}`.toLowerCase();
        const cpf = student.cpf.replace(/\D/g, '');
        if (!haystack.includes(rawSearch) && !(digits && cpf.includes(digits))) return false;
      }
      return true;
    });
    return paginate(filtered, params);
  }
  async create(ownerId: string, input: EntradaAluno) {
    const student = { id: crypto.randomUUID(), ownerId, planName: undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...input };
    this.students.unshift(student);
    return student;
  }
  async findById(ownerId: string, id: string) { return this.students.find((student) => student.id === id && student.ownerId === ownerId) ?? null; }
  async findByEmail(ownerId: string, email: string) { return this.students.find((student) => student.ownerId === ownerId && student.email === email) ?? null; }
  async findByCpf(ownerId: string, cpf: string) { return this.students.find((student) => student.ownerId === ownerId && student.cpf === cpf) ?? null; }
  async update(_ownerId: string, id: string, input: EntradaAluno) {
    const student = this.students.find((item) => item.id === id)!;
    Object.assign(student, input, { updatedAt: new Date().toISOString() });
    return student;
  }
  async delete(_ownerId: string, id: string) { this.students = this.students.filter((student) => student.id !== id); }
  async contarTodos(ownerId: string) { return this.students.filter((student) => student.ownerId === ownerId).length; }
  async contarPorPlano(ownerId: string, planId: string) { return this.students.filter((student) => student.ownerId === ownerId && student.planId === planId).length; }
  async contarNovosNoMesAtual(ownerId: string) { return this.students.filter((student) => student.ownerId === ownerId).length; }
  async buscarRecentes(ownerId: string, limit: number): Promise<IndicadoresPainel['recentStudents']> {
    return this.students
      .filter((student) => student.ownerId === ownerId)
      .slice(0, limit)
      .map((student) => ({ id: student.id, name: student.name, goal: student.goal, status: student.status, createdAt: student.createdAt }));
  }
}

class RepositorioMemoriaTreino implements IRepositorioTreino {
  // Simula treinos para testar filtros, cadastro, edicao e metricas.
  workouts: TreinoComDono[] = [];
  async list(params: ParametrosListagemTreinos) {
    const rawSearch = params.search?.trim().toLowerCase();
    const filtered = this.workouts.filter((workout) => {
      if (workout.ownerId !== params.ownerId) return false;
      if (params.level && workout.level !== params.level) return false;
      if (params.studentId && workout.studentId !== params.studentId) return false;
      if (rawSearch) {
        const haystack = `${workout.title} ${workout.objective} ${workout.studentName ?? ''}`.toLowerCase();
        if (!haystack.includes(rawSearch)) return false;
      }
      return true;
    });
    return paginate(filtered, params);
  }
  async create(ownerId: string, input: EntradaTreino) {
    const workout = { id: crypto.randomUUID(), ownerId, studentName: undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...input };
    this.workouts.unshift(workout);
    return workout;
  }
  async findById(ownerId: string, id: string) { return this.workouts.find((workout) => workout.id === id && workout.ownerId === ownerId) ?? null; }
  async update(_ownerId: string, id: string, input: EntradaTreino) {
    const workout = this.workouts.find((item) => item.id === id)!;
    Object.assign(workout, input, { updatedAt: new Date().toISOString() });
    return workout;
  }
  async delete(_ownerId: string, id: string) { this.workouts = this.workouts.filter((workout) => workout.id !== id); }
  async contarTodos(ownerId: string) { return this.workouts.filter((workout) => workout.ownerId === ownerId).length; }
  async contarPorNivel(ownerId: string) {
    return ['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'].map((level) => ({
      level: level as Treino['level'],
      workouts: this.workouts.filter((workout) => workout.ownerId === ownerId && workout.level === level).length,
    }));
  }
}

describe('Shape Up API', () => {
  // Cada teste recebe dependencias novas para evitar vazamento de estado.
  let userRepository: RepositorioMemoriaUsuario;
  let planRepository: RepositorioMemoriaPlano;
  let studentRepository: RepositorioMemoriaAluno;
  let workoutRepository: RepositorioMemoriaTreino;
  let attachmentRepository: RepositorioMemoriaAnexo;
  let mailService: ServicoEmailMemoria;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    userRepository = new RepositorioMemoriaUsuario();
    planRepository = new RepositorioMemoriaPlano();
    studentRepository = new RepositorioMemoriaAluno();
    workoutRepository = new RepositorioMemoriaTreino();
    attachmentRepository = new RepositorioMemoriaAnexo();
    mailService = new ServicoEmailMemoria();
    app = createApp({ userRepository, planRepository, studentRepository, workoutRepository, attachmentRepository, mailService });
  });

  async function criarSessaoGestor(overrides: Partial<{ name: string; email: string; cpf: string; password: string; perfil: PerfilAcesso }> = {}) {
    const password = overrides.password ?? 'Shape@123';
    const user = await userRepository.create({
      name: overrides.name ?? 'Gestor Teste',
      email: overrides.email ?? 'gestor@shape.com.br',
      cpf: overrides.cpf ?? '11144477735',
      passwordHash: await bcrypt.hash(password, 10),
      perfil: overrides.perfil ?? 'ADMIN',
    });

    const login = await request(app).post('/api/autenticacao/entrar').send({
      email: user.email,
      password,
    });

    expect(login.status).toBe(200);
    return { user, token: login.body.token as string, password };
  }

  it('bloqueia cadastro publico de clientes', async () => {
    const response = await request(app).post('/api/autenticacao/cadastro').send({
      name: 'Gestor Teste',
      email: 'gestor@shape.com.br',
      password: 'Shape@123',
      confirmPassword: 'Shape@123',
      cpf: '11144477735',
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Cadastro publico desativado. O master Shape Up deve criar o acesso do cliente.');
    expect(userRepository.users).toHaveLength(0);
  });

  it('bloqueia login com credenciais invalidas', async () => {
    await criarSessaoGestor();

    const response = await request(app).post('/api/autenticacao/entrar').send({
      email: 'gestor@shape.com.br',
      password: 'errada',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Credenciais invalidas');
  });

  it('permite atualizar perfil sem trocar senha e exige senha atual para alterar a senha', async () => {
    const { token } = await criarSessaoGestor();

    const profileUpdate = await request(app).put('/api/usuarios/me').set('Authorization', `Bearer ${token}`).send({
      name: 'Gestor Atualizado',
      cpf: '39053344705',
    });

    expect(profileUpdate.status).toBe(200);
    expect(profileUpdate.body.name).toBe('Gestor Atualizado');
    expect(profileUpdate.body.cpf).toBe('39053344705');

    const passwordUpdateWithoutCurrent = await request(app).put('/api/usuarios/me').set('Authorization', `Bearer ${token}`).send({
      name: 'Gestor Atualizado',
      cpf: '39053344705',
      password: 'NovaSenha@123',
      confirmPassword: 'NovaSenha@123',
    });

    expect(passwordUpdateWithoutCurrent.status).toBe(400);
    expect(passwordUpdateWithoutCurrent.body.message).toBe('Informe sua senha atual para alterar a senha.');

    const passwordUpdateWithWrongCurrent = await request(app).put('/api/usuarios/me').set('Authorization', `Bearer ${token}`).send({
      name: 'Gestor Atualizado',
      cpf: '39053344705',
      currentPassword: 'SenhaErrada@123',
      password: 'NovaSenha@123',
      confirmPassword: 'NovaSenha@123',
    });

    expect(passwordUpdateWithWrongCurrent.status).toBe(401);
    expect(passwordUpdateWithWrongCurrent.body.message).toBe('A senha atual informada esta incorreta.');
  });

  it('envia link de redefinicao por e-mail e permite criar uma nova senha', async () => {
    await criarSessaoGestor();

    const forgotPassword = await request(app).post('/api/autenticacao/esqueci-senha').send({
      email: 'gestor@shape.com.br',
    });

    expect(forgotPassword.status).toBe(200);
    expect(forgotPassword.body.message).toBe('Se o e-mail estiver cadastrado, voce recebera um link para redefinir sua senha.');
    expect(mailService.messages).toHaveLength(1);

    const token = mailService.messages[0].text.match(/token=([a-f0-9]+)/)?.[1];
    expect(token).toBeTruthy();

    const resetPassword = await request(app).post('/api/autenticacao/redefinir-senha').send({
      token,
      password: 'NovaSenha@123',
      confirmPassword: 'NovaSenha@123',
    });

    expect(resetPassword.status).toBe(200);
    expect(resetPassword.body.message).toBe('Senha redefinida com sucesso.');

    const oldPasswordLogin = await request(app).post('/api/autenticacao/entrar').send({
      email: 'gestor@shape.com.br',
      password: 'Shape@123',
    });
    expect(oldPasswordLogin.status).toBe(401);

    const newPasswordLogin = await request(app).post('/api/autenticacao/entrar').send({
      email: 'gestor@shape.com.br',
      password: 'NovaSenha@123',
    });
    expect(newPasswordLogin.status).toBe(200);
  });

  it('mantem resposta generica quando o e-mail nao existe e bloqueia token invalido', async () => {
    const missingUserResponse = await request(app).post('/api/autenticacao/esqueci-senha').send({
      email: 'naoexiste@shape.com.br',
    });

    expect(missingUserResponse.status).toBe(200);
    expect(missingUserResponse.body.message).toBe('Se o e-mail estiver cadastrado, voce recebera um link para redefinir sua senha.');
    expect(mailService.messages).toHaveLength(0);

    const invalidTokenResponse = await request(app).post('/api/autenticacao/redefinir-senha').send({
      token: 'token-invalido',
      password: 'NovaSenha@123',
      confirmPassword: 'NovaSenha@123',
    });

    expect(invalidTokenResponse.status).toBe(400);
    expect(invalidTokenResponse.body.message).toBe('O link de redefinicao e invalido ou expirou.');
  });

  it('nao permite acesso autenticado sem token', async () => {
    const response = await request(app).get('/api/planos');
    expect(response.status).toBe(401);
  });

  it('permite que o master crie cliente e bloqueia cliente de criar novas contas', async () => {
    const { token: masterToken } = await criarSessaoGestor({
      name: 'Master Shape Up',
      email: 'admin@shape.com.br',
      perfil: 'MASTER',
    });

    const createdUser = await request(app).post('/api/usuarios').set('Authorization', `Bearer ${masterToken}`).send({
      name: 'Cliente Academia Demo',
      email: 'cliente.demo@shape.com.br',
      password: 'Shape@123',
      confirmPassword: 'Shape@123',
      cpf: '39053344705',
      perfil: 'MASTER',
    });

    expect(createdUser.status).toBe(201);
    expect(createdUser.body.perfil).toBe('ADMIN');
    expect(createdUser.body.mustChangePassword).toBe(true);

    const users = await request(app).get('/api/usuarios').set('Authorization', `Bearer ${masterToken}`);
    expect(users.status).toBe(200);
    expect(users.body).toHaveLength(1);
    expect(users.body[0].passwordHash).toBeUndefined();
    expect(users.body[0].email).toBe('cliente.demo@shape.com.br');

    const masterPlanCreate = await request(app).post('/api/planos').set('Authorization', `Bearer ${masterToken}`).send({
      name: 'Plano Master Shape Up',
      description: 'Cadastro permitido para a academia da conta master.',
      price: 149.9,
      durationMonths: 6,
      status: 'ATIVO',
    });
    expect(masterPlanCreate.status).toBe(201);

    const login = await request(app).post('/api/autenticacao/entrar').send({
      email: 'cliente.demo@shape.com.br',
      password: 'Shape@123',
    });
    const userToken = login.body.token as string;
    expect(login.body.user.mustChangePassword).toBe(true);

    const firstAccessWithoutPasswordChange = await request(app).put('/api/usuarios/me').set('Authorization', `Bearer ${userToken}`).send({
      name: 'Cliente Academia Demo',
      cpf: '39053344705',
    });
    expect(firstAccessWithoutPasswordChange.status).toBe(400);
    expect(firstAccessWithoutPasswordChange.body.message).toBe('Defina uma nova senha para concluir o primeiro acesso.');

    const firstAccessPasswordChange = await request(app).put('/api/usuarios/me').set('Authorization', `Bearer ${userToken}`).send({
      name: 'Cliente Academia Demo',
      cpf: '39053344705',
      currentPassword: 'Shape@123',
      password: 'Cliente@123',
      confirmPassword: 'Cliente@123',
    });
    expect(firstAccessPasswordChange.status).toBe(200);
    expect(firstAccessPasswordChange.body.mustChangePassword).toBe(false);

    const allowedList = await request(app).get('/api/planos').set('Authorization', `Bearer ${userToken}`);
    expect(allowedList.status).toBe(200);

    const planCreate = await request(app).post('/api/planos').set('Authorization', `Bearer ${userToken}`).send({
      name: 'Plano Cliente Demo',
      description: 'Cadastro permitido para o dono da academia.',
      price: 99.9,
      durationMonths: 3,
      status: 'ATIVO',
    });
    expect(planCreate.status).toBe(201);

    const usersFromClient = await request(app).get('/api/usuarios').set('Authorization', `Bearer ${userToken}`);
    expect(usersFromClient.status).toBe(403);

    const createFromClient = await request(app).post('/api/usuarios').set('Authorization', `Bearer ${userToken}`).send({
      name: 'Outro Socio',
      email: 'outro.socio@shape.com.br',
      password: 'Shape@123',
      confirmPassword: 'Shape@123',
      cpf: '11144477735',
      perfil: 'ADMIN',
    });
    expect(createFromClient.status).toBe(403);

    const clientDeleteAttempt = await request(app).delete(`/api/usuarios/${createdUser.body.id}`).set('Authorization', `Bearer ${userToken}`);
    expect(clientDeleteAttempt.status).toBe(403);

    const masterSelfDelete = await request(app).delete(`/api/usuarios/${users.body[0].id}`).set('Authorization', `Bearer ${masterToken}`);
    expect(masterSelfDelete.status).toBe(204);

    const usersAfterDelete = await request(app).get('/api/usuarios').set('Authorization', `Bearer ${masterToken}`);
    expect(usersAfterDelete.status).toBe(200);
    expect(usersAfterDelete.body).toHaveLength(0);
  });

  it('recebe e salva imagem valida com Multer usando nome unico', async () => {
    const { token } = await criarSessaoGestor();
    const response = await request(app)
      .post('/api/imagens')
      .set('Authorization', `Bearer ${token}`)
      .field('category', 'AVALIACAO')
      .field('description', 'Avaliacao fisica inicial do aluno.')
      .attach('imagem', PNG_1X1_TRANSPARENTE, { filename: 'Logo Shape Up.png', contentType: 'image/png' });

    try {
      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.category).toBe('AVALIACAO');
      expect(response.body.description).toBe('Avaliacao fisica inicial do aluno.');
      expect(response.body.originalName).toBe('Logo Shape Up.png');
      expect(response.body.fileName).toMatch(/logo-shape-up\.png$/);
      expect(response.body.relativePath).toContain('/uploads/imagens/');
      expect(response.body.url).toContain('/uploads/imagens/');
      expect(response.body.mimeType).toBe('image/png');
      expect(response.body.size).toBe(PNG_1X1_TRANSPARENTE.length);
      expect(existsSync(path.join(process.cwd(), 'uploads', 'imagens', response.body.fileName))).toBe(true);

      const list = await request(app).get('/api/imagens').set('Authorization', `Bearer ${token}`);
      expect(list.status).toBe(200);
      expect(list.body).toHaveLength(1);
      expect(list.body[0].id).toBe(response.body.id);
      expect(list.body[0].url).toContain('/uploads/imagens/');
    } finally {
      removerImagemTeste(response.body.fileName);
    }
  });

  it('permite upload de imagem para cliente criado pelo master', async () => {
    const { token: masterToken } = await criarSessaoGestor({ perfil: 'MASTER' });
    await request(app).post('/api/usuarios').set('Authorization', `Bearer ${masterToken}`).send({
      name: 'Cliente Academia Demo',
      email: 'cliente.demo@shape.com.br',
      password: 'Shape@123',
      confirmPassword: 'Shape@123',
      cpf: '39053344705',
      perfil: 'ADMIN',
    });

    const login = await request(app).post('/api/autenticacao/entrar').send({
      email: 'cliente.demo@shape.com.br',
      password: 'Shape@123',
    });

    const response = await request(app)
      .post('/api/imagens')
      .set('Authorization', `Bearer ${login.body.token}`)
      .attach('imagem', PNG_1X1_TRANSPARENTE, { filename: 'logo.png', contentType: 'image/png' });

    try {
      expect(response.status).toBe(201);
      expect(response.body.mimeType).toBe('image/png');
    } finally {
      removerImagemTeste(response.body.fileName);
    }
  });

  it('valida extensao, tipo real e tamanho maximo das imagens recebidas', async () => {
    const { token } = await criarSessaoGestor();

    const invalidExtension = await request(app)
      .post('/api/imagens')
      .set('Authorization', `Bearer ${token}`)
      .attach('imagem', Buffer.from('arquivo invalido'), { filename: 'arquivo.txt', contentType: 'text/plain' });
    expect(invalidExtension.status).toBe(400);
    expect(invalidExtension.body.message).toBe('Envie uma imagem valida nos formatos PNG, JPG, JPEG ou WEBP.');

    const fakeImage = await request(app)
      .post('/api/imagens')
      .set('Authorization', `Bearer ${token}`)
      .attach('imagem', Buffer.from('nao sou uma imagem real'), { filename: 'falso.png', contentType: 'image/png' });
    expect(fakeImage.status).toBe(400);
    expect(fakeImage.body.message).toBe('O conteudo do arquivo nao corresponde a uma imagem valida.');

    const tooLarge = await request(app)
      .post('/api/imagens')
      .set('Authorization', `Bearer ${token}`)
      .attach('imagem', Buffer.alloc(IMAGEM_TAMANHO_MAXIMO_BYTES + 1), { filename: 'grande.png', contentType: 'image/png' });
    expect(tooLarge.status).toBe(400);
    expect(tooLarge.body.message).toBe('A imagem deve ter no maximo 8 MB.');
  });

  it('pagina planos e retorna 404 ao editar recurso inexistente', async () => {
    const { token } = await criarSessaoGestor();

    await request(app).post('/api/planos').set('Authorization', `Bearer ${token}`).send({ name: 'Plano Start', description: 'Plano inicial com suporte mensal.', price: 99.9, durationMonths: 3, status: 'ATIVO' });
    await request(app).post('/api/planos').set('Authorization', `Bearer ${token}`).send({ name: 'Plano Pro', description: 'Plano avancado com consultoria completa.', price: 189.9, durationMonths: 6, status: 'ATIVO' });

    const list = await request(app).get('/api/planos?page=1&pageSize=1').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.meta.totalItems).toBe(2);
    expect(list.body.data).toHaveLength(1);

    const update = await request(app).put('/api/planos/inexistente').set('Authorization', `Bearer ${token}`).send({ name: 'Plano Teste', description: 'Descricao valida com 10 caracteres.', price: 100, durationMonths: 6, status: 'ATIVO' });
    expect(update.status).toBe(404);
  });

  it('filtra planos por status e busca', async () => {
    const { token } = await criarSessaoGestor();

    await request(app).post('/api/planos').set('Authorization', `Bearer ${token}`).send({ name: 'Plano Start', description: 'Plano inicial com suporte mensal.', price: 99.9, durationMonths: 3, status: 'ATIVO' });
    await request(app).post('/api/planos').set('Authorization', `Bearer ${token}`).send({ name: 'Plano Pausado', description: 'Plano inativo para testes.', price: 129.9, durationMonths: 3, status: 'INATIVO' });

    const activeOnly = await request(app).get('/api/planos?status=ATIVO').set('Authorization', `Bearer ${token}`);
    expect(activeOnly.status).toBe(200);
    expect(activeOnly.body.meta.totalItems).toBe(1);
    expect(activeOnly.body.data[0].name).toContain('Start');

    const search = await request(app).get('/api/planos?search=pausado').set('Authorization', `Bearer ${token}`);
    expect(search.status).toBe(200);
    expect(search.body.meta.totalItems).toBe(1);
    expect(search.body.data[0].status).toBe('INATIVO');
  });

  it('retorna 409 ao excluir plano vinculado a alunos', async () => {
    const { token } = await criarSessaoGestor();

    const plan = await request(app).post('/api/planos').set('Authorization', `Bearer ${token}`).send({
      name: 'Plano Premium',
      description: 'Plano premium anual com acompanhamento.',
      price: 249.9,
      durationMonths: 12,
      status: 'ATIVO',
    });

    await request(app).post('/api/alunos').set('Authorization', `Bearer ${token}`).send({
      name: 'Ana Silva',
      email: 'ana@shape.com.br',
      cpf: '39053344705',
      phone: '11999999999',
      birthDate: '1997-07-15',
      goal: 'Hipertrofia com foco em pernas',
      status: 'ATIVO',
      planId: plan.body.id,
    });

    const response = await request(app).delete(`/api/planos/${plan.body.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Nao e possivel excluir um plano vinculado a alunos.');
  });

  it('filtra alunos por plano, status e busca', async () => {
    const { token } = await criarSessaoGestor();

    const planA = await request(app).post('/api/planos').set('Authorization', `Bearer ${token}`).send({ name: 'Plano A', description: 'Descricao valida com 10 caracteres.', price: 100, durationMonths: 6, status: 'ATIVO' });
    const planB = await request(app).post('/api/planos').set('Authorization', `Bearer ${token}`).send({ name: 'Plano B', description: 'Descricao valida com 10 caracteres.', price: 120, durationMonths: 6, status: 'ATIVO' });

    await request(app).post('/api/alunos').set('Authorization', `Bearer ${token}`).send({ name: 'Ana Silva', email: 'ana@shape.com.br', cpf: '39053344705', phone: '11999999999', birthDate: '1997-07-15', goal: 'Hipertrofia com foco em pernas', status: 'ATIVO', planId: planA.body.id });
    await request(app).post('/api/alunos').set('Authorization', `Bearer ${token}`).send({ name: 'Bruno Lima', email: 'bruno@shape.com.br', cpf: '11144477735', phone: '11988887777', birthDate: '1996-07-15', goal: 'Reducao de gordura e condicionamento', status: 'INATIVO', planId: planB.body.id });

    const byPlan = await request(app).get(`/api/alunos?planId=${planA.body.id}`).set('Authorization', `Bearer ${token}`);
    expect(byPlan.status).toBe(200);
    expect(byPlan.body.meta.totalItems).toBe(1);
    expect(byPlan.body.data[0].name).toContain('Ana');

    const activeSearch = await request(app).get('/api/alunos?status=ATIVO&search=ana').set('Authorization', `Bearer ${token}`);
    expect(activeSearch.status).toBe(200);
    expect(activeSearch.body.meta.totalItems).toBe(1);
    expect(activeSearch.body.data[0].status).toBe('ATIVO');

    const cpfSearch = await request(app).get('/api/alunos?search=111444').set('Authorization', `Bearer ${token}`);
    expect(cpfSearch.status).toBe(200);
    expect(cpfSearch.body.meta.totalItems).toBe(1);
    expect(cpfSearch.body.data[0].email).toBe('bruno@shape.com.br');
  });

  it('filtra treinos por nivel, aluno e busca', async () => {
    const { token } = await criarSessaoGestor();

    const plan = await request(app).post('/api/planos').set('Authorization', `Bearer ${token}`).send({ name: 'Plano Premium', description: 'Plano premium anual com acompanhamento.', price: 249.9, durationMonths: 12, status: 'ATIVO' });
    const studentA = await request(app).post('/api/alunos').set('Authorization', `Bearer ${token}`).send({ name: 'Ana Silva', email: 'ana@shape.com.br', cpf: '39053344705', phone: '11999999999', birthDate: '1997-07-15', goal: 'Hipertrofia com foco em pernas', status: 'ATIVO', planId: plan.body.id });
    const studentB = await request(app).post('/api/alunos').set('Authorization', `Bearer ${token}`).send({ name: 'Bruno Lima', email: 'bruno@shape.com.br', cpf: '11144477735', phone: '11988887777', birthDate: '1996-07-15', goal: 'Reducao de gordura e condicionamento', status: 'ATIVO', planId: plan.body.id });

    await request(app).post('/api/treinos').set('Authorization', `Bearer ${token}`).send({ studentId: studentA.body.id, title: 'Treino A', objective: 'Base de forca', level: 'INTERMEDIARIO', notes: 'Subir carga gradualmente', startDate: '2026-03-10', endDate: '2026-04-10' });
    await request(app).post('/api/treinos').set('Authorization', `Bearer ${token}`).send({ studentId: studentB.body.id, title: 'Treino B', objective: 'Emagrecimento', level: 'INICIANTE', notes: 'Foco em volume', startDate: '2026-03-10', endDate: '2026-04-10' });

    const byLevel = await request(app).get('/api/treinos?level=INICIANTE').set('Authorization', `Bearer ${token}`);
    expect(byLevel.status).toBe(200);
    expect(byLevel.body.meta.totalItems).toBe(1);
    expect(byLevel.body.data[0].title).toBe('Treino B');

    const byStudent = await request(app).get(`/api/treinos?studentId=${studentA.body.id}`).set('Authorization', `Bearer ${token}`);
    expect(byStudent.status).toBe(200);
    expect(byStudent.body.meta.totalItems).toBe(1);
    expect(byStudent.body.data[0].studentId).toBe(studentA.body.id);

    const bySearch = await request(app).get('/api/treinos?search=emag').set('Authorization', `Bearer ${token}`);
    expect(bySearch.status).toBe(200);
    expect(bySearch.body.meta.totalItems).toBe(1);
    expect(bySearch.body.data[0].objective).toContain('Emagrecimento');
  });

  it('cria aluno vinculado a plano e treino vinculado a aluno', async () => {
    const { token } = await criarSessaoGestor();

    const plan = await request(app).post('/api/planos').set('Authorization', `Bearer ${token}`).send({ name: 'Plano Premium', description: 'Plano premium anual com acompanhamento.', price: 249.9, durationMonths: 12, status: 'ATIVO' });
    const student = await request(app).post('/api/alunos').set('Authorization', `Bearer ${token}`).send({ name: 'Ana Silva', email: 'ana@shape.com.br', cpf: '39053344705', phone: '11999999999', birthDate: '1997-07-15', goal: 'Hipertrofia com foco em pernas', status: 'ATIVO', planId: plan.body.id });

    expect(student.status).toBe(201);
    expect(student.body.planId).toBe(plan.body.id);

    const workout = await request(app).post('/api/treinos').set('Authorization', `Bearer ${token}`).send({ studentId: student.body.id, title: 'Treino A', objective: 'Base de forca', level: 'INTERMEDIARIO', notes: 'Subir carga gradualmente', startDate: '2026-03-10', endDate: '2026-04-10' });

    expect(workout.status).toBe(201);
    expect(workout.body.studentId).toBe(student.body.id);
  });

  it('isola dados entre gestores diferentes', async () => {
    const { token: firstToken } = await criarSessaoGestor({
      name: 'Enzo',
      email: 'enzo@shape.com.br',
      cpf: '39053344705',
    });
    const { token: secondToken } = await criarSessaoGestor({
      name: 'Pedro',
      email: 'pedro@shape.com.br',
      cpf: '11144477735',
    });

    const plan = await request(app).post('/api/planos').set('Authorization', `Bearer ${firstToken}`).send({
      name: 'Plano Enzo',
      description: 'Plano exclusivo da academia do Enzo.',
      price: 159.9,
      durationMonths: 6,
      status: 'ATIVO',
    });

    const firstList = await request(app).get('/api/planos').set('Authorization', `Bearer ${firstToken}`);
    const secondList = await request(app).get('/api/planos').set('Authorization', `Bearer ${secondToken}`);
    const secondGetById = await request(app).get(`/api/planos/${plan.body.id}`).set('Authorization', `Bearer ${secondToken}`);

    expect(firstList.status).toBe(200);
    expect(firstList.body.meta.totalItems).toBe(1);
    expect(firstList.body.data[0].name).toBe('Plano Enzo');

    expect(secondList.status).toBe(200);
    expect(secondList.body.meta.totalItems).toBe(0);
    expect(secondList.body.data).toHaveLength(0);

    expect(secondGetById.status).toBe(404);
  });
});

