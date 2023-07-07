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

// const StubMailSender = new ExtendedMailSender();
export const StubMailSender = new ExtendedMailSender();
// export const StubMailSender: MailSender = {
//   sendMail(mail: Mail): void {
//     this.mailsEnviados.push(mail);
//   },

//   envioMail(usuario: Usuario): boolean {
//     return this.mailsEnviados.some(
//       (mail) => mail.from === usuario.mailPrincipal,
//     );
//   },

//   reset(): void {
//     this.mailsEnviados = [];
//   },
// } as MailSender;
