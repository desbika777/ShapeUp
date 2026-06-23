import type {
  AuthUser,
  PaginatedResponse,
  Plan,
  PlanInput,
  PlanStatus,
  Student,
  StudentInput,
  StudentStatus,
  Workout,
  WorkoutInput,
  WorkoutLevel,
  DashboardMetrics,
} from '@shapeup/shared';

export type PaginationParams = {
  page: number;
  pageSize: number;
  skip: number;
};

export type PlanListParams = PaginationParams & {
  ownerId: string;
  search?: string;
  status?: PlanStatus;
};

export type StudentListParams = PaginationParams & {
  ownerId: string;
  search?: string;
  status?: StudentStatus;
  planId?: string;
};

export type WorkoutListParams = PaginationParams & {
  ownerId: string;
  search?: string;
  level?: WorkoutLevel;
  studentId?: string;
};

export type UserRecord = AuthUser & {
  passwordHash: string;
};

export type PasswordResetTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
};

export interface IUserRepository {
  create(input: { name: string; email: string; passwordHash: string; cpf: string }): Promise<UserRecord>;
  findByEmail(email: string): Promise<UserRecord | null>;
  findByCpf(cpf: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
  update(id: string, input: { name: string; passwordHash: string; cpf: string }): Promise<UserRecord>;
  createPasswordResetToken(input: { userId: string; tokenHash: string; expiresAt: Date }): Promise<PasswordResetTokenRecord>;
  findPasswordResetTokenByHash(tokenHash: string): Promise<PasswordResetTokenRecord | null>;
  markPasswordResetTokenUsed(id: string): Promise<void>;
  deletePasswordResetTokensByUserId(userId: string): Promise<void>;
}

export interface IPlanRepository {
  list(params: PlanListParams): Promise<PaginatedResponse<Plan>>;
  create(ownerId: string, input: PlanInput): Promise<Plan>;
  findById(ownerId: string, id: string): Promise<Plan | null>;
  update(ownerId: string, id: string, input: PlanInput): Promise<Plan>;
  delete(ownerId: string, id: string): Promise<void>;
  countActive(ownerId: string): Promise<number>;
  countStudentsByPlan(ownerId: string): Promise<Array<{ name: string; students: number }>>;
}

export interface IStudentRepository {
  list(params: StudentListParams): Promise<PaginatedResponse<Student>>;
  create(ownerId: string, input: StudentInput): Promise<Student>;
  findById(ownerId: string, id: string): Promise<Student | null>;
  findByEmail(ownerId: string, email: string): Promise<Student | null>;
  findByCpf(ownerId: string, cpf: string): Promise<Student | null>;
  update(ownerId: string, id: string, input: StudentInput): Promise<Student>;
  delete(ownerId: string, id: string): Promise<void>;
  countAll(ownerId: string): Promise<number>;
  countByPlan(ownerId: string, planId: string): Promise<number>;
  countNewInCurrentMonth(ownerId: string): Promise<number>;
  findRecent(ownerId: string, limit: number): Promise<DashboardMetrics['recentStudents']>;
}

export interface IWorkoutRepository {
  list(params: WorkoutListParams): Promise<PaginatedResponse<Workout>>;
  create(ownerId: string, input: WorkoutInput): Promise<Workout>;
  findById(ownerId: string, id: string): Promise<Workout | null>;
  update(ownerId: string, id: string, input: WorkoutInput): Promise<Workout>;
  delete(ownerId: string, id: string): Promise<void>;
  countAll(ownerId: string): Promise<number>;
  countByLevel(ownerId: string): Promise<Array<{ level: Workout['level']; workouts: number }>>;
}
