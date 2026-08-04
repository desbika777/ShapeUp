// Tipos compartilhados entre frontend e backend.
// Mantem os contratos da API iguais nos dois lados do projeto.
export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

// Usuario autenticado enviado ao frontend sem dados sensiveis.
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  createdAt: string;
  updatedAt: string;
};

// Resposta padrao de cadastro/login: token JWT e usuario.
export type AuthResponse = {
  token: string;
  user: AuthUser;
};

// Entradas usadas nas telas e services de autenticacao.
export type UserRegistrationInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cpf: string;
};

export type UserLoginInput = {
  email: string;
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type UserUpdateInput = {
  name: string;
  cpf: string;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
};

// Status e niveis controlam valores permitidos em selects e banco.
export type PlanStatus = 'ACTIVE' | 'INACTIVE';
export type StudentStatus = 'ACTIVE' | 'INACTIVE';
export type WorkoutLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// Contrato de plano comercial exibido no CRUD de planos.
export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
};

export type PlanInput = {
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  status: PlanStatus;
};

// Contrato de aluno exibido nas telas de carteira e formulario.
export type Student = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  goal: string;
  status: StudentStatus;
  planId: string;
  planName?: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentInput = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  goal: string;
  status: StudentStatus;
  planId: string;
};

// Contrato de treino usado na prescricao vinculada a alunos.
export type Workout = {
  id: string;
  studentId: string;
  studentName?: string;
  title: string;
  objective: string;
  level: WorkoutLevel;
  notes: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutInput = {
  studentId: string;
  title: string;
  objective: string;
  level: WorkoutLevel;
  notes: string;
  startDate: string;
  endDate: string;
};

// Dados consolidados que alimentam cards e graficos do dashboard.
export type DashboardMetrics = {
  totals: {
    students: number;
    activePlans: number;
    workouts: number;
    newStudentsThisMonth: number;
  };
  studentsByPlan: Array<{ name: string; students: number }>;
  workoutsByLevel: Array<{ level: WorkoutLevel; workouts: number }>;
  recentStudents: Array<Pick<Student, 'id' | 'name' | 'goal' | 'status' | 'createdAt'>>;
};

// Formato padrao de erro e mensagens simples da API.
export type ApiErrorPayload = {
  message: string;
  details?: string[];
};

export type ApiMessageResponse = {
  message: string;
};
