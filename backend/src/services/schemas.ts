// Schemas Zod do backend: validam entrada antes das regras de negocio.
import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});

export const planListSchema = paginationSchema.extend({
  search: z.string().min(1).optional(),
  status: z.enum(['ATIVO', 'INATIVO']).optional(),
});

export const studentListSchema = paginationSchema.extend({
  search: z.string().min(1).optional(),
  status: z.enum(['ATIVO', 'INATIVO']).optional(),
  planId: z.string().min(1).optional(),
});

export const workoutListSchema = paginationSchema.extend({
  search: z.string().min(1).optional(),
  level: z.enum(['INICIANTE', 'INTERMEDIARIO', 'AVANCADO']).optional(),
  studentId: z.string().min(1).optional(),
});

export const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().min(1),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  cpf: z.string().min(11),
});

export const updateUserSchema = z.object({
  name: z.string().min(3),
  cpf: z.string().min(11),
  currentPassword: z.string().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const planSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  durationMonths: z.coerce.number().int().positive(),
  status: z.enum(['ATIVO', 'INATIVO']),
});

export const studentSchema = z.object({
  name: z.string().min(3),
  email: z.string().min(1),
  cpf: z.string().min(11),
  phone: z.string().min(8),
  birthDate: z.string().min(1),
  goal: z.string().min(5),
  status: z.enum(['ATIVO', 'INATIVO']),
  planId: z.string().min(1),
});

export const workoutSchema = z.object({
  studentId: z.string().min(1),
  title: z.string().min(3),
  objective: z.string().min(5),
  level: z.enum(['INICIANTE', 'INTERMEDIARIO', 'AVANCADO']),
  notes: z.string().min(5),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});
