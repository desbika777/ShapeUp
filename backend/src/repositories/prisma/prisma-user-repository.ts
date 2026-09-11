// Repositorio Prisma de usuarios: usado pela autenticacao e perfil.
import type { PerfilAcesso } from '@shape/shared';
import type { IRepositorioUsuario, RegistroTokenRecuperacaoSenha, RegistroUsuario } from '../interfaces.js';
import { prisma } from '../../lib/prisma.js';

function mapearUsuario(record: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
  perfis?: Array<{ perfil: { name: string } }>;
}): RegistroUsuario {
  const perfil = record.perfis?.some((item) => item.perfil.name === 'ADMIN') ? 'ADMIN' : 'USUARIO';

  // Padroniza datas como string ISO para o service e o frontend.
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    passwordHash: record.passwordHash,
    cpf: record.cpf,
    perfil,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function mapearTokenRecuperacaoSenha(record: {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}): RegistroTokenRecuperacaoSenha {
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

export class RepositorioPrismaUsuario implements IRepositorioUsuario {
  async create(input: { name: string; email: string; passwordHash: string; cpf: string; perfil: PerfilAcesso }) {
    // Cria usuario ja com senha protegida por hash recebido do service.
    const { perfil, ...userData } = input;
    const created = await prisma.usuario.create({
      data: {
        ...userData,
        perfis: {
          create: {
            perfil: {
              connectOrCreate: {
                where: { name: perfil },
                create: {
                  name: perfil,
                  description: perfil === 'ADMIN' ? 'Acesso administrativo completo.' : 'Acesso operacional limitado.',
                },
              },
            },
          },
        },
      },
      include: { perfis: { include: { perfil: true } } },
    });
    return mapearUsuario(created);
  }

  async list() {
    const users = await prisma.usuario.findMany({
      orderBy: { createdAt: 'desc' },
      include: { perfis: { include: { perfil: true } } },
    });
    return users.map((user) => {
      const { passwordHash: _passwordHash, ...safeUser } = mapearUsuario(user);
      return safeUser;
    });
  }

  async findByEmail(email: string) {
    const user = await prisma.usuario.findUnique({ where: { email }, include: { perfis: { include: { perfil: true } } } });
    return user ? mapearUsuario(user) : null;
  }

  async findByCpf(cpf: string) {
    const user = await prisma.usuario.findUnique({ where: { cpf }, include: { perfis: { include: { perfil: true } } } });
    return user ? mapearUsuario(user) : null;
  }

  async findById(id: string) {
    const user = await prisma.usuario.findUnique({ where: { id }, include: { perfis: { include: { perfil: true } } } });
    return user ? mapearUsuario(user) : null;
  }

  async update(id: string, input: { name: string; passwordHash: string; cpf: string }) {
    const updated = await prisma.usuario.update({
      where: { id },
      data: input,
      include: { perfis: { include: { perfil: true } } },
    });
    return mapearUsuario(updated);
  }

  async criarTokenRecuperacaoSenha(input: { userId: string; tokenHash: string; expiresAt: Date }) {
    // Salva somente hash do token para reduzir risco caso o banco seja exposto.
    const created = await prisma.tokenRecuperacaoSenha.create({ data: input });
    return mapearTokenRecuperacaoSenha(created);
  }

  async buscarTokenRecuperacaoSenhaPorHash(tokenHash: string) {
    const token = await prisma.tokenRecuperacaoSenha.findUnique({ where: { tokenHash } });
    return token ? mapearTokenRecuperacaoSenha(token) : null;
  }

  async marcarTokenRecuperacaoSenhaUsado(id: string) {
    await prisma.tokenRecuperacaoSenha.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async excluirTokensRecuperacaoSenhaPorUsuario(userId: string) {
    // Invalida tokens antigos quando um novo link e enviado ou a senha muda.
    await prisma.tokenRecuperacaoSenha.deleteMany({ where: { userId } });
  }
}
