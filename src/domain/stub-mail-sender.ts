import { MailSender, Mail } from './mail-sender';
import { Usuario } from './usuario';

class ExtendedMailSender implements MailSender {
  mailsEnviados: Mail[] = [];

  sendMail(mail: Mail): void {
    this.mailsEnviados.push(mail);
  }

  envioMail(usuario: Usuario): boolean {
    return this.mailsEnviados.some(
      (mail) => mail.from === usuario.mailPrincipal,
    );
  }

  reset(): void {
    this.mailsEnviados = [];
  }
}

export const stubMailSender = new ExtendedMailSender();
