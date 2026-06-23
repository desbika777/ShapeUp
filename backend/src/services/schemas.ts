import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});

export const planListSchema = paginationSchema.extend({
  search: z.string().min(1).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const studentListSchema = paginationSchema.extend({
  search: z.string().min(1).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  planId: z.string().min(1).optional(),
});

export const workoutListSchema = paginationSchema.extend({
  search: z.string().min(1).optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
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
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const studentSchema = z.object({
  name: z.string().min(3),
  email: z.string().min(1),
  cpf: z.string().min(11),
  phone: z.string().min(8),
  birthDate: z.string().min(1),
  goal: z.string().min(5),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  planId: z.string().min(1),
});

export const workoutSchema = z.object({
  studentId: z.string().min(1),
  title: z.string().min(3),
  objective: z.string().min(5),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  notes: z.string().min(5),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});
