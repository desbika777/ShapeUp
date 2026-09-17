import type { NivelTreino, StatusAluno, StatusPlano } from '@shape/shared';

export function formatCurrency(value: number) {
  const [integerPart, decimalPart] = value.toFixed(2).split('.');
  const integerWithSeparators = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `R$ ${integerWithSeparators},${decimalPart}`;
}

export function formatDate(value: string) {
  const normalizedValue = value.length === 10 ? `${value}T00:00:00` : value;
  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatPlanStatus(value: StatusPlano) {
  return value === 'ATIVO' ? 'Ativo' : 'Inativo';
}

export function formatStudentStatus(value: StatusAluno) {
  return value === 'ATIVO' ? 'Ativo' : 'Inativo';
}

export function formatWorkoutLevel(value: NivelTreino) {
  switch (value) {
    case 'INICIANTE':
      return 'Iniciante';
    case 'INTERMEDIARIO':
      return 'Intermediario';
    case 'AVANCADO':
      return 'Avancado';
  }
}

export function toDateInputValue(value: string) {
  return value.slice(0, 10);
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}
