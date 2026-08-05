// Tipos compartilhados entre frontend e backend.
// Mantem os contratos da API iguais nos dois lados do projeto.
export type RespostaPaginada<T> = {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

// Usuario autenticado enviado ao frontend sem dados sensiveis.
export type UsuarioAutenticado = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  createdAt: string;
  updatedAt: string;
};

// Resposta padrao de cadastro/login: token JWT e usuario.
export type RespostaAutenticacao = {
  token: string;
  user: UsuarioAutenticado;
};

// Entradas usadas nas telas e services de autenticacao.
export type EntradaCadastroUsuario = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cpf: string;
};

export type EntradaLoginUsuario = {
  email: string;
  password: string;
};

export type EntradaEsqueciSenha = {
  email: string;
};

export type EntradaRedefinirSenha = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type EntradaAtualizacaoUsuario = {
  name: string;
  cpf: string;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
};

// Status e niveis controlam valores permitidos em selects e banco.
export type StatusPlano = 'ATIVO' | 'INATIVO';
export type StatusAluno = 'ATIVO' | 'INATIVO';
export type NivelTreino = 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';

// Contrato de plano comercial exibido no CRUD de planos.
export type Plano = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  status: StatusPlano;
  createdAt: string;
  updatedAt: string;
};

export type EntradaPlano = {
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  status: StatusPlano;
};

// Contrato de aluno exibido nas telas de carteira e formulario.
export type Aluno = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  goal: string;
  status: StatusAluno;
  planId: string;
  planName?: string;
  createdAt: string;
  updatedAt: string;
};

export type EntradaAluno = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  goal: string;
  status: StatusAluno;
  planId: string;
};

// Contrato de treino usado na prescricao vinculada a alunos.
export type Treino = {
  id: string;
  studentId: string;
  studentName?: string;
  title: string;
  objective: string;
  level: NivelTreino;
  notes: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type EntradaTreino = {
  studentId: string;
  title: string;
  objective: string;
  level: NivelTreino;
  notes: string;
  startDate: string;
  endDate: string;
};

// Dados consolidados que alimentam cards e graficos do dashboard.
export type IndicadoresPainel = {
  totals: {
    students: number;
    activePlans: number;
    workouts: number;
    newStudentsThisMonth: number;
  };
  studentsByPlan: Array<{ name: string; students: number }>;
  workoutsByLevel: Array<{ level: NivelTreino; workouts: number }>;
  recentStudents: Array<Pick<Aluno, 'id' | 'name' | 'goal' | 'status' | 'createdAt'>>;
};

// Formato padrao de erro e mensagens simples da API.
export type PayloadErroApi = {
  message: string;
  details?: string[];
};

export type RespostaMensagemApi = {
  message: string;
};
