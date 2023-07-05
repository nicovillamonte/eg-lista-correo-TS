import { BusinessError } from '../error/bussiness.error';
import { MailSender } from './mail-sender';
import { Post } from './post';
import { Usuario } from './usuario';

export class ListaCorreo {
  private readonly suscriptos: Array<Usuario> = [];
  private readonly usuariosPendientes: Array<Usuario> = [];
  tipoSuscripcion: TipoSuscripcion = new SuscripcionAbierta();
  validacionEnvio: ValidacionEnvio = new EnvioLibre();
  mailSender!: MailSender;
  prefijo = '';

  suscribir(usuario: Usuario) {
    this.tipoSuscripcion.suscribir(usuario, this);
  }

  confirmarSuscripcion(usuario: Usuario) {
    this.tipoSuscripcion.confirmarSuscripcion(usuario, this);
  }

  rechazarSuscripcion(usuario: Usuario) {
    this.tipoSuscripcion.rechazarSuscripcion(usuario, this);
  }

  recibirPost(post: Post) {
    this.validacionEnvio.validarPost(post, this);

    this.mailSender.sendMail({
      from: post.emisor.mailPrincipal,
      to: this.getMailsDestino(post),
      subject: `[${this.prefijo}] ${post.asunto}`,
      content: post.mensaje,
    });
  }

  private getMailsDestino(post: Post) {
    return this.suscriptos
      .filter((usuario) => usuario !== post.emisor)
      .map((usuario) => usuario.mailPrincipal)
      .join(', ');
  }

  /*********************** Definiciones internas  ***************************/
  agregarUsuario(usuario: Usuario) {
    this.suscriptos.push(usuario);
  }

  agregarUsuarioPendiente(usuario: Usuario) {
    this.usuariosPendientes.push(usuario);
  }

  eliminarUsuarioPendiente(usuario: Usuario) {
    this.usuariosPendientes.splice(this.usuariosPendientes.indexOf(usuario), 1);
  }

  contieneUsuario(emisor: Usuario): boolean {
    return this.suscriptos.includes(emisor);
  }

  resetear() {
    this.suscriptos.splice(0, this.suscriptos.length);
    this.usuariosPendientes.splice(0, this.usuariosPendientes.length);
  }
}

/**********************************************************************************
                        SUSCRIPCION
 **********************************************************************************/
export interface TipoSuscripcion {
  suscribir(usuario: Usuario, listaCorreo: ListaCorreo): void;
  confirmarSuscripcion(usuario: Usuario, listaCorreo: ListaCorreo): void;
  rechazarSuscripcion(usuario: Usuario, listaCorreo: ListaCorreo): void;
}

export class SuscripcionAbierta implements TipoSuscripcion {
  suscribir(usuario: Usuario, listaCorreo: ListaCorreo) {
    listaCorreo.agregarUsuario(usuario);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  confirmarSuscripcion(usuario: Usuario, listaCorreo: ListaCorreo) {
    throw new BusinessError(
      'No debe confirmar la suscripción para la lista de suscripción abierta',
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rechazarSuscripcion(usuario: Usuario, listaCorreo: ListaCorreo) {
    throw new BusinessError(
      'No debe rechazar la suscripción para la lista de suscripción abierta',
    );
  }
}

export class SuscripcionCerrada implements TipoSuscripcion {
  suscribir(usuario: Usuario, listaCorreo: ListaCorreo) {
    listaCorreo.agregarUsuarioPendiente(usuario);
  }

  confirmarSuscripcion(usuario: Usuario, listaCorreo: ListaCorreo) {
    listaCorreo.eliminarUsuarioPendiente(usuario);
    listaCorreo.agregarUsuario(usuario);
  }

  rechazarSuscripcion(usuario: Usuario, listaCorreo: ListaCorreo) {
    listaCorreo.eliminarUsuarioPendiente(usuario);
  }
}

/**********************************************************************************
                        VALIDACION DE ENVIO
 **********************************************************************************/
export interface ValidacionEnvio {
  validarPost(post: Post, listaCorreo: ListaCorreo): void;
}

export class EnvioLibre implements ValidacionEnvio {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validarPost(post: Post, listaCorreo: ListaCorreo) {
    // Null Object Pattern, no hay validación
  }
}

export class EnvioRestringido implements ValidacionEnvio {
  validarPost(post: Post, listaCorreo: ListaCorreo) {
    if (!listaCorreo.contieneUsuario(post.emisor)) {
      throw new BusinessError(
        'No puede enviar un mensaje porque no pertenece a la lista',
      );
    }
  }
}
