// Contrato de envio de e-mail usado pelo fluxo de recuperacao de senha.
export type MailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export interface IMailService {
  send(message: MailMessage): Promise<void>;
}
