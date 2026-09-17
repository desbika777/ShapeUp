// Validacoes dos formularios do frontend usando Zod.
import { EMAIL_REGEX, isStrongPassword, isValidCpf } from '@shape/shared';
import { z } from 'zod';
import { parseDateInput } from './format';

// Login exige e-mail valido e senha preenchida.
export const loginSchema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Informe um e-mail valido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

export const loginFormSchema = loginSchema.extend({
  rememberAccess: z.boolean(),
});

// Base de validacao para criacao interna de clientes.
export const managerAccessSchema = z
  .object({
    name: z.string().min(3, 'Informe um nome com ao menos 3 caracteres.'),
    email: z.string().regex(EMAIL_REGEX, 'Informe um e-mail valido.'),
    password: z.string().refine(isStrongPassword, 'Use a senha provisoria gerada ou gere outra senha.'),
    confirmPassword: z.string().min(8, 'Confirme a senha.'),
    cpf: z.string().refine(isValidCpf, 'Informe um CPF valido.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'A confirmacao da senha nao confere.',
  });

// Criacao interna sempre gera a conta do dono da academia.
export const createUserSchema = managerAccessSchema.extend({
  perfil: z.enum(['ADMIN', 'MASTER']),
});

// Recuperacao de senha pede somente o e-mail cadastrado.
export const forgotPasswordSchema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Informe um e-mail valido.'),
});

// Redefinicao usa token do link e nova senha forte.
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'O link de redefinicao e invalido ou expirou.'),
    password: z.string().refine(isStrongPassword, 'Use uma senha forte com 8+ caracteres, maiuscula, minuscula, numero e simbolo.'),
    confirmPassword: z.string().min(8, 'Confirme a senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'A confirmacao da senha nao confere.',
  });

// Perfil permite alterar senha apenas quando os campos de senha sao preenchidos corretamente.
export const updateUserSchema = z
  .object({
    name: z.string().min(3, 'Informe um nome com ao menos 3 caracteres.'),
    cpf: z.string().refine(isValidCpf, 'Informe um CPF valido.'),
    currentPassword: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, context) => {
    const wantsPasswordChange = Boolean(data.currentPassword || data.password || data.confirmPassword);

    if (!wantsPasswordChange) {
      return;
    }

    if (!data.currentPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['currentPassword'],
        message: 'Informe sua senha atual para alterar a senha.',
      });
    }

    if (!data.password) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'Informe a nova senha.',
      });
    } else if (!isStrongPassword(data.password)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'Use uma senha forte com 8+ caracteres, maiuscula, minuscula, numero e simbolo.',
      });
    }

    if (!data.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Confirme a nova senha.',
      });
    } else if (data.password !== data.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'A confirmacao da senha nao confere.',
      });
    }
  });

// Plano comercial precisa de nome, descricao, valor, duracao e status.
export const planSchema = z.object({
  name: z.string().min(2, 'Informe o nome do plano.'),
  description: z.string().min(10, 'A descricao precisa ter pelo menos 10 caracteres.'),
  price: z.number().positive('Informe um valor valido.'),
  durationMonths: z.number().int().positive('Informe a duracao em meses.'),
  status: z.enum(['ATIVO', 'INATIVO']),
});

// Aluno precisa de dados pessoais, objetivo e plano vinculado.
export const studentSchema = z.object({
  name: z.string().min(3, 'Informe o nome do aluno.'),
  email: z.string().regex(EMAIL_REGEX, 'Informe um e-mail valido.'),
  cpf: z.string().refine(isValidCpf, 'Informe um CPF valido.'),
  phone: z.string().min(8, 'Informe um telefone valido.'),
  birthDate: z.string().min(1, 'Informe a data de nascimento.'),
  goal: z.string().min(5, 'Informe o objetivo do aluno.'),
  status: z.enum(['ATIVO', 'INATIVO']),
  planId: z.string().min(1, 'Selecione um plano.'),
});

// Treino precisa de aluno, periodo valido, objetivo e nivel.
export const workoutSchema = z.object({
  studentId: z.string().min(1, 'Selecione um aluno.'),
  title: z.string().min(3, 'Informe o titulo do treino.'),
  objective: z.string().min(5, 'Informe o objetivo do treino.'),
  level: z.enum(['INICIANTE', 'INTERMEDIARIO', 'AVANCADO']),
  notes: z.string().min(5, 'Descreva observacoes importantes.'),
  startDate: z.string().min(1, 'Informe a data inicial.').refine((value) => Boolean(parseDateInput(value)), 'Informe a data inicial no formato dd/mm/aaaa.'),
  endDate: z.string().min(1, 'Informe a data final.').refine((value) => Boolean(parseDateInput(value)), 'Informe a data final no formato dd/mm/aaaa.'),
}).refine((data) => {
  const start = parseDateInput(data.startDate);
  const end = parseDateInput(data.endDate);
  return Boolean(start && end && end >= start);
}, {
  path: ['endDate'],
  message: 'A data final deve ser igual ou posterior a data inicial.',
});

