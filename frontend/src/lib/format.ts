import type { PlanStatus, StudentStatus, WorkoutLevel } from '@shapeup/shared';

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
}

export function formatCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatPlanStatus(value: PlanStatus) {
  return value === 'ACTIVE' ? 'Ativo' : 'Inativo';
}

export function formatStudentStatus(value: StudentStatus) {
  return value === 'ACTIVE' ? 'Ativo' : 'Inativo';
}

export function formatWorkoutLevel(value: WorkoutLevel) {
  switch (value) {
    case 'BEGINNER':
      return 'Iniciante';
    case 'INTERMEDIATE':
      return 'Intermediario';
    case 'ADVANCED':
      return 'Avancado';
  }
}
