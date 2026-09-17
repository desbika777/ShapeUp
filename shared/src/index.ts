// Tipos compartilhados entre frontend e backend.
// Mantem os contratos da API iguais nos dois lados do projeto.
export type PerfilAcesso = 'MASTER' | 'ADMIN';

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
  perfil: PerfilAcesso;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
};

// Resposta padrao de login: token JWT e usuario.
export type RespostaAutenticacao = {
  token: string;
  user: UsuarioAutenticado;
};

// Entradas usadas nas telas e services de autenticacao.
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

export type EntradaCriacaoUsuario = {
  name: string;
  email: string;
  cpf: string;
  password: string;
  confirmPassword: string;
  perfil: PerfilAcesso;
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const SENHA_FORTE_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(normalizeEmail(email));
}

export function normalizeCpf(cpf: string) {
  return cpf.replace(/\D/g, '');
}

export function isValidCpf(cpf: string) {
  const normalized = normalizeCpf(cpf);

  if (normalized.length !== 11 || /^([0-9])\1+$/.test(normalized)) {
    return false;
  }

  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    sum += Number(normalized[index]) * (10 - index);
  }

  let remainder = (sum * 10) % 11;
  remainder = remainder === 10 ? 0 : remainder;

  if (remainder !== Number(normalized[9])) {
    return false;
  }

  sum = 0;
  for (let index = 0; index < 10; index += 1) {
    sum += Number(normalized[index]) * (11 - index);
  }

  remainder = (sum * 10) % 11;
  remainder = remainder === 10 ? 0 : remainder;

  return remainder === Number(normalized[10]);
}

export function isStrongPassword(password: string) {
  return SENHA_FORTE_REGEX.test(password);
}

// Parametros oficiais para upload de imagens via Multer.
export const IMAGEM_EXTENSOES_PERMITIDAS = ['.png', '.jpg', '.jpeg', '.webp'] as const;
export const IMAGEM_MIME_TYPES_PERMITIDOS = ['image/png', 'image/jpeg', 'image/webp'] as const;
export const IMAGEM_TAMANHO_MAXIMO_BYTES = 8 * 1024 * 1024;

export type ImagemEnviada = {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  extension: string;
  relativePath: string;
  url: string;
  uploadedAt: string;
};

export const CATEGORIAS_ANEXO = ['COMPROVANTE', 'AVALIACAO', 'MANUTENCAO', 'DOCUMENTO', 'OUTRO'] as const;

export type CategoriaAnexo = typeof CATEGORIAS_ANEXO[number];

export type AnexoAcademia = ImagemEnviada & {
  id: string;
  category: CategoriaAnexo;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EntradaAnexo = {
  category: CategoriaAnexo;
  description?: string;
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
