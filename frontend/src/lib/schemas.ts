import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidCpf(cpf: string) {
  const normalized = cpf.replace(/\D/g, '');
  if (normalized.length !== 11 || /^([0-9])\1+$/.test(normalized)) return false;
  let sum = 0;
  for (let index = 0; index < 9; index += 1) sum += Number(normalized[index]) * (10 - index);
  let remainder = (sum * 10) % 11;
  remainder = remainder === 10 ? 0 : remainder;
  if (remainder !== Number(normalized[9])) return false;
  sum = 0;
  for (let index = 0; index < 10; index += 1) sum += Number(normalized[index]) * (11 - index);
  remainder = (sum * 10) % 11;
  remainder = remainder === 10 ? 0 : remainder;
  return remainder === Number(normalized[10]);
}

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const loginSchema = z.object({
  email: z.string().regex(emailRegex, 'Informe um e-mail valido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

export const loginFormSchema = loginSchema.extend({
  rememberAccess: z.boolean(),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Informe um nome com ao menos 3 caracteres.'),
    email: z.string().regex(emailRegex, 'Informe um e-mail valido.'),
    password: z.string().regex(strongPassword, 'Use uma senha forte com 8+ caracteres, maiuscula, minuscula, numero e simbolo.'),
    confirmPassword: z.string().min(8, 'Confirme a senha.'),
    cpf: z.string().refine(isValidCpf, 'Informe um CPF valido.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'A confirmacao da senha nao confere.',
  });

export const forgotPasswordSchema = z.object({
  email: z.string().regex(emailRegex, 'Informe um e-mail valido.'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'O link de redefinicao e invalido ou expirou.'),
    password: z.string().regex(strongPassword, 'Use uma senha forte com 8+ caracteres, maiuscula, minuscula, numero e simbolo.'),
    confirmPassword: z.string().min(8, 'Confirme a senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'A confirmacao da senha nao confere.',
  });

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
    } else if (!strongPassword.test(data.password)) {
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

export const planSchema = z.object({
  name: z.string().min(2, 'Informe o nome do plano.'),
  description: z.string().min(10, 'A descricao precisa ter pelo menos 10 caracteres.'),
  price: z.number().positive('Informe um valor valido.'),
  durationMonths: z.number().int().positive('Informe a duracao em meses.'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const studentSchema = z.object({
  name: z.string().min(3, 'Informe o nome do aluno.'),
  email: z.string().regex(emailRegex, 'Informe um e-mail valido.'),
  cpf: z.string().refine(isValidCpf, 'Informe um CPF valido.'),
  phone: z.string().min(8, 'Informe um telefone valido.'),
  birthDate: z.string().min(1, 'Informe a data de nascimento.'),
  goal: z.string().min(5, 'Informe o objetivo do aluno.'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  planId: z.string().min(1, 'Selecione um plano.'),
});

export const workoutSchema = z.object({
  studentId: z.string().min(1, 'Selecione um aluno.'),
  title: z.string().min(3, 'Informe o titulo do treino.'),
  objective: z.string().min(5, 'Informe o objetivo do treino.'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  notes: z.string().min(5, 'Descreva observacoes importantes.'),
  startDate: z.string().min(1, 'Informe a data inicial.'),
  endDate: z.string().min(1, 'Informe a data final.'),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  path: ['endDate'],
  message: 'A data final deve ser igual ou posterior a data inicial.',
});

