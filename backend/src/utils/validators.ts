const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email);
}

export function normalizeCpf(cpf: string) {
  return cpf.replace(/\D/g, '');
}

export function isValidCpf(cpf: string) {
  const normalized = normalizeCpf(cpf);

  if (normalized.length !== 11 || /^([0-9])\1+$/.test(normalized)) {
    return false;
  }

  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    sum += Number(normalized[index]) * (10 - index);
  }
  let remainder = (sum * 10) % 11;
  remainder = remainder === 10 ? 0 : remainder;
  if (remainder !== Number(normalized[9])) {
    return false;
  }

  sum = 0;
  for (let index = 0; index < 10; index += 1) {
    sum += Number(normalized[index]) * (11 - index);
  }
  remainder = (sum * 10) % 11;
  remainder = remainder === 10 ? 0 : remainder;

  return remainder === Number(normalized[10]);
}

export function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
}
