import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type {
  ApiMessageResponse,
  AuthResponse,
  AuthUser,
  ForgotPasswordInput,
  ResetPasswordInput,
  UserLoginInput,
  UserRegistrationInput,
  UserUpdateInput,
} from '@shapeup/shared';
import { env } from '../config/env.js';
import { AppError } from '../core/app-error.js';
import type { IUserRepository } from '../repositories/interfaces.js';
import type { IMailService } from './mail-service.js';
import { isStrongPassword, isValidCpf, isValidEmail, normalizeCpf } from '../utils/validators.js';

const PASSWORD_RESET_REQUEST_MESSAGE = 'Se o e-mail estiver cadastrado, voce recebera um link para redefinir sua senha.';
const PASSWORD_RESET_INVALID_MESSAGE = 'O link de redefinicao e invalido ou expirou.';

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mailService: IMailService,
  ) {}

  async register(input: UserRegistrationInput): Promise<AuthResponse> {
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

    const normalizedCpf = normalizeCpf(input.cpf);

    const [emailAlreadyExists, cpfAlreadyExists] = await Promise.all([
      this.userRepository.findByEmail(input.email),
      this.userRepository.findByCpf(normalizedCpf),
    ]);

    if (emailAlreadyExists) {
      throw new AppError(409, 'Ja existe um usuario com este e-mail.');
    }

    if (cpfAlreadyExists) {
      throw new AppError(409, 'Ja existe um usuario com este CPF.');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.userRepository.create({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash,
      cpf: normalizedCpf,
    });

    return this.buildAuthResponse(user);
  }

  async login(input: UserLoginInput): Promise<AuthResponse> {
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

  async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, 'Usuario nao encontrado.');
    }

    return this.toAuthUser(user);
  }

  async updateProfile(userId: string, input: UserUpdateInput): Promise<AuthUser> {
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

  async requestPasswordReset(input: ForgotPasswordInput): Promise<ApiMessageResponse> {
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

    await this.userRepository.deletePasswordResetTokensByUserId(user.id);
    await this.userRepository.createPasswordResetToken({ userId: user.id, tokenHash, expiresAt });

    await this.mailService.send({
      to: user.email,
      subject: 'Redefinicao de senha ShapeUp',
      text: [
        `Ola, ${user.name}.`,
        '',
        'Recebemos uma solicitacao para redefinir a senha da sua conta ShapeUp.',
        `Acesse o link abaixo para criar uma nova senha: ${resetUrl}`,
        '',
        'Se voce nao solicitou essa alteracao, ignore este e-mail.',
      ].join('\n'),
      html: [
        `<p>Ola, ${user.name}.</p>`,
        '<p>Recebemos uma solicitacao para redefinir a senha da sua conta ShapeUp.</p>',
        `<p><a href="${resetUrl}">Clique aqui para criar uma nova senha</a>.</p>`,
        '<p>Se voce nao solicitou essa alteracao, ignore este e-mail.</p>',
      ].join(''),
    });

    return { message: PASSWORD_RESET_REQUEST_MESSAGE };
  }

  async resetPassword(input: ResetPasswordInput): Promise<ApiMessageResponse> {
    if (!isStrongPassword(input.password)) {
      throw new AppError(400, 'A nova senha deve ter no minimo 8 caracteres, letras maiusculas, minusculas, numeros e simbolos.');
    }

    if (input.password !== input.confirmPassword) {
      throw new AppError(400, 'A confirmacao da senha nao confere.');
    }

    const tokenHash = this.hashResetToken(input.token.trim());
    const resetToken = await this.userRepository.findPasswordResetTokenByHash(tokenHash);

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
    await this.userRepository.deletePasswordResetTokensByUserId(user.id);

    return { message: 'Senha redefinida com sucesso.' };
  }

  private buildAuthResponse(user: Awaited<ReturnType<IUserRepository['create']>>): AuthResponse {
    return {
      token: jwt.sign({}, env.JWT_SECRET, { subject: user.id, expiresIn: '8h' }),
      user: this.toAuthUser(user),
    };
  }

  private toAuthUser(user: Awaited<ReturnType<IUserRepository['create']>>): AuthUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private hashResetToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private buildPasswordResetUrl(token: string): string {
    const resetUrl = env.PASSWORD_RESET_URL ? new URL(env.PASSWORD_RESET_URL) : new URL('/reset-password', env.FRONTEND_URL);
    resetUrl.searchParams.set('token', token);
    return resetUrl.toString();
  }
}
