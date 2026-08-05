// Formatadores usados para mostrar dados tecnicos em formato brasileiro.
import type { StatusPlano, StatusAluno, NivelTreino } from '@shape/shared';

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
