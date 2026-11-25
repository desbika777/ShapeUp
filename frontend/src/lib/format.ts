// Formatadores usados para mostrar dados tecnicos em formato brasileiro.
import type { StatusPlano, StatusAluno, NivelTreino, PerfilAcesso } from '@shape/shared';

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(value: string) {
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
}

export function maskBrazilianDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
}

function isValidDateParts(day: number, month: number, year: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function brazilianDateToIso(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return '';

  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);

  if (!isValidDateParts(day, month, year)) return '';
  return `${yearText}-${monthText}-${dayText}`;
}

export function formatDateForBrazilianInput(value: string) {
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  return maskBrazilianDate(value);
}

export function parseDateInput(value: string) {
  const isoValue = brazilianDateToIso(value) || (/^\d{4}-\d{2}-\d{2}/.exec(value)?.[0] ?? '');
  if (!isoValue) return null;

  const [yearText, monthText, dayText] = isoValue.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!isValidDateParts(day, month, year)) return null;
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatCpf(value: string) {
  // Mantem apenas 11 digitos e aplica mascara visual de CPF.
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatarStatusPlano(value: StatusPlano) {
  return value === 'ATIVO' ? 'Ativo' : 'Inativo';
}

export function formatarStatusAluno(value: StatusAluno) {
  return value === 'ATIVO' ? 'Ativo' : 'Inativo';
}

export function formatarNivelTreino(value: NivelTreino) {
  switch (value) {
    case 'INICIANTE':
      return 'Iniciante';
    case 'INTERMEDIARIO':
      return 'Intermediario';
    case 'AVANCADO':
      return 'Avancado';
  }
}

export function formatarPerfil(value: PerfilAcesso) {
  return value === 'MASTER' ? 'Master Shape Up' : 'Dono da academia';
}
