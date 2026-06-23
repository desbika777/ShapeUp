import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import type { IMailService, MailMessage } from './mail-service.js';

export class SmtpMailService implements IMailService {
  private readonly transport = this.createTransport();

  async send(message: MailMessage): Promise<void> {
    if (!this.transport || !env.MAIL_FROM) {
      console.info('[ShapeUp] Link de redefinicao gerado em ambiente local:', message.text);
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
