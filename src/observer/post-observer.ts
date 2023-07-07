import { MailSender } from '../domain/mail-sender';
import { ListaCorreo } from '../domain/lista-correo';
import { Post } from '../domain/post';

export interface PostObserver {
  postEnviado(post: Post, lista: ListaCorreo): void;
}

/*------------------------
  MailObserver
------------------------*/
export class MailObserver implements PostObserver {
  private mailSender!: MailSender;
  private prefijo!: string;

  setMailSender(mailSender: MailSender) {
    this.mailSender = mailSender;
  }

  setPrefijo(prefijo: string) {
    this.prefijo = prefijo;
  }

  postEnviado(post: Post, lista: ListaCorreo) {
    this.mailSender.sendMail({
      from: post.mailEmisor(),
      to: lista.getMailsDestino(post),
      subject: `[${this.prefijo}] ${post.asunto}`,
      content: post.mensaje,
    });
  }
}

/*------------------------
  BloqueoUsuarioVerbosoObserver
------------------------*/
export class BloqueoUsuarioVerbosoObserver implements PostObserver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postEnviado(post: Post, lista: ListaCorreo) {
    if (post.emisor.envioMuchosMensajes()) {
      post.emisor.bloquear();
    }
  }
}

/*------------------------
  MalasPalabrasObserver
------------------------*/
export class MalasPalabrasObserver implements PostObserver {
  private readonly malasPalabras: string[] = [];
  readonly postConMalasPalabras: Post[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postEnviado(post: Post, lista: ListaCorreo) {
    if (this.tieneMalasPalabras(post)) {
      this.postConMalasPalabras.push(post);
    }
  }

  tieneMalasPalabras(post: Post) {
    return this.malasPalabras.some((palabra) => post.tienePalabra(palabra));
  }

  agregarMalaPalabra(palabra: string) {
    this.malasPalabras.push(palabra);
  }
}
