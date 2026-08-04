// Seed local do ShapeUp.
// Cria dados iniciais para testar o sistema e demonstrar a modelagem na banca.
import 'dotenv/config';
import {
  AttendanceSource,
  ClassScheduleStatus,
  ClassStatus,
  EnrollmentStatus,
  EquipmentStatus,
  ExerciseStatus,
  GoalStatus,
  MaintenanceStatus,
  MembershipStatus,
  PaymentMethodStatus,
  PaymentStatus,
  PlanStatus,
  PrismaClient,
  StaffStatus,
  StudentStatus,
  WorkoutLevel,
  WorkoutStatus,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Senha padrao do usuario administrador: ShapeUp@123.
  const passwordHash = await bcrypt.hash('ShapeUp@123', 10);
  const now = new Date();

  // Academia base usada para relacionar usuarios, alunos e operacao.
  const academy = await prisma.academy.upsert({
    where: { document: '12345678000190' },
    update: {
      name: 'Shape Academia Central',
      phone: '11940028922',
      email: 'contato@shape.com',
      status: 'ACTIVE',
    },
    create: {
      id: 'seed-academy-central',
      name: 'Shape Academia Central',
      document: '12345678000190',
      phone: '11940028922',
      email: 'contato@shape.com',
      status: 'ACTIVE',
    },
  });

  // Perfis de acesso preparados para evoluir permissoes no projeto.
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: { description: 'Acesso administrativo completo.' },
    create: { id: 'seed-role-admin', name: 'ADMIN', description: 'Acesso administrativo completo.' },
  });

  const teacherRole = await prisma.role.upsert({
    where: { name: 'PROFESSOR' },
    update: { description: 'Acesso para professores e instrutores.' },
    create: { id: 'seed-role-professor', name: 'PROFESSOR', description: 'Acesso para professores e instrutores.' },
  });

  // Gestor principal usado para acessar o sistema localmente.
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shapeup.com' },
    update: {
      academyId: academy.id,
      name: 'Administrador Shape',
      passwordHash,
      cpf: '11144477735',
      status: 'ACTIVE',
    },
    create: {
      academyId: academy.id,
      name: 'Administrador Shape',
      email: 'admin@shapeup.com',
      passwordHash,
      cpf: '11144477735',
      status: 'ACTIVE',
    },
  });

  // Vincula o gestor ao perfil administrativo.
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id },
  });

  // Professor/instrutor usado nos treinos, aulas e avaliacoes.
  const teacher = await prisma.staffMember.upsert({
    where: { academyId_cpf: { academyId: academy.id, cpf: '22255588896' } },
    update: {
      name: 'Mariana Costa',
      email: 'mariana.costa@shape.com',
      phone: '11988887777',
      position: 'Professora',
      status: StaffStatus.ACTIVE,
    },
    create: {
      id: 'seed-staff-mariana',
      academyId: academy.id,
      name: 'Mariana Costa',
      email: 'mariana.costa@shape.com',
      cpf: '22255588896',
      phone: '11988887777',
      position: 'Professora',
      status: StaffStatus.ACTIVE,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: teacherRole.id } },
    update: {},
    create: { userId: admin.id, roleId: teacherRole.id },
  });

  // Plano comercial inicial para matricular alunos.
  const plan = await prisma.plan.upsert({
    where: { id: 'seed-plan-premium' },
    update: {
      academyId: academy.id,
      ownerId: admin.id,
      name: 'Performance completa',
      description: 'Plano completo com acompanhamento continuo para evolucao e desempenho.',
      price: 249.9,
      durationMonths: 12,
      status: PlanStatus.ACTIVE,
    },
    create: {
      id: 'seed-plan-premium',
      academyId: academy.id,
      ownerId: admin.id,
      name: 'Performance completa',
      description: 'Plano completo com acompanhamento continuo para evolucao e desempenho.',
      price: 249.9,
      durationMonths: 12,
      status: PlanStatus.ACTIVE,
    },
  });

  // Aluno inicial para demonstrar carteira, matricula e treino.
  const student = await prisma.student.upsert({
    where: { ownerId_cpf: { ownerId: admin.id, cpf: '39053344705' } },
    update: {
      academyId: academy.id,
      ownerId: admin.id,
      name: 'Ana Silva',
      email: 'ana.silva@shapeup.com',
      cpf: '39053344705',
      phone: '11987654321',
      birthDate: new Date('1997-07-15'),
      goal: 'Hipertrofia com foco em membros inferiores',
      status: StudentStatus.ACTIVE,
      planId: plan.id,
    },
    create: {
      academyId: academy.id,
      ownerId: admin.id,
      name: 'Ana Silva',
      email: 'ana.silva@shapeup.com',
      cpf: '39053344705',
      phone: '11987654321',
      birthDate: new Date('1997-07-15'),
      goal: 'Hipertrofia com foco em membros inferiores',
      status: StudentStatus.ACTIVE,
      planId: plan.id,
    },
  });

  // Matricula liga aluno e plano com status ativo.
  const membership = await prisma.membership.upsert({
    where: { id: 'seed-membership-ana-performance' },
    update: {
      studentId: student.id,
      planId: plan.id,
      startDate: new Date('2026-08-01'),
      endDate: new Date('2027-08-01'),
      status: MembershipStatus.ACTIVE,
    },
    create: {
      id: 'seed-membership-ana-performance',
      studentId: student.id,
      planId: plan.id,
      startDate: new Date('2026-08-01'),
      endDate: new Date('2027-08-01'),
      status: MembershipStatus.ACTIVE,
    },
  });

  // Forma de pagamento e pagamento simulam a parte financeira.
  const paymentMethod = await prisma.paymentMethod.upsert({
    where: { academyId_name: { academyId: academy.id, name: 'Cartao de credito' } },
    update: { status: PaymentMethodStatus.ACTIVE },
    create: {
      id: 'seed-payment-method-credit-card',
      academyId: academy.id,
      name: 'Cartao de credito',
      status: PaymentMethodStatus.ACTIVE,
    },
  });

  await prisma.payment.upsert({
    where: { id: 'seed-payment-ana-august' },
    update: {
      membershipId: membership.id,
      paymentMethodId: paymentMethod.id,
      amount: 249.9,
      dueDate: new Date('2026-08-10'),
      paidAt: new Date('2026-08-03'),
      status: PaymentStatus.PAID,
    },
    create: {
      id: 'seed-payment-ana-august',
      membershipId: membership.id,
      paymentMethodId: paymentMethod.id,
      amount: 249.9,
      dueDate: new Date('2026-08-10'),
      paidAt: new Date('2026-08-03'),
      status: PaymentStatus.PAID,
    },
  });

  // Catalogo de grupos musculares e exercicios sustenta o modulo de treinos.
  const lowerBody = await prisma.muscleGroup.upsert({
    where: { academyId_name: { academyId: academy.id, name: 'Membros inferiores' } },
    update: {},
    create: { id: 'seed-muscle-lower-body', academyId: academy.id, name: 'Membros inferiores' },
  });

  const core = await prisma.muscleGroup.upsert({
    where: { academyId_name: { academyId: academy.id, name: 'Core' } },
    update: {},
    create: { id: 'seed-muscle-core', academyId: academy.id, name: 'Core' },
  });

  const squat = await prisma.exercise.upsert({
    where: { academyId_name: { academyId: academy.id, name: 'Agachamento livre' } },
    update: {
      description: 'Exercicio base para forca de membros inferiores.',
      instructions: 'Manter coluna neutra e amplitude controlada.',
      status: ExerciseStatus.ACTIVE,
    },
    create: {
      id: 'seed-exercise-squat',
      academyId: academy.id,
      name: 'Agachamento livre',
      description: 'Exercicio base para forca de membros inferiores.',
      instructions: 'Manter coluna neutra e amplitude controlada.',
      status: ExerciseStatus.ACTIVE,
    },
  });

  const plank = await prisma.exercise.upsert({
    where: { academyId_name: { academyId: academy.id, name: 'Prancha abdominal' } },
    update: {
      description: 'Exercicio isometrico para estabilizacao do core.',
      instructions: 'Evitar queda do quadril durante a execucao.',
      status: ExerciseStatus.ACTIVE,
    },
    create: {
      id: 'seed-exercise-plank',
      academyId: academy.id,
      name: 'Prancha abdominal',
      description: 'Exercicio isometrico para estabilizacao do core.',
      instructions: 'Evitar queda do quadril durante a execucao.',
      status: ExerciseStatus.ACTIVE,
    },
  });

  await prisma.exerciseMuscleGroup.upsert({
    where: { exerciseId_muscleGroupId: { exerciseId: squat.id, muscleGroupId: lowerBody.id } },
    update: {},
    create: { exerciseId: squat.id, muscleGroupId: lowerBody.id },
  });

  await prisma.exerciseMuscleGroup.upsert({
    where: { exerciseId_muscleGroupId: { exerciseId: plank.id, muscleGroupId: core.id } },
    update: {},
    create: { exerciseId: plank.id, muscleGroupId: core.id },
  });

  // Treino prescrito para o aluno, com professor responsavel.
  const workout = await prisma.workout.upsert({
    where: { id: 'seed-workout-forca-base' },
    update: {
      ownerId: admin.id,
      studentId: student.id,
      staffMemberId: teacher.id,
      title: 'Treino A - Forca e Base',
      objective: 'Ganhar forca e consolidar execucao tecnica',
      level: WorkoutLevel.INTERMEDIATE,
      notes: 'Priorizar progressao de carga a cada 2 semanas.',
      status: WorkoutStatus.ACTIVE,
      startDate: now,
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 45),
    },
    create: {
      id: 'seed-workout-forca-base',
      ownerId: admin.id,
      studentId: student.id,
      staffMemberId: teacher.id,
      title: 'Treino A - Forca e Base',
      objective: 'Ganhar forca e consolidar execucao tecnica',
      level: WorkoutLevel.INTERMEDIATE,
      notes: 'Priorizar progressao de carga a cada 2 semanas.',
      status: WorkoutStatus.ACTIVE,
      startDate: now,
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 45),
    },
  });

  // Exercicios vinculados ao treino com ordem, series e repeticoes.
  await prisma.workoutExercise.upsert({
    where: { workoutId_exerciseId_sortOrder: { workoutId: workout.id, exerciseId: squat.id, sortOrder: 1 } },
    update: { sets: 4, repetitions: '8-10', load: 40, restSeconds: 90, notes: 'Aumentar carga se execucao estiver estavel.' },
    create: {
      workoutId: workout.id,
      exerciseId: squat.id,
      sortOrder: 1,
      sets: 4,
      repetitions: '8-10',
      load: 40,
      restSeconds: 90,
      notes: 'Aumentar carga se execucao estiver estavel.',
    },
  });

  await prisma.workoutExercise.upsert({
    where: { workoutId_exerciseId_sortOrder: { workoutId: workout.id, exerciseId: plank.id, sortOrder: 2 } },
    update: { sets: 3, repetitions: '45 segundos', restSeconds: 60, notes: 'Manter postura neutra.' },
    create: {
      workoutId: workout.id,
      exerciseId: plank.id,
      sortOrder: 2,
      sets: 3,
      repetitions: '45 segundos',
      restSeconds: 60,
      notes: 'Manter postura neutra.',
    },
  });

  // Avaliacao fisica registra acompanhamento corporal do aluno.
  const assessment = await prisma.physicalAssessment.upsert({
    where: { id: 'seed-assessment-ana-initial' },
    update: {
      studentId: student.id,
      staffMemberId: teacher.id,
      assessmentDate: new Date('2026-08-03'),
      weight: 64.5,
      height: 1.68,
      bodyFatPercentage: 22.4,
      notes: 'Avaliacao inicial para acompanhamento de hipertrofia.',
    },
    create: {
      id: 'seed-assessment-ana-initial',
      studentId: student.id,
      staffMemberId: teacher.id,
      assessmentDate: new Date('2026-08-03'),
      weight: 64.5,
      height: 1.68,
      bodyFatPercentage: 22.4,
      notes: 'Avaliacao inicial para acompanhamento de hipertrofia.',
    },
  });

  // Medidas corporais complementam a avaliacao fisica.
  await prisma.bodyMeasurement.upsert({
    where: { id: 'seed-measurement-ana-waist' },
    update: { assessmentId: assessment.id, bodyPart: 'Cintura', value: 72, unit: 'cm' },
    create: { id: 'seed-measurement-ana-waist', assessmentId: assessment.id, bodyPart: 'Cintura', value: 72, unit: 'cm' },
  });

  await prisma.bodyMeasurement.upsert({
    where: { id: 'seed-measurement-ana-hip' },
    update: { assessmentId: assessment.id, bodyPart: 'Quadril', value: 98, unit: 'cm' },
    create: { id: 'seed-measurement-ana-hip', assessmentId: assessment.id, bodyPart: 'Quadril', value: 98, unit: 'cm' },
  });

  // Aulas coletivas, inscricao e frequencia representam rotina da academia.
  const classType = await prisma.classType.upsert({
    where: { academyId_name: { academyId: academy.id, name: 'Funcional' } },
    update: { description: 'Aula coletiva de condicionamento geral.', defaultCapacity: 20, status: ClassStatus.ACTIVE },
    create: {
      id: 'seed-class-type-functional',
      academyId: academy.id,
      name: 'Funcional',
      description: 'Aula coletiva de condicionamento geral.',
      defaultCapacity: 20,
      status: ClassStatus.ACTIVE,
    },
  });

  const classSchedule = await prisma.classSchedule.upsert({
    where: { id: 'seed-class-schedule-functional-monday' },
    update: {
      classTypeId: classType.id,
      staffMemberId: teacher.id,
      startsAt: new Date('2026-08-10T10:00:00'),
      endsAt: new Date('2026-08-10T11:00:00'),
      capacity: 20,
      status: ClassScheduleStatus.SCHEDULED,
    },
    create: {
      id: 'seed-class-schedule-functional-monday',
      classTypeId: classType.id,
      staffMemberId: teacher.id,
      startsAt: new Date('2026-08-10T10:00:00'),
      endsAt: new Date('2026-08-10T11:00:00'),
      capacity: 20,
      status: ClassScheduleStatus.SCHEDULED,
    },
  });

  await prisma.classEnrollment.upsert({
    where: { classScheduleId_studentId: { classScheduleId: classSchedule.id, studentId: student.id } },
    update: { status: EnrollmentStatus.ENROLLED },
    create: { classScheduleId: classSchedule.id, studentId: student.id, status: EnrollmentStatus.ENROLLED },
  });

  await prisma.attendanceRecord.upsert({
    where: { id: 'seed-attendance-ana-functional' },
    update: {
      studentId: student.id,
      classScheduleId: classSchedule.id,
      checkInAt: new Date('2026-08-10T09:55:00'),
      source: AttendanceSource.CLASS,
    },
    create: {
      id: 'seed-attendance-ana-functional',
      studentId: student.id,
      classScheduleId: classSchedule.id,
      checkInAt: new Date('2026-08-10T09:55:00'),
      source: AttendanceSource.CLASS,
    },
  });

  // Equipamento e manutencao cobrem a parte operacional da estrutura fisica.
  const treadmill = await prisma.equipment.upsert({
    where: { academyId_code: { academyId: academy.id, code: 'EQ-EST-001' } },
    update: {
      name: 'Esteira profissional',
      status: EquipmentStatus.ACTIVE,
      acquiredAt: new Date('2025-02-01'),
    },
    create: {
      id: 'seed-equipment-treadmill',
      academyId: academy.id,
      name: 'Esteira profissional',
      code: 'EQ-EST-001',
      status: EquipmentStatus.ACTIVE,
      acquiredAt: new Date('2025-02-01'),
    },
  });

  await prisma.equipmentMaintenance.upsert({
    where: { id: 'seed-maintenance-treadmill' },
    update: {
      equipmentId: treadmill.id,
      description: 'Revisao preventiva semestral.',
      scheduledAt: new Date('2026-09-01'),
      status: MaintenanceStatus.SCHEDULED,
      cost: 180,
    },
    create: {
      id: 'seed-maintenance-treadmill',
      equipmentId: treadmill.id,
      description: 'Revisao preventiva semestral.',
      scheduledAt: new Date('2026-09-01'),
      status: MaintenanceStatus.SCHEDULED,
      cost: 180,
    },
  });

  // Metas, notificacoes e auditoria deixam a modelagem preparada para futuras entregas.
  await prisma.goal.upsert({
    where: { id: 'seed-goal-ana-strength' },
    update: {
      studentId: student.id,
      title: 'Aumentar carga no agachamento',
      description: 'Chegar a 60kg com tecnica estavel.',
      targetDate: new Date('2026-12-15'),
      status: GoalStatus.ACTIVE,
    },
    create: {
      id: 'seed-goal-ana-strength',
      studentId: student.id,
      title: 'Aumentar carga no agachamento',
      description: 'Chegar a 60kg com tecnica estavel.',
      targetDate: new Date('2026-12-15'),
      status: GoalStatus.ACTIVE,
    },
  });

  await prisma.notification.upsert({
    where: { id: 'seed-notification-admin-payment' },
    update: {
      academyId: academy.id,
      userId: admin.id,
      title: 'Pagamento confirmado',
      message: 'Pagamento da aluna Ana Silva registrado com sucesso.',
      readAt: null,
    },
    create: {
      id: 'seed-notification-admin-payment',
      academyId: academy.id,
      userId: admin.id,
      title: 'Pagamento confirmado',
      message: 'Pagamento da aluna Ana Silva registrado com sucesso.',
    },
  });

  await prisma.auditLog.upsert({
    where: { id: 'seed-audit-log-seed-run' },
    update: {
      academyId: academy.id,
      userId: admin.id,
      action: 'SEED_EXECUTED',
      entity: 'Academy',
      entityId: academy.id,
      metadata: { source: 'prisma/seed.ts' },
    },
    create: {
      id: 'seed-audit-log-seed-run',
      academyId: academy.id,
      userId: admin.id,
      action: 'SEED_EXECUTED',
      entity: 'Academy',
      entityId: academy.id,
      metadata: { source: 'prisma/seed.ts' },
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
