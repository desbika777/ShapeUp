// Contratos dos repositorios usados pelos services.
// Eles separam regras de negocio da tecnologia de banco de dados.
import type {
  PerfilAcesso,
  UsuarioAutenticado,
  RespostaPaginada,
  Plano,
  EntradaPlano,
  StatusPlano,
  Aluno,
  EntradaAluno,
  StatusAluno,
  Treino,
  EntradaTreino,
  NivelTreino,
  IndicadoresPainel,
} from '@shape/shared';

export type ParametrosPaginacao = {
  page: number;
  pageSize: number;
  skip: number;
};

export type ParametrosListagemPlanos = ParametrosPaginacao & {
  ownerId: string;
  search?: string;
  status?: StatusPlano;
};

export type ParametrosListagemAlunos = ParametrosPaginacao & {
  ownerId: string;
  search?: string;
  status?: StatusAluno;
  planId?: string;
};

export type ParametrosListagemTreinos = ParametrosPaginacao & {
  ownerId: string;
  search?: string;
  level?: NivelTreino;
  studentId?: string;
};

// Registro interno de usuario inclui passwordHash; esse campo nao vai para o frontend.
export type RegistroUsuario = UsuarioAutenticado & {
  passwordHash: string;
};

// Token de recuperacao salvo como hash para nao expor o link original.
export type RegistroTokenRecuperacaoSenha = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
};

// Operacoes necessarias para cadastro, login, perfil e recuperacao de senha.
export interface IRepositorioUsuario {
  create(input: { name: string; email: string; passwordHash: string; cpf: string; perfil: PerfilAcesso }): Promise<RegistroUsuario>;
  list(): Promise<UsuarioAutenticado[]>;
  findByEmail(email: string): Promise<RegistroUsuario | null>;
  findByCpf(cpf: string): Promise<RegistroUsuario | null>;
  findById(id: string): Promise<RegistroUsuario | null>;
  update(id: string, input: { name: string; passwordHash: string; cpf: string }): Promise<RegistroUsuario>;
  criarTokenRecuperacaoSenha(input: { userId: string; tokenHash: string; expiresAt: Date }): Promise<RegistroTokenRecuperacaoSenha>;
  buscarTokenRecuperacaoSenhaPorHash(tokenHash: string): Promise<RegistroTokenRecuperacaoSenha | null>;
  marcarTokenRecuperacaoSenhaUsado(id: string): Promise<void>;
  excluirTokensRecuperacaoSenhaPorUsuario(userId: string): Promise<void>;
}

// Operacoes de persistencia para planos comerciais da academia.
export interface IRepositorioPlano {
  list(params: ParametrosListagemPlanos): Promise<RespostaPaginada<Plano>>;
  create(ownerId: string, input: EntradaPlano): Promise<Plano>;
  findById(ownerId: string, id: string): Promise<Plano | null>;
  update(ownerId: string, id: string, input: EntradaPlano): Promise<Plano>;
  delete(ownerId: string, id: string): Promise<void>;
  contarAtivos(ownerId: string): Promise<number>;
  contarAlunosPorPlano(ownerId: string): Promise<Array<{ name: string; students: number }>>;
}

// Operacoes de persistencia para alunos e indicadores relacionados.
export interface IRepositorioAluno {
  list(params: ParametrosListagemAlunos): Promise<RespostaPaginada<Aluno>>;
  create(ownerId: string, input: EntradaAluno): Promise<Aluno>;
  findById(ownerId: string, id: string): Promise<Aluno | null>;
  findByEmail(ownerId: string, email: string): Promise<Aluno | null>;
  findByCpf(ownerId: string, cpf: string): Promise<Aluno | null>;
  update(ownerId: string, id: string, input: EntradaAluno): Promise<Aluno>;
  delete(ownerId: string, id: string): Promise<void>;
  contarTodos(ownerId: string): Promise<number>;
  contarPorPlano(ownerId: string, planId: string): Promise<number>;
  contarNovosNoMesAtual(ownerId: string): Promise<number>;
  buscarRecentes(ownerId: string, limit: number): Promise<IndicadoresPainel['recentStudents']>;
}

// Operacoes de persistencia para treinos e agrupamentos do dashboard.
export interface IRepositorioTreino {
  list(params: ParametrosListagemTreinos): Promise<RespostaPaginada<Treino>>;
  create(ownerId: string, input: EntradaTreino): Promise<Treino>;
  findById(ownerId: string, id: string): Promise<Treino | null>;
  update(ownerId: string, id: string, input: EntradaTreino): Promise<Treino>;
  delete(ownerId: string, id: string): Promise<void>;
  contarTodos(ownerId: string): Promise<number>;
  contarPorNivel(ownerId: string): Promise<Array<{ level: Treino['level']; workouts: number }>>;
}
