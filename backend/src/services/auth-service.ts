// Servico de autenticacao: concentra regras de cadastro, login, perfil e senha.
import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type {
  RespostaMensagemApi,
  RespostaAutenticacao,
  UsuarioAutenticado,
  EntradaEsqueciSenha,
  EntradaRedefinirSenha,
  EntradaLoginUsuario,
  EntradaCadastroUsuario,
  EntradaAtualizacaoUsuario,
  EntradaCriacaoUsuario,
} from '@shape/shared';
import { env } from '../config/env.js';
import { AppError } from '../core/app-error.js';
import type { IRepositorioUsuario } from '../repositories/interfaces.js';
import type { IServicoEmail } from './mail-service.js';
import { isStrongPassword, isValidCpf, isValidEmail, normalizeCpf } from '../utils/validators.js';

const PASSWORD_RESET_REQUEST_MESSAGE = 'Se o e-mail estiver cadastrado, voce recebera um link para redefinir sua senha.';
const PASSWORD_RESET_INVALID_MESSAGE = 'O link de redefinicao e invalido ou expirou.';

export class ServicoAutenticacao {
  constructor(
    private readonly userRepository: IRepositorioUsuario,
    private readonly mailService: IServicoEmail,
  ) {}

  // Valida dados do gestor, protege a senha com hash e cria a conta.
  async register(input: EntradaCadastroUsuario): Promise<RespostaAutenticacao> {
    await this.validateNewUser(input);
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.userRepository.create({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash,
      cpf: normalizeCpf(input.cpf),
      perfil: 'ADMIN',
    });

    return this.buildAuthResponse(user);
  }

  // Lista usuarios para que o administrador acompanhe os acessos existentes.
  listUsers() {
    return this.userRepository.list();
  }

  // Cria usuario operacional com perfil escolhido pelo administrador.
  async createUser(input: EntradaCriacaoUsuario): Promise<UsuarioAutenticado> {
    await this.validateNewUser(input);
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.userRepository.create({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash,
      cpf: normalizeCpf(input.cpf),
      perfil: input.perfil,
    });

    return this.toAuthUser(user);
  }

  private async validateNewUser(input: EntradaCadastroUsuario | EntradaCriacaoUsuario) {
    if (!isValidEmail(input.email)) {
      throw new AppError(400, 'Informe um e-mail valido.');
    }

    if (!isValidCpf(input.cpf)) {
      throw new AppError(400, 'Informe um CPF valido.');
    }

    if (!isStrongPassword(input.password)) {
      throw new AppError(400, 'A senha deve ter no minimo 8 caracteres, letras maiusculas, minusculas, numeros e simbolos.');
    }

    if (input.password !== input.confirmPassword) {
      throw new AppError(400, 'A confirmacao da senha nao confere.');
    }

    const email = input.email.trim().toLowerCase();
    const normalizedCpf = normalizeCpf(input.cpf);

    const [emailAlreadyExists, cpfAlreadyExists] = await Promise.all([
      this.userRepository.findByEmail(email),
      this.userRepository.findByCpf(normalizedCpf),
    ]);

    if (emailAlreadyExists) {
      throw new AppError(409, 'Ja existe um usuario com este e-mail.');
    }

    if (cpfAlreadyExists) {
      throw new AppError(409, 'Ja existe um usuario com este CPF.');
    }
  }

  // Confere e-mail e senha para gerar uma sessao JWT.
  async login(input: EntradaLoginUsuario): Promise<RespostaAutenticacao> {
    if (!isValidEmail(input.email)) {
      throw new AppError(400, 'Informe um e-mail valido.');
    }

    const user = await this.userRepository.findByEmail(input.email.trim().toLowerCase());

    if (!user) {
      throw new AppError(401, 'Credenciais invalidas.');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError(401, 'Credenciais invalidas.');
    }

    return this.buildAuthResponse(user);
  }

