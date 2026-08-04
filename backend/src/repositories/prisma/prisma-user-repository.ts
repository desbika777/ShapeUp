// Repositorio Prisma de usuarios: usado pela autenticacao e perfil.
import type { IUserRepository, PasswordResetTokenRecord, UserRecord } from '../interfaces.js';
import { prisma } from '../../lib/prisma.js';

function mapUser(record: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
}): UserRecord {
  // Padroniza datas como string ISO para o service e o frontend.
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    passwordHash: record.passwordHash,
    cpf: record.cpf,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function mapPasswordResetToken(record: {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}): PasswordResetTokenRecord {
  // Normaliza datas do token de reset para facilitar comparacoes.
  return {
    id: record.id,
    userId: record.userId,
    tokenHash: record.tokenHash,
    expiresAt: record.expiresAt.toISOString(),
    usedAt: record.usedAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
  };
}

export class PrismaUserRepository implements IUserRepository {
  async create(input: { name: string; email: string; passwordHash: string; cpf: string }) {
    // Cria usuario ja com senha protegida por hash recebido do service.
    const created = await prisma.user.create({ data: input });
    return mapUser(created);
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? mapUser(user) : null;
  }

  async findByCpf(cpf: string) {
    const user = await prisma.user.findUnique({ where: { cpf } });
    return user ? mapUser(user) : null;
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? mapUser(user) : null;
  }

  async update(id: string, input: { name: string; passwordHash: string; cpf: string }) {
    const updated = await prisma.user.update({ where: { id }, data: input });
    return mapUser(updated);
  }

  async createPasswordResetToken(input: { userId: string; tokenHash: string; expiresAt: Date }) {
    // Salva somente hash do token para reduzir risco caso o banco seja exposto.
    const created = await prisma.passwordResetToken.create({ data: input });
    return mapPasswordResetToken(created);
  }

  async findPasswordResetTokenByHash(tokenHash: string) {
    const token = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    return token ? mapPasswordResetToken(token) : null;
  }

  async markPasswordResetTokenUsed(id: string) {
    await prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async deletePasswordResetTokensByUserId(userId: string) {
    // Invalida tokens antigos quando um novo link e enviado ou a senha muda.
    await prisma.passwordResetToken.deleteMany({ where: { userId } });
  }
}
