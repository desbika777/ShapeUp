// Contrato de envio de e-mail usado pelo fluxo de recuperacao de senha.
export type MensagemEmail = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export interface IServicoEmail {
  send(message: MensagemEmail): Promise<void>;
}