  // Busca o usuario autenticado pelo id gravado no token.
  async getCurrentUser(userId: string): Promise<UsuarioAutenticado> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, 'Usuario nao encontrado.');
    }

    return this.toAuthUser(user);
  }

  // Atualiza perfil e troca senha somente quando a senha atual foi confirmada.
  async updateProfile(userId: string, input: EntradaAtualizacaoUsuario): Promise<UsuarioAutenticado> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, 'Usuario nao encontrado.');
    }

    if (!isValidCpf(input.cpf)) {
      throw new AppError(400, 'Informe um CPF valido.');
    }

    const normalizedCpf = normalizeCpf(input.cpf);
    const cpfOwner = await this.userRepository.findByCpf(normalizedCpf);

    if (cpfOwner && cpfOwner.id !== userId) {
      throw new AppError(409, 'Ja existe um usuario com este CPF.');
    }

    const shouldChangePassword = Boolean(input.currentPassword || input.password || input.confirmPassword);
    let passwordHash = user.passwordHash;

    if (shouldChangePassword) {
      if (!input.currentPassword) {
        throw new AppError(400, 'Informe sua senha atual para alterar a senha.');
      }

      if (!input.password || !isStrongPassword(input.password)) {
        throw new AppError(400, 'A nova senha deve ter no minimo 8 caracteres, letras maiusculas, minusculas, numeros e simbolos.');
      }

      if (!input.confirmPassword) {
        throw new AppError(400, 'Confirme a nova senha.');
      }

      if (input.password !== input.confirmPassword) {
        throw new AppError(400, 'A confirmacao da senha nao confere.');
      }

      const currentPasswordMatches = await bcrypt.compare(input.currentPassword, user.passwordHash);

      if (!currentPasswordMatches) {
        throw new AppError(401, 'A senha atual informada esta incorreta.');
      }

      passwordHash = await bcrypt.hash(input.password, 10);
    }

    const updated = await this.userRepository.update(userId, {
      name: input.name.trim(),
      passwordHash,
      cpf: normalizedCpf,
    });

    return this.toAuthUser(updated);
  }

  // Gera token de redefinicao, salva o hash e envia o link por e-mail.
  async requestPasswordReset(input: EntradaEsqueciSenha): Promise<RespostaMensagemApi> {
    const email = input.email.trim().toLowerCase();

    if (!isValidEmail(email)) {
      throw new AppError(400, 'Informe um e-mail valido.');
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return { message: PASSWORD_RESET_REQUEST_MESSAGE };
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashResetToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
    const resetUrl = this.buildPasswordResetUrl(token);

    await this.userRepository.excluirTokensRecuperacaoSenhaPorUsuario(user.id);
    await this.userRepository.criarTokenRecuperacaoSenha({ userId: user.id, tokenHash, expiresAt });

    await this.mailService.send({
      to: user.email,
      subject: 'Redefinicao de senha Shape',
      text: [
        `Ola, ${user.name}.`,
        '',
        'Recebemos uma solicitacao para redefinir a senha da sua conta Shape.',
        `Acesse o link abaixo para criar uma nova senha: ${resetUrl}`,
        '',
        'Se voce nao solicitou essa alteracao, ignore este e-mail.',
      ].join('\n'),
      html: [
        `<p>Ola, ${user.name}.</p>`,
        '<p>Recebemos uma solicitacao para redefinir a senha da sua conta Shape.</p>',
        `<p><a href="${resetUrl}">Clique aqui para criar uma nova senha</a>.</p>`,
        '<p>Se voce nao solicitou essa alteracao, ignore este e-mail.</p>',
      ].join(''),
    });

    return { message: PASSWORD_RESET_REQUEST_MESSAGE };
  }

  // Valida o token recebido por e-mail e grava a nova senha com hash.
  async resetPassword(input: EntradaRedefinirSenha): Promise<RespostaMensagemApi> {
    if (!isStrongPassword(input.password)) {
      throw new AppError(400, 'A nova senha deve ter no minimo 8 caracteres, letras maiusculas, minusculas, numeros e simbolos.');
    }

    if (input.password !== input.confirmPassword) {
      throw new AppError(400, 'A confirmacao da senha nao confere.');
    }

    const tokenHash = this.hashResetToken(input.token.trim());
    const resetToken = await this.userRepository.buscarTokenRecuperacaoSenhaPorHash(tokenHash);

    if (!resetToken || resetToken.usedAt || new Date(resetToken.expiresAt).getTime() <= Date.now()) {
      throw new AppError(400, PASSWORD_RESET_INVALID_MESSAGE);
    }

    const user = await this.userRepository.findById(resetToken.userId);

    if (!user) {
      throw new AppError(400, PASSWORD_RESET_INVALID_MESSAGE);
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    await this.userRepository.update(user.id, {
      name: user.name,
      passwordHash,
      cpf: user.cpf,
    });
    await this.userRepository.excluirTokensRecuperacaoSenhaPorUsuario(user.id);

    return { message: 'Senha redefinida com sucesso.' };
  }

  // Monta o retorno padrao usado em cadastro e login.
  private buildAuthResponse(user: Awaited<ReturnType<IRepositorioUsuario['create']>>): RespostaAutenticacao {
    return {
      token: jwt.sign({ perfil: user.perfil }, env.JWT_SECRET, { subject: user.id, expiresIn: '8h' }),
      user: this.toAuthUser(user),
    };
  }

  // Remove dados sensiveis antes de devolver usuario ao frontend.
  private toAuthUser(user: Awaited<ReturnType<IRepositorioUsuario['create']>>): UsuarioAutenticado {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      perfil: user.perfil,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Guarda apenas o hash do token de reset, nao o token puro.
  private hashResetToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // Monta a URL que o usuario recebe para redefinir a senha.
  private buildPasswordResetUrl(token: string): string {
    const resetUrl = env.PASSWORD_RESET_URL ? new URL(env.PASSWORD_RESET_URL) : new URL('/redefinir-senha', env.FRONTEND_URL);
    resetUrl.searchParams.set('token', token);
    return resetUrl.toString();
  }
}
