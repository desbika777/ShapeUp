import { PrismaClient, PlanStatus, StudentStatus, WorkoutLevel } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('ShapeUp@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shapeup.com' },
    update: {},
    create: {
      name: 'Administrador ShapeUp',
      email: 'admin@shapeup.com',
      passwordHash,
      cpf: '11144477735',
    },
  });

  const plan = await prisma.plan.upsert({
    where: { id: 'seed-plan-premium' },
    update: {
      ownerId: admin.id,
      name: 'Performance completa',
      description: 'Plano completo com acompanhamento continuo para evolucao e desempenho.',
      price: 249.9,
      durationMonths: 12,
      status: PlanStatus.ACTIVE,
    },
    create: {
      id: 'seed-plan-premium',
      ownerId: admin.id,
      name: 'Performance completa',
      description: 'Plano completo com acompanhamento continuo para evolucao e desempenho.',
      price: 249.9,
      durationMonths: 12,
      status: PlanStatus.ACTIVE,
    },
  });

  const student = await prisma.student.upsert({
    where: { ownerId_email: { ownerId: admin.id, email: 'ana.silva@shapeup.com' } },
    update: {
      ownerId: admin.id,
      name: 'Ana Silva',
      cpf: '39053344705',
      phone: '11987654321',
      birthDate: new Date('1997-07-15'),
      goal: 'Hipertrofia com foco em membros inferiores',
      status: StudentStatus.ACTIVE,
      planId: plan.id,
    },
    create: {
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

  await prisma.workout.upsert({
    where: { id: 'seed-workout-forca-base' },
    update: {
      ownerId: admin.id,
      studentId: student.id,
      title: 'Treino A - Forca e Base',
      objective: 'Ganhar forca e consolidar execucao tecnica',
      level: WorkoutLevel.INTERMEDIATE,
      notes: 'Priorizar progressao de carga a cada 2 semanas.',
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
    },
    create: {
      id: 'seed-workout-forca-base',
      ownerId: admin.id,
      studentId: student.id,
      title: 'Treino A - Forca e Base',
      objective: 'Ganhar forca e consolidar execucao tecnica',
      level: WorkoutLevel.INTERMEDIATE,
      notes: 'Priorizar progressao de carga a cada 2 semanas.',
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
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
