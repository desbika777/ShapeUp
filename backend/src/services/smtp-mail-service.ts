// Implementacao real de e-mail via SMTP.
import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import type { IServicoEmail, MensagemEmail } from './mail-service.js';

export class ServicoEmailSmtp implements IServicoEmail {
  private readonly transport = this.createTransport();

  async send(message: MensagemEmail): Promise<void> {
    // Em ambiente sem SMTP configurado, registra no console para facilitar testes locais.
    if (!this.transport || !env.MAIL_FROM) {
      console.info('[Shape] Link de redefinicao gerado em ambiente local:', message.text);
      return;
    }

    await this.transport.sendMail({
      from: env.MAIL_FROM,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  }

  private createTransport() {
    // Se faltar qualquer credencial SMTP, a aplicacao segue funcionando sem envio real.
    if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS) {
      return null;
    }

    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE === 'true',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
}
